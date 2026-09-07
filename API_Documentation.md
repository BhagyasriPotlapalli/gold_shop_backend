# Gold Shop API Documentation

**Base URL:** `http://localhost:5000/api`
**Authentication:** All routes require a Bearer Token in the `Authorization` header.

---

## 1. Profiles API
**Endpoints:** `/vendors`, `/workers`, `/bullions`, `/processors`
*(All profile endpoints share the exact same methods, fields, and behavior. Replace `/vendors` below with the respective entity name.)*

### Methods
| Function Name | Method | Route | Description |
| :--- | :--- | :--- | :--- |
| `createProfile` | **POST** | `/vendors` | Create a new profile. |
| `getAllProfiles` | **GET** | `/vendors` | Get a list of all profiles. |
| `getProfileById` | **GET** | `/vendors/:id` | Get a specific profile by ID. |
| `updateProfile` | **PUT** | `/vendors/:id` | Update an existing profile. |
| `deleteProfile` | **DELETE** | `/vendors/:id` | Delete a profile. |

### Schema Fields (Payload & Response)
| Field | Type | Required? | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | Integer | - | - | Auto-generated Primary Key |
| `name` | String | **Yes** | - | Full name of the entity |
| `phoneNumber` | String | No | null | Contact number |
| `address` | String | No | null | Street address |
| `city` | String | No | null | City |
| `state` | String | No | null | State |
| `country` | String | No | null | Country |
| `profileImage` | String | No | null | URL/path to profile picture |
| `latitude` | Decimal | No | null | Map latitude (e.g., 17.3850) |
| `longitude` | Decimal | No | null | Map longitude (e.g., 78.4867) |
| `cashGiven` | Decimal | No | 0.00 | Cash advance given |
| `cashRemainingBalance`| Decimal | No | 0.00 | Pending cash balance |
| `cashBorrow` | Decimal | No | 0.00 | Cash borrowed |
| `goldGiven` | Decimal | No | 0.000 | Pure gold weight given (grams) |
| `goldRemainingBalance`| Decimal | No | 0.000 | Pending gold balance (grams) |
| `goldBorrow` | Decimal | No | 0.000 | Gold borrowed (grams) |
| `createdAt` | DateTime | - | auto | Record creation time |
| `updatedAt` | DateTime | - | auto | Record last update time |

---

## 2. Orders API
**Endpoints:** `/orders`

### Methods
| Function Name | Method | Route | Description |
| :--- | :--- | :--- | :--- |
| `createOrder` | **POST** | `/orders` | Create a new order. |
| `getAllOrders` | **GET** | `/orders` | Get all orders. |
| `getOrderById` | **GET** | `/orders/:id` | Get a specific order by ID. |
| `updateOrder` | **PUT** | `/orders/:id` | Update an existing order. |
| `deleteOrder` | **DELETE** | `/orders/:id` | Delete an order. |

### Schema Fields (Payload & Response)
*Note: All fields for the Order API are optional (`allowNull: true`). You only need to send the fields relevant to the current state of the order.*

| Category | Field | Type | Description |
| :--- | :--- | :--- | :--- |
| **System** | `id` | Integer | Auto-generated Primary Key |
| **System** | `orderType` | String | Type of order (e.g., "New Order", "Repair") |
| **System** | `itemType` | String | Type of item (e.g., "order", "sale") |
| **Dates** | `startDate` | Date (YYYY-MM-DD) | When the order was placed |
| **Dates** | `estimatedDate` | Date (YYYY-MM-DD) | Expected delivery date to customer |
| **Dates** | `deliveredDate` | Date (YYYY-MM-DD) | Actual delivery date |
| **Item Info** | `ornamentName` | String | Name of the item (e.g., "Gold Necklace") |
| **Item Info** | `referenceImage` | String | URL/path to reference design |
| **Customer Info** | `customerId` | String | Customer ID (e.g., "CUS-001") |
| **Customer Info** | `customerName` | String | Customer Name |
| **Customer Info** | `customerPhone` | String | Customer Phone Number |
| **Customer Info** | `customerAddress`| String | Customer Address |
| **Relationships** | `workerId` | Integer | Foreign Key to Worker profile |
| **Relationships** | `vendorId` | Integer | Foreign Key to Vendor profile |
| **Relationships** | `bullionId` | Integer | Foreign Key to Bullion profile |
| **Old Gold Exchange**| `hasOldGold` | String | "Yes" or "No" |
| **Old Gold Exchange**| `beforeProcessingWeight`| Decimal | Old gold weight before melting (grams) |
| **Old Gold Exchange**| `afterProcessingWeight` | Decimal | Old gold weight after melting (grams) |
| **Gold Math** | `customerGoldWeight` | Decimal | Fine gold equivalent belonging to customer |
| **Gold Math** | `requiredGoldWeight` | Decimal | Total gold required for the ornament |
| **Gold Math** | `goldRate` | Decimal | Rate of gold applied to this order |
| **Stone Details** | `hasStone` | String | "Yes Stone" or "No Stone" |
| **Stone Details** | `stoneType` | String | Type of stone (e.g., "Diamond", "Ruby") |
| **Stone Details** | `stoneWeight` | Decimal | Weight of stones |
| **Stone Details** | `stoneCost` | Decimal | Total cost of stones |
| **Stone Details** | `stoneImage` | String | URL/path to stone image |
| **Final Weight** | `grossWeight` | Decimal | Total weight of item + stones |
| **Final Weight** | `netWeight` | Decimal | Total pure weight of gold only |
| **Customer Billing** | `ornamentAmount` | Decimal | Cost of making the ornament |
| **Customer Billing** | `advanceAmount` | Decimal | Advance paid by customer |
| **Customer Billing** | `discount` | Decimal | Discount given |
| **Customer Billing** | `totalAmount` | Decimal | Final total bill amount |
| **Customer Billing** | `paymentMode` | String | E.g., "Cash", "UPI", "Card" |
| **Worker Processing**| `totalGoldGivenToWorker`| Decimal | 24K gold given to worker (grams) |
| **Worker Processing**| `workerGivenAmount` | Decimal | Cash paid to worker |
| **Worker Processing**| `workerGoldWastage` | Decimal | Wastage allowed/occurred (grams) |
| **Worker Processing**| `workerRemainingBalance`| Decimal | Pending cash to worker |
| **Worker Processing**| `workerRemainingGold` | Decimal | Pending gold return from worker |
| **Bullion Math** | `assignedBullionWeight`| Decimal | Bullion gold assigned to this order |
| **Bullion Math** | `usedBullionGold` | Decimal | Actual bullion gold consumed |
| **Bullion Math** | `purchaseBullionGold` | Decimal | New bullion purchased for this order |
| **Bullion Math** | `bullionGivenAmount` | Decimal | Cash given to bullion dealer |
| **Bullion Math** | `bullionRemainingBalance`| Decimal | Cash pending to bullion dealer |
