/**
 * 微信公众号自动上传脚本
 * 功能：上传文章和图片到微信公众号草稿箱
 *
 * 使用方法：
 * node upload-to-wechat.js --title "文章标题" --content article.md --cover cover.png
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');
require('dotenv').config();

class WechatPublisher {
  constructor(appId, appSecret) {
    this.appId = appId;
    this.appSecret = appSecret;
    this.tokenCache = null;
    this.tokenExpireTime = 0;
  }

  // 获取 access_token（带缓存）
  async getAccessToken() {
    const now = Date.now();
    if (this.tokenCache && now < this.tokenExpireTime) {
      console.log('📦 使用缓存的 access_token');
      return this.tokenCache;
    }

    console.log('🔑 获取新的 access_token...');
    const url = 'https://api.weixin.qq.com/cgi-bin/token';
    const res = await axios.get(url, {
      params: {
        grant_type: 'client_credential',
        appid: this.appId,
        secret: this.appSecret
      }
    });

    if (res.data.errcode) {
      throw new Error(`获取 Token 失败: ${res.data.errmsg}`);
    }

    this.tokenCache = res.data.access_token;
    // 提前 5 分钟过期，避免临界点问题
    this.tokenExpireTime = now + (res.data.expires_in - 300) * 1000;
    return this.tokenCache;
  }

  // 上传封面图（永久素材）
  async uploadCover(imagePath) {
    console.log(`上传封面图: ${path.basename(imagePath)}`);
    const token = await this.getAccessToken();
    const form = new FormData();
    form.append('media', fs.createReadStream(imagePath));

    const url = 'https://api.weixin.qq.com/cgi-bin/material/add_material';
    const res = await axios.post(url, form, {
      params: { access_token: token, type: 'image' },
      headers: form.getHeaders()
    });

    if (res.data.errcode) {
      throw new Error(`上传封面失败: ${res.data.errmsg}`);
    }

    console.log(`封面上传成功，media_id: ${res.data.media_id}`);
    return res.data.media_id;
  }

  // 上传正文图片（临时素材）
  async uploadContentImage(imagePath) {
    console.log(`📷 上传正文图片: ${path.basename(imagePath)}`);
    const token = await this.getAccessToken();
    const form = new FormData();
    form.append('media', fs.createReadStream(imagePath));

    const url = 'https://api.weixin.qq.com/cgi-bin/media/uploadimg';
    const res = await axios.post(url, form, {
      params: { access_token: token },
      headers: form.getHeaders()
    });

    if (res.data.errcode) {
      throw new Error(`上传图片失败: ${res.data.errmsg}`);
    }

    return res.data.url;
  }

  // Markdown 转微信 HTML
  convertToWechatHtml(markdown) {
    console.log('转换 Markdown 为微信 HTML...');
    const md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true
    });

    // 自定义渲染规则
    const defaultRender = md.renderer.rules.paragraph_open || function(tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

    // 段落样式
    md.renderer.rules.paragraph_open = function(tokens, idx, options, env, self) {
      tokens[idx].attrPush(['style', 'margin: 10px 0; line-height: 1.8; font-size: 16px; color: #333;']);
      return defaultRender(tokens, idx, options, env, self);
    };

    // 标题样式
    md.renderer.rules.heading_open = function(tokens, idx, options, env, self) {
      const level = tokens[idx].tag;
      const styles = {
        h1: 'font-size: 24px; font-weight: bold; margin: 20px 0 10px; color: #2c3e50;',
        h2: 'font-size: 20px; font-weight: bold; margin: 18px 0 8px; border-left: 4px solid #42b983; padding-left: 10px; color: #2c3e50;',
        h3: 'font-size: 18px; font-weight: bold; margin: 15px 0 5px; color: #34495e;'
      };
      tokens[idx].attrPush(['style', styles[level] || '']);
      return self.renderToken(tokens, idx, options);
    };

    // 代码块样式
    md.renderer.rules.fence = function(tokens, idx) {
      const code = tokens[idx].content;
      const lang = tokens[idx].info || '';
      return `<pre style="background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; margin: 15px 0;"><code style="font-family: 'Courier New', 'Consolas', monospace; font-size: 14px; color: #e96900;">${escapeHtml(code)}</code></pre>`;
    };

    // 引用样式
    md.renderer.rules.blockquote_open = function(tokens, idx, options, env, self) {
      return '<blockquote style="border-left: 4px solid #ddd; padding-left: 15px; margin: 15px 0; color: #666; font-style: italic;">';
    };

    // 列表样式
    md.renderer.rules.bullet_list_open = function(tokens, idx, options, env, self) {
      return '<ul style="padding-left: 20px; margin: 10px 0;">';
    };

    return md.render(markdown);
  }

  // 创建草稿
  async createDraft(article) {
    console.log('创建草稿...');
    const token = await this.getAccessToken();
    const url = 'https://api.weixin.qq.com/cgi-bin/draft/add';

    const res = await axios.post(url,
      { articles: [article] },
      {
        params: { access_token: token },
        headers: { 'Content-Type': 'application/json; charset=UTF-8' }
      }
    );

    if (res.data.errcode && res.data.errcode !== 0) {
      throw new Error(`创建草稿失败 [${res.data.errcode}]: ${res.data.errmsg}`);
    }

    return res.data.media_id;
  }

  // 完整发布流程
  async publish({ title, contentPath, coverPath, author = '', digest = '' }) {
    const startTime = Date.now();

    try {
      console.log('\n🚀 开始上传流程...\n');

      // 1. 上传封面图
      const thumbMediaId = await this.uploadCover(coverPath);

      // 2. 读取并转换 Markdown
      const markdown = fs.readFileSync(contentPath, 'utf-8');
      const htmlContent = this.convertToWechatHtml(markdown);

      // 3. 创建草稿
      const mediaId = await this.createDraft({
        title,
        author,
        digest: digest || markdown.substring(0, 54).replace(/[#*>\-]/g, '') + '...',
        content: htmlContent,
        thumb_media_id: thumbMediaId,
        need_open_comment: 0,
        only_fans_can_comment: 0
      });

      const duration = ((Date.now() - startTime) / 1000).toFixed(1);

      console.log('\n草稿上传成功！');
      console.log(`草稿 media_id: ${mediaId}`);
      console.log(`请前往公众号后台查看并发布`);
      console.log(`总耗时: ${duration} 秒\n`);

      return { success: true, mediaId, duration };
    } catch (error) {
      console.error('\n❌ 上传失败:', error.message);
      return { success: false, error: error.message };
    }
  }
}

// HTML 转义
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// 命令行参数解析
function parseArgs() {
  const args = process.argv.slice(2);
  const params = {};

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace('--', '');
    params[key] = args[i + 1];
  }

  return params;
}

// 主函数
async function main() {
  const params = parseArgs();

  if (!params.title || !params.content || !params.cover) {
    console.error(`
❌ 缺少必要参数！

使用方法：
  node upload-to-wechat.js --title "文章标题" --content article.md --cover cover.png

参数说明：
  --title    文章标题
  --content  Markdown 文件路径
  --cover    封面图路径（PNG/JPG）
  --author   作者名（可选）
  --digest   摘要（可选，不填自动截取）

环境变量配置（.env 文件）：
  WECHAT_APPID=your_app_id
  WECHAT_SECRET=your_app_secret
    `);
    process.exit(1);
  }

  // 检查环境变量
  if (!process.env.WECHAT_APPID || !process.env.WECHAT_SECRET) {
    console.error('❌ 未配置微信公众号凭证！请在 .env 文件中设置 WECHAT_APPID 和 WECHAT_SECRET');
    process.exit(1);
  }

  // 检查文件是否存在
  if (!fs.existsSync(params.content)) {
    console.error(`❌ 文件不存在: ${params.content}`);
    process.exit(1);
  }
  if (!fs.existsSync(params.cover)) {
    console.error(`❌ 封面图不存在: ${params.cover}`);
    process.exit(1);
  }

  const publisher = new WechatPublisher(
    process.env.WECHAT_APPID,
    process.env.WECHAT_SECRET
  );

  await publisher.publish({
    title: params.title,
    contentPath: params.content,
    coverPath: params.cover,
    author: params.author || '',
    digest: params.digest || ''
  });
}

// 导出类供其他脚本使用
module.exports = WechatPublisher;

// 命令行直接运行
if (require.main === module) {
  main().catch(error => {
    console.error('执行失败:', error);
    process.exit(1);
  });
}