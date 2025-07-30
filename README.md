# Flow Budget

A personal budget tracking application built with React Native (Expo) and Express.js, using Turborepo for monorepo management.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `app`: a [React Native](https://reactnative.dev/) mobile app built with [Expo](https://expo.dev/) (in development)
- `server`: an [Express.js](https://expressjs.com/) backend API server
- `@flow-budget/database`: PostgreSQL database configuration with Kysely query builder
- `@flow-budget/api-types`: shared TypeScript types between frontend and backend
- `@flow-budget/eslint-config`: `eslint` configurations
- `@flow-budget/typescript-config`: `tsconfig.json`s used throughout the monorepo
- `@flow-budget/ui`: shared React component library

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v24 or higher)
- [pnpm](https://pnpm.io/) package manager
- [Docker](https://www.docker.com/) and Docker Compose (for PostgreSQL)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) for mobile development

### Installation

1. Clone the repository:

```bash
git clone https://github.com/samhmission/flow-budget.git
cd flow-budget
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

4. Start PostgreSQL with Docker:

```bash
docker-compose up -d
```

5. Set up the API URL for the mobile app:

```bash
# In your shell or .env file
export EXPO_PUBLIC_API_URL=http://localhost:3000
```

### Development

To start all development servers:

```bash
pnpm dev
```

This will start:

- **API server** at `http://localhost:3000`
- **Expo development server** for the mobile app

Or start services individually:

```bash
pnpm dev --filter=@flow-budget/server    # Start API server only
pnpm dev --filter=app                     # Start Expo app only
```

### Available Scripts

```bash
pnpm build       # Build all apps and packages
pnpm lint        # Lint all code
pnpm format      # Format code with Prettier
pnpm clean       # Clean all build artifacts and node_modules
pnpm test        # Run tests
```

## Features

- ✅ Create budget items (income/expenses)
- ✅ Categorize transactions
- ✅ Real-time budget tracking
- ✅ PostgreSQL database with migrations
- ✅ Docker-based development environment
- ✅ Cross-platform mobile app (iOS/Android/Web via Expo) (in development)
- 🚧 Category autocomplete (planned)
- 🚧 Budget analytics and reporting (planned)

## Tech Stack

### Frontend (Mobile App)

- React Native with Expo
- TypeScript
- React Query for data fetching
- Expo Router for navigation
- Shared UI components

### Backend (API)

- Express.js
- TypeScript
- PostgreSQL with Kysely query builder
- Docker for containerization

### Development Tools

- Turborepo for monorepo management
- ESLint for code linting
- Prettier for code formatting
- Docker Compose for local development
- pnpm for package management

## Project Structure

```
flow-budget/
├── apps/
│   ├── app/          # React Native mobile app (Expo)
│   ├── server/       # Express.js API server│
├── packages/
│   ├── api-types/    # Shared TypeScript types
│   ├── database/     # PostgreSQL config & Kysely setup
│   ├── eslint-config/
│   ├── typescript-config/
│   └── ui/           # Shared React components
├── docker-compose.yml # PostgreSQL & pgAdmin setup
└── turbo.json        # Turborepo configuration
```

## Database

The project uses PostgreSQL running in Docker. The database configuration supports:

- Development environment on port 5434
- pgAdmin interface for database management
- Automated migrations with Kysely

## Contributing

This is a personal project, but feel free to open issues or submit pull requests if you find bugs or have suggestions!

## License

This project is open source and available under the [MIT License](LICENSE).

---

_Note: This project is in active development and primarily for personal use._
