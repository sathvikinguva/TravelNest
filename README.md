# Rooms and Flights

Unified documentation for the full-stack Rooms and Flights booking system.
This README covers frontend, backend, local setup, API usage, and database design.
The application supports room booking, flight booking, admin management, and JWT based authorization.

## 1. Product Summary

Rooms and Flights is a travel booking platform with two user modes.
Regular users can browse rooms and flights, then create and manage bookings.
Admin users can manage inventory, monitor bookings, and administer user records.
Authentication is implemented using Google OAuth and JWT authorization for APIs.
The frontend is built with React and Vite.
The backend is built with Spring Boot and MySQL.

## 2. High Level Architecture

The system is split into two deployable parts.
The frontend runs as a single page application and calls REST APIs.
The backend exposes API endpoints and handles business rules.
MySQL stores users, rooms, flights, and bookings.
JWT is issued on successful OAuth sign-in and sent in Authorization headers.
Admin APIs are protected by role checks.

## 3. Repository Structure

- backend: Spring Boot service, controllers, entities, security, and persistence.
- frontend: React app, pages, components, context state, and API client.
- backend/docker/mysql/init: optional SQL bootstrap for local database startup.

## 4. Tech Stack

Frontend technologies:
- React with TypeScript.
- Vite for development and bundling.
- Tailwind utility classes for styling.
- Framer Motion for transitions and animation.

Backend technologies:
- Java 21 compatible Spring Boot runtime.
- Spring Web, Spring Security, Spring Data JPA.
- OAuth2 client integration for Google login.
- JJWT for token generation and validation.
- MySQL as relational database.

## 5. Core Features

- Browse room inventory with image, location, type, description, and price.
- Browse flight inventory with source, destination, timings, fare, cabin class, and image.
- Create room or flight bookings with traveler details and payment metadata.
- View and cancel user bookings.
- Admin room create and update flows.
- Admin flight create and update flows.
- Admin booking visibility across all users.
- Admin user removal for non-admin accounts.

## 6. Prerequisites

Install the following locally:
- Node.js 18 or higher.
- npm 9 or higher.
- Java 21 or project compatible JDK.
- Maven 3.9 or higher.
- MySQL 8.

Create and configure a MySQL user with database privileges.
Ensure port 3306 is available for local MySQL.
Ensure backend port 8080 and frontend port 5173 are available.

## 7. Environment Configuration

Backend properties are located in backend/src/main/resources/application.properties.
Important properties:
- spring.datasource.url
- spring.datasource.username
- spring.datasource.password
- app.jwt.secret
- app.jwt.expiration-ms
- app.frontend.oauth-success-url

Set these environment variables before backend startup:
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- JWT_SECRET

The JWT secret must be base64 encoded and sufficiently long for HMAC signing.

## 8. Local Run Guide

### 8.1 Start Backend

1. Open terminal in backend folder.
2. Run mvn spring-boot:run.
3. Verify service starts on http://localhost:8080.

### 8.2 Start Frontend

1. Open terminal in frontend folder.
2. Run npm install.
3. Run npm run dev.
4. Open http://localhost:5173.

Important note:
Run npm commands inside frontend folder, not repository root.

## 9. API Security Model

Public endpoints:
- GET /api/rooms
- GET /api/rooms/{id}
- GET /api/flights
- GET /api/flights/{id}

Authenticated endpoints:
- /api/bookings/**

Admin only endpoints:
- /api/admin/**

Security flow:
- User signs in via Google OAuth.
- Backend creates or loads user.
- Backend generates JWT with uid and role claims.
- Frontend stores token and sends Bearer token for protected calls.
- JWT filter validates token and populates SecurityContext.

## 10. Booking Flow

1. User picks room or flight.
2. User enters traveler data and payment reference details.
3. Frontend posts booking payload with amounts and currency.
4. Backend validates user and bookable item.
5. Backend stores booking with BOOKED status.
6. User can view or cancel own bookings.

## 11. Admin Flow

1. Admin opens admin panel.
2. Admin can add or update room inventory.
3. Admin can add or update flight inventory.
4. Admin can review all booking records.
5. Admin can remove normal users.

## 12. Database Design Document

### 12.1 Database Name

- travel_booking

### 12.2 Design Principles

- Keep core entities normalized.
- Use surrogate numeric primary keys.
- Store booking ownership through foreign key to users.
- Separate room and flight catalogs from bookings.
- Persist financial values in bookings for auditability at booking time.

### 12.3 Entity Relationship Summary

- One user can have many bookings.
- One booking belongs to exactly one user.
- Booking references item_id and type to indicate room or flight target.
- Rooms and flights are independent inventory tables.

### 12.4 Table: users

Purpose:
- Stores authenticated application users and role assignments.

Columns:
- id BIGINT PK AUTO_INCREMENT.
- name VARCHAR(255) NOT NULL.
- email VARCHAR(255) NOT NULL UNIQUE.
- role VARCHAR(20) NOT NULL.

Constraints and indexes:
- Primary key on id.
- Unique constraint on email.

### 12.5 Table: rooms

Purpose:
- Stores room or hotel stay inventory managed by admin.

Columns:
- id BIGINT PK AUTO_INCREMENT.
- name VARCHAR(255) NOT NULL.
- location VARCHAR(255) NOT NULL.
- image_url VARCHAR(1000) NULL.
- room_type VARCHAR(255) NULL.
- description VARCHAR(2000) NULL.
- price DOUBLE NOT NULL.
- available BIT(1) NOT NULL.

Constraints and indexes:
- Primary key on id.
- Optional index recommendation on location for filtering.

### 12.6 Table: flights

Purpose:
- Stores flight inventory managed by admin.

Columns:
- id BIGINT PK AUTO_INCREMENT.
- flight_name VARCHAR(255) NULL.
- source VARCHAR(255) NOT NULL.
- destination VARCHAR(255) NOT NULL.
- date DATETIME(6) NOT NULL.
- departure_time DATETIME(6) NULL.
- arrival_time DATETIME(6) NULL.
- image_url VARCHAR(1000) NULL.
- cabin_class VARCHAR(255) NULL.
- price DOUBLE NOT NULL.

Constraints and indexes:
- Primary key on id.
- Optional composite index recommendation on source and destination.

### 12.7 Table: bookings

Purpose:
- Stores finalized booking records with traveler and payment metadata.

Columns:
- id BIGINT PK AUTO_INCREMENT.
- user_id BIGINT NOT NULL FK users(id).
- type VARCHAR(20) NOT NULL.
- item_id BIGINT NOT NULL.
- status VARCHAR(20) NOT NULL.
- traveler_name VARCHAR(120) NOT NULL.
- traveler_notes VARCHAR(500) NULL.
- travel_date DATE NOT NULL.
- guest_count INT NOT NULL.
- payment_method VARCHAR(40) NOT NULL.
- payment_reference VARCHAR(40) NOT NULL.
- base_amount DECIMAL(10,2) NOT NULL.
- tax_amount DECIMAL(10,2) NOT NULL.
- total_amount DECIMAL(10,2) NOT NULL.
- currency VARCHAR(3) NOT NULL.

Constraints and indexes:
- Primary key on id.
- Foreign key user_id references users(id).
- Index idx_bookings_user_id on user_id.
- Index idx_bookings_item_type on item_id and type.

### 12.8 Referential Integrity Notes

When deleting users, related bookings should be handled explicitly.
Application currently enforces cleanup logic at service layer.
Consider ON DELETE CASCADE only if business policy allows hard delete propagation.

### 12.9 Data Type Notes

DECIMAL is used for booking amounts to avoid floating point precision issues.
DOUBLE is currently used for room and flight price catalogs.
For strict financial consistency, future migration can change catalog price to DECIMAL.

### 12.10 Suggested Future Enhancements

- Add created_at and updated_at timestamps to all tables.
- Add soft delete fields for audit friendly removals.
- Add booking reference code unique per booking.
- Add separate payments table for transaction lifecycle.
- Add availability calendars for room date capacity.

## 13. Build and Validation Commands

Frontend:
- npm install
- npm run dev
- npm run build

Backend:
- mvn clean test
- mvn spring-boot:run

## 15. Quick Start Checklist

- Configure MySQL credentials.
- Configure OAuth and JWT environment variables.
- Start backend service.
- Start frontend service.
- Sign in via Google OAuth.
- Promote admin role in database if needed.
- Create room and flight inventory from admin panel.
- Create bookings from user flow.
- Verify booking and admin management workflows.
