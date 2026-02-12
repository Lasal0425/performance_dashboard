# B2B Performance Dashboard - Technical Documentation

This document provides a detailed overview of the B2B Performance Dashboard's architecture, components, and dynamic data handling logic.

---

## 1. Architecture Overview

The application is built on a **Centralized State Pattern**. The `Dashboard.tsx` component serves as the "Orchestrator," managing the lifecycle of the data from fetching to distribution.

### Data Flow:
1.  **Source**: The dashboard retrieves the Google Sheets CSV URL from environment variables (`NEXT_PUBLIC_CSV_URL`) or a fallback default.
2.  **Fetch**: `Dashboard` fetches the raw CSV text using the browser Fetch API.
3.  **Parse**: `PapaParse` converts CSV text into a JSON array of objects with `dynamicTyping` enabled.
4.  **Auto-Detection**: The dashboard analyzes the headers and data types to determine:
    *   `labelColumn`: The first column (Entity/Name).
    *   `numericColumns`: Columns containing numerical metrics.
5.  **Visualization**: Data is distributed to the **Podium**, **Leaderboard**, and **Performance Charts**.

---

## 2. Component Directory

### `Dashboard.tsx`
*   **Role**: Orchestrator and State Provider.
*   **Key Logic**:
    *   Uses `useCallback` and `useEffect` for lifecycle management.
    *   Automates the identification of metrics vs. labels.
    *   Handles synchronized loading and error states.

### `Podium.tsx`
*   **Role**: Visual Highlight of Top Performers.
*   **Logic**: 
    *   Dynamically identifies a "Score Column" (searching for keywords like 'Total' or 'Points').
    *   Sorts data and renders the Top 3 in a stylized Olympic-style podium.
    *   Uses `framer-motion` style animations for entry.

### `DataTable.tsx`
*   **Role**: Interactive Data Explorer.
*   **Features**:
    *   **Search**: Client-side filtering across all columns.
    *   **Sorting**: Multi-column sorting logic with `useMemo` for performance.
    *   **Conditional Styling**: Special formatting for "Rank" columns (1st, 2nd, 3rd place colors).

### `Charts.tsx`
*   **Role**: Visual Performance Analysis.
*   **Features**:
    *   Uses `recharts` for high-performance SVG rendering.
    *   **Dynamic Generation**: Maps through `numericColumns` to create one Bar Chart per metric discovered in the CSV.
    *   **Filtered Views**: Automatically excludes "Rank" or "ID" columns from visual charts to keep them relevant.

### `SummaryCards.tsx`
*   **Role**: High-level KPIs.
*   **Logic**: Iterates through the data to sum up totals for every numeric column found.

---

## 3. The "No-Hardcoding" Logic

One of the project's core strengths is its independence from specific column names.

```typescript
// Example of how the dashboard identifies metrics:
const numericColumns = headers.filter((header, index) => {
    if (index === 0) return false; // First column is assumed to be the label
    return results.data.some((row) => typeof row[header] === 'number');
});
```

Because of this logic, you can swap the current Google Sheet for an entirely different one (e.g., Sales data instead of Competition data), and the dashboard will reconfigure its charts and summary cards automatically.

---

## 4. Customization & Extension

### Adding New Chart Types
To change a Bar Chart to a Line Chart, navigate to `Charts.tsx` and swap the Recharts components (`Bar` -> `Line`).

### Styling
All styling is handled via **Tailwind CSS** with a custom design system defined in `src/app/globals.css`. We use a "Blue-Slate" professional palette.

### Icons
We use `lucide-react` for consistent, lightweight iconography.

---

## 5. Troubleshooting Common Issues

### Module Not Found Errors
If you encounter `Cannot find module './DataTable'`, it is usually due to TypeScript caching.
**Resolution**:
1. Check that the import path in `Dashboard.tsx` matches the filename in `src/components/`.
2. Ensure you are using relative paths (`./`) or the established `@/` alias.
3. Restart the TS Server in your IDE.

---

## 6. Deployment
The app is optimized for **Vercel**. Simply connect the repository, and it will auto-detect the Next.js setup. Ensure `npm run build` passes locally before pushing.
