# Performance Dashboard

A dynamic, real-time dashboard built with Next.js 15, React, and Recharts that fetches data directly from Google Sheets CSV.

[Detailed Technical Documentation →](./DOCUMENTATION.md)

## Features

- **Dynamic Data Parsing**: Automatically detects numeric columns and label columns.
- **Auto-Generating Metrics**: Creates summary cards for all numeric data (totals).
- **Responsive Charts**: Generates bar charts for each numeric metric.
- **Smart Leaderboard**: Sortable data table with special styling for "Rank" columns.
- **Dynamic Configuration**: Paste any published Google Sheet CSV URL to update the entire dashboard instantly.
- **Premium UI**: Modern dark-themed interface with glassmorphism, animations, and responsive design.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Visualization**: Recharts
- **Icons**: Lucide React
- **CSV Parsing**: PapaParse

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Published Google Sheet URL
To use your own data, go to Google Sheets:
1. `File` > `Share` > `Publish to web`.
2. Select the sheet and set format to `CSV`.
3. Copy the URL and paste it into the dashboard input.
