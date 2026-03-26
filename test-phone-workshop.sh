#!/bin/bash

# AI电话工坊快速测试脚本
# 用于验证Edge Function是否正常工作

echo "================================"
echo "AI电话工坊快速测试"
echo "================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查必要的工具
if ! command -v curl &> /dev/null; then
    echo -e "${RED}错误: 未安装curl${NC}"
    exit 1
fi

if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}警告: 未安装jq，输出将不会格式化${NC}"
    JQ_INSTALLED=false
else
    JQ_INSTALLED=true
fi

# 配置（需要根据实际情况修改）
PROJECT_URL="https://backend.appmiaoda.com/projects/supabase284966718093180928"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1cGFiYXNlMjg0OTY2NzE4MDkzMTgwOTI4IiwiYXVkIjoiYXV0aGVudGljYXRlZCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM3MjQ3NjAwLCJleHAiOjIwNTI4MjM2MDB9.xxx" # 需要替换为实际的anon key

echo "测试配置:"
echo "  项目URL: $PROJECT_URL"
echo "  Anon Key: ${ANON_KEY:0:20}..."
echo ""

# 测试1: 文字输入模式
echo "================================"
echo "测试1: 文字输入模式"
echo "================================"
echo "发送测试请求..."

RESPONSE=$(curl -s -X POST \
  "$PROJECT_URL/functions/v1/phone-call-dialogue" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "userText": "Hello, how are you?",
    "conversationHistory": [],
    "scenarioTitle": "商务问候",
    "voiceId": "male-qn-qingse"
  }')

echo ""
echo "响应:"
if [ "$JQ_INSTALLED" = true ]; then
    echo "$RESPONSE" | jq '.'
else
    echo "$RESPONSE"
fi

# 检查响应
if echo "$RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ 测试1通过: 文字输入模式正常工作${NC}"
    
    # 提取关键信息
    if [ "$JQ_INSTALLED" = true ]; then
        USER_TEXT=$(echo "$RESPONSE" | jq -r '.userText')
        AI_REPLY=$(echo "$RESPONSE" | jq -r '.aiReply')
        echo ""
        echo "对话内容:"
        echo "  用户: $USER_TEXT"
        echo "  AI: $AI_REPLY"
    fi
else
    echo -e "${RED}❌ 测试1失败: 文字输入模式异常${NC}"
    
    if [ "$JQ_INSTALLED" = true ]; then
        ERROR=$(echo "$RESPONSE" | jq -r '.error // "未知错误"')
        echo "  错误信息: $ERROR"
    fi
fi

echo ""
echo "================================"
echo "测试完成"
echo "================================"
echo ""
echo "说明:"
echo "1. 如果测试1通过，说明Edge Function基本功能正常"
echo "2. 如果测试1失败，请检查:"
echo "   - API密钥是否配置正确"
echo "   - 网络连接是否正常"
echo "   - Edge Function是否已部署"
echo ""
echo "3. 语音模式需要在浏览器中测试，因为需要:"
echo "   - 麦克风权限"
echo "   - 音频编码/解码"
echo "   - 实时交互"
echo ""
echo "建议: 在浏览器中打开应用，先测试文字模式，再测试语音模式"
