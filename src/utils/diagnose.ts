import { supabase } from '@/db/supabase';

/**
 * 诊断工具：测试AI电话工坊的各个组件
 */
export async function diagnosePhoneWorkshop() {
  console.log('🔍 开始诊断AI电话工坊...\n');
  
  const results = {
    textMode: false,
    voiceMode: false,
    errors: [] as string[]
  };

  // 测试1: 文字模式（最基础的测试）
  console.log('📝 测试1: 文字输入模式');
  try {
    const { data, error } = await supabase.functions.invoke('phone-call-dialogue', {
      body: {
        userText: 'Hello, how are you?',
        conversationHistory: [],
        scenarioTitle: '测试场景',
        voiceId: 'male-qn-qingse'
      }
    });

    if (error) {
      console.error('❌ 文字模式失败:', error);
      
      // 尝试获取详细错误
      if (error.context) {
        try {
          const errorText = await error.context.text();
          console.error('详细错误:', errorText);
          results.errors.push(`文字模式错误: ${errorText}`);
        } catch (e) {
          results.errors.push(`文字模式错误: ${error.message}`);
        }
      } else {
        results.errors.push(`文字模式错误: ${error.message}`);
      }
    } else if (data && data.success) {
      console.log('✅ 文字模式成功!');
      console.log('   用户输入:', data.userText);
      console.log('   AI回复:', data.aiReply);
      results.textMode = true;
    } else {
      console.error('❌ 文字模式失败: 服务器返回错误');
      results.errors.push(`文字模式错误: ${data?.error || '未知错误'}`);
    }
  } catch (error: any) {
    console.error('❌ 文字模式异常:', error);
    results.errors.push(`文字模式异常: ${error.message}`);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // 测试2: 语音模式（需要音频数据）
  console.log('🎤 测试2: 语音识别模式');
  console.log('   (需要真实的音频数据，跳过自动测试)');
  console.log('   请在浏览器中手动测试语音模式');

  console.log('\n' + '='.repeat(50) + '\n');

  // 输出诊断结果
  console.log('📊 诊断结果:');
  console.log('   文字模式:', results.textMode ? '✅ 正常' : '❌ 失败');
  console.log('   语音模式:', '⏭️ 需要手动测试');
  
  if (results.errors.length > 0) {
    console.log('\n❌ 发现的错误:');
    results.errors.forEach((err, i) => {
      console.log(`   ${i + 1}. ${err}`);
    });
  }

  console.log('\n💡 建议:');
  if (!results.textMode) {
    console.log('   1. 检查Supabase Secrets中的 INTEGRATIONS_API_KEY 是否配置');
    console.log('   2. 检查Edge Function是否已部署');
    console.log('   3. 检查API配额是否充足');
    console.log('   4. 查看上面的详细错误信息');
  } else {
    console.log('   1. 文字模式正常，可以使用');
    console.log('   2. 如果语音模式失败，可能是语音识别API的问题');
    console.log('   3. 建议先使用文字模式进行对话');
  }

  return results;
}

// 在浏览器控制台中调用此函数
// @ts-ignore
window.diagnosePhoneWorkshop = diagnosePhoneWorkshop;

console.log('💡 诊断工具已加载！');
console.log('   在浏览器控制台中输入: diagnosePhoneWorkshop()');
