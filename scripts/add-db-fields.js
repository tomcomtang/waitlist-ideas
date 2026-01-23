/**
 * 在 Notion 数据库中添加字段
 * 运行: node scripts/add-db-fields.js
 */

require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

async function addDatabaseFields() {
  console.log('🔧 开始添加数据库字段...\n');

  const NOTION_SECRET = process.env.NOTION_SECRET;
  const NOTION_DB = process.env.NOTION_DB;

  if (!NOTION_SECRET || !NOTION_DB) {
    console.error('❌ 错误: 请确保 .env.local 中设置了 NOTION_SECRET 和 NOTION_DB');
    process.exit(1);
  }

  const cleanDbId = NOTION_DB.replace(/-/g, '');

  try {
    const notion = new Client({ auth: NOTION_SECRET });

    // 先获取当前数据库结构
    console.log('📋 获取当前数据库结构...');
    const database = await notion.databases.retrieve({ database_id: cleanDbId });
    console.log(`✅ 数据库: ${database.title[0]?.plain_text || '未命名'}\n`);

    const existingProperties = database.properties;
    console.log('📝 当前字段:');
    Object.keys(existingProperties).forEach(key => {
      const prop = existingProperties[key];
      console.log(`   - ${key}: ${prop.type}`);
    });
    console.log('');

    // 准备要添加的字段
    const propertiesToAdd = {};

    // 检查并添加 Email 字段
    if (!existingProperties.Email) {
      console.log('➕ 添加 Email 字段...');
      propertiesToAdd.Email = {
        email: {}
      };
    } else {
      console.log('✅ Email 字段已存在');
    }

    // 检查并添加 Time 字段（使用 Date 类型）
    if (!existingProperties.Time) {
      console.log('➕ 添加 Time 字段...');
      propertiesToAdd.Time = {
        date: {}
      };
    } else {
      console.log('✅ Time 字段已存在');
    }

    // 检查并添加 ID 字段（使用 Text 类型，因为 Notion 会自动生成页面 ID）
    if (!existingProperties.ID) {
      console.log('➕ 添加 ID 字段（文本类型）...');
      propertiesToAdd.ID = {
        rich_text: {}
      };
    } else {
      console.log('✅ ID 字段已存在');
    }

    // 如果有新字段需要添加
    if (Object.keys(propertiesToAdd).length > 0) {
      console.log('\n📝 正在更新数据库...');
      try {
        // 保留所有现有字段的基本定义，只添加新字段
        const updatedProperties = {};
        
        // 先复制所有现有字段的基本定义（只保留类型，不包含详细配置）
        Object.keys(existingProperties).forEach(key => {
          const prop = existingProperties[key];
          // 只保留字段类型的基本结构，不包含 options/groups 等详细配置
          updatedProperties[key] = {
            [prop.type]: {}
          };
        });
        
        // 添加新字段
        Object.assign(updatedProperties, propertiesToAdd);

        const updatedDatabase = await notion.databases.update({
          database_id: cleanDbId,
          properties: updatedProperties
        });

        console.log('✅ 数据库字段添加成功！\n');
        console.log('📋 更新后的字段列表:');
        Object.keys(updatedDatabase.properties).forEach(key => {
          const prop = updatedDatabase.properties[key];
          console.log(`   - ${key}: ${prop.type}`);
        });
        console.log('\n🎉 完成！现在数据库包含以下字段:');
        console.log('   - Name (Title) - 已存在');
        if (updatedDatabase.properties.Email) {
          console.log('   - Email (Email) - ✅ 已添加');
        }
        if (updatedDatabase.properties.Time) {
          console.log('   - Time (Date) - ✅ 已添加');
        }
        if (updatedDatabase.properties.ID) {
          console.log('   - ID (Text) - ✅ 已添加');
        }
      } catch (error) {
        console.error('❌ 更新数据库失败:');
        console.error(`   错误代码: ${error.code}`);
        console.error(`   错误信息: ${error.message}`);
        if (error.code === 'validation_error') {
          console.error('\n💡 可能的原因:');
          console.error('   1. 字段名称冲突');
          console.error('   2. 字段类型不支持');
          console.error('   3. 数据库权限不足');
        }
        process.exit(1);
      }
    } else {
      console.log('\n✅ 所有字段都已存在，无需添加！');
    }

  } catch (error) {
    console.error('❌ 操作失败:');
    console.error(`   错误代码: ${error.code}`);
    console.error(`   错误信息: ${error.message}`);
    process.exit(1);
  }
}

addDatabaseFields();
