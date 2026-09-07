# Gold Shop Full-Stack Implementation Plan (Real-Time Usage)

This document outlines a production-ready, full-stack architecture (Backend + Frontend) to manage a comprehensive gold shop business. It covers Bullion purchases, Worker job-works, Vendor wholesale purchases, Customer sales (with old gold exchange), Old gold processing, Schemes, Repairs, and Finance.

## Core Business Logic Additions
*   **Dual Ledgers**: Every party (Worker, Bullion, Customer) has both a **Financial Ledger** (Currency: INR/USD) and a **Metal Ledger** (Fine Gold/Silver in grams).
*   **Processor Deductions**: Processors can charge in currency OR deduct a percentage/weight of gold as their fee (melting loss/processing fee).
*   **Vendor Ornaments**: Ornaments are tracked individually (via Tags/SKUs) or in batches, distinguishing between "Our Products" (made by workers) and "Vendor Products" (purchased wholesale).
*   **Additional Services**: Managing customer gold schemes (EMI/Bonus) and repair services (tracking weight before/after heating).

---

## 1. Backend Architecture (Node.js + Express + Sequelize/MySQL)

### 1.1 Database Models (Entities & Fields)

#### `Party` (Ledger Accounts)
*   `id`, `name`, `contactNumber`, `address`, `gstNumber`
*   `type`: Enum ('Customer', 'Bullion', 'Worker', 'Vendor', 'Processor')
*   `financialBalance`: Decimal (Currency owed)
*   `metalBalanceGold`: Decimal (Fine Gold 24K owed)
*   `metalBalanceSilver`: Decimal (Fine Silver owed)

#### `ProductCategory` & `ProductMaster`
*   **Category**: `id`, `name` (Ring, Chain, Bangle, Coin), `material` (Gold, Silver, Gemstone, Platinum)
*   **Product/Tag (Inventory)**: `id` (SKU/Barcode), `categoryId`, `sourceType` (Worker, Vendor), `sourcePartyId`, `purity` (Enum: 999, 916, 750), `grossWeight`, `netWeight`, `stoneWeight`, `stoneValue`, `makingChargeType` (PerGram, Percentage, Fixed), `makingChargeValue`, `status` (InStock, Sold, Melted).

#### `BullionPurchase`
*   `id`, `bullionId`, `date`, `metalType` (Gold/Silver), `purity` (999), `weightReceived`, `ratePerGram`, `totalCost`, `amountPaid`, `balanceAddedToLedger`

#### `VendorPurchase` (Ready-made Ornaments)
*   `id`, `vendorId`, `date`, `totalGrossWeight`, `totalNetWeight`, `totalItems`, `metalAmount` (Fine gold equivalent added to Vendor Metal Ledger), `financialAmount` (Making charges/stones added to Financial Ledger).

#### `JobWork` (Worker/Karigar)
*   `id`, `workerId`, `dateIssued`, `fineGoldIssued` (24K), `expectedPurity` (e.g., 916)
*   `dateReceived`, `ornamentsReceivedWeight`, `scrapReturnedWeight`, `fineGoldConsumed` (Calculated)
*   `makingCharges`, `status` (Issued, Received, Settled)

#### `CustomerSale` (Point of Sale / Invoice)
*   `id`, `customerId`, `date`, `invoiceNumber`
*   **Items Sold**: Array of Products (Gross Wt, Net Wt, Stone Value, Rate, Making Chg, Hallmark Chg).
*   **Old Gold Exchanged**: `oldGoldWeight`, `oldGoldPurity` (KDM/Non-KDM), `estimatedFineGold`, `agreedRate`, `exchangeValue` (Deducted from bill).
*   **Totals**: `grossAmount`, `discount`, `netAmount`, `taxAmount`.
*   **Payments**: `cashAmount`, `upiAmount`, `cardAmount`, `emiAmount`.

#### `OldGoldProcessing` (Melting/Refining)
*   `id`, `processorId`, `dateSent`, `oldGoldSentWeight` (Mixed purity)
*   `dateReceived`, `fineGoldReceivedWeight` (24K)
*   `processingFeeCurrency`: Decimal (Cash paid for processing)
*   `processingLossGold`: Decimal (Gold lost/taken as fee during processing)

#### `Expense`
*   `id`, `date`, `category` (Rent, Electricity, Vendor Expenses, Staff, Tea/Snacks), `amount`, `paymentMethod`, `notes`.

#### `RepairService`
*   `id`, `customerId`, `itemDescription`, `weightBeforeHeating`, `weightAfterHeating`, `repairCharges`, `deliveryDate`, `status` (Pending, InProgress, Ready, Delivered).

#### `GoldScheme` & `SchemeAccount`
*   **Scheme**: `id`, `name`, `durationMonths`, `bonusMonths` (e.g., 11+1).
*   **Account**: `id`, `customerId`, `schemeId`, `startDate`, `accumulatedAmount`, `accumulatedGoldWeight` (if weight-based).

### 1.2 API Modules (Controllers)
*   `Auth & Users`: Role-based access (Admin, Cashier, Manager).
*   `POS Controller`: High-speed API for generating invoices, applying discounts, and handling exchange math.
*   `Ledger Controller`: Fetch metal and financial statements for any party.
*   `Dashboard Controller`: Daily rates, today's sales, cash-in-hand, inventory valuation.

---

## 2. Frontend Architecture (React.js or Vue.js)

The frontend will be an Admin Dashboard / POS system tailored for fast operations.

### 2.1 Core Screens / Modules

#### A. Point of Sale (POS) Billing Screen
*   **Real-time Rate Board**: Input today's 24K and 22K rates at the top.
*   **Cart Section**: Scan barcodes or manually add items (Ring, Chain). Auto-calculates making charges based on weight.
*   **Exchange Section**: Input fields for Old Gold (Weight, Purity %, calculated fine gold, deduction amount).
*   **Payment Splitter**: Easy toggles to split payment across Cash, UPI, and Card.

#### B. Inventory & Tagging (Vendor/Worker Products)
*   **Add New Stock**: Select Source (Vendor A or Worker B). Enter Gross Wt, Stone Wt, Purity.
*   **Barcode Generation**: Generate printable labels with a unique ID for each ornament.
*   **Stock Book**: Live table of all items currently in the shop.

#### C. Party & Ledger Management
*   **View Party**: Screen showing two tabs: **Financial Ledger** (Dr/Cr in Rupees) and **Metal Ledger** (In/Out in Fine Grams).
*   **Settle Account**: Button to pay/receive cash or issue/receive gold to balance the ledgers.

#### D. Job Work & Processing (Operations)
*   **Issue to Worker**: Simple form to deduct 24K gold from shop inventory and add to Worker's Metal Ledger.
*   **Receive from Processor**: Form to log old gold sent, and fine gold received, capturing the processing loss.

#### E. Schemes & Repairs
*   **Scheme Ledger**: Track monthly EMIs paid by customers, trigger alerts for missed payments.
*   **Repair Receipts**: Generate a small receipt for repairs showing "Weight Before Heating" to build customer trust.

#### F. Analytics Dashboard
*   **Today's Summary**: Sales vs Purchases.
*   **Expense Tracker**: Daily expense pie chart.

---

## 3. Verification & Execution Plan

### Execution Phases
1.  **Phase 1: Backend Setup & Core Models**: Initialize Sequelize, create Party, Inventory, and Ledger models.
2.  **Phase 2: Transactions & POS Backend**: Build the complex math for Sales, Job Works, and Old Gold Processing.
3.  **Phase 3: Frontend Scaffolding**: Setup React/Vue, routing, and basic layout.
4.  **Phase 4: POS & Inventory UI**: Build the billing screen and tagging system.
5.  **Phase 5: Ledgers & Reports**: Build the UI for tracking worker/vendor balances and shop expenses.
