/**
 * 测试 Notion 连接脚本
 * 运行: node scripts/test-notion.js
 */

require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

async function testNotionConnection() {
  console.log('🔍 开始测试 Notion 连接...\n');

  // 检查环境变量
  const NOTION_SECRET = process.env.NOTION_SECRET;
  const NOTION_DB = process.env.NOTION_DB;

  if (!NOTION_SECRET) {
    console.error('❌ 错误: NOTION_SECRET 未设置');
    console.log('请在 .env.local 文件中设置 NOTION_SECRET');
    process.exit(1);
  }

  // NOTION_DB 是可选的，如果没有设置，只测试密钥
  const hasDatabaseId = !!NOTION_DB && NOTION_DB !== 'test-notion-db';

  console.log('✅ 环境变量检查通过');
  console.log(`   NOTION_SECRET: ${NOTION_SECRET.substring(0, 10)}...`);
  console.log(`   NOTION_SECRET 长度: ${NOTION_SECRET.length} 字符\n`);

  try {
    // 初始化 Notion 客户端
    const notion = new Client({ auth: NOTION_SECRET });
    console.log('✅ Notion 客户端初始化成功\n');

    // 测试 1: 验证密钥有效性 - 尝试搜索所有内容
    console.log('🔑 测试 1: 验证 Notion 密钥有效性...');
    try {
      // 先搜索所有数据库
      const dbSearchResponse = await notion.search({
        filter: {
          property: 'object',
          value: 'database',
        },
        page_size: 10,
      });
      
      // 再搜索所有页面（可能包含数据库）
      const pageSearchResponse = await notion.search({
        filter: {
          property: 'object',
          value: 'page',
        },
        page_size: 10,
      });
      
      console.log('✅ Notion 密钥验证成功！');
      console.log(`   密钥格式: ${NOTION_SECRET.startsWith('secret_') ? '✅ 正确 (secret_ 开头)' : NOTION_SECRET.startsWith('ntn_') ? '✅ 正确 (ntn_ 开头 - 新格式)' : '⚠️  非标准格式'}`);
      console.log(`   可访问的数据库数量: ${dbSearchResponse.results.length} 个`);
      console.log(`   可访问的页面数量: ${pageSearchResponse.results.length} 个\n`);
      
      if (dbSearchResponse.results.length > 0) {
        console.log('📋 找到以下数据库:');
        dbSearchResponse.results.forEach((db, index) => {
          const title = db.title?.[0]?.plain_text || '未命名数据库';
          const dbId = db.id.replace(/-/g, '');
          console.log(`   ${index + 1}. ${title}`);
          console.log(`      ID: ${dbId}`);
          console.log(`      URL: ${db.url}`);
          console.log(`      已连接: ${db.url ? '✅' : '❌'}\n`);
        });
      } else {
        console.log('⚠️  搜索未找到数据库（这是正常的，Notion API 搜索可能无法找到所有数据库）\n');
      }

      // 如果提供了数据库 ID，直接测试该数据库
      if (hasDatabaseId) {
        console.log('📋 测试 2: 直接测试指定的数据库...');
        console.log(`   数据库 ID: ${NOTION_DB}`);
        console.log(`   ID 长度: ${NOTION_DB.length} 字符\n`);
        
        // 清理数据库 ID（去掉连字符）
        const cleanDbId = NOTION_DB.replace(/-/g, '');
        if (cleanDbId.length !== 32) {
          console.warn('⚠️  警告: 数据库 ID 长度不是 32 字符');
          console.warn('   请检查数据库 ID 是否正确\n');
        }

        try {
          const database = await notion.databases.retrieve({ database_id: cleanDbId });
          console.log('✅ 数据库连接成功！');
          console.log(`   数据库标题: ${database.title[0]?.plain_text || '未命名'}`);
          console.log(`   数据库 ID: ${database.id}`);
          console.log(`   数据库 URL: ${database.url}\n`);

          // 检查字段
          console.log('📝 检查数据库字段...');
          const properties = database.properties;
          const hasName = properties.Name && properties.Name.type === 'title';
          const hasEmail = properties.Email && properties.Email.type === 'email';
          
          console.log(`   Name 字段: ${hasName ? '✅ 存在 (Title 类型)' : '❌ 不存在或类型错误'}`);
          console.log(`   Email 字段: ${hasEmail ? '✅ 存在 (Email 类型)' : '❌ 不存在或类型错误'}\n`);

          if (hasName && hasEmail) {
            console.log('✅ 数据库字段配置正确！\n');
            
            // 测试创建记录
            console.log('📝 测试 3: 创建测试记录...');
            try {
              const testPage = await notion.pages.create({
                parent: {
                  database_id: cleanDbId,
                },
                properties: {
                  Email: {
                    type: 'email',
                    email: 'test@example.com',
                  },
                  Name: {
                    type: 'title',
                    title: [
                      {
                        type: 'text',
                        text: {
                          content: '测试用户',
                        },
                      },
                    ],
                  },
                },
              });
              console.log('✅ 测试记录创建成功！');
              console.log(`   记录 ID: ${testPage.id}`);
              console.log(`   记录 URL: ${testPage.url}\n`);

              // 清理测试记录
              console.log('🗑️  清理测试记录...');
              try {
                await notion.pages.update({
                  page_id: testPage.id,
                  archived: true,
                });
                console.log('✅ 测试记录已归档（可在 Notion 中恢复或永久删除）\n');
              } catch (error) {
                console.log('⚠️  无法自动清理测试记录，请手动删除\n');
              }
            } catch (error) {
              console.error('❌ 创建测试记录失败:');
              console.error(`   错误代码: ${error.code}`);
              console.error(`   错误信息: ${error.message}\n`);
            }
          } else {
            console.log('⚠️  请确保数据库有以下字段:');
            console.log('   - Name (Title 类型)');
            console.log('   - Email (Email 类型)\n');
          }
        } catch (error) {
          console.error('❌ 数据库连接失败:');
          if (error.code === 'object_not_found') {
            console.error('   数据库不存在或数据库 ID 错误');
            console.error('   请检查:');
            console.error('   1. NOTION_DB 是否正确（32 字符，去掉连字符）');
            console.error('   2. 数据库是否已连接到集成');
            console.error('   3. 集成是否有访问权限');
          } else if (error.code === 'unauthorized') {
            console.error('   未授权访问');
            console.error('   请检查数据库是否已连接到集成');
            console.error('   （数据库页面 → ... → Connections → 选择你的集成）');
          } else {
            console.error(`   错误代码: ${error.code}`);
            console.error(`   错误信息: ${error.message}`);
          }
        }
      } else {
        console.log('💡 提示: 如果你已经创建了数据库，请:');
        console.log('   1. 从数据库 URL 获取 32 字符的数据库 ID（去掉连字符）');
        console.log('   2. 更新 .env.local 中的 NOTION_DB');
        console.log('   3. 确保数据库已连接到集成');
        console.log('   4. 重新运行此测试\n');
      }
    } catch (error) {
      console.error('❌ Notion 密钥验证失败:');
      if (error.code === 'unauthorized') {
        console.error('   密钥无效或已过期');
        console.error('   请检查:');
        console.error('   1. NOTION_SECRET 是否正确');
        console.error('   2. 是否从 https://www.notion.so/my-integrations 获取');
        console.error('   3. 密钥是否被撤销或删除');
      } else if (error.code === 'invalid_request') {
        console.error('   密钥格式错误');
        console.error('   密钥应该以 "secret_" 或 "ntn_" 开头');
      } else {
        console.error(`   错误代码: ${error.code}`);
        console.error(`   错误信息: ${error.message}`);
      }
      process.exit(1);
    }

    console.log('🎉 测试完成！');

  } catch (error) {
    console.error('\n❌ 未预期的错误:');
    console.error(error);
    process.exit(1);
  }
}

testNotionConnection();
