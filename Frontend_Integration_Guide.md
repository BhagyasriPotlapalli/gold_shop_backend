# Frontend Integration Guide: Gold Shop API

This guide provides everything a frontend developer (React, Vue, Angular, etc.) needs to integrate with the Gold Shop Backend APIs, complete with `axios` examples, exact JSON payloads, and expected responses.

## 🔑 Authentication
All routes are protected. You must attach the JWT token to the `Authorization` header as a Bearer token in every request.

**Axios Global Setup (Recommended):**
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // or however you store it
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

## 1. Profiles API (Vendors, Workers, Bullions, Processors)
*(Replace `/vendors` with `/workers`, `/bullions`, or `/processors` depending on the screen you are building).*

### Create a Profile (POST)
**Code Example:**
```javascript
const createVendor = async (vendorData) => {
  try {
    const response = await api.post('/vendors', vendorData);
    console.log("Success:", response.data);
  } catch (error) {
    console.error("Error:", error.response.data);
  }
};
```
**Payload to Send (`vendorData`):**
```json
{
  "name": "Ramesh Gold Works",  // REQUIRED
  "phoneNumber": "9876543210",
  "address": "123 Main Bazaar",
  "city": "Hyderabad",
  "state": "Telangana",
  "country": "India",
  "cashGiven": 5000.00,
  "goldGiven": 50.500
}
```
**Response You Get (201 Created):**
```json
{
  "id": 1,
  "name": "Ramesh Gold Works",
  "phoneNumber": "9876543210",
  "address": "123 Main Bazaar",
  "city": "Hyderabad",
  "state": "Telangana",
  "country": "India",
  "profileImage": null,
  "latitude": null,
  "longitude": null,
  "cashGiven": "5000.00",
  "cashRemainingBalance": "0.00",
  "cashBorrow": "0.00",
  "goldGiven": "50.500",
  "goldRemainingBalance": "0.000",
  "goldBorrow": "0.000",
  "updatedAt": "2026-09-07T16:00:00.000Z",
  "createdAt": "2026-09-07T16:00:00.000Z"
}
```

---

## 2. Orders API

This is a massive table, but you **don't** need to send all fields at once. You can create a draft order with just the customer name, and then `PUT` the rest later.

### Create an Order (POST)
**Code Example:**
```javascript
const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
```
**Payload to Send (Send only what you have):**
```json
{
  "customerId": "CUS-001",
  "customerName": "Suresh Kumar",
  "customerPhone": "9123456789",
  "orderType": "New Order",
  "ornamentName": "Gold Necklace",
  "grossWeight": 32.750,
  "totalAmount": 250000.00,
  "paymentMode": "Cash"
}
```

### Update an Order (PUT)
Use this when the worker updates the gold wastage or bullion is assigned.
**Code Example:**
```javascript
const updateOrder = async (orderId, updateData) => {
  try {
    const response = await api.put(`/orders/${orderId}`, updateData);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
```
**Payload to Send (`updateData`):**
```json
{
  "workerId": 1,
  "totalGoldGivenToWorker": 35.000,
  "workerGoldWastage": 1.500,
  "deliveredDate": "2026-09-20"
}
```

---

## 📋 Full Order Dictionary for Frontend Forms
When building your UI forms, map your inputs to these exact JSON keys:

**Customer & Order Info:**
- `customerId` (String)
- `customerName` (String)
- `customerPhone` (String)
- `customerAddress` (String)
- `orderType` (String)
- `itemType` (String)
- `startDate` (YYYY-MM-DD)
- `estimatedDate` (YYYY-MM-DD)
- `deliveredDate` (YYYY-MM-DD)

**Item & Stone Details:**
- `ornamentName` (String)
- `referenceImage` (String URL)
- `hasStone` (String)
- `stoneType` (String)
- `stoneWeight` (Decimal)
- `stoneCost` (Decimal)
- `stoneImage` (String URL)

**Old Gold Exchange:**
- `hasOldGold` (String)
- `beforeProcessingWeight` (Decimal)
- `afterProcessingWeight` (Decimal)

**Gold Math & Final Weights:**
- `customerGoldWeight` (Decimal)
- `requiredGoldWeight` (Decimal)
- `goldRate` (Decimal)
- `grossWeight` (Decimal)
- `netWeight` (Decimal)

**Customer Billing:**
- `ornamentAmount` (Decimal)
- `advanceAmount` (Decimal)
- `discount` (Decimal)
- `totalAmount` (Decimal)
- `paymentMode` (String)

**Worker/Vendor Tracking (Backend Relations):**
- `workerId` (Integer ID)
- `vendorId` (Integer ID)
- `totalGoldGivenToWorker` (Decimal)
- `workerGivenAmount` (Decimal)
- `workerGoldWastage` (Decimal)
- `workerRemainingBalance` (Decimal)
- `workerRemainingGold` (Decimal)

**Bullion Tracking:**
- `bullionId` (Integer ID)
- `assignedBullionWeight` (Decimal)
- `usedBullionGold` (Decimal)
- `purchaseBullionGold` (Decimal)
- `bullionGivenAmount` (Decimal)
- `bullionRemainingBalance` (Decimal)
