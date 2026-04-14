# VendorVerse

A modern, production-ready vendor management platform built with Vite, React, and TypeScript. A complete marketplace solution for discovering and managing local vendors with real-time availability tracking and intelligent detection systems.

## Features

- **Lightning Fast**: Vite for instant hot module replacement and optimized builds
- **Type Safe**: Full TypeScript coverage across frontend and backend
- **Beautiful UI**: shadcn/ui components with Tailwind CSS for responsive design
- **Vendor Discovery**: Browse and search local vendors with real-time availability
- **Smart Detection**: Anti-fake detection and business hour tracking
- **Accessibility**: Comprehensive component library with Radix UI primitives
- **Developer Experience**: Hot reload, linting, formatting, and testing setup
- **Production Ready**: Optimized builds and deployment-ready architecture

## Architecture Overview

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         VendorVerse Platform                        │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                          Client Layer (React)                        │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Browser: React 18+ with TypeScript                                  │
│  Routing: React Router with 9 page components                        │
│  UI Components: 40+ shadcn/ui components + 8 custom components       │
│  State: Context API (LanguageContext, VendorContext)                 │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
                              ↓ API Calls
                    (fetch via api-client.ts)
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│                         Backend API Layer                            │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Node.js / TypeScript Runtime                                        │
│                                                                      │
│  Endpoints:                                                          │
│  • GET  /api/health                - Health check                    │
│  • GET  /api/vendors               - List all vendors                │
│  • POST /api/vendors               - Create vendor                   │
│  • POST /api/vendors/view          - Get vendor details              │
│  • POST /api/vendor-view           - Track vendor view               │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
                    (Business Logic)
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│                        Vendor Processing                             │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  • isOpenNow.ts      - Check business hours & availability           │
│  • antiFakeDetection.ts - Detect fraudulent vendors                  │
│  • vendorStore.ts    - Vendor data management                        │
│  • utils.ts          - Common utilities                              │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### How Vendor Registration/Discovery Starts

```
User Interaction Flow:
┌────────────────────┐
│  User Visits Site  │
└────────┬───────────┘
         │
         ↓
┌────────────────────┐
│  Homepage (index)  │
└────────┬───────────┘
         │
         ├─→ Browse Vendors (browse.tsx)
         │   └─→ All Vendors (all-vendors.tsx)
         │       └─→ API: GET /api/vendors
         │           ├─→ Check isOpenNow()
         │           └─→ Check antiFakeDetection()
         │
         ├─→ Register Vendor (register.tsx)
         │   └─→ API: POST /api/vendors
         │       └─→ vendorStore.ts processes data
         │
         └─→ Vendor Profile (vendor-profile.tsx)
             └─→ API: POST /api/vendors/view
                 └─→ Track vendor view analytics
                 └─→ Display vendor details & hours

Vendor Data Flow:
┌──────────────────────────────────────┐
│  Vendor Information                  │
└──────┬───────────────────────────────┘
       │ Submitted via form
       ↓
┌──────────────────────────────────────┐
│  POST /api/vendors                   │
└──────┬───────────────────────────────┘
       │ Processing in backend
       ├─→ antiFakeDetection checks
       ├─→ Business hours validation
       └─→ Store in vendorStore
            │
            ↓
       ┌────────────────────┐
       │ Vendor Created     │
       │ Ready for Browse   │
       └────────────────────┘
```

## Tech Stack

### Frontend

- **React 18+** - Modern React with hooks and concurrent features
- **TypeScript 5** - Full type safety across the application
- **Vite 5** - Fast build tool and dev server with HMR
- **Tailwind CSS 3** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library (40+ components)
- **React Router DOM** - Client-side routing with 9 page routes
- **Framer Motion** - Smooth animations and transitions

### Backend

- **Node.js API** - REST API endpoints with TypeScript
- **TypeScript** - Type-safe backend development
- **Express-like routing** - RESTful endpoint structure

### Development Tools

- **ESLint 9** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Fast unit testing
- **TypeScript ESLint** - TypeScript-specific linting

## Project Structure

```
VendorVerse/
├── src/
│   ├── components/               # React components
│   │   ├── ErrorBoundary.tsx
│   │   ├── CookieBanner.tsx
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Spinner.tsx
│   │   ├── SmartImage.tsx
│   │   └── ui/                   # shadcn/ui base components (40+ pre-configured)
│   ├── context/                  # React Context providers
│   │   ├── LanguageContext.tsx   # Multi-language support
│   │   └── VendorContext.tsx     # Vendor state management
│   ├── layouts/                  # Layout systems
│   │   ├── RootLayout.tsx        # Centralized header/footer wrapper
│   │   ├── Website.tsx           # Structural container
│   │   ├── Dashboard.tsx         # Admin/Dashboard layout
│   │   └── parts/
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── pages/                    # Page components (9 pages)
│   │   ├── index.tsx             # Homepage
│   │   ├── browse.tsx            # Vendor browsing
│   │   ├── all-vendors.tsx       # Complete vendor list
│   │   ├── vendor-profile.tsx    # Individual vendor details
│   │   ├── register.tsx          # Vendor registration
│   │   ├── guide.tsx             # User guide
│   │   ├── priya-sabziwali.tsx   # Vendor example
│   │   ├── raju-chai-stall.tsx   # Vendor example
│   │   └── _404.tsx              # 404 page
│   ├── lib/                      # Utilities and business logic
│   │   ├── api-client.ts         # API client setup
│   │   ├── vendorStore.ts        # Vendor data management
│   │   ├── isOpenNow.ts          # Business hours checker
│   │   ├── antiFakeDetection.ts  # Fraud detection system
│   │   └── utils.ts              # Common utilities
│   ├── server/                   # Backend API
│   │   ├── configure.js
│   │   └── api/
│   │       ├── health/
│   │       │   └── GET.ts        # Health check endpoint
│   │       ├── vendors/
│   │       │   ├── GET.ts        # List vendors
│   │       │   ├── POST.ts       # Create vendor
│   │       │   └── view/
│   │       │       └── POST.ts   # Vendor details
│   │       └── vendor-view/
│   │           └── POST.ts       # View tracking
│   ├── styles/                   # Global styles
│   │   └── globals.css
│   ├── test/                     # Test setup
│   │   └── setup.ts
│   ├── App.tsx                   # Root application component
│   ├── main.tsx                  # Application entry point
│   ├── router.ts                 # Route definitions
│   └── routes.tsx                # Route components
├── dev-tools/                    # Development utilities
│   └── src/
│       └── error-client.ts
├── public/                       # Static assets
│   ├── assets/
│   ├── analytics.js
│   ├── robots.txt
│   └── favicon.ico
├── Configuration files
│   ├── vite.config.ts
│   ├── vitest.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── eslint.config.js
│   ├── postcss.config.js
│   ├── components.json
│   └── package.json
└── dotenv files
    ├── .env.example
    ├── .gitignore
    └── README.md
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run test` - Run Vitest unit tests
- `npm run lint` - Run ESLint code linting
- `npm run type-check` - Run TypeScript type checking
- `npm run setup` - Initialize project with dependencies

## UI Components

This application includes shadcn/ui components that are:

- **Accessible** - Built with Radix UI primitives
- **Customizable** - Easy to modify and extend
- **Consistent** - Design system with CSS variables
- **Production Ready** - Pre-configured and tested

40+ pre-configured shadcn/ui components:

- **Layout**: Card, Separator, Tabs, Sheet, Dialog
- **Forms**: Button, Input, Textarea, Select, Checkbox, Switch
- **Navigation**: Navigation Menu, Breadcrumb, Pagination
- **Feedback**: Alert, Badge, Progress, Skeleton, Sonner
- **Data Display**: Table, Avatar, Calendar, Hover Card
- **Overlays**: Popover, Tooltip, Alert Dialog, Drawer
- **Interactive**: Accordion, Collapsible, Command, Context Menu

## API Endpoints Reference

### Health Check

- `GET /api/health` - Check API availability

### Vendor Management

- `GET /api/vendors` - List all active vendors
- `POST /api/vendors` - Register a new vendor
- `POST /api/vendors/view` - Get vendor details by ID

### Analytics

- `POST /api/vendor-view` - Track vendor profile views



## Getting Started

### Prerequisites

- Node.js 16+ (LTS recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Ayush-Sharma12/Vendor-Verse.git
cd VendorVerse
```

2. Install dependencies:

```bash
npm install
```

3. Setup environment:

```bash
cp env.example .env
```

4. Start development server:

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

## Building for Production

Build the optimized production bundle:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Environment Configuration

Edit `.env` file with your settings:

```env
VITE_APP_NAME=VendorVerse
VITE_API_URL=http://localhost:5173/api
NODE_ENV=development
PORT=5173
```

## Development Best Practices

- Keep components small and focused with single responsibility
- Use TypeScript for type safety across the application
- Leverage Context API for state management
- Use async/await for API calls with proper error handling
- Run `npm run lint` and `npm run type-check` before committing

## Quick Deploy

Deploy this project with one click to your preferred platform:

- **Vercel** (Recommended): [Deploy to Vercel](https://vercel.com/new/clone?repository-url=https://github.com/Ayush-Sharma12/Vendor-Verse)
- **Netlify**: [Deploy to Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/Ayush-Sharma12/Vendor-Verse)
- **Railway**: [Deploy to Railway](https://railway.app/new?repo=https://github.com/Ayush-Sharma12/Vendor-Verse)

### Manual Build & Deploy

```bash
npm run build
# Deploy the 'dist' folder to any static hosting service
```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes and commit
4. Push to your fork and open a Pull Request

## License

MIT License - See LICENSE file for details

## Acknowledgments

Built with amazing open-source libraries:

- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [React](https://react.dev/) - JavaScript library for building UIs
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Superset of JavaScript
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Vitest](https://vitest.dev/) - Fast unit testing framework


