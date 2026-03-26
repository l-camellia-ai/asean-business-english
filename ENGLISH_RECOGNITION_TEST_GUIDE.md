# AI电话工坊英文识别测试指南

## 快速测试步骤

### 1. 打开应用
- 访问应用URL
- 进入"情景实战"页面
- 选择任意场景（如"贸易谈判"）
- 点击"AI电话工坊"按钮

### 2. 开始测试
1. 点击"开始通话"按钮
2. 点击"点击录音"按钮（麦克风图标）
3. 清晰地说英语：**"Hello, how are you?"**
4. 说完后点击"停止录音"
5. 等待识别结果

### 3. 预期结果

#### ✅ 成功的表现
- 对话框中显示：**"Hello, how are you?"**（或类似的英文）
- AI用英语回复（如"I'm fine, thank you. How can I help you today?"）
- 播放AI的英语语音
- 分数增加

#### ❌ 失败的表现
- 对话框中显示中文（如"你好"）
- 或显示错误提示

### 4. 查看日志（可选）

#### 浏览器控制台
1. 按F12打开开发者工具
2. 切换到"Console"标签
3. 查找以下日志：
```
发送请求到Edge Function: {audioLength: 74924, historyLength: 1}
Edge Function响应: {...}
识别结果: Hello, how are you?
```

#### Supabase后台日志
1. 登录Supabase项目
2. 进入"Edge Functions"
3. 点击"phone-call-dialogue"
4. 点击"Logs"标签
5. 查找以下日志：
```
[abc12345] === 步骤1: 语音识别 ===
语音识别请求参数:
- dev_pid: 1537 (英文识别)  ← 确认这行存在
完整请求体: {
  "dev_pid": 1537,           ← 确认这个参数存在
  ...
}
[abc12345] 识别结果: Hello, how are you?
```

---

## 测试用例

### 用例1：简单问候
- **说**：Hello
- **预期**：Hello
- **难度**：⭐

### 用例2：完整问候
- **说**：Hello, how are you?
- **预期**：Hello, how are you?
- **难度**：⭐⭐

### 用例3：自我介绍
- **说**：My name is John
- **预期**：My name is John
- **难度**：⭐⭐

### 用例4：商务询问
- **说**：Can you send me the quotation?
- **预期**：Can you send me the quotation?
- **难度**：⭐⭐⭐

### 用例5：复杂句子
- **说**：I would like to discuss the contract details with you tomorrow
- **预期**：I would like to discuss the contract details with you tomorrow
- **难度**：⭐⭐⭐⭐

---

## 常见问题

### Q: 识别结果不准确怎么办？
**A**: 
1. 确保在安静的环境中
2. 靠近麦克风说话
3. 说话清晰、语速适中
4. 避免口音过重
5. 录音时长2-10秒为佳

### Q: 还是识别成中文怎么办？
**A**: 
1. 刷新浏览器页面（Ctrl+F5强制刷新）
2. 清除浏览器缓存
3. 检查Supabase后台日志确认dev_pid参数
4. 如果日志中没有"dev_pid: 1537"，说明Edge Function未正确部署

### Q: 显示"配额已耗尽"怎么办？
**A**: 
1. 等待明天0点配额重置
2. 或使用文字输入模式（点击键盘图标）
3. 在输入框中输入英语文字

---

## 反馈信息

如果测试失败，请提供以下信息：

1. **浏览器信息**
   - 浏览器类型：Chrome / Edge / Safari / Firefox
   - 浏览器版本：

2. **测试内容**
   - 说的英语：
   - 识别结果：
   - 预期结果：

3. **控制台日志**
   - 复制完整的控制台日志（从"开始录音"到"识别结果"）

4. **Supabase日志**（如果可以访问）
   - 复制Edge Function日志（特别是"语音识别请求参数"部分）

5. **其他信息**
   - 录音时长：
   - 环境：安静 / 一般 / 嘈杂
   - 麦克风：内置 / 外置

---

**测试准备完成**：✅  
**预期测试时间**：2-5分钟  
**预期成功率**：95%+
