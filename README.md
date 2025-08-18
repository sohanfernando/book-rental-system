## Book Rental App

Minimal full-stack app to manage books and rentals. Frontend is React + Vite + Tailwind; backend is Spring Boot + JPA + MySQL.

### Project structure

- `backend/` Spring Boot API
- `frontend/` React UI (Vite)

## Prerequisites

- Java 21
- Node.js 18+ and npm
- MySQL 8 running locally

Default DB credentials are configured in `backend/src/main/resources/application.properties`:

- URL: `jdbc:mysql://localhost:3306/bookrental?createDatabaseIfNotExist=true`
- Username: `root`
- Password: `1234`

Adjust these if your local MySQL differs.

## Setup and run

1) Start the backend (port 8080)

Windows PowerShell:

```bash
cd backend
./mvnw.cmd spring-boot:run
```

macOS/Linux:

```bash
cd backend
./mvnw spring-boot:run
```

2) Start the frontend (port 5173, proxied to 8080)

```bash
cd frontend
npm install
npm run dev
```

Open the app at `http://localhost:5173`.

Notes:
- The Vite dev server proxies API calls from `/api` to `http://localhost:8080` (see `frontend/vite.config.js`).
- Ensure MySQL is running and accessible with the configured credentials before starting the backend.

## API endpoints

Base URL: `http://localhost:8080`

### Books

- GET `/api/books` — List all books
- GET `/api/books/{id}` — Get a single book
- POST `/api/books` — Create a book
  - Body:
  ```json
  {
    "title": "string",
    "author": "string",
    "genre": "string",
    "availabilityStatus": "AVAILABLE" | "UNAVAILABLE" // optional
  }
  ```
- PUT `/api/books/{id}` — Update a book
  - Body: same as create (fields required except `availabilityStatus` optional)
- DELETE `/api/books/{id}` — Delete a book

### Rentals

- GET `/api/rentals` — List all rentals
- GET `/api/rentals/{id}` — Get a single rental
- POST `/api/rentals` — Create a rental
  - Body:
  ```json
  {
    "username": "string",
    "rentalDate": "YYYY-MM-DD",
    "returnDate": "YYYY-MM-DD", // optional
    "bookId": 1
  }
  ```
- PUT `/api/rentals/{id}` — Update a rental (e.g., set `returnDate`)
  - Body (partial allowed):
  ```json
  {
    "username": "string",
    "rentalDate": "YYYY-MM-DD",
    "returnDate": "YYYY-MM-DD"
  }
  ```
- DELETE `/api/rentals/{id}` — Delete a rental

Response models:
- `BookResponse`: `{ id, title, author, genre, availabilityStatus }`
- `RentalResponse`: `{ id, username, rentalDate, returnDate, book: BookResponse }`

## Assumptions and additional features

- Rental date is required on create; return date is optional.
- When a book is rented, it is marked `UNAVAILABLE`. When a rental is returned (via `returnDate`) or a non-returned rental is deleted, the book is marked `AVAILABLE`.
- Simple optimistic UI: the frontend refreshes lists after create/update/delete.
- Tailwind styling with a clean navigation header and tab-like toggle between Books and Rentals.
- Manage Books includes editing `availabilityStatus`.
- Dev-time CORS is handled via Vite proxy; no backend CORS config required for local dev.

## Tech stack

- Backend: Spring Boot 3, Java 21, Spring Data JPA, MySQL
- Frontend: React 18, Vite, Tailwind CSS


