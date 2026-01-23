import { render } from "@react-email/render";
import WaitlistWelcomeEmail from "../../../emails";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const { email, firstname } = await request.json();
    
    console.log("Mail API called with:", { email: email?.substring(0, 10) + "...", hasFirstname: !!firstname });

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // 验证环境变量
    if (!process.env.NOTION_SECRET || !process.env.NOTION_DB) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const notion = new Client({ auth: process.env.NOTION_SECRET });
    const dbId = process.env.NOTION_DB.replace(/-/g, "");
    
    console.log("Environment variables checked, querying Notion...");

    // 查找该邮箱对应的记录
    console.log("Querying Notion database for email...");
    const existingRecords = await notion.databases.query({
      database_id: dbId,
      filter: {
        property: "Email",
        email: {
          equals: email,
        },
      },
    });

    if (!existingRecords.results || existingRecords.results.length === 0) {
      console.log("Email not found in database");
      return NextResponse.json(
        { error: "Email not found in database" },
        { status: 404 }
      );
    }

    const record = existingRecords.results[0];
    console.log("Record found, checking Email Sent status...");
    
    // 检查是否已经发送过邮件
    const emailSent = "properties" in record && 
                      record.properties["Email Sent"]?.type === "checkbox" 
      ? record.properties["Email Sent"].checkbox 
      : false;

    if (emailSent) {
      console.log("Email already sent, returning early");
      return NextResponse.json(
        { message: "Email has already been sent to this address" },
        { status: 200 }
      );
    }

    // 发送邮件
    console.log("Rendering email template...");
    const emailHtml = await render(WaitlistWelcomeEmail({ userFirstname: firstname || "" }));
    
    console.log("Sending email via Resend...");
    
    // Resend 测试邮箱限制：只能发送到注册账号的邮箱
    // 如果要发送到任意邮箱，必须验证域名
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    const replyToEmail = process.env.RESEND_REPLY_TO || "onboarding@resend.dev";
    
    // 如果使用测试邮箱且未验证域名，只能发送到注册邮箱
    // 这里添加一个检查：如果使用测试邮箱，检查收件人是否是注册邮箱
    const isTestEmail = fromEmail === "onboarding@resend.dev" || fromEmail.includes("@resend.dev");
    const registeredEmail = process.env.RESEND_REGISTERED_EMAIL || "tomcomtang@gmail.com";
    
    // 如果使用测试邮箱，且收件人不是注册邮箱，记录警告但继续尝试发送
    // Resend 会返回错误，我们会在错误处理中处理
    if (isTestEmail && email !== registeredEmail) {
      console.warn(`⚠️  Test email limitation: Can only send to registered email (${registeredEmail}). Attempting to send to ${email} will fail unless domain is verified.`);
    }
    
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: "Welcome to Waitlist Ideas! 🎉",
      reply_to: replyToEmail,
      html: emailHtml,
    });

    if (error) {
      console.error("Resend API error:", error);
      
      // 如果是域名验证错误，提供更友好的提示
      const errorMessage = typeof error === 'object' && 'message' in error ? String(error.message) : String(error);
      const statusCode = typeof error === 'object' && 'statusCode' in error ? (error as any).statusCode : undefined;
      
      if (statusCode === 403 && errorMessage.includes("verify a domain")) {
        return NextResponse.json(
          { 
            error: "Domain verification required",
            message: "To send emails to recipients, please verify your domain at https://resend.com/domains. Test emails can only be sent to your registered email address.",
            details: errorMessage
          },
          { status: 403 }
        );
      }
      
      return NextResponse.json(
        { error: errorMessage || "Failed to send email", details: error },
        { status: 500 }
      );
    }

    if (!data) {
      console.error("Resend returned no data");
      return NextResponse.json(
        { error: "Failed to send email - no data returned" },
        { status: 500 }
      );
    }

    console.log("Email sent successfully, updating Notion record...");
    // 邮件发送成功，更新 Notion 记录标记为已发送
    try {
      await notion.pages.update({
        page_id: record.id,
        properties: {
          "Email Sent": {
            type: "checkbox",
            checkbox: true,
          },
        },
      });
      console.log("Notion record updated successfully");
    } catch (updateError) {
      console.warn("Failed to update Email Sent field:", updateError);
      // 邮件已发送，即使更新字段失败也不影响
    }

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error: any) {
    console.error("Mail API error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      cause: error.cause,
    });
    return NextResponse.json(
      { 
        error: error.message || "Failed to send email",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
