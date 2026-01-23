/**
 * 测试创建记录（只使用 Email、Time、ID）
 * 运行: node scripts/test-create-record.js
 */

require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

async function testCreateRecord() {
  console.log('🧪 测试创建记录...\n');

  const NOTION_SECRET = process.env.NOTION_SECRET;
  const NOTION_DB = process.env.NOTION_DB;

  if (!NOTION_SECRET || !NOTION_DB) {
    console.error('❌ 错误: 请确保 .env.local 中设置了 NOTION_SECRET 和 NOTION_DB');
    process.exit(1);
  }

  const cleanDbId = NOTION_DB.replace(/-/g, '');
  const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const currentTime = new Date().toISOString();
  const testEmail = `test-${Date.now()}@example.com`;

  try {
    const notion = new Client({ auth: NOTION_SECRET });

    console.log('📝 创建测试记录...');
    console.log(`   Email: ${testEmail}`);
    console.log(`   Time: ${currentTime}`);
    console.log(`   ID: ${uniqueId}\n`);

    const testPage = await notion.pages.create({
      parent: {
        database_id: cleanDbId,
      },
      properties: {
        Email: {
          type: 'email',
          email: testEmail,
        },
        Name: {
          type: 'title',
          title: [
            {
              type: 'text',
              text: {
                content: '', // 留空
              },
            },
          ],
        },
        Time: {
          type: 'date',
          date: {
            start: currentTime,
          },
        },
        ID: {
          type: 'rich_text',
          rich_text: [
            {
              type: 'text',
              text: {
                content: uniqueId,
              },
            },
          ],
        },
      },
    });

    console.log('✅ 测试记录创建成功！');
    console.log(`   记录 URL: ${testPage.url}\n`);

    // 清理测试记录
    console.log('🗑️  清理测试记录...');
    await notion.pages.update({
      page_id: testPage.id,
      archived: true,
    });
    console.log('✅ 测试记录已归档\n');

    console.log('🎉 所有测试通过！数据库配置正确！');
    console.log('\n💡 现在可以:');
    console.log('   1. 运行 npm run dev 启动项目');
    console.log('   2. 在浏览器中测试表单提交');
    console.log('   3. 在 Notion 数据库中查看记录');

  } catch (error) {
    console.error('❌ 创建记录失败:');
    console.error(`   错误代码: ${error.code}`);
    console.error(`   错误信息: ${error.message}`);
    if (error.code === 'validation_error') {
      console.error('\n💡 可能的原因:');
      console.error('   1. 字段名称不匹配');
      console.error('   2. 字段类型不正确');
    }
    process.exit(1);
  }
}

testCreateRecord();
