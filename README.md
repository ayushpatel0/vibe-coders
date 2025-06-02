# Vibezz Coder - Project Documentation

## Overview
Vibezz Coder is a modern web application built with Next.js 15.3.1, featuring a robust tech stack and advanced features for code editing and collaboration.

## Tech Stack

### Core Technologies
- **Framework:** Next.js 15.3.1
- **Language:** TypeScript
- **UI Library:** React 19
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Form Handling:** React Hook Form with Zod validation
- **Database:** Postgres and Supabase
- **Authentication:** JWT (jsonwebtoken)

### Key Dependencies
- **Code Editor:** Monaco Editor (`@monaco-editor/react`)
- **UI Components:** Shadcn UI
- **AI Integration:** Google Gemini (`@google/genai`)
- **File Handling:** React Dropzone
- **Markdown Support:** React Markdown with rehype-highlight and remark-gfm
- **Notifications:** Sonner

## Project Structure
```
src/
├── app/          # Next.js app directory (pages and layouts)
├── components/   # Reusable React components
├── lib/          # Utility libraries and configurations
├── models/       # Database models and schemas
├── store/        # Zustand state management
└── utils/        # Helper functions and utilities
```


## Getting Started

### Prerequisites
- `Node.js` (Latest LTS version recommended)
- `npm`, `yarn`, or `pnpm` package manager

### Installation
Clone the repository and install dependencies:
```
npm install
# or
yarn install
# or
pnpm install
```
The application will be available at http://localhost:3000.

Building for Production
```
npm run build
# or
yarn build
# or
pnpm build
```

Running Production Build
```
npm run start
# or
yarn start
# or
pnpm start
```

## Key Features
### Code Editor Integration
- Monaco Editor integration for advanced code editing
- Syntax highlighting
- Code completion
- Multiple language support

### Authentication & Authorization
- Email verification using Gmail
- JWT-based authentication
- Protected routes via middleware
- User session management

### Database Integration
- PostgreSQL for data persistence
- Supabase for real-time features
- Pg tables for data modeling

### UI/UX Features
- Responsive design with Tailwind CSS
- Dark/Light theme support
- Modern component library with Radix UI
- Toast notifications with Sonner

### AI Integration
- Google Gemini integration for AI-powered features
- Code analysis and suggestions

## Development Guidelines

### Code Style
- ESLint configuration for code quality
- TypeScript for type safety
- Component-based architecture

### State Management
- Zustand for global state management
- React Hook Form for form state
- Local component state, where appropriate

### API Integration
- Axios for HTTP requests
- API route handlers in Next.js
- Proper error handling and loading states

## Deployment
The application can be deployed on Vercel or any other platform that supports Next.js applications.

###  Vercel Deployment
1. Push your code to a Git repository
2. Import the project in Vercel
3. Configure environment variables
4. Deploy

## Environment Variables
Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=
GEMINI_API_KEY=
JWT_SECRET=
SENDER_EMAIL=
SENDER_EMAIL_PASSWORD=
SENDER_NAME=
SUPABASE_DB_PASSWORD=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_KEY=
NEXT_PUBLIC_SUPABASE_BUCKET_ID=
SUPABASE_IMAGE_BASE_URL=
```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support
For support and questions, please open an issue in the repository.
