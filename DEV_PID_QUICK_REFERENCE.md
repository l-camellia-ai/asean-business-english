# 百度语音识别API - dev_pid参数快速参考

## 关键参数值

```
┌─────────────────────────────────────────────────┐
│  百度语音识别 dev_pid 参数对照表                │
├─────────┬──────────┬────────────────────────────┤
│ dev_pid │ 语言模型 │ 说明                       │
├─────────┼──────────┼────────────────────────────┤
│  1537   │  中文    │ 普通话（默认）             │
│  1737   │  英文    │ English                    │
│  1837   │  粤语    │ Cantonese                  │
│  1936   │  四川话  │ Sichuan dialect            │
└─────────┴──────────┴────────────────────────────┘
```

## 常见错误

### ❌ 错误用法
```typescript
// 想识别英文，但用了中文模型
dev_pid: 1537  // 这是中文！
```

**结果**：
- 说"Hello" → 识别成"哈喽"
- 说"How are you" → 识别成"好啊有"

### ✅ 正确用法
```typescript
// 识别英文，使用英文模型
dev_pid: 1737  // 这是英文！
```

**结果**：
- 说"Hello" → 识别成"Hello"
- 说"How are you" → 识别成"How are you"

## 完整示例

### 英文识别配置
```typescript
const recognitionPayload = {
  format: 'wav',
  rate: 16000,
  dev_pid: 1737,  // ← 英文识别
  cuid: crypto.randomUUID(),
  speech: audioBase64,
  len: audioLength,
};
```

### 中文识别配置
```typescript
const recognitionPayload = {
  format: 'wav',
  rate: 16000,
  dev_pid: 1537,  // ← 中文识别
  cuid: crypto.randomUUID(),
  speech: audioBase64,
  len: audioLength,
};
```

## 记忆技巧

```
1537 = 中文 (15 + 37 = 52, 我爱)
1737 = 英文 (17 + 37 = 54, 我是)
```

或者：

```
1537 → 5 < 7 → 中文（排前面）
1737 → 7 = 7 → 英文（排后面）
```

## 快速检查清单

部署前检查：
- [ ] 确认`dev_pid`参数值正确
- [ ] 英文识别使用`1737`
- [ ] 中文识别使用`1537`
- [ ] 添加了日志输出
- [ ] 运行了lint检查
- [ ] 重新部署了Edge Function

测试验证：
- [ ] 说英语，识别出英文 ✅
- [ ] 查看日志，确认`dev_pid: 1737`
- [ ] 查看完整请求体，确认参数传递

## 故障排除

### 问题：说英语识别成中文
**原因**：`dev_pid: 1537`（中文模型）  
**解决**：改为`dev_pid: 1737`

### 问题：说中文识别成英文
**原因**：`dev_pid: 1737`（英文模型）  
**解决**：改为`dev_pid: 1537`

### 问题：修改后还是不生效
**原因**：未重新部署或未刷新浏览器  
**解决**：
1. 重新部署Edge Function
2. 强制刷新浏览器（Ctrl+F5）
3. 清除浏览器缓存

## 相关文档

- `ENGLISH_RECOGNITION_FINAL_FIX.md` - 详细修复报告
- `ENGLISH_RECOGNITION_TEST_GUIDE.md` - 测试指南
- `ENGLISH_FIX_SUMMARY.md` - 修复总结

---

**最后更新**：2026-03-24  
**当前配置**：`dev_pid: 1737`（英文识别）
