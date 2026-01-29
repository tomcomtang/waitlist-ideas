import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();

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
    
    const dbId = process.env.NOTION_DB.replace(/-/g, "");
    
    console.log("Checking if email already exists:", {
      email: body.email.substring(0, 10) + "...",
    });
    
    const existingRecords = await notion.databases.query({
      database_id: dbId,
      filter: {
        property: "Email",
        email: {
          equals: body.email,
        },
      },
    });
    
    if (existingRecords.results && existingRecords.results.length > 0) {
      return NextResponse.json(
        { success: false, error: "This email is already registered. Please use a different email address." },
        { status: 409 }
      );
    }
    
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const token = randomBytes(16).toString("hex");
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
        "Email Sent": {
          type: "checkbox",
          checkbox: false,
        },
        Token: {
          type: "rich_text",
          rich_text: [
            {
              type: "text",
              text: {
                content: token,
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

    if (error.code === "validation_error") {
      return NextResponse.json(
        { 
          success: false, 
          error: `Validation error: ${error.message || "Field validation failed"}` 
        },
        { status: 400 }
      );
    }

    const errorMessage = process.env.NODE_ENV === "development" 
      ? `${error.message || "Failed to save to Notion"} (Code: ${error.code || "unknown"})`
      : "Failed to save to Notion. Please try again later.";

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
