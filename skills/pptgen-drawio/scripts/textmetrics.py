#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""文字尺寸测量：用本机真实字体文件量宽度，算折行数和需要的高度。

两处在用：
- `render_check.py` 扫描已生成的 pptx，判断哪个框会裁字；
- 生成脚本排版时算每个文本框该多高（**不要按 1.4 倍字号之类的系数估**）。

Draw.io 画布用 px，PowerPoint 用 pt。1920 px 宽的画布 = 20 英寸 = 1440 pt，
所以 1 px = 0.75 pt，用 `px_to_pt` / `pt_to_px` 换算。

单独跑可以查字体有没有找到：
    python scripts/textmetrics.py
"""

import os
import sys

# 字体名 → 可能的字体文件，按优先级。找不到就退化成按字宽估，结果偏保守。
FONT_FILES = {
    "微软雅黑": ["msyh.ttc", "msyh.ttf", "msyhl.ttc"],
    "Microsoft YaHei": ["msyh.ttc", "msyh.ttf"],
    "宋体": ["simsun.ttc", "SimSun.ttf"],
    "SimSun": ["simsun.ttc"],
    "黑体": ["simhei.ttf"],
    "Times New Roman": ["times.ttf", "Times New Roman.ttf"],
    "Arial": ["arial.ttf", "Arial.ttf"],
    "Calibri": ["calibri.ttf"],
    "Georgia": ["georgia.ttf"],
}

FONT_DIRS = [
    os.path.join(os.environ.get("WINDIR", r"C:\Windows"), "Fonts"),
    os.path.expanduser("~/AppData/Local/Microsoft/Windows/Fonts"),
    "/usr/share/fonts", "/usr/local/share/fonts", os.path.expanduser("~/.fonts"),
    "/System/Library/Fonts", "/Library/Fonts",
]

# 行距系数。PowerPoint 单倍行距下中文实际占用约 1.2 倍字号，
# 段间还有间距，统一按 1.25 算，比 1.4 更接近实测。
LINE_SPACING = 1.25

# 文本框内边距，python-pptx 默认左右 0.1 英寸 = 7.2 pt，上下 0.05 英寸 = 3.6 pt
PAD_X_PT = 7.2 * 2
PAD_Y_PT = 3.6 * 2

PT_PER_PX = 0.75          # 1920 px = 1440 pt

_font_cache = {}
_missing = set()


def px_to_pt(v):
    return v * PT_PER_PX


def pt_to_px(v):
    return v / PT_PER_PX


def find_font_path(name):
    """按字体名找到磁盘上的字体文件，找不到返回 None。"""
    if name in _font_cache:
        return _font_cache[name]
    result = None
    for candidate in FONT_FILES.get(name, []):
        for d in FONT_DIRS:
            if not os.path.isdir(d):
                continue
            p = os.path.join(d, candidate)
            if os.path.exists(p):
                result = p
                break
            try:                        # 大小写不敏感兜底
                for f in os.listdir(d):
                    if f.lower() == candidate.lower():
                        result = os.path.join(d, f)
                        break
            except OSError:
                pass
            if result:
                break
        if result:
            break
    if result is None:
        _missing.add(name)
    _font_cache[name] = result
    return result


def missing_fonts():
    """到目前为止没找到字体文件的字体名。量出来的宽度只能当估算。"""
    return sorted(_missing)


def load_font(name, size_pt):
    """加载字体量宽度。size_pt 当 px 传给 Pillow——量出来的宽高比是对的，
    后面统一按 pt 比较。"""
    try:
        from PIL import ImageFont
    except ImportError:
        return None
    path = find_font_path(name)
    px = max(1, int(round(size_pt)))
    try:
        if path:
            return ImageFont.truetype(path, px)
        return ImageFont.truetype("arial.ttf", px)
    except Exception:
        try:
            return ImageFont.load_default()
        except Exception:
            return None


def text_width_pt(text, font, size_pt):
    """一行文字的宽度，单位 pt。没有字体就按中文全宽 / 西文半宽估。"""
    if font is not None:
        try:
            return font.getlength(text)
        except AttributeError:
            try:
                return font.getsize(text)[0]
            except Exception:
                pass
        except Exception:
            pass
    w = 0.0
    for ch in text:
        w += size_pt * (1.0 if ord(ch) > 0x2E80 else 0.55)
    return w


def wrap_lines(text, font, size_pt, avail_w_pt):
    """按可用宽度折行，返回行数。中文逐字折，西文按空格折（单词不拆开）。"""
    if avail_w_pt <= 0:
        return len(text.splitlines()) or 1
    total = 0
    for para in text.split("\n"):
        if not para.strip():
            total += 1
            continue
        line_w, lines = 0.0, 1
        i, n = 0, len(para)
        while i < n:
            ch = para[i]
            if ord(ch) <= 0x2E80 and ch not in " \t":
                j = i                   # 西文单词整体不拆
                while j < n and ord(para[j]) <= 0x2E80 and para[j] not in " \t":
                    j += 1
                chunk = para[i:j]
            else:
                chunk = ch
                j = i + 1
            w = text_width_pt(chunk, font, size_pt)
            if line_w + w > avail_w_pt and line_w > 0:
                lines += 1
                line_w = w
            else:
                line_w += w
            i = j
        total += lines
    return max(1, total)


def measure_pt(text, size_pt, box_w_pt, font_name="微软雅黑",
               pad_x_pt=None, pad_y_pt=None):
    """量一段文字：返回 (行数, 需要的高度 pt)。box_w_pt 是文本框总宽。

    pad_x_pt / pad_y_pt 是左右、上下内边距之和，不传就按 python-pptx 默认值。
    **扫描已导出的 pptx 要读实际值**——drawio2pptx 会显式写
    `tIns="0" lIns="0" bIns="0" rIns="0"`，按默认值算会多算 7 pt，
    单行文字会被误报成溢出。
    """
    px = PAD_X_PT if pad_x_pt is None else pad_x_pt
    py = PAD_Y_PT if pad_y_pt is None else pad_y_pt
    font = load_font(font_name, size_pt)
    lines = wrap_lines(text, font, size_pt, box_w_pt - px)
    return lines, lines * size_pt * LINE_SPACING + py


def measure_px(text, size_pt, box_w_px, font_name="微软雅黑"):
    """生成脚本用：框宽给 px，返回 (行数, 需要的高度 px)。

    Draw.io 里定一个文本框多高就用这个，别按系数估。
    """
    lines, need_pt = measure_pt(text, size_pt, px_to_pt(box_w_px), font_name)
    return lines, pt_to_px(need_pt)


def box_h_px(text, size_pt, box_w_px, font_name="微软雅黑", extra_px=0):
    """直接给出该用的框高（px），向上取整，可加余量。"""
    _, need = measure_px(text, size_pt, box_w_px, font_name)
    return int(need + extra_px + 0.999)


if __name__ == "__main__":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except AttributeError:
        pass
    print("字体查找结果：")
    for name in FONT_FILES:
        print("  %-18s %s" % (name, find_font_path(name) or "❌ 没找到"))
    demo = "复杂环境下的规划面临动态障碍物、交通标志识别等现实难点"
    for w in (760, 520, 300):
        lines, h = measure_px(demo, 18, w)
        print("宽 %4d px：%d 行，需 %.0f px 高" % (w, lines, h))
