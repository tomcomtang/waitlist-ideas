/**
 * 检查数据库所有字段
 * 运行: node scripts/check-db-fields.js
 */

require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

async function checkDatabaseFields() {
  console.log('🔍 检查数据库字段...\n');

  const NOTION_SECRET = process.env.NOTION_SECRET;
  const NOTION_DB = process.env.NOTION_DB;

  if (!NOTION_SECRET || !NOTION_DB) {
    console.error('❌ 错误: 请确保 .env.local 中设置了 NOTION_SECRET 和 NOTION_DB');
    process.exit(1);
  }

  const cleanDbId = NOTION_DB.replace(/-/g, '');

  try {
    const notion = new Client({ auth: NOTION_SECRET });

    const database = await notion.databases.retrieve({ database_id: cleanDbId });
    console.log(`📋 数据库: ${database.title[0]?.plain_text || '未命名'}\n`);

    const properties = database.properties;
    console.log('📝 当前所有字段:');
    console.log('─'.repeat(50));
    
    Object.keys(properties).forEach((key, index) => {
      const prop = properties[key];
      console.log(`${index + 1}. ${key}`);
      console.log(`   类型: ${prop.type}`);
      if (prop.type === 'title') {
        console.log(`   ✅ 这是 Title 字段（Notion 必需字段）`);
      }
      console.log('');
    });

    console.log('─'.repeat(50));
    console.log(`\n总计: ${Object.keys(properties).length} 个字段\n`);

    // 检查必需的字段
    const hasEmail = properties.Email && properties.Email.type === 'email';
    const hasTime = properties.Time && properties.Time.type === 'date';
    const hasID = properties.ID && (properties.ID.type === 'rich_text' || properties.ID.type === 'text');
    const hasName = properties.Name && properties.Name.type === 'title';

    console.log('✅ 字段检查:');
    console.log(`   Email: ${hasEmail ? '✅' : '❌'}`);
    console.log(`   Time: ${hasTime ? '✅' : '❌'}`);
    console.log(`   ID: ${hasID ? '✅' : '❌'}`);
    console.log(`   Name: ${hasName ? '✅ (Title 类型，Notion 必需)' : '❌'}\n`);

    if (hasEmail && hasTime && hasID) {
      console.log('🎉 完美！数据库包含所有必需字段：Email、Time、ID');
    } else {
      console.log('⚠️  缺少以下字段:');
      if (!hasEmail) console.log('   - Email (Email 类型)');
      if (!hasTime) console.log('   - Time (Date 类型)');
      if (!hasID) console.log('   - ID (Text 类型)');
    }

  } catch (error) {
    console.error('❌ 操作失败:');
    console.error(`   错误代码: ${error.code}`);
    console.error(`   错误信息: ${error.message}`);
    process.exit(1);
  }
}

checkDatabaseFields();
