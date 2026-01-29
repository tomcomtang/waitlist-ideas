# Waitlist Ideas

This is a template repository for collecting spot registrations (event signups, pre-sale applications, reservation lists, etc.) using Next.js 15, Notion as a CMS, and Resend for sending confirmation emails. Email sending is optional and controlled by the `RESEND_ENABLED` environment variable.

## Features

- ✅ **Notion Integration**: Save all registrations to your Notion database
- ✅ **Registration Token**: A unique token is generated per registration and stored in Notion; it is included in the confirmation email as proof of registration (e.g. for check-in or claiming a spot)
- ✅ **Email Notifications**: Send confirmation emails via Resend (optional, controlled by `RESEND_ENABLED`)
- ✅ **Duplicate Prevention**: Prevents duplicate email registrations
- ✅ **Email Tracking**: Tracks whether a confirmation email has been sent per record
- ✅ **Modern Design**: Glassmorphism effects with animated background
- ✅ **Responsive Layout**: Works on all devices
- ✅ **Type-Safe**: Built with TypeScript
- ✅ **Real-time Feedback**: Toast notifications for user actions

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NOTION_SECRET=your_notion_secret_here
NOTION_DB=your_notion_database_id_here
RESEND_ENABLED=false
RESEND_API_KEY=your_resend_api_key_here
```

Set `RESEND_ENABLED=true` to enable sending confirmation emails.

### 3. Set Up Notion Database

1. Create a new database in your Notion workspace
2. Add the following properties:
   - **Name**: Title type
   - **Email**: Email type
   - **Time**: Date type
   - **ID**: Text type
   - **Email Sent**: Checkbox type
   - **Token**: Text type (unique token per registration; auto-generated on insert, included in confirmation email as proof of registration)
3. Create an integration at [Notion Integrations](https://www.notion.so/my-integrations)
4. Copy the integration secret (this is your `NOTION_SECRET`)
5. Share your database with the integration
6. Get your database ID from the URL: `https://www.notion.so/{DATABASE_ID}?v=...`

### 4. Set Up Resend (Optional)

1. Sign up at [Resend](https://resend.com)
2. For testing, you can use the default test email `onboarding@resend.dev`
3. For production, verify your domain and update `RESEND_FROM_EMAIL` in `.env.local`

### 5. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### 6. Build for Production

```bash
npm run build
npm start
```

## Deploy

[![Deploy with EdgeOne Pages](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?from=github&template=waitlist-ideas)

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── mail/
│   │   │   └── route.ts          # Email sending API
│   │   └── notion/
│   │       └── route.ts          # Notion integration API
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── ui/                       # Reusable UI components
│   ├── canvas-background.tsx     # Animated background
│   ├── footer.tsx                # Footer component
│   ├── hero-section.tsx          # Hero section
│   └── subscription-section.tsx  # Waitlist form
├── emails/
│   └── index.tsx                 # Welcome email template
├── lib/
│   └── utils.ts                  # Utility functions
└── package.json
```

## How It Works

1. **Registration**: Visitor enters name and email on the page to apply for a spot
2. **Validation**: Frontend validates email format and required fields
3. **Notion Storage**: Registration is saved to your Notion database; a unique **Token** is generated and stored with the record
4. **Duplicate Check**: System rejects duplicate emails so each spot is claimed once
5. **Email Sending**: Confirmation email is sent via Resend (if `RESEND_ENABLED=true`), including the token as proof of registration
6. **Status Tracking**: “Email Sent” is tracked per record in Notion
7. **User Feedback**: Toast notifications confirm success or show errors

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Background**: @paper-design/shaders-react
- **Database**: Notion API
- **Email**: Resend
- **UI Components**: Radix UI, Sonner (toasts)

## Development

### Customizing Styles

Modify `app/globals.css` to customize the appearance. The design uses:

- Glassmorphism effects (backdrop-filter, transparency)
- Purple gradient theme
- Dark background with animated shaders

### Customizing Email Template

Edit `emails/index.tsx` to customize the confirmation email sent to new registrations. The template receives `userFirstname` and `token`; the token is shown in the email as the registrant’s proof of registration (e.g. for check-in or claiming a spot).

### API Endpoints

- `POST /api/notion` - Save a registration to Notion
  - Body: `{ name: string, email: string }`
  - Returns: `{ success: boolean, id?: string, error?: string }`

- `POST /api/mail` - Send confirmation email
  - Body: `{ email: string, firstname: string }`
  - Returns: `{ message: string, error?: string }`
  - Automatically checks if email was already sent

## License

MIT

## Acknowledgments

This project uses Notion as a CMS and Resend for email delivery, providing a simple yet powerful spot-registration and application-list solution.
