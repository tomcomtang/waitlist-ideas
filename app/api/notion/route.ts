import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 验证必要参数
    if (!body?.email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    if (!body?.name || body.name.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    // 验证环境变量
    if (!process.env.NOTION_SECRET) {
      console.error("NOTION_SECRET is not configured");
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    if (!process.env.NOTION_DB) {
      console.error("NOTION_DB is not configured");
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    const notion = new Client({ auth: process.env.NOTION_SECRET });
    
    // 处理数据库ID格式（移除连字符）
    const dbId = process.env.NOTION_DB.replace(/-/g, "");
    
    // 生成唯一 ID（使用时间戳 + 随机数）
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    // 获取当前时间
    const currentTime = new Date().toISOString();
    
    console.log("Creating Notion page with:", {
      dbId: dbId.substring(0, 8) + "...",
      name: body.name,
      email: body.email.substring(0, 10) + "...",
    });
    
    const response = await notion.pages.create({
      parent: {
        database_id: dbId,
      },
      properties: {
        Email: {
          type: "email",
          email: body.email,
        },
        Name: {
          type: "title",
          title: [
            {
              type: "text",
              text: {
                content: body.name.trim(),
              },
            },
          ],
        },
        Time: {
          type: "date",
          date: {
            start: currentTime,
          },
        },
        ID: {
          type: "rich_text",
          rich_text: [
            {
              type: "text",
              text: {
                content: uniqueId,
              },
            },
          ],
        },
      },
    });

    if (!response) {
      throw new Error("Failed to create page in Notion");
    }

    return NextResponse.json(
      { success: true, id: response.id },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Notion API error:", {
      message: error.message,
      code: error.code,
      status: error.status,
      body: error.body,
    });
    
    // 处理 Notion API 特定错误
    if (error.code === "object_not_found") {
      return NextResponse.json(
        { success: false, error: "Database not found. Please check your NOTION_DB configuration." },
        { status: 404 }
      );
    }

    if (error.code === "unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized access. Please check your NOTION_SECRET." },
        { status: 401 }
      );
    }

    // 处理验证错误
    if (error.code === "validation_error") {
      return NextResponse.json(
        { 
          success: false, 
          error: `Validation error: ${error.message || "Field validation failed"}` 
        },
        { status: 400 }
      );
    }

    // 返回详细错误信息（开发环境）
    const errorMessage = process.env.NODE_ENV === "development" 
      ? `${error.message || "Failed to save to Notion"} (Code: ${error.code || "unknown"})`
      : "Failed to save to Notion. Please try again later.";

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
