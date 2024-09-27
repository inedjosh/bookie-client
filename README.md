# Bookie Application Frontend

This project is the frontend for a book application where users can read books, leave comments, become authors, and perform basic CRUD operations as both readers and authors.

## Table of Contents

- [Getting Started](#getting-started)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Directory Structure](#directory-structure)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

To get started with this project, follow the instructions below to set up your local development environment.

## Features

- **Read Books**: Browse and read a wide selection of books.
- **Commenting**: Leave comments on books to share your thoughts and insights.
- **Authoring**: Become an author and manage your own books.
- **CRUD Operations**: Perform basic Create, Read, Update, and Delete operations for books and comments.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **Vite**: A modern frontend build tool that provides a fast development environment.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Redux Toolkit**: A library for managing application state.
- **Axios**: A promise-based HTTP client for making API requests.
- **Formik**: A library for managing forms in React.
- **Yup**: A JavaScript schema builder for value parsing and validation.

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Usage

To start the development server, run:

```bash
npm run dev
```

You can then access the application at `http://localhost:3000`.

To build the project for production, run:

```bash
npm run build
```

To preview the production build, run:

```bash
npm run preview
```

## Scripts

- **dev**: Starts the development server.
- **build**: Builds the application for production.
- **lint**: Runs ESLint to check for code quality issues.
- **preview**: Previews the production build.

## Directory Structure

```plaintext
client/
├── public/                 # Static files
├── src/                    # Source code
│   ├── components/         # Reusable components
│   ├── features/           # Redux slices and features
│   ├── pages/              # Page components
│   ├── App.tsx             # Main application component
│   └── index.tsx           # Entry point of the application
├── package.json            # Project metadata and dependencies
└── vite.config.ts          # Vite configuration
```
