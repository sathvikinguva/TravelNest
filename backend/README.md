# Travel Booking Backend (Spring Boot)

Backend for a travel booking system using Java, Spring Boot, MySQL, Google OAuth2, JWT, and role-based access control.

## Features

- Google OAuth2 login
- JWT authentication for API requests
- Role-based authorization (`USER`, `ADMIN`)
- Room management
- Flight management
- Booking management
- DTO-based API responses
- Global exception handling

## Package Structure

- `controller`
- `service`
- `repository`
- `entity`
- `dto`
- `security`
- `config`
- `exception`

## Prerequisites

- Java 17+
- Maven 3.9+
- MySQL 8+
- Google OAuth credentials

## Configuration

Update [src/main/resources/application.properties](src/main/resources/application.properties):

- `spring.datasource.*`
- `spring.security.oauth2.client.registration.google.*`
- `app.jwt.secret` (Base64 encoded, at least 256-bit)

## Run

```bash
mvn spring-boot:run
```

OAuth login entrypoint:

- `GET /oauth2/authorization/google`

After successful login, backend responds with JWT JSON payload.
