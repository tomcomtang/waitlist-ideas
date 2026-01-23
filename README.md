# Waitlist Ideas - Next.js 15 Waitlist Template

A modern, beautiful waitlist template built with Next.js 15, featuring Notion CMS integration, Resend email service, and Upstash Redis rate limiting.

## Features

- **Next.js 15**: Built with the latest Next.js framework
- **Notion as CMS**: Manage your waitlist users directly in Notion
- **Resend Email**: Send beautiful welcome emails to new signups
- **Upstash Redis**: Rate limiting to prevent abuse
- **Modern UI**: Beautiful, responsive design with smooth animations
- **TypeScript**: Fully typed for better developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Notion account and workspace
- A Resend account
- An Upstash Redis database

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd waitlist-ideas
```

2. Install dependencies:

```bash
npm install
# or
bun install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
NOTION_SECRET=your_notion_secret
NOTION_DB=your_notion_database_id
RESEND_API_KEY=your_resend_api_key
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

### Setting Up Notion

1. Create a new database in your Notion workspace
2. Add the following columns:
   - **Name**: Title type
   - **Email**: Email type
3. Create an internal integration at [Notion Integrations](https://www.notion.so/my-integrations)
4. Copy the integration secret (this is your `NOTION_SECRET`)
5. Share your database with the integration
6. Get your database ID from the URL: `https://www.notion.so/{DATABASE_ID}?v=...`

### Setting Up Resend

1. Sign up at [Resend](https://resend.com)
2. Add and verify your domain
3. Generate an API key from the dashboard
4. Update the email sender in `app/api/mail/route.ts` with your verified domain

### Setting Up Upstash Redis

1. Sign up at [Upstash](https://upstash.com)
2. Create a new Redis database
3. Copy the REST URL and REST Token

### Running the Development Server

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
# or
bun build
bun start
```

## Project Structure

```
waitlist-ideas/
├── app/
│   ├── api/
│   │   ├── mail/
│   │   │   └── route.ts      # Email sending API
│   │   └── notion/
│   │       └── route.ts      # Notion integration API
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/
│   ├── ui/                   # Reusable UI components
│   ├── footer.tsx            # Footer component
│   ├── hero-section.tsx      # Hero section
│   ├── waitlist-form.tsx     # Waitlist form
│   └── feature-cards.tsx     # Feature cards
├── emails/
│   └── index.tsx             # Email template
├── lib/
│   └── utils.ts              # Utility functions
└── public/                   # Static assets
```

## Customization

### Styling

The project uses Tailwind CSS. You can customize colors and styles in:
- `app/globals.css` - CSS variables for theming
- `tailwind.config.ts` - Tailwind configuration

### Email Template

Edit `emails/index.tsx` to customize the welcome email sent to new signups.

### UI Components

All UI components are in the `components/` directory. You can modify them to match your brand.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your environment variables
4. Deploy!

The project is optimized for Vercel deployment.

## License

MIT License - feel free to use this template for personal or commercial projects.

## Support

If you have any questions or need help, please open an issue on GitHub.
