---
name: paper-write
description: 本科与硕士学位论文全流程撰写辅助。支持大纲审核（理工科/文科）、结构仿写（通用/实验/绪论/摘要；文科含文献综述、案例分析、对策建议、文科绪论与摘要）、参考文献获取、融合、润色（含实验章节/文科章节）、缩写、扩写、防 AIGC、中英互译、结构化信息提取。当用户提到论文撰写、大纲审核、论文章节仿写、参考文献、论文润色、防 AIGC、论文翻译、文科论文、文献综述、对策建议时使用。
---

# 本科&硕士学位论文撰写

## 使用时机

- 用户需要审核/优化论文大纲（理工科 / 文科区分）
- 用户需要仿写论文章节（绪论、摘要、实验章节等；**文科**另含文献综述、案例分析、对策建议及文科版绪论/摘要）
- 用户需要参考文献匹配与 GB/T 7714 格式
- 用户需要润色、缩写、扩写、去 AI 化（实验章节用实验润色，文科章节用文科润色）
- 用户需要中英互译
- 用户需要从论文中提取结构化信息（用于答辩 PPT 等）

## Step 1：识别任务类型

根据用户需求选择对应 reference 文件执行。

---

### 大纲审核

| 适用 | 文件 |
|------|------|
| **理工科**（计算机/电子/机械/土木等） | [outline-review-science.md](reference/outline-review-science.md) |
| **文科**（文学/经管/教育/法学/传媒等） | [outline-review-liberal.md](reference/outline-review-liberal.md) |

---

### 结构仿写

**通用**（理工/文科均可）

| 任务 | 文件 |
|------|------|
| 通用章节（任一章节仿写） | [structure-imitate-general.md](reference/structure-imitate-general.md) |

**理工（science-*）**

| 任务 | 文件 |
|------|------|
| 绪论 | [structure-imitate-science-introduction.md](reference/structure-imitate-science-introduction.md) |
| 摘要 | [structure-imitate-science-abstract.md](reference/structure-imitate-science-abstract.md) |
| 实验章节 | [structure-imitate-science-experiment.md](reference/structure-imitate-science-experiment.md) |

**文科（liberal-*）**

| 任务 | 文件 |
|------|------|
| 绪论 | [structure-imitate-liberal-introduction.md](reference/structure-imitate-liberal-introduction.md) |
| 摘要 | [structure-imitate-liberal-abstract.md](reference/structure-imitate-liberal-abstract.md) |
| 文献综述 / 理论章节 | [structure-imitate-liberal-literature-review.md](reference/structure-imitate-liberal-literature-review.md) |
| 案例分析 / 调研实证 | [structure-imitate-liberal-case-analysis.md](reference/structure-imitate-liberal-case-analysis.md) |
| 对策与建议 | [structure-imitate-liberal-policy.md](reference/structure-imitate-liberal-policy.md) |

---

### 问题与格式检查

| 任务 | 文件 |
|------|------|
| 问题与格式检查（错别字 / 标点 / 版式 / 图表与公式编号 / 章节引用等） | [check-issues-and-format.md](reference/check-issues-and-format.md) |

---

### 参考文献与融合

| 任务 | 文件 |
|------|------|
| 参考文献获取（GB/T 7714） | [references.md](reference/references.md) |
| 融合 | [merge.md](reference/merge.md) |

---

### 润色

| 适用 | 文件 |
|------|------|
| **通用** | [polish.md](reference/polish.md) |
| **实验章节**（理工 science） | [polish-science-experiment.md](reference/polish-science-experiment.md) |
| **文科章节**（liberal） | [polish-liberal.md](reference/polish-liberal.md) |

---

### 缩写、扩写、防 AIGC

| 任务 | 文件 |
|------|------|
| 缩写 | [abbreviate.md](reference/abbreviate.md) |
| 扩写 | [expand.md](reference/expand.md) |
| 防 AIGC（去 AI 痕） | [anti-aigc.md](reference/anti-aigc.md) |

---

### 翻译

| 方向 | 文件 |
|------|------|
| 中 → 英 | [zh-to-en.md](reference/zh-to-en.md) |
| 英 → 中 | [en-to-zh.md](reference/en-to-zh.md) |

---

### 结构化信息提取

| 任务 | 文件 |
|------|------|
| 提取（用于答辩 PPT 等） | [extract-structured.md](reference/extract-structured.md)（完成后可询问是否串联答辩 PPT 生成） |


## Step 2：收集输入

- **多输入任务**（如绪论仿写需【参考范文】【论文大纲】【个人草稿】）：解析用户消息中的【】标记、追问缺失项、或读取用户指定的工作区文件，收齐后再执行。
- **单输入任务**：直接从用户消息或粘贴内容提取。

## Step 3：执行并输出

读取对应 reference 中的 Prompt，按其中 Role/Task/Constraints/Output Format 执行，输出符合要求的正文或结构化结果。

## 注意事项

- **Word 适配**：严禁 Markdown，中文与英文/数字/公式之间加空格，全角中文标点。
- **去 AI 化**：避免「显著提升」「极大增强」「卓越表现」「不仅如此」等。
- **信息零丢失**：严禁删除实验参数、数据、核心论点。
- **撰写顺序**：先做后写、由内向外——先完成方法章与实验，再写绪论与摘要。