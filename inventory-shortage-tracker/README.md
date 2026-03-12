# 📦 Inventory Shortage Tracker

A **fully browser-based** Inventory Shortage Tracker Web App built with React + Vite + Tailwind CSS. No backend, no Python, no downloads required — upload your Excel/CSV files directly in the browser and get instant reports and charts.

---

## 🚀 Getting Started

```bash
# 1. Navigate into the project folder
cd inventory-shortage-tracker

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open your browser at **http://localhost:5173**

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🖥️ Features

| Tab | Description |
|-----|-------------|
| 📋 **Shortage Tracker** | Upload inventory CSV/Excel → flagged table with Critical/Warning/OK urgency |
| 🚨 **Shortage Alerts** | Alert cards sorted by urgency with days until stockout |
| 🔄 **PO vs GRN Reconciliation** | Match purchase orders vs goods received — flag shortages |
| 📈 **Trend Report** | 6-month multi-line Chart.js charts + risk summary table |
| 🔮 **Shortage Prediction** | 30-day moving average forecast + horizontal bar chart |

All tabs include an **Export to Excel** button to download the results.

---

## 📥 Required File Formats

### Tab 1: Shortage Tracker
**File:** CSV or Excel (`.csv`, `.xlsx`, `.xls`)

| Column | Description |
|--------|-------------|
| `Item Code` | Unique item identifier |
| `Item Name` | Product name |
| `Current Stock` | Current quantity in stock |
| `Reorder Level` | Minimum stock level before reorder |
| `Supplier` | Supplier name |
| `Lead Time` | Lead time in days |

**Sample data:**
```
Item Code,Item Name,Current Stock,Reorder Level,Supplier,Lead Time
ITM001,Bicycle Helmet,15,50,SafeGear Ltd,7
ITM002,Chain Oil,0,30,LubePro Inc,3
ITM003,Bike Pump,80,40,CycleParts Co,5
```

---

### Tab 2: Shortage Alerts
**File:** Excel or CSV with one extra column vs Tab 1

| Column | Description |
|--------|-------------|
| `Item Code` | Unique item identifier |
| `Item Name` | Product name |
| `Current Stock` | Current quantity in stock |
| `Reorder Level` | Minimum stock level |
| `Supplier` | Supplier name |
| `Lead Time` | Lead time in days |
| `Avg Daily Consumption` | Average units consumed per day |

**Sample data:**
```
Item Code,Item Name,Current Stock,Reorder Level,Supplier,Lead Time,Avg Daily Consumption
ITM001,Bicycle Helmet,15,50,SafeGear Ltd,7,5
ITM002,Chain Oil,0,30,LubePro Inc,3,10
ITM003,Bike Pump,80,40,CycleParts Co,5,2
```

---

### Tab 3: PO vs GRN Reconciliation
**File:** Excel (`.xlsx`) with **two sheets** named `PO` and `GRN`

**PO Sheet columns:**
| Column | Description |
|--------|-------------|
| `PO Number` | Purchase order number |
| `Item` | Item name |
| `Ordered Qty` | Quantity ordered |
| `Supplier` | Supplier name |
| `PO Date` | Date of purchase order |

**GRN Sheet columns:**
| Column | Description |
|--------|-------------|
| `GRN Number` | Goods received note number |
| `Item` | Item name (must match PO sheet) |
| `Received Qty` | Quantity received |
| `Date` | Date received |

---

### Tab 4: Trend Report
**File:** Excel or CSV with monthly stock data

| Column | Description |
|--------|-------------|
| `Item Name` | Product name |
| `Month` | Month in `YYYY-MM` format (e.g., `2025-01`) |
| `Stock Level` | Stock level that month |
| `Reorder Level` | Reorder level for that item |

**Sample data:**
```
Item Name,Month,Stock Level,Reorder Level
Bicycle Helmet,2025-01,45,50
Bicycle Helmet,2025-02,30,50
Bicycle Helmet,2025-03,10,50
Chain Oil,2025-01,80,30
Chain Oil,2025-02,25,30
```

---

### Tab 5: Shortage Prediction
**File:** Excel or CSV with daily/periodic stock and consumption data

| Column | Description |
|--------|-------------|
| `Date` | Date of the record |
| `Item Name` | Product name |
| `Stock Level` | Stock level on that date |
| `Consumption` | Units consumed on that date |
| `Reorder Level` | Reorder level for that item |

**Sample data:**
```
Date,Item Name,Stock Level,Consumption,Reorder Level
2025-01-01,Bicycle Helmet,200,8,50
2025-01-02,Bicycle Helmet,192,7,50
2025-01-03,Bicycle Helmet,185,9,50
```

---

## 🧠 Business Logic

### Urgency Levels (Shortage Tracker)
| Level | Condition |
|-------|-----------|
| `CRITICAL` | `Current Stock == 0` |
| `Critical` | `Current Stock < Reorder Level × 0.5` |
| `Warning` | `Current Stock < Reorder Level` |
| `OK` | `Current Stock >= Reorder Level` |

### Alert Levels (Shortage Alerts)
| Level | Days Until Stockout |
|-------|---------------------|
| 🔴 CRITICAL | ≤ 3 days |
| 🟠 High | ≤ 7 days |
| 🟡 Medium | ≤ 14 days |
| 🟢 Low | > 14 days |

### Risk Levels (Trend Report)
| Level | Shortage % |
|-------|-----------|
| High | ≥ 66% of months in shortage |
| Medium | ≥ 33% of months in shortage |
| Low | < 33% of months in shortage |

### Prediction Risk (Shortage Prediction)
| Level | Days to Stockout |
|-------|-----------------|
| 🔴 CRITICAL | ≤ 7 days |
| 🟠 High | ≤ 14 days |
| 🟡 Medium | ≤ 30 days |
| 🟢 Safe | > 30 days |

---

## 🔧 Tech Stack

- **React 18** — UI framework
- **Vite 4** — Build tool & dev server
- **Tailwind CSS 3** — Utility-first styling
- **SheetJS (xlsx)** — Client-side Excel/CSV parsing and export
- **Chart.js 4 + react-chartjs-2** — Interactive charts
- **FileSaver.js** — Client-side file download

---

## 📁 Project Structure

```
inventory-shortage-tracker/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── FileUpload.jsx
│   │   ├── ShortageTracker.jsx
│   │   ├── ShortageAlerts.jsx
│   │   ├── POGRNReconciliation.jsx
│   │   ├── TrendReport.jsx
│   │   ├── ShortagePrediction.jsx
│   │   └── ExportButton.jsx
│   └── utils/
│       ├── parseFile.js
│       ├── shortageLogic.js
│       ├── reconciliationLogic.js
│       ├── trendLogic.js
│       ├── predictionLogic.js
│       └── exportToExcel.js
```
