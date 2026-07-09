# CORE

CORE is a static personal finance dashboard built with HTML, CSS, and JavaScript. It provides a lightweight interface for tracking transactions, viewing reports, and managing categories.

## Features

- Dashboard overview with net balance, total income, total expense, and transaction count
- Transaction list with filtering, sorting, and pagination
- Add new transactions with description, amount, type, category, and date
- Transaction export option on the transactions page
- Category management with color selection and confirmation dialogs
- Reports page with charts showing income vs expense and spending by category
- Mobile-friendly sidebar navigation with a hamburger menu

## Pages

- `index.html` — Dashboard overview and quick transaction controls
- `transactions.html` — Detailed transaction list, search, filters, and export
- `reports.html` — Visual reports and charts for spending trends
- `categories.html` — Category creation and management

## Structure

- `styles/` — CSS layout and page-specific styling
- `scripts/` — JavaScript modules for dashboard, transactions, reports, categories, pagination, and utility functions
- `images/` — Application icons and assets

## Getting Started

1. Clone or download the repository.
2. Open the project folder in your browser or using a local development server.
3. Open `index.html` to start using the app.

> The app is built as a static frontend and does not require a backend or build step.

## Notes

- The app uses third-party icons from Font Awesome and Phosphor Icons.
- Chart rendering on `reports.html` uses Chart.js.
- Export functionality on `transactions.html` uses `jspdf` for PDF export.