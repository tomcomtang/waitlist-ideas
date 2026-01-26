# Waitlist Ideas

A modern waitlist landing page built with Next.js 15. Collect user signups, store them in Notion, and send welcome emails automatically.

## Features

- ✅ **Notion Integration**: Automatically save signups to your Notion database
- ✅ **Email Notifications**: Send beautiful welcome emails via Resend
- ✅ **Duplicate Prevention**: Prevents duplicate email registrations
- ✅ **Email Tracking**: Tracks whether welcome emails have been sent
- ✅ **Modern Design**: Glassmorphism effects with animated background
- ✅ **Responsive Layout**: Fully responsive design that works on all devices
- ✅ **Type-Safe**: Built with TypeScript for better developer experience
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
RESEND_API_KEY=your_resend_api_key_here
```

### 3. Set Up Notion Database

1. Create a new database in your Notion workspace
2. Add the following properties:
   - **Name**: Title type
   - **Email**: Email type
   - **Time**: Date type
   - **ID**: Text type
   - **Email Sent**: Checkbox type
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

1. **User Signup**: User enters name and email on the landing page
2. **Validation**: Frontend validates email format and required fields
3. **Notion Storage**: User data is saved to Notion database
4. **Duplicate Check**: System checks if email already exists before saving
5. **Email Sending**: Welcome email is sent via Resend (if configured)
6. **Status Tracking**: Email sent status is tracked in Notion database
7. **User Feedback**: Toast notifications provide real-time feedback

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

Edit `emails/index.tsx` to customize the welcome email sent to new signups.

### API Endpoints

- `POST /api/notion` - Save user signup to Notion
  - Body: `{ name: string, email: string }`
  - Returns: `{ success: boolean, id?: string, error?: string }`

- `POST /api/mail` - Send welcome email
  - Body: `{ email: string, firstname: string }`
  - Returns: `{ message: string, error?: string }`
  - Automatically checks if email was already sent

## License

MIT

## Acknowledgments

This project uses Notion as a CMS and Resend for email delivery, providing a simple yet powerful waitlist solution.
