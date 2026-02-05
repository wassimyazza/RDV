# RDV - Event Reservation System 🎫

A modern full-stack event management and reservation platform built with NestJS and Next.js.

## 📖 About

RDV is a comprehensive event booking system that allows organizations to manage workshops, conferences, and training sessions. The platform provides role-based access control with distinct experiences for administrators and participants.

**Key Features:**
- 🎯 Event creation and management
- 📅 Real-time seat availability tracking
- 🎟️ PDF ticket generation
- 👥 Role-based access control (Admin/Participant)
- 📊 Administrative dashboard with statistics
- 🔐 JWT authentication
- 📱 Responsive modern UI

## 🛠️ Tech Stack

### Backend
- **Framework:** NestJS
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication:** JWT + Passport
- **PDF Generation:** PDFKit
- **Testing:** Jest

### Frontend
- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Icons:** React Icons

### DevOps
- **Containerization:** Docker & Docker Compose

## 📁 Project Structure
```
RDV/
├── backend/              # NestJS API
│   ├── src/
│   │   ├── auth/        # Authentication module
│   │   ├── events/      # Events management
│   │   ├── reservations/# Reservations handling
│   │   ├── users/       # User management
│   │   ├── statistics/  # Admin statistics
│   │   └── pdf/         # Ticket generation
│   ├── test/            # Unit & E2E tests
│   └── Dockerfile
├── frontend/            # Next.js Application
│   ├── app/
│   │   ├── admin/      # Admin dashboard
│   │   ├── dashboard/  # Participant dashboard
│   │   ├── events/     # Event listing
│   │   └── login/      # Authentication pages
│   ├── components/     # Reusable UI components
│   ├── lib/            # API client & utilities
│   └── Dockerfile
└── docker-compose.yml  # Docker orchestration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Docker & Docker Compose (optional)

### Installation

#### Option 1: Docker (Recommended)

1. **Clone the repository**
```bash
git clone https://github.com/wassimyazza/RDV.git
cd RDV
```

2. **Start all services**
```bash
docker-compose up --build
```

3. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api

#### Option 2: Local Development

**Backend Setup:**
```bash
cd backend
npm install
```

Create `.env` file:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=rdv_events
JWT_SECRET=your-secret-key
PORT=3001
```
```bash
# Create database
createdb rdv_events

# Run migrations (auto with synchronize: true)
npm run start:dev
```

**Frontend Setup:**
```bash
cd frontend
npm install
npm run dev
```

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```env
DB_HOST=localhost
DB_PORT=5435
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=rdv_events
JWT_SECRET=mysecretkey123
PORT=3001
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 👤 User Roles

### Admin
- Create and manage events
- Publish/cancel events
- Confirm/refuse reservations
- View statistics dashboard
- Access all system features

### Participant
- Browse published events
- Create reservations
- View personal reservations
- Download confirmed tickets (PDF)

## 📝 API Endpoints

### Authentication
```
POST   /api/auth/login          # User login
POST   /api/users/register      # User registration
```

### Events
```
GET    /api/events              # List all events (Admin)
GET    /api/events/published    # List published events (Public)
GET    /api/events/:id          # Get event details
POST   /api/events              # Create event (Admin)
PATCH  /api/events/:id/publish  # Publish event (Admin)
PATCH  /api/events/:id/cancel   # Cancel event (Admin)
```

### Reservations
```
POST   /api/reservations                    # Create reservation
GET    /api/reservations/my-reservations    # User's reservations
GET    /api/reservations/:id/download-ticket # Download PDF ticket
PATCH  /api/reservations/:id/confirm        # Confirm reservation (Admin)
PATCH  /api/reservations/:id/refuse         # Refuse reservation (Admin)
```

### Statistics (Admin)
```
GET    /api/statistics/dashboard            # Complete dashboard stats
GET    /api/statistics/upcoming-events      # Upcoming events list
GET    /api/statistics/reservations-by-status # Reservation statistics
```

## 🧪 Testing

### Backend Tests
```bash
cd backend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🐳 Docker Commands
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Rebuild containers
docker-compose up --build

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Reset database
docker-compose down -v
docker-compose up --build
```

## 📊 Features Breakdown

### Event Management
- ✅ CRUD operations for events
- ✅ Event status workflow (Draft → Published → Canceled)
- ✅ Real-time seat capacity tracking
- ✅ Prevent overbooking

### Reservation System
- ✅ One reservation per user per event
- ✅ Status tracking (Pending → Confirmed/Refused)
- ✅ Automatic seat management
- ✅ PDF ticket generation for confirmed reservations

### Security
- ✅ JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Password hashing with bcrypt
- ✅ Protected routes and guards

### User Experience
- ✅ Modern, responsive UI
- ✅ Real-time form validation
- ✅ Loading states and error handling
- ✅ Intuitive navigation

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Wassim Yazza**
- GitHub: [@wassimyazza](https://github.com/wassimyazza)
- Email: wassimyazza10@gmail.com
- Project: [RDV](https://github.com/wassimyazza/RDV)

## 🙏 Acknowledgments

- Built during training at YOUCODE-SAFI (UM6P)
- Special thanks to Webcom team for support

## 📞 Support

For support, email wassimyazza10@gmail.com or open an issue on [GitHub](https://github.com/wassimyazza/RDV/issues).

---

**Made with ❤️ by Wassim Yazza**