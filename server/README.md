# Contact Us API Backend (Node.js + Express + MongoDB)

This backend handles Contact Us submissions from the Expo / React Native mobile app and persists them into a MongoDB database using Mongoose.

## Tech Stack
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Utilities**: CORS, Dotenv

## Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` or edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/contact_us_db
```
*(If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string)*

### 3. Start the Server
```bash
# Production mode
npm start

# Development mode with auto-reload
npm run dev
```

## API Endpoints

### 1. Health Check
* `GET /health`
* Returns status of server.

### 2. Submit Contact Us Form
* `POST /api/contact`
* **Request Body** (JSON):
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1 555-0199",
  "address": "123 Market St, Suite 400, San Francisco, CA",
  "subject": "Inquiry regarding Enterprise Services",
  "message": "Hello, I would like more information on your enterprise staff management solutions."
}
```
* **Success Response (201 Created)**:
```json
{
  "status": "success",
  "message": "Thank you! Your contact message has been saved successfully.",
  "data": {
    "_id": "65e...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1 555-0199",
    "address": "123 Market St, Suite 400, San Francisco, CA",
    "subject": "Inquiry regarding Enterprise Services",
    "message": "Hello, I would like more information on your enterprise staff management solutions.",
    "createdAt": "2026-09-30T05:30:00.000Z",
    "updatedAt": "2026-09-30T05:30:00.000Z"
  }
}
```

### 3. Get All Submissions
* `GET /api/contact`
* Returns all contact messages sorted by newest first.
