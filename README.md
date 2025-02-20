# Resume Builder

A modern, feature-rich resume builder application built with Next.js that helps users create professional resumes with AI-powered optimization.

## Features

- **Interactive Resume Editor**: Step-by-step interface for creating and editing resumes
- **Real-time Preview**: Live preview of resume changes
- **AI-powered Optimization**: Intelligent suggestions for resume improvement
- **ATS-friendly**: Ensures resumes are optimized for Applicant Tracking Systems
- **Auto-save**: Automatically saves progress as you work
- **Multiple Sections**: Support for work experience, education, projects, skills, certifications, and references
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **AI Integration**: Google's Gemini AI
- **State Management**: Custom hooks and stores

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Clerk account for authentication
- Google AI API key for Gemini integration

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd resume-builder
```

1. Install dependencies:

```bash
npm install
```

1. Set up environment variables:
Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="your-postgresql-connection-string"
CLERK_SECRET_KEY="your-clerk-secret-key"
CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
GOOGLE_AI_API_KEY="your-google-ai-api-key"
```

1. Run database migrations:

```bash
npx prisma migrate dev
```

1. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

- `/app` - Next.js app router pages and layouts
- `/components` - Reusable React components
- `/actions` - Server actions for data operations
- `/hooks` - Custom React hooks
- `/lib` - Utility functions and configurations
- `/prisma` - Database schema and migrations

## Deployment

This application can be easily deployed on Vercel:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Configure environment variables
4. Deploy

For other platforms, ensure you have:

- Node.js runtime environment
- PostgreSQL database connection
- Environment variables properly configured

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
