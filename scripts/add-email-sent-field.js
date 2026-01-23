/**
 * 添加 Email Sent 字段到 Notion 数据库
 * 运行: node scripts/add-email-sent-field.js
 */

require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

async function addEmailSentField() {
  console.log('🔧 添加 Email Sent 字段到数据库...\n');

  const NOTION_SECRET = process.env.NOTION_SECRET;
  const NOTION_DB = process.env.NOTION_DB;

  if (!NOTION_SECRET || !NOTION_DB) {
    console.error('❌ 错误: 请确保 .env.local 中设置了 NOTION_SECRET 和 NOTION_DB');
    process.exit(1);
  }

  const cleanDbId = NOTION_DB.replace(/-/g, '');

  try {
    const notion = new Client({ auth: NOTION_SECRET });

    // 获取数据库信息
    const database = await notion.databases.retrieve({ database_id: cleanDbId });
    console.log(`📋 数据库: ${database.title[0]?.plain_text || 'Unknown'}\n`);

    // 检查字段是否已存在
    const existingProperties = database.properties;
    if (existingProperties['Email Sent']) {
      console.log('✅ Email Sent 字段已存在\n');
      return;
    }

    // 添加 Email Sent 字段
    console.log('➕ 添加 Email Sent 字段...');
    await notion.databases.update({
      database_id: cleanDbId,
      properties: {
        ...existingProperties,
        'Email Sent': {
          type: 'checkbox',
          checkbox: {},
        },
      },
    });

    console.log('✅ Email Sent 字段添加成功！\n');
    console.log('💡 现在可以:');
    console.log('   1. 在 Notion 数据库中查看新字段');
    console.log('   2. 使用邮件接口发送邮件');

  } catch (error) {
    console.error('❌ 添加字段失败:');
    console.error(`   错误代码: ${error.code}`);
    console.error(`   错误信息: ${error.message}`);
    if (error.code === 'validation_error') {
      console.error('\n💡 可能的原因:');
      console.error('   1. 字段名称冲突');
      console.error('   2. 字段类型不正确');
    }
    process.exit(1);
  }
}

addEmailSentField();
