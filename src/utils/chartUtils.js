const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * Transform the backend monthly-spending array into Recharts BarChart format.
 * Input:  [{ month: 5, total: 1200 }, ...]
 * Output: [{ month: "May", total: 1200 }, ...]
 */
export const toMonthlyChartData = (data = []) =>
  Array.isArray(data)
    ? data.map((item) => ({
        month: MONTH_LABELS[parseInt(item.month) - 1] || String(item.month),
        total: item.total,
      }))
    : [];

/**
 * Transform the backend category-totals array into Recharts PieChart format.
 * Input:  [{ category: "Food", total: 3400 }, ...]
 * Output: [{ name: "Food", value: 3400 }, ...]
 */
export const toCategoryChartData = (data = []) =>
  Array.isArray(data)
    ? data.map((item) => ({ name: item.category, value: item.total }))
    : [];
