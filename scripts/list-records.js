/**
 * 查询并打印数据库中的所有记录
 * 运行: node scripts/list-records.js
 */

require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

async function listRecords() {
  console.log('📋 查询数据库记录...\n');

  const NOTION_SECRET = process.env.NOTION_SECRET;
  const NOTION_DB = process.env.NOTION_DB;

  if (!NOTION_SECRET || !NOTION_DB) {
    console.error('❌ 错误: 请确保 .env.local 中设置了 NOTION_SECRET 和 NOTION_DB');
    process.exit(1);
  }

  const cleanDbId = NOTION_DB.replace(/-/g, '');

  try {
    const notion = new Client({ auth: NOTION_SECRET });

    // 查询数据库中的所有记录
    const response = await notion.databases.query({
      database_id: cleanDbId,
    });

    console.log(`📊 数据库: test-notion-db`);
    console.log(`📝 总记录数: ${response.results.length} 条\n`);

    if (response.results.length === 0) {
      console.log('📭 数据库中没有记录\n');
      return;
    }

    console.log('─'.repeat(80));
    response.results.forEach((page, index) => {
      const props = page.properties;
      
      console.log(`\n记录 #${index + 1}`);
      console.log(`ID: ${page.id}`);
      console.log(`URL: ${page.url}`);
      
      // 获取 Name 字段
      if (props.Name && props.Name.title) {
        const name = props.Name.title[0]?.plain_text || '(空)';
        console.log(`Name: ${name}`);
      }
      
      // 获取 Email 字段
      if (props.Email && props.Email.email) {
        console.log(`Email: ${props.Email.email}`);
      }
      
      // 获取 Time 字段
      if (props.Time && props.Time.date) {
        const time = props.Time.date.start;
        console.log(`Time: ${time}`);
      }
      
      // 获取 ID 字段
      if (props.ID && props.ID.rich_text) {
        const id = props.ID.rich_text[0]?.plain_text || '(空)';
        console.log(`ID: ${id}`);
      }
      
      // 获取 Date 字段（如果有）
      if (props.Date && props.Date.date) {
        const date = props.Date.date.start;
        console.log(`Date: ${date}`);
      }
      
      console.log('─'.repeat(80));
    });

    console.log(`\n✅ 共 ${response.results.length} 条记录\n`);

  } catch (error) {
    console.error('❌ 查询失败:');
    console.error(`   错误代码: ${error.code}`);
    console.error(`   错误信息: ${error.message}`);
    process.exit(1);
  }
}

listRecords();
