import { render } from "@react-email/render";
import WaitlistWelcomeEmail from "../../../emails";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: NextRequest) {
  try {
    const { email, firstname } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const resendEnabled = process.env.RESEND_ENABLED === "true";
    
    if (!resendEnabled) {
      return NextResponse.json(
        { message: "Email sending is disabled" },
        { status: 200 }
      );
    }

    if (!resend) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    if (!process.env.NOTION_SECRET || !process.env.NOTION_DB) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const notion = new Client({ auth: process.env.NOTION_SECRET });
    const dbId = process.env.NOTION_DB.replace(/-/g, "");

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
      return NextResponse.json(
        { error: "Email not found in database" },
        { status: 404 }
      );
    }

    const record = existingRecords.results[0];
    
    const emailSent = "properties" in record && 
                      record.properties["Email Sent"]?.type === "checkbox" 
      ? record.properties["Email Sent"].checkbox 
      : false;

    if (emailSent) {
      return NextResponse.json(
        { message: "Email has already been sent to this address" },
        { status: 200 }
      );
    }

    const emailHtml = await render(WaitlistWelcomeEmail({ userFirstname: firstname || "" }));
    
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    const replyToEmail = process.env.RESEND_REPLY_TO || "onboarding@resend.dev";
    
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: "Welcome to Waitlist Ideas! 🎉",
      reply_to: replyToEmail,
      html: emailHtml,
    });

    if (error) {
      return NextResponse.json(
        { error: "Failed to send email", details: error },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

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
    } catch (updateError) {
      console.warn("Failed to update Email Sent field:", updateError);
    }

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: error.message || "Failed to send email",
      },
      { status: 500 }
    );
  }
}
