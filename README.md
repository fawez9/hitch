# Hitch

> **Help Issue-To-Contributions Handoffs (abrv)>> Discovering issues that match your skills**

Hitch is a developer tool that simplifies finding and contributing to GitHub issues. With advanced filtering by labels, programming languages, and keywords, Hitch helps developers quickly identify meaningful contribution opportunities across open-source projects.

[![CI](https://github.com/fawez9/hitch/actions/workflows/ci.yml/badge.svg)](https://github.com/fawez9/hitch/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
🚀 **[Live Demo](https://hitch.vercel.app)** | 📖 **[Documentation](https://github.com/fawez9/hitch/wiki)**

## 🎉 Version 1.0 - Now Live!

This is the **first release** of Hitch! While it's fully functional and ready to use, we're just getting started. Exciting features and improvements are coming soon.

**🔮 Upcoming Features:**

- 🛠 **Track Issues You Care About**
- 🔑 **Authentication** – Sign in with GitHub to personalize your experience
- 💾 **Saved searches** – Bookmark your favorite filters for quick access
- ⭐ **Issue bookmarks** – Keep track of issues you want to contribute to

> Stay tuned! Star ⭐ this repo to get updates on new features.

## ✨ Features

- **Smart Issue Discovery** – Search GitHub issues with real-time filtering
- **Advanced Filtering** – Filter by programming language, labels (bug, enhancement, good first issue), and keywords
- **Optimized Performance** – Client-side filtering for instant results with server-side data fetching
- **Pagination Support** – Handles GitHub API limits gracefully (max 1,000 results)
- **Modern UI/UX** – Responsive design built with Tailwind CSS and smooth animations
- **Robust Error Handling** – Clear feedback for loading states, errors, and edge cases

## 🚀 Quick Start

### Prerequisites

- **Node.js** v20 or higher
- **npm** v10 or higher
- **GitHub Personal Access Token** (optional, for higher API rate limits)

### Installation

```bash
git clone https://github.com/your-username/hitch.git
cd hitch
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
SECRET_TOKEN=your_github_personal_access_token
```

> **Note:** A GitHub token is optional but recommended to increase API rate limits from 60 to 5,000 requests per hour. [Generate a token here](https://github.com/settings/tokens).

### Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build

```bash
npm run build
npm start
```

## 🛠️ Tech Stack

| Category             | Technologies                                    |
| -------------------- | ----------------------------------------------- |
| **Framework**        | Next.js 16 (React 19, App Router)               |
| **Language**         | TypeScript                                      |
| **Styling**          | Tailwind CSS                                    |
| **Icons**            | Lucide React, React Icons                       |
| **State Management** | React Hooks (useState, useEffect, custom hooks) |
| **Testing**          | Vitest, React Testing Library                   |
| **API**              | GitHub REST API v3                              |

## 📂 Project Structure

```
hitch/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/v1/issues/      # API routes
│   │   ├── page.tsx            # Home page
│   │   └── layout.tsx          # Root layout
│   ├── components/             # Reusable UI components
│   │   ├── FilterPanel.tsx
│   │   ├── IssueCard.tsx
│   │   ├── Pagination.tsx
│   │   └── HomePage.tsx
│   ├── hooks/                  # Custom React hooks
│   │   └── useIssueSearch.ts
│   └── lib/                    # Utility functions
├── packages/
│   └── core/                   # Framework-agnostic business logic
│       └── src/
│           └── issues/
│               ├── search.ts
│               ├── mapper.ts
│               ├── queryBuilder.ts
│               └── types.ts
├── tests/                      # Test suites
│   ├── core/                   # Core logic tests
│   ├── components/             # Component tests
│   └── hooks/                  # Hook tests
├── .github/workflows/          # CI/CD configuration
└── public/                     # Static assets
```

## 🧪 Testing

### Run All Tests

```bash
npm run test
```

### Run Specific Test Suites

```bash
npm run test:units-core          # Core business logic
npm run test:units-components    # UI components
npm run test:units-hooks         # Custom hooks
npm run test:integrations        # Integration tests (requires SECRET_TOKEN)
```

### Watch Mode

```bash
npm run test:watch
```

## 📜 Available Scripts

| Command              | Description                  |
| -------------------- | ---------------------------- |
| `npm run dev`        | Start development server     |
| `npm run build`      | Build for production         |
| `npm start`          | Start production server      |
| `npm run lint`       | Run ESLint                   |
| `npm run typecheck`  | Run TypeScript type checking |
| `npm test`           | Run all tests                |
| `npm run test:watch` | Run tests in watch mode      |

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes and commit**
   ```bash
   git commit -m "feat: add your feature description"
   ```
4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request**

### Before Submitting

Ensure your code passes all checks:

```bash
npm run lint          # Check code style
npm run typecheck     # Check TypeScript types
npm test              # Run tests
npm run build         # Verify production build
```

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `test:` Test updates
- `ref:` Code refactoring/typos

## 📝 License

This project is licensed under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [GitHub REST API](https://docs.github.com/en/rest)
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Made with ❤️ for the open-source community**

_Helping developers find their next contribution, one issue at a time._
