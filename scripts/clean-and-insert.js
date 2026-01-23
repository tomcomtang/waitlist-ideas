/**
 * 删除所有记录并插入一条新记录
 * 运行: node scripts/clean-and-insert.js
 */

require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

async function cleanAndInsert() {
  console.log('🧹 开始清理数据库...\n');

  const NOTION_SECRET = process.env.NOTION_SECRET;
  const NOTION_DB = process.env.NOTION_DB;

  if (!NOTION_SECRET || !NOTION_DB) {
    console.error('❌ 错误: 请确保 .env.local 中设置了 NOTION_SECRET 和 NOTION_DB');
    process.exit(1);
  }

  const cleanDbId = NOTION_DB.replace(/-/g, '');

  try {
    const notion = new Client({ auth: NOTION_SECRET });

    // 步骤 1: 查询所有记录
    console.log('📋 查询所有记录...');
    const response = await notion.databases.query({
      database_id: cleanDbId,
    });

    const records = response.results;
    console.log(`   找到 ${records.length} 条记录\n`);

    // 步骤 2: 删除所有记录
    if (records.length > 0) {
      console.log('🗑️  正在删除记录...');
      for (let i = 0; i < records.length; i++) {
        const record = records[i];
        try {
          await notion.pages.update({
            page_id: record.id,
            archived: true,
          });
          console.log(`   ✅ 已删除记录 #${i + 1} (${record.id})`);
        } catch (error) {
          console.error(`   ❌ 删除记录 #${i + 1} 失败: ${error.message}`);
        }
      }
      console.log(`\n✅ 已删除 ${records.length} 条记录\n`);
    } else {
      console.log('📭 数据库中没有记录，无需删除\n');
    }

    // 步骤 3: 插入新记录
    console.log('📝 插入新记录...');
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const currentTime = new Date().toISOString();
    const testEmail = `test-${Date.now()}@example.com`;

    const newPage = await notion.pages.create({
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

    console.log('✅ 新记录创建成功！');
    console.log(`   记录 URL: ${newPage.url}`);
    console.log(`   Email: ${testEmail}`);
    console.log(`   Time: ${currentTime}`);
    console.log(`   ID: ${uniqueId}\n`);

    // 步骤 4: 验证记录
    console.log('🔍 验证记录...');
    const verifyResponse = await notion.databases.query({
      database_id: cleanDbId,
    });
    console.log(`✅ 数据库现在有 ${verifyResponse.results.length} 条记录\n`);

    console.log('🎉 完成！');

  } catch (error) {
    console.error('❌ 操作失败:');
    console.error(`   错误代码: ${error.code}`);
    console.error(`   错误信息: ${error.message}`);
    process.exit(1);
  }
}

cleanAndInsert();
