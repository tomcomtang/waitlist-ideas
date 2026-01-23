/**
 * 尝试删除 Name 字段
 * 运行: node scripts/remove-name-field.js
 */

require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

async function removeNameField() {
  console.log('🗑️  尝试删除 Name 字段...\n');

  const NOTION_SECRET = process.env.NOTION_SECRET;
  const NOTION_DB = process.env.NOTION_DB;

  if (!NOTION_SECRET || !NOTION_DB) {
    console.error('❌ 错误: 请确保 .env.local 中设置了 NOTION_SECRET 和 NOTION_DB');
    process.exit(1);
  }

  const cleanDbId = NOTION_DB.replace(/-/g, '');

  try {
    const notion = new Client({ auth: NOTION_SECRET });

    // 获取当前数据库结构
    console.log('📋 获取当前数据库结构...');
    const database = await notion.databases.retrieve({ database_id: cleanDbId });
    console.log(`✅ 数据库: ${database.title[0]?.plain_text || '未命名'}\n`);

    const existingProperties = database.properties;
    
    // 检查是否有 Name 字段
    if (!existingProperties.Name) {
      console.log('✅ Name 字段不存在，无需删除');
      return;
    }

    console.log('📝 当前字段:');
    Object.keys(existingProperties).forEach(key => {
      const prop = existingProperties[key];
      console.log(`   - ${key}: ${prop.type}`);
    });
    console.log('');

    // 准备更新后的字段（删除 Name）
    const updatedProperties = {};
    Object.keys(existingProperties).forEach(key => {
      if (key !== 'Name') {
        const prop = existingProperties[key];
        // 只保留字段类型的基本结构
        updatedProperties[key] = {
          [prop.type]: {}
        };
      }
    });

    console.log('🗑️  正在删除 Name 字段...');
    try {
      const updatedDatabase = await notion.databases.update({
        database_id: cleanDbId,
        properties: updatedProperties
      });

      console.log('✅ Name 字段删除成功！\n');
      console.log('📋 更新后的字段列表:');
      Object.keys(updatedDatabase.properties).forEach(key => {
        const prop = updatedDatabase.properties[key];
        console.log(`   - ${key}: ${prop.type}`);
      });
      console.log('\n🎉 完成！现在数据库只包含:');
      console.log('   - Email (Email)');
      console.log('   - Time (Date)');
      console.log('   - ID (Text)');
    } catch (error) {
      console.error('❌ 删除失败:');
      console.error(`   错误代码: ${error.code}`);
      console.error(`   错误信息: ${error.message}\n`);
      
      if (error.message.includes('title') || error.message.includes('Title')) {
        console.log('💡 说明:');
        console.log('   Notion 数据库必须至少有一个 Title 类型的字段');
        console.log('   这是 Notion 的要求，无法删除所有 Title 字段\n');
        console.log('💡 替代方案:');
        console.log('   1. 保留 Name 字段，但在代码中不填充它（留空）');
        console.log('   2. 或者将 Name 字段重命名为其他名称（如 "备注"）');
        console.log('   3. 代码中只使用 Email、Time、ID 这三个字段\n');
      }
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ 操作失败:');
    console.error(`   错误代码: ${error.code}`);
    console.error(`   错误信息: ${error.message}`);
    process.exit(1);
  }
}

removeNameField();
