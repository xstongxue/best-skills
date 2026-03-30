#!/bin/bash

###############################################################################
# Draw.io 批量导出脚本
# 功能：将 .drawio 文件批量导出为 PNG 图片
#
# 使用方法：
#   ./export-drawio.sh                   # 导出所有 .drawio 文件
#   ./export-drawio.sh covers            # 仅导出封面图
#   ./export-drawio.sh illustrations     # 仅导出正文插图
###############################################################################

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查 draw.io 是否已安装
check_drawio() {
    if command -v drawio &> /dev/null; then
        echo -e "${GREEN}✓${NC} 检测到 draw.io 命令行工具"
        return 0
    elif command -v /Applications/draw.io.app/Contents/MacOS/draw.io &> /dev/null; then
        echo -e "${GREEN}✓${NC} 检测到 draw.io Mac 应用"
        DRAWIO_CMD="/Applications/draw.io.app/Contents/MacOS/draw.io"
        return 0
    else
        echo -e "${RED}✗${NC} 未检测到 draw.io 工具"
        echo ""
        echo "请安装 draw.io："
        echo "  macOS:   brew install --cask drawio"
        echo "  Linux:   snap install drawio"
        echo "  Windows: choco install drawio"
        echo ""
        echo "或手动下载：https://github.com/jgraph/drawio-desktop/releases"
        exit 1
    fi
}

# 导出单个文件
export_file() {
    local input_file="$1"
    local output_file="$2"

    echo -e "${YELLOW}→${NC} 导出: $(basename "$input_file")"

    ${DRAWIO_CMD:-drawio} --export --format png --scale 2 \
        --output "$output_file" "$input_file" &> /dev/null

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} 成功: $output_file"
        return 0
    else
        echo -e "${RED}✗${NC} 失败: $input_file"
        return 1
    fi
}

# 批量导出
batch_export() {
    local source_dir="$1"
    local export_dir="$2"

    # 确保导出目录存在
    mkdir -p "$export_dir"

    local count=0
    local success=0

    for file in "$source_dir"/*.drawio; do
        if [ -f "$file" ]; then
            count=$((count + 1))
            local filename=$(basename "$file" .drawio)
            local output_file="$export_dir/${filename}.png"

            if export_file "$file" "$output_file"; then
                success=$((success + 1))
            fi
        fi
    done

    echo ""
    echo -e "${GREEN}完成！${NC} 成功导出 $success/$count 个文件"
}

# 主函数
main() {
    echo "Draw.io 批量导出工具"
    echo "================================"
    echo ""

    check_drawio

    local base_dir="../images"
    local mode="${1:-all}"

    case "$mode" in
        covers)
            echo "📁 模式: 仅导出封面图"
            echo ""
            batch_export "$base_dir/covers/source" "$base_dir/covers/export"
            ;;
        illustrations)
            echo "📁 模式: 仅导出正文插图"
            echo ""
            batch_export "$base_dir/illustrations/source" "$base_dir/illustrations/export"
            ;;
        all)
            echo "📁 模式: 导出所有图片"
            echo ""
            echo "【1/2】导出封面图..."
            batch_export "$base_dir/covers/source" "$base_dir/covers/export"
            echo ""
            echo "【2/2】导出正文插图..."
            batch_export "$base_dir/illustrations/source" "$base_dir/illustrations/export"
            ;;
        *)
            echo -e "${RED}✗${NC} 未知模式: $mode"
            echo ""
            echo "使用方法："
            echo "  $0              # 导出所有"
            echo "  $0 covers       # 仅封面"
            echo "  $0 illustrations # 仅插图"
            exit 1
            ;;
    esac
}

main "$@"