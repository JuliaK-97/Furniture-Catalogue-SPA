# Furniture-Catalogue-SPA
SPA + FastAPI backend for digitizing furniture cataloguing workflows
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
| Frontend    | React.js          |
| Backend     | Node.js  |
| Database    | MongoDB           |
| Containers  | Docker + Compose  |
| Storage     | local file system |
---
## Setup Instructions

### Prerequisites
- Docker & Docker Compose
- Git
- Node.js

### Clone the Repository
```bash
git clone https://github.com/JuliaK-97/Furniture-Catalogue-SPA.git
cd Furniture-Catalogue-SPA
## 🌐 Access

---

## 🧪 Testing

### Backend
Run tests inside the `backend/` folder:
```bash
npm test
```

---
## Documentation
- The backend uses JSDoc-style inline documentation to describe API routes, parameters, and behaviors
---

##  Folder Structure

```
Furniture-Catalogue-SPA/
├── frontend/          # React SPA
├── backend/           # Node.js
├── database/          # DB models or seed data
├── tests/             # Unit & integration tests using node:test and supertest
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
- Sprint 3: Docker, testing, and logging
- Daily logs and retrospectives in `/docs/scrum-log.md`

---

## Project Status

✅ Concept approved  
✅ Architecture documented  
🔄 Development in progress  
📅 Presentation scheduled

---

## 📎 License

This project is open source under the MIT License.

---

## 👩‍💻 Author

Julia K.  
Johannesburg, South Africa





