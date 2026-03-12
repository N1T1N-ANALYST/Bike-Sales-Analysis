# 📦 Inventory Shortage Tracker

A **fully self-contained, browser-based** Inventory Shortage Tracker web application built with React + Vite + Tailwind CSS. No backend, no downloads, no Python required — everything runs 100% in the browser.

---

## 🚀 How to Run

```bash
cd inventory-shortage-tracker
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

To create a production build:

```bash
npm run build
```

---

## 🖥️ Features

| Tab | Description |
|-----|-------------|
| 📋 **Shortage Tracker** | Upload CSV/Excel, flag items below reorder level with urgency (CRITICAL/Warning/OK) |
| 🚨 **Shortage Alerts** | Alert cards with days until stockout per item |
| 🔄 **PO vs GRN Reconciliation** | Match Purchase Orders vs Goods Received, flag shortages |
| 📈 **Trend Report** | 6-month stock trends with Chart.js line chart |
| 🔮 **Shortage Prediction** | 30-day prediction using Simple Moving Average with bar chart |

---

## 📋 Required Column Formats

### 📋 Shortage Tracker & 🚨 Shortage Alerts
Upload: `inventory.csv` or `inventory.xlsx`

| Column | Description | Example |
|--------|-------------|---------|
| Item Code | Unique item identifier | ITEM-001 |
| Item Name | Name of the item | Bicycle Frame |
| Current Stock | Current stock quantity | 50 |
| Reorder Level | Reorder trigger level | 100 |
| Supplier | Supplier name | ABC Suppliers |
| Lead Time | Lead time in days | 7 |
| Avg Daily Consumption | Avg units consumed per day *(Alerts tab only)* | 5 |

### 🔄 PO vs GRN Reconciliation
Upload: `po_grn.xlsx` (Excel with **two sheets: PO and GRN**)

**Sheet "PO":**

| Column | Example |
|--------|---------|
| PO Number | PO-001 |
| Item | Bicycle Frame |
| Ordered Qty | 200 |
| Supplier | ABC Suppliers |
| PO Date | 2025-01-01 |

**Sheet "GRN":**

| Column | Example |
|--------|---------|
| GRN Number | GRN-001 |
| Item | Bicycle Frame |
| Received Qty | 150 |
| Date | 2025-01-10 |

### 📈 Trend Report
Upload: `stock_history.xlsx`

| Column | Example |
|--------|---------|
| Item Name | Bicycle Frame |
| Month | 2025-01 |
| Stock Level | 80 |
| Reorder Level | 100 |

### 🔮 Shortage Prediction
Upload: `stock_history.xlsx`

| Column | Example |
|--------|---------|
| Date | 2025-01-01 |
| Item Name | Bicycle Frame |
| Stock Level | 80 |
| Consumption | 5 |
| Reorder Level | 100 |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [React 18](https://react.dev/) | UI framework |
| [Vite](https://vitejs.dev/) | Build tool and dev server |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [SheetJS (xlsx)](https://sheetjs.com/) | Excel/CSV parsing in the browser |
| [Chart.js](https://www.chartjs.org/) + [react-chartjs-2](https://react-chartjs-2.js.org/) | Charts |
| [FileSaver.js](https://github.com/eligrey/FileSaver.js/) | Excel export and download |

---

## 📥 How to Export Reports

Every tab has an **"Export to Excel"** button. After uploading your data file and processing it, click the button to download an `.xlsx` report directly in your browser — no server required.

---

## 📸 Screenshot

> *(Replace with an actual screenshot after running the app)*

---

## 🗂️ Project Structure

```
inventory-shortage-tracker/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── components/
    │   ├── Navbar.jsx
    │   ├── FileUpload.jsx
    │   ├── ExportButton.jsx
    │   ├── ShortageTracker.jsx
    │   ├── ShortageAlerts.jsx
    │   ├── POGRNReconciliation.jsx
    │   ├── TrendReport.jsx
    │   └── ShortagePrediction.jsx
    └── utils/
        ├── parseFile.js
        ├── shortageLogic.js
        ├── reconciliationLogic.js
        ├── trendLogic.js
        ├── predictionLogic.js
        └── exportToExcel.js
```
