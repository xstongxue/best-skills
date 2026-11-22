---
name: office-file-process
description: '处理 Office 文档的一站式 skill：Word(.doc/.docx/.dotx)、Excel(.xls/.xlsx/.xlsm/.csv)、PowerPoint(.ppt/.pptx/.potx) 的创建、读取、编辑、提取、转换、校验。触发：『读取 word 文档』『提取 excel 内容』『看 ppt 讲了什么』、.doc 老格式打不开、生成/编辑 Word 报告/合同/模板、制作幻灯片/deck/演示文稿、写带公式的电子表格。读取优先 pandoc/markitdown 等官方工具，环境没有则走 Windows Office COM 自动化（含中文文件名、PowerShell 编码等 Windows 环境方案）；创建/编辑用 docx-js、pptxgenjs、openpyxl 等。Use whenever any .docx/.xlsx/.pptx file is the primary input or output: create, read, edit, extract, convert, or validate it.'
license: Proprietary. LICENSE.txt has complete terms
---

# Office 文档处理（统一入口）

处理 Word / Excel / PowerPoint 文件的统一 skill。面向 **Windows + Office** 环境（COM 自动化是它独有的兜底能力），不预设任何机器装了哪些工具——**动手前先探测环境**，再按本文规则决策。非 Windows 或无 Office 的机器见文末降级方案。**先按任务路由**，细节在对应参考文档里。

## 任务路由

| 任务 | 路线 | 详情 |
|---|---|---|
| **读取/提取**任何 Office 文档内容 | 按下方"读取路线怎么选"决策 | 本页 |
| **创建/编辑** Word 文档 | docx-js（新建）/ unzip+XML（编辑） | [reference/docx.md](reference/docx.md) |
| **创建/编辑** PowerPoint | pptxgenjs（新建）/ unzip+XML（编辑） | [reference/pptx.md](reference/pptx.md) |
| **创建/编辑** Excel | openpyxl / pandas | [reference/xlsx.md](reference/xlsx.md) |
| **校验** docx/pptx/xlsx 输出 | `scripts/office/validate.py` | 各格式参考文档的 QA 节 |

## 读取路线怎么选（官方工具 vs Office COM）

**原则：有环境就用官方的（输出质量更高），没有就用 COM 提取脚本。** 先探测环境再动手：

```bash
where pandoc 2>/dev/null && echo HAS_PANDOC
python -c "import markitdown" 2>/dev/null && echo HAS_MARKITDOWN
python -c "import openpyxl" 2>/dev/null && echo HAS_OPENPYXL
```

| 格式 | 环境在（优先） | 环境不在（退回 COM） |
|---|---|---|
| .docx | `pandoc -t markdown file.docx` — 输出带结构 markdown（标题层级、列表、表格），后续处理质量最高 | `extract_office_text.ps1` — 纯文本，表格转制表符 |
| .pptx | `markitdown deck.pptx` — 每页一块带 `<!-- Slide number: N -->` 标记 | `extract_office_text.ps1` — 逐页文本 + `[NOTES]` 备注 |
| .xlsx | `markitdown file.xlsx` 快速浏览；`openpyxl`/`pandas` 精确读（有单元格坐标，规划编辑必须用它） | `extract_office_text.ps1` — 逐 sheet 制表符纯文本，无坐标 |
| .doc/.xls/.ppt（老格式） | 官方工具也读不了（二进制） | **COM 是唯一路径**（或 COM 转新格式后再走官方工具） |

补充判断：

- **openpyxl/pandas 是 pip 一装就有的轻依赖**（无需管理员），读 xlsx 需要坐标或要进一步算数据时，直接 `pip install openpyxl pandas` 比退回 COM 更好；`markitdown` 其实也是 pip 可装的轻依赖（`pip install "markitdown[pptx,xlsx]"`）；只有 pandoc/soffice 是系统级安装，不方便现装。
- **带保护壳的文档**（加密狗水印壳等）：**一律 COM 对象模型直取 `Content.Text`**——已验证 Word SaveAs 导出此类文档是乱码；官方工具（pandoc 等）未在此场景验证过，别拿它冒险。
- **中文文件名**：官方工具能处理，但如果 Read/Grep 打不开输出文件，退回 COM 脚本（输出固定 ASCII 文件名 `office_extract_<n>.txt`）。

本页及 reference/ 里的 `scripts/...` 路径一律相对**本 skill 根目录**书写；从仓库根实际调用时加前缀 `.claude/skills/office-file-process/`（如 `python .claude/skills/office-file-process/scripts/office/validate.py`——下方 `-File` 示例即此前缀形式）。

## COM 提取脚本（官方工具不可用/老格式/带壳文档时的读取路径）

核心结论：**不要用 Word 的 SaveAs/另存为导出文本**——带保护壳的文档（如加密狗水印壳）导出的是乱码；用 COM 对象模型直接取 `Content.Text`。

```powershell
& C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe -NoProfile -ExecutionPolicy Bypass `
  -File ".claude/skills/office-file-process/scripts/extract_office_text.ps1" `
  -PathPattern "D:\some\dir\*.doc"
```

`-File` 用**相对路径**（相对仓库根目录，即 `.claude` 的父目录）——任何人从仓库根执行都成立，无需改路径。若当前目录不在仓库根，先 `cd` 到仓库根，或把相对路径换成实际绝对路径。

只传 `-PathPattern`，**不要传任何其他参数**。脚本自动完成：

1. **输出放在源文档旁边**，命名 `office_extract_<n>.txt`——ASCII 文件名（父目录即使是中文路径，Read/Grep 也能打开），原文档在哪提取就在哪；
2. 每次运行先清掉该目录上次残留的 `office_extract_*.txt`，目录里恒为本次结果；
3. Word 表格单元格转为制表符分隔（协议表格 CMD/参数定义可直接阅读）；
4. 结束时打印 **manifest**（源文件 → 输出文件全路径映射），照着 Read 即可；
5. 收尾杀掉无窗口的残留 Office 进程（用户自己开的可见 Word/Excel 永远不动）。

`-PathPattern` 的父目录路径里可以有 `*`/`?`——中文目录名打不出来时用通配符代替，如 `D:\code\middleware\*_MCUService\mpu\docs\*\*.doc`。

**注意**：输出在源目录意味着它会出现在 `svn status` 的 `?` 列表里（若源目录在 SVN 工作副本内）——提交前确认不带 `office_extract_*.txt`（rsync 同步时 `--exclude='office_extract_*'`）。

### 各应用提取要点（自己写脚本时）

| 应用 | 打开 | 取内容 |
|---|---|---|
| Word | `Documents.Open($path, $false, $true)`（ReadOnly） | `$doc.Content.Text`，再把 `` `r`a ``（CR+BEL，表格单元格结束符）替换为制表符/换行 |
| Excel | `Workbooks.Open($path, 0, $true)` | `$ws.UsedRange.Value2` → 2D 数组 `$arr[$r,$c]` 批量读，**不要逐格读**（慢 100 倍） |
| PowerPoint | `Presentations.Open($path, $true, $false, $false)`（ReadOnly, 无窗口） | 遍历 `Slides` → `Shapes`，条件 `HasTextFrame -eq -1 -and TextFrame2.HasText -eq -1`，取 `TextFrame2.TextRange.Text`；备注在 `$slide.NotesPage.Shapes` |

COM 清理铁律（否则进程残留）：`try/finally` 中 `Quit()` + `[Runtime.InteropServices.Marshal]::ReleaseComObject()` + `[GC]::Collect()`；多个文件复用同一个应用实例，最后统一 Quit。

## 环境检查（写代码前先对照）

**不预设任何机器的安装情况**——动手前先探测，缺什么按下表决定"装"还是"走替代"：

```bash
where soffice pandoc pdftoppm 2>/dev/null        # 系统级工具：渲染验证/读取/转图
python -c "import openpyxl" 2>/dev/null && echo HAS_OPENPYXL
node -e "require('docx')" 2>/dev/null && echo HAS_DOCX_JS
```

Windows + Office 的机器天然可用：Office COM 自动化 · PowerShell。其余常见缺口及对策：

**pip 依赖离线部署**：无网络的机器按 [reference/python-setup.md](reference/python-setup.md) 三步走——①装 Python → ②有网机器 `pip download` 打包 wheels（约 65MB）→ ③目标机 `pip install --no-index` 离线装齐。装完后 markitdown/openpyxl/pandas 等探测全部命中，读取自动走官方工具路线。

| 工具 | 用途 | 缺时的替代（无需先装） |
|---|---|---|
| LibreOffice (`soffice`) | docx/pptx 渲染验证、xlsx 重算(`recalc.py`)、格式转换 | Office COM（`ExportAsFixedFormat` 转 PDF、Excel COM 重算） |
| `pandoc` | 读 docx | `extract_office_text.ps1` |
| `markitdown` | 读 pptx/xlsx | `extract_office_text.ps1`（pip 可装，属轻依赖） |
| `pdftoppm`/poppler、`pdftotext` | PDF 转图、提文本 | 见独立 `pdf` skill |
| `qpdf`/`pdftk` | PDF 命令行 | 见独立 `pdf` skill |
| pip 库 openpyxl/pandas/defusedxml/lxml/Pillow/markitdown | 生成编辑 + 官方读取路线 | 在线 `pip install`，或按 [python-setup.md](reference/python-setup.md) 离线部署 |
| npm 包 docx/pptxgenjs | 生成 docx/pptx | 属轻依赖，用前在输出目录 `npm install` 对应包即可 |

## Windows 环境坑（全部踩过，务必遵守）

1. **bash 里不写内联 PowerShell**：bash 双引号会吃掉 `$` 变量，`-Command` 内联脚本必炸。一律写成 `.ps1` 文件用 `-File` 调用。（本会话 shell 是 PowerShell 时不受此限，但跨双引号的 `$` 插值仍需小心。）
2. **.ps1 只能是纯 ASCII**：PowerShell 5.1 把无 BOM 的 .ps1 按 ANSI/GBK 读，脚本里的中文路径会变乱码。中文路径一律在**调用方**用 `*` 通配符代替（如 `*_MCUService`）。
3. **调用 PowerShell 5.1 用全路径** `C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe`（若系统默认 pwsh 7：pwsh 7 与 COM 自动化组合偶发异常，5.1 最稳）。
4. **中文文件/目录名 Read/Grep 打不开**（"Path does not exist"，Glob 却能列出来）：因此输出**文件名**固定为 ASCII（`office_extract_<n>.txt`）；实测 ASCII 文件名 + 中文父目录路径可以正常 Read——若某环境仍打不开，再退回 `-OutDir` 指定一个纯 ASCII 目录。
5. **`Get-ChildItem -Path '…\*\…\*.doc' -Filter` 静默返回空**：父路径带通配符时 -Filter 失效。先 `Get-Item` 解析父目录为具体路径再列文件（脚本内 `Resolve-TargetDir` 已处理）。
6. **PowerShell 正则**：`-match '*xxx'` 非法（`*` 不能开头），转义写 `'-match "xxx\.txt"'`。
7. bash 调 PowerShell 结尾可能打印 `[0x7FF...] ANOMALY: meaningless REX prefix used`——无害的退出噪声，忽略。
8. **提取文件名固定 `office_extract_<n>.txt`**：用户明确要求提取件放在原文档旁边，不要挪到 TEMP 或其他目录。

## 无 Office 机器的降级方案（仅新格式）

.docx/.xlsx/.pptx 本质是 zip+XML，可用 `Expand-Archive` 解包后直接读 XML：

- Word：`word/document.xml`（`<w:t>` 节点内是文本）
- Excel：`xl/sharedStrings.xml` + `xl/worksheets/sheet*.xml`
- PowerPoint：`ppt/slides/slide*.xml`（`<a:t>` 节点）

老格式 .doc/.xls/.ppt 是二进制格式，没有 Office 时无解（若装了 LibreOffice，`scripts/office/soffice.py` 的转换是另一条路）。

## 脚本清单

| 脚本 | 来源/用途 |
|---|---|
| `scripts/extract_office_text.ps1` | COM 批量提取（本页） |
| `scripts/office/` | 共享 OOXML 基础设施：`validate.py`（XSD 校验）、`soffice.py`（LibreOffice 包装）、schemas、validators |
| `scripts/accept_changes.py` `comment.py` `merge_runs.py` | Word：接受修订、批注、合并 run（[reference/docx.md](reference/docx.md)） |
| `scripts/add_slide.py` `clean.py` `thumbnail.py` | PPT：复制页、清理孤儿、缩略图网格（[reference/pptx.md](reference/pptx.md)） |
| `scripts/recalc.py` | Excel 公式重算（需 LibreOffice；无 LibreOffice 的 Windows 机器走 Excel COM，[reference/xlsx.md](reference/xlsx.md)） |
