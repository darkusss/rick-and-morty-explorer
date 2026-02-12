# Rick & Morty Explorer 🛸

A React single-page application that displays characters from the Rick and Morty universe using the [Rick and Morty API](https://rickandmortyapi.com/).

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-7-purple)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-5-red)
![Vitest](https://img.shields.io/badge/Vitest-3-green)

## 🌐 Live Demo

**[View Live Application](https://lustrous-horse-9c05c4.netlify.app/)**

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [Project Structure](#-project-structure)
- [Testing](#-testing)
- [Future Improvements](#-future-improvements)

## ✨ Features

### Listing Page

- **Character Grid**: Responsive grid displaying character cards
- **Search**: Search characters by name (debounced input)
- **Filters**: Filter by status, species, and gender
- **Sorting**: Sort alphabetically (A-Z / Z-A)
- **Load More**: Pagination with "Load More" button

### Detail Page

- **Character Information**: Name, status, species, gender, origin, location
- **Episode List**: All episodes the character appears in
- **Responsive Layout**: Adapts to all screen sizes

### General

- **Smart Caching**: TanStack Query with localStorage persistence
- **Error Handling**: User-friendly error messages
- **Loading States**: Visual feedback during data fetching
- **Mobile First**: Fully responsive design
- **Type Safety**: Full TypeScript coverage
- **Code Quality**: ESLint + Prettier configuration

## 🛠 Tech Stack

| Technology       | Purpose                  |
| ---------------- | ------------------------ |
| React 19         | UI Framework             |
| TypeScript 5     | Type Safety              |
| Vite 7           | Build Tool & Dev Server  |
| React Router 7   | Client-side Routing      |
| TanStack Query 5 | Data Fetching & Caching  |
| Vitest 3         | Unit Testing             |
| Testing Library  | Component Testing        |
| CSS Modules      | Scoped Component Styling |
| ESLint           | Code Linting             |
| Prettier         | Code Formatting          |

**No external UI component libraries were used** - all components built from scratch.

## 🚀 Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/darkusss/rick-and-morty-explorer.git

# Navigate to project directory
cd rick-and-morty-explorer

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 📜 Available Scripts

| Script                 | Description                              |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Start development server with hot reload |
| `npm run build`        | Build for production (TypeScript + Vite) |
| `npm run preview`      | Preview production build locally         |
| `npm run lint`         | Run ESLint to check code quality         |
| `npm run test`         | Run unit tests with Vitest               |
| `npm run format`       | Format code with Prettier                |
| `npm run format:check` | Check if code is properly formatted      |

## 📁 Project Structure

```
rick-and-morty-explorer/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Reusable components
│   │   ├── character/   # Character-specific components
│   │   ├── common/      # Generic UI components
│   │   └── layout/      # Layout components
│   ├── context/         # React Context providers
│   ├── hooks/           # Custom React hooks
│   │   └── __tests__/   # Hook unit tests
│   ├── pages/           # Page components
│   │   ├── Home/
│   │   ├── CharacterDetail/
│   │   └── NotFound/
│   ├── services/        # API service layer
│   ├── styles/          # Global styles
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Root component
│   └── main.tsx         # Application entry point
├── .prettierrc          # Prettier configuration
├── .prettierignore      # Prettier ignore patterns
├── eslint.config.js     # ESLint configuration
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── vitest.config.ts     # Vitest configuration
```

## 🧪 Testing

The project uses **Vitest** with **Testing Library** for unit and component testing.

### Running Tests

```bash
# Run all tests
npm run test
```

### Test Structure

- Hook tests: `src/hooks/__tests__/`
- Component tests: `src/components/*/__tests__/`

## 🎨 Code Style

- **Formatting**: Prettier (runs on save if configured in VS Code)
- **Linting**: ESLint with TypeScript rules
- **Naming**: camelCase for variables/functions, PascalCase for components/types
- **Imports**: Organized with React imports first, then third-party, then local

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📝 API Reference

This project uses the [Rick and Morty API](https://rickandmortyapi.com/documentation):

- **Characters Endpoint**: `https://rickandmortyapi.com/api/character`
- **Filter Parameters**: name, status, species, gender
- **Pagination**: Automatic via `next` field
- **Rate Limiting**: None (public API)

## � Future Improvements

### API & Data Validation

- **Zod Integration**: Add runtime validation for API responses to ensure type safety at runtime and catch API contract changes early

### Performance

- **Virtual Scrolling**: Implement virtualization for large character lists

### Features

- **Advanced Filters**: Add filters for episodes, origin, and location
- **Favorites**: Allow users to save favorite characters (localStorage)

### Developer Experience

- **Storybook**: Add component documentation and demos
- **Commit Hooks**: Add Husky for pre-commit linting and testing
- **CI/CD**: Set up GitHub Actions for automated testing and deployment

## �📄 License

This project is open source and available for educational purposes.

## 👤 Author

**Vlad**

- GitHub: [@darkusss](https://github.com/darkusss)

---
