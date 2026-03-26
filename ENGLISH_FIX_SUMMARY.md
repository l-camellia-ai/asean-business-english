# 英文识别修复总结

## 问题
AI电话工坊无法识别英文，只能识别中文。

## 根本原因
Edge Function中的语音识别API调用**缺少`dev_pid: 1537`参数**。

## 修复内容

### 1. 代码修改
**文件**：`supabase/functions/phone-call-dialogue/index.ts`

**修改前**：
```typescript
const recognitionPayload = {
  format: 'wav',
  rate: 16000,
  cuid: crypto.randomUUID(),
  speech: audioBase64,
  len: audioLength,
};
```

**修改后**：
```typescript
const recognitionPayload = {
  format: 'wav',
  rate: 16000,
  dev_pid: 1537, // ✅ 添加英文识别模型
  cuid: crypto.randomUUID(),
  speech: audioBase64,
  len: audioLength,
};
```

### 2. 日志增强
添加了详细的日志输出：
```typescript
console.log('- dev_pid:', recognitionPayload.dev_pid, '(英文识别)');
console.log('完整请求体:', JSON.stringify(recognitionPayload, null, 2));
```

### 3. 部署
- ✅ 重新部署Edge Function
- ✅ 绑定语音识别插件（Plugin ID: 4ce92d6c-eb93-4c59-be9c-7f265903e2c8）

## 测试方法

### 快速测试
1. 进入"情景实战" → 选择场景 → "AI电话工坊"
2. 点击"开始通话"
3. 点击"点击录音"
4. 说英语："Hello, how are you?"
5. 点击"停止录音"
6. 查看识别结果

### 预期结果
- ✅ 识别结果显示英文："Hello, how are you?"
- ✅ AI用英语回复
- ✅ 播放英语语音

## 验证日志

### Supabase后台日志
查找以下内容确认修复成功：
```
[abc12345] === 步骤1: 语音识别 ===
语音识别请求参数:
- format: wav
- rate: 16000
- dev_pid: 1537 (英文识别)  ← ✅ 确认这行存在
- cuid: ...
- len: 74924
完整请求体: {
  "format": "wav",
  "rate": 16000,
  "dev_pid": 1537,           ← ✅ 确认参数在请求体中
  ...
}
[abc12345] 识别结果: Hello, how are you?  ← ✅ 成功识别英文
```

## 注意事项

### 1. 配额限制
- 语音识别插件有每日免费配额
- 如遇"配额已耗尽"错误，请使用文字输入模式
- 配额每天0点（UTC+8）重置

### 2. 识别准确率
- 在安静环境中录音
- 说话清晰、语速适中
- 靠近麦克风
- 录音时长2-10秒为佳

### 3. 浏览器兼容性
- 推荐使用Chrome或Edge浏览器
- Safari可能有兼容性问题

## 相关文档
- `ENGLISH_RECOGNITION_FIX.md` - 详细修复报告
- `ENGLISH_RECOGNITION_TEST_GUIDE.md` - 测试指南

## 状态
- **修复状态**：✅ 完成
- **部署状态**：✅ 已部署
- **测试状态**：⏳ 待用户验证
- **预期效果**：✅ 可以正常识别英文
