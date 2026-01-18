# MERN Hotel Management System – Project Presentation

## 1. Project Overview
- **Project Name:** MERN Hotel Management System
- **Architecture:** Full-stack MERN (MongoDB, Express, React, Node.js)
- **Purpose:** End-to-end hotel management platform supporting guests, reception, managers, staff, and admins.
- **Key Idea:** Centralize all hotel operations (room management, bookings, payments, service requests, reviews, dashboards) in a single web application.

## 2. Core Features
- **Authentication & Authorization**
  - Secure login and registration using JWT-based authentication.
  - Role-based access control (Guest, Staff, Reception, Manager, Admin).

- **Room Management**
  - Admin and staff can create, update, and delete rooms.
  - Track room type, floor, amenities (AC, WiFi, TV), availability, and status.

- **Bookings**
  - Guests can view available rooms and create bookings.
  - Reception and admin can create bookings on behalf of guests.
  - Booking lifecycle: pending, confirmed, checked-in, checked-out, cancelled (status driven from backend).

- **Payments**
  - Record payments associated with bookings and rooms.
  - Track payment method (e.g., cash) and status.
  - Admin/Manager dashboards show recent payments and revenue insights.

- **Service Requests**
  - Guests can submit service requests (e.g., housekeeping, maintenance).
  - Staff/Reception can view and manage service requests from dashboards.

- **Reviews & Feedback**
  - Guests can submit reviews/feedback.
  - Admin/Manager can monitor reviews for quality improvement.

- **Dashboards (Role-Specific)**
  - **Guest Dashboard:** View/update profile, manage bookings, service requests, and feedback.
  - **Reception Dashboard:** Manage check-ins/check-outs, view guests, handle bookings and service requests.
  - **Manager Dashboard:** Higher-level insights (guests, bookings, revenue, service performance).
  - **Admin Dashboard:** Full control over users, rooms, bookings, payments, reviews, and settings.

## 3. Technology Stack

### Frontend
- **Framework:** React (Vite-based setup)
- **Routing:** react-router-dom
- **UI & Styling:** Tailwind-style utility classes with custom color theme
- **Icons:** react-icons

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Auth & Security:** jsonwebtoken, bcrypt, dotenv, cors
- **Other:** body-parser, nodemon for development

### Project Structure
- **frontend/** – React SPA with pages and shared components.
  - `src/pages` – Home, About, Contact, Room listing, Login/Register, and all dashboards (Admin, Manager, Reception, Staff, Guest).
  - `src/component` – Shared layout components (Header, Footer, etc.).
- **backend/** – Express server and APIs.
  - `Controllers/` – Business logic for auth, bookings, rooms, payments, reviews, service requests, settings.
  - `Models/` – Mongoose models for User, Room, Booking, Payment, Review, ServiceRequest, Settings.
  - `Routes/` – REST API route definitions mapped to controllers.
  - `utils/connection.js` – MongoDB connection setup.

## 4. Key Modules and Flows

### 4.1 Authentication Flow
- Users register and log in via frontend forms (Login/Register pages).
- Credentials are sent to backend `/api` auth routes.
- Backend verifies user credentials using bcrypt and issues a JWT.
- Frontend stores user info (and token) in localStorage and uses it to:
  - Protect routes by role.
  - Attach token in API requests for protected resources.

### 4.2 Room Management Flow
- Admin/Staff adds or edits rooms via Admin dashboard forms.
- Data includes room number, room type, floor, price, amenities, and status.
- Backend stores room data in `RoomModel`.
- Rooms are fetched by various dashboards to:
  - Show availability to guests.
  - Allow admins/managers to manage room status.

### 4.3 Booking Flow
- Guest selects room and dates from frontend.
- Booking request is sent to `/api/booking` routes.
- Backend creates a `BookingModel` entry with guest, room, and dates.
- Reception/Admin views booking lists in their dashboards:
  - Can confirm, update, or cancel bookings depending on role.

### 4.4 Payment Flow
- Payments are linked to bookings and rooms.
- Backend uses `PaymentModel` to track payment amount, method, and status.
- Admin/Manager dashboards use payments data to:
  - Display recent payments.
  - Calculate revenue and overview statistics.

### 4.5 Service Request Flow
- Guests create service requests from their dashboard (e.g., housekeeping).
- Requests are stored in `ServiceRequestModel`.
- Reception/Staff dashboards show open and in-progress requests.
- Status updates flow from staff actions back to guest views.

## 5. Frontend Dashboards (Highlights)

### 5.1 Admin Dashboard
- Manage users (create, edit, delete, update status).
- Manage rooms (CRUD, availability, pricing).
- View global bookings, payments, reviews, and service requests.
- Guest details view:
  - Shows bookings, payments, and service requests for a selected guest.
  - Used in multiple tabs for a consistent experience.

### 5.2 Manager Dashboard
- Focused on insights and analytics.
- Guest insights:
  - For a selected guest, show combined booking, payment, and service request history.
- Revenue and performance indicators derived from bookings and payments.

### 5.3 Reception Dashboard
- Targeted for front-desk operations.
- Manage guest check-ins/check-outs.
- View guests, bookings, and service requests in a consolidated interface.
- Guest details panel similar to Admin/Manager for quick lookup.

### 5.4 Guest Dashboard
- Guests can:
  - View and edit their profile.
  - See all their bookings.
  - Create service requests.
  - Submit feedback/reviews.

## 6. Non-Functional Aspects
- **Security**
  - JWT authentication and role-based authorization middleware.
  - Password hashing with bcrypt.
  - CORS configured with an allowed origins whitelist.
- **Scalability**
  - Clear separation of concerns between controllers, models, and routes.
  - RESTful APIs that can be consumed by other clients in the future (e.g., mobile).
- **Maintainability**
  - Organized folder structure for both frontend and backend.
  - Reusable React components and shared utility functions.

## 7. How to Run the Project (Local Setup)

### 7.1 Prerequisites
- Node.js and npm installed.
- MongoDB instance running (local or cloud).
- `.env` file in backend with at least:
  - `PORT` – Port number for backend server.
  - `MONGODB_URI` – MongoDB connection string.
  - `JWT_SECRET` – Secret key for JWT.

### 7.2 Backend Setup
1. Open a terminal in `backend/`.
2. Install dependencies:
   - `npm install`
3. Start the backend (development):
   - `npm run dev`

### 7.3 Frontend Setup
1. Open another terminal in `frontend/`.
2. Install dependencies:
   - `npm install`
3. Start the frontend dev server:
   - `npm run dev`
4. Open the shown local URL (typically `http://localhost:5173`).

## 8. Possible Presentation Slide Outline
- **Slide 1:** Project Title, Team, and Tech Stack.
- **Slide 2:** Problem Statement and Motivation.
- **Slide 3:** System Overview and Architecture Diagram (MERN stack layers).
- **Slide 4:** Core Features (Rooms, Bookings, Payments, Service Requests).
- **Slide 5:** Role-Based Dashboards (Guest, Reception, Manager, Admin).
- **Slide 6:** Technical Stack and Key Libraries.
- **Slide 7:** Security and Non-Functional Requirements.
- **Slide 8:** Demo Screenshots and User Flows.
- **Slide 9:** Challenges Faced and How They Were Solved.
- **Slide 10:** Future Enhancements and Conclusion.

You can copy this outline directly into PowerPoint or Google Slides and convert each section into slides, adding screenshots from your running application for a polished presentation.

