# Complete Frontend API Documentation (With Exact Payloads)

**Base URL:** `http://localhost:5000/api`  
**Authentication:** All routes require the JWT token in the `Authorization` header as `Bearer <your_token>`.

---

## 1. Profiles API (`/profiles`)
**Description:** A single API to manage Vendors, Workers, Bullions, and Processors.

### Endpoints
- **GET** `/profiles?type=Worker` (Returns wrapped JSON: `{ success: true, message: "Workers fetched successfully", data: [...] }`)
- **GET** `/profiles/:id`
- **POST** `/profiles`
- **PUT** `/profiles/:id`
- **DELETE** `/profiles/:id`

### EXACT POST/PUT JSON Payload Example
```json
{
  "type": "Worker",
  "name": "Ramesh Gold Works",
  "phoneNumber": "9876543210",
  "address": "123 Main Bazaar",
  "city": "Hyderabad",
  "state": "Telangana",
  "country": "India",
  "profileImage": "https://example.com/image.jpg",
  "latitude": 17.385044,
  "longitude": 78.486671,
  "cashGiven": 5000.00,
  "cashRemainingBalance": 1000.00,
  "cashBorrow": 0.00,
  "goldGiven": 50.500,
  "goldRemainingBalance": 10.000,
  "goldBorrow": 0.000
}
```

---

## 2. Gold Orders API (`/gold-orders`)
**Description:** Manages gold orders, assignments, and images.

### Endpoints
- **GET** `/gold-orders`
- **GET** `/gold-orders?for=processing` (Orders WITH old gold, UNASSIGNED to a processor)
- **GET** `/gold-orders?records=assigned` (Orders assigned to a worker OR vendor)
- **GET** `/gold-orders?records=unassigned` (Orders NOT assigned to a worker or vendor)
- **GET** `/gold-orders/:id`
- **POST** `/gold-orders` (Send Raw JSON)
- **PUT** `/gold-orders/:id` (Send Raw JSON for data updates, OR `multipart/form-data` for image uploads)
- **DELETE** `/gold-orders/:id`

### EXACT POST Payload Example (Raw JSON)
*Use standard `application/json` for creating the order. All fields below are optional, so you can send a partial draft. You will upload images later via a PUT request.*

```json
{
  "customerId": "CUS-001",
  "customerName": "Suresh Kumar",
  "customerPhone": "9123456789",
  "customerAddress": "Secunderabad, Telangana",
  
  "orderType": "New Order",
  "itemType": "order",
  "startDate": "2026-09-08",
  "estimatedDate": "2026-09-20",
  "deliveredDate": null,

  "ornamentName": "Gold Necklace",
  "hasStone": "Yes Stone",
  "stoneType": "Diamond",
  "stoneWeight": 1.250,
  "stoneCost": 15000.00,

  "hasOldGold": "Yes",
  "beforeProcessingWeight": 25.500,
  "afterProcessingWeight": 24.850,

  "customerGoldWeight": 20.000,
  "requiredGoldWeight": 30.000,
  "goldRate": 6900.00,
  "grossWeight": 32.750,
  "netWeight": 31.500,

  "ornamentAmount": 5000.00,
  "advanceAmount": 30000.00,
  "discount": 1000.00,
  "totalAmount": 250000.00,
  "paymentMode": "Cash",

  "workerId": 1,
  "vendorId": null,
  "bullionId": 3,
  "processorId": null,

  "totalGoldGivenToWorker": 35.000,
  "workerGivenAmount": 2000.00,
  "workerGoldWastage": 1.500,
  "workerRemainingBalance": 500.00,
  "workerRemainingGold": 2.000,

  "assignedBullionWeight": 10.000,
  "usedBullionGold": 9.500,
  "purchaseBullionGold": 0.000,
  "bullionGivenAmount": 0.00,
  "bullionRemainingBalance": 0.00
}
```

### EXACT PUT Payload Example for Uploading Images (`multipart/form-data`)
*When the user is ready to upload images for an existing order, send a `PUT` request as `multipart/form-data`.*

```javascript
const formData = new FormData();
// Only append the files you want to upload/update
formData.append('referenceImage', fileInput1.files[0]);
formData.append('stoneImage', fileInput2.files[0]);

await axios.put('http://localhost:5000/api/gold-orders/15', formData, {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'multipart/form-data'
  }
});
```

---

## 3. Metal Rates API (`/metal-rates`)

### Endpoints
- **GET** `/metal-rates/latest` (Instantly returns cached rates)
- **POST** `/metal-rates/sync` (Fetches new rates if not done today)

### EXACT JSON Response Example (For both GET and POST)
```json
{
  "status": "success",
  "rateDate": "2026-09-08",
  "count": 4,
  "data": [
    {
      "id": 1,
      "metalCode": "XAU",
      "metalName": "Gold",
      "ratePerOunceINR": "215000.00",
      "ratePerGramINR": "6912.40",
      "rate24K": "6912.40",
      "rate22K": "6331.76",
      "rate18K": "5184.30",
      "rateDate": "2026-09-08"
    },
    {
      "id": 2,
      "metalCode": "XAG",
      "metalName": "Silver",
      "ratePerOunceINR": "2500.00",
      "ratePerGramINR": "80.37",
      "rateDate": "2026-09-08"
    }
  ]
}
```

---

## 4. Universal Audit Logs API (`/audit-logs`)

### Endpoints
- **GET** `/audit-logs?page=1&limit=20`

**Filters you can append to the URL:**
`?search=manikanta` | `?userId=4` | `?action=CREATE` | `?module=ORDERS` | `?fromDate=2026-09-01&toDate=2026-09-08`

### EXACT JSON Response Example
```json
{
  "success": true,
  "message": "Audit logs fetched successfully",
  "data": {
    "logs": [
      {
        "id": 101,
        "action": "CREATE",
        "module": "ORDERS",
        "description": "Created new gold order ORD-1025",
        "actor": {
          "id": 4,
          "name": "Manikanta",
          "role": "Super Admin"
        },
        "target": null,
        "entity": {
          "id": 15,
          "type": "GOLD_ORDER",
          "name": "ORD-1025"
        },
        "metadata": {
          "ipAddress": "192.168.1.24",
          "device": "Mozilla/5.0...",
          "os": "Unknown"
        },
        "changes": null,
        "createdAt": "2026-09-08T10:35:00.000Z"
      }
    ],
    "summary": {
      "totalEvents": 145,
      "staffActions": 42,
      "billingActivity": 89,
      "inventoryActions": 0,
      "securityEvents": 14
    },
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 145,
      "totalPages": 8
    }
  }
}
```
