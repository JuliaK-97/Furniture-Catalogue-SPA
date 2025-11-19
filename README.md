# Furniture-Catalogue-SPA
A single-page application (SPA) with a Node.js backend for digitizing furniture cataloguing workflows
---
## Overview
This project replaces manual furniture cataloguing with a digital workflow that enables:
- Entry of item details (name, description, lot number)
- Image upload and preview
- Secure storage and retrieval via API
- Export data for auction listing
---
## Target Users
- Furniture catalogers
- Inventory managers
- Auction staff
---
## Tech Stack

| Layer       | Technology        |
|-------------|-------------------|
| Frontend    | React.js (Vite)   |
| Backend     | Node.js + Express |
| Database    | MongoDB           |
| Containers  | Docker + Compose  |
| Storage     | local file system |
---
## Setup Instructions

### Prerequisites
- Docker & Docker Compose
- Git
- Node.js (for local dev)

### Clone the Repository
```bash
git clone https://github.com/JuliaK-97/Furniture-Catalogue-SPA.git
cd Furniture-Catalogue-SPA
```
### Run with Docker
``` bash
docker compose up -d
```
Frontend: http://localhost:3000
Backend API: http://localhost:5000/api
MongoDB:mongodb://localhost:27017

---

## 🧪 Testing

### Backend
Run tests inside the `backend/` folder:
``` bash
npm run test:unit
npm run test:integration
```
- testing done in isolated testing environment env.test
- coverage includes unit and integration tests using node:test and supertest




---
## Documentation
- The backend uses JSDoc-style inline documentation to describe API routes, parameters, and behaviors
---

## Folder Structure

```
Furniture-Catalogue-SPA/
├── frontend/          # React SPA
├── backend/           # Node.js API
├── database/          # DB models or seed data
├── tests/             # Unit & integration tests 
├── docs/              # Wireframes, diagrams, Scrum logs
├── docker-compose.yml
└── README.md
```

---

## Wireframes & Architecture

Diagrams and wireframes are stored in `/docs`:
- Home screen layout
- Add/Edit form
- C4 component diagram
- API flowchart

---

## Scrum Process

Development follows a Scrum model:
- Sprint 1: UI and form
- Sprint 2: Backend and image upload
- Sprint 3: Docker, testing, and documentation
Project Tracking was done in Jira
- product backlog
- sprint backlog
- progress and workflow tracking
---

## 📎 License

This project is open source under the MIT License.

---

## 👩‍💻 Author

Julia K.  
Johannesburg, South Africa





