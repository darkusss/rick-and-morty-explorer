# Rick & Morty Explorer 🛸

A React single-page application that displays characters from the Rick and Morty universe using the [Rick and Morty API](https://rickandmortyapi.com/).

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-6-purple)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)

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

- **Caching**: localStorage caching to reduce API calls
- **Error Handling**: User-friendly error messages
- **Loading States**: Visual feedback during data fetching
- **Mobile Support**: Fully responsive design

## 🛠 Tech Stack

| Technology     | Purpose        |
| -------------- | -------------- |
| React 19       | UI Framework   |
| TypeScript     | Type Safety    |
| Vite           | Build Tool     |
| React Router 7 | Routing        |
| CSS Modules    | Scoped Styling |

**No external UI component libraries were used** - all components built from scratch.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

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
