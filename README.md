# ToursEngine

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Your new, shiny [Nx workspace](https://nx.dev) is almost ready ✨.

# Tours Engine 🌍✈️

## Quick Overview

Tours Engine is a comprehensive tour booking web application with a React frontend and NestJS backend, designed to simplify tour management and booking.

## 📂 Project Structure

```
tours-engine/
├── apps/
│   ├── web-ui/               # React frontend application
│   │   ├── src/
│   │   └── e2e/             # End-to-end tests
│   └── rest-api/            # NestJS backend application
│       ├── src/
|       |   ├── .env.local    # Environment variables template
|       |   ├── .Dockerfile   # Dockerfile
│       │   ├── auth/        # Authentication logic
│       │   ├── tours/       # Tours management
│       │   ├── bookings/    # Booking management
│       │   └── payments/    # Payment processing
│       └── test/            # API tests
├── libs/                    # Shared libraries
│   ├── shared-types/       # Common TypeScript interfaces
│   └── ui-components/      # Reusable React components
├── tools/                   # Build and development tools
├── docs/                    # Documentation files
│   ├── database_design.pdf
│   └── Tour Booking API.postman_collection.json
├── docker-compose.yml       # Container orchestration
├── nx.json                 # Nx workspace config
└── package.json            # Project dependencies
```

## 🚀 Tech Stack

- **Frontend**: React
- **Backend**: NestJS
- **Database**: PostgreSQL
- **Containerization**: Docker
- **Database Design**: [Database Design](https://dbdiagram.io/d/65607337ac895c1814c0904f)
- **Monorepo**: Nx Workspaces
- **API Documentation**: OpenAPI (Postman Collection)
- **Sentry**: Error Tracking

## 📚 Project Files

- [API Documentation](/docs/Tour%20Booking%20API.postman_collection.json)
- [Database Design PDF](/docs/database_design.pdf)
- [Environment Variables Template](/.env.local)
- [Docker Configuration](/docker-compose.yml)

## 📦 Features

- **User Authentication:** Secure user registration, login, and profile management using JWT.
- **Tour Management:** Create, read, update, and delete tours.
- **Tour Browsing:** Browse available tours with pagination, sorting, and filtering.
- **Booking Management:** Create and manage tour bookings.
- **User Profiles:** View and manage user profile information.
- **Secure Payment Processing:** Integrated with Stripe for secure payment handling.
- **Stripe Webhooks:** Handle Stripe events for payment processing.

## 🗂️ Database Schema

Here's a visual representation of the database schema:

```mermaid
erDiagram
    USERS ||--o{ TOURS : creates
    USERS ||--o{ BOOKINGS : makes
    USERS ||--o{ PAYMENTS : processes
    TOURS ||--o{ BOOKINGS : has
    BOOKINGS ||--o{ PAYMENT_BOOKINGS : linked
    PAYMENTS ||--o{ PAYMENT_BOOKINGS : includes

    USERS {
        char(26) id PK
        varchar username
        varchar email
        varchar first_name
        varchar last_name
        varchar phone_number
        varchar password
        boolean active
        varchar[] roles
        jsonb metadata
        timestamp last_login
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    TOURS {
        char(26) id PK
        varchar title
        varchar location
        text description
        int duration
        decimal price
        varchar currency
        varchar[] image_urls
        boolean is_active
        int capacity
        char(26) created_by_user_id FK
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    BOOKINGS {
        char(26) id PK
        char(26) user_id FK
        char(26) tour_id FK
        char status
        int participants
        decimal total_amount
        text special_requirements
        varchar reference_number
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    PAYMENTS {
        char(26) id PK
        char(26) user_id FK
        varchar stripe_payment_intent_id
        varchar stripe_customer_id
        decimal amount
        varchar currency
        varchar status
        varchar failure_reason
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    PAYMENT_BOOKINGS {
        char(26) id PK
        char(26) payment_id FK
        char(26) booking_id FK
        decimal amount
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }
```

## 🔧 Prerequisites

- **Node.js** (v22+)
- **npm** or **Yarn**
- **Docker** (optional, but recommended)
- **PostgreSQL**

## 📋 Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/outhanchazima/tours-engine.git
cd tours-engine
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment

- Create a `.env` file in the project app(rest-api) under apps
- Check the sample .env.local 
- Add necessary configuration:

  ```
  DATABASE_URL=postgresql://username:password@localhost:5432/toursdb
  STRIPE_SECRET_KEY=your_stripe_secret_key
  JWT_SECRET=your_jwt_secret
  ```

### 4. Database Setup

```bash
# If using Docker
docker-compose up -d
```

### 5. Run the Application
 - Server runs on http://localhost:3000/
 - Client runs on http://localhost:4200/
 - SERVER Swagger Docs run on http://localhost:3000/api
 

```bash
# Start Backend
nx serve rest-api

# Start Frontend
nx serve web-ui

# Alternatively you can run both the client and server in paralle 
npm run serve
```

## 🐳 Docker Deployment

```bash
# Build the apps first
npm run build

# Run Docker Compose
docker-compose build
docker-compose up
```

## 🔒 Security Features

- JWT Authentication
- Role-Based Access Control
- Input Validation
- HTTPS Encryption
- Stripe Secure Payments

## 🤔 Assumptions & Prerequisites

- JWT Authentication is implemented using @nestjs/jwt and assumes stateless authentication
- Images are stored in object storage (S3/MinIO) - only URLs are stored in the database
- Frontend assumes modern browser compatibility
- API rate limiting is handled by the infrastructure layer
- Stripe is configured for test mode during development

## ⚠️ Known Issues

1. **Booking Creation**: Occasionally returns 500 error due to database connection issues
   - Workaround: Retry the booking creation
   - Root cause: Database version issue(postgres)

2. **Nx Workspace Dependencies**: 
   - Issue: React dependency conflicts during package installation
   - Note: Application functions normally despite warning messages
   - Workaround: Safe to proceed with npm install

3. **Image Upload**:
   - Assumes pre-signed URLs for direct upload to object storage
   - Frontend handles image resize before upload

## 🚀 Future Implementations

1. **Authentication Enhancement**:
   - Migrate to Keycloak for more robust identity management
   - Implement OAuth 2.0 flows
   - Single Sign-On (SSO) integration

2. **Infrastructure**:
   - Add Redis for caching
   - Implement proper rate limiting
   - Set up CDN for static assets

3. **Monitoring**:
   - Add application metrics
   - Implement logging aggregation
   - Set up error tracking

4. **Proper Nx Workspaces Utilization**
    - Use librarties(nest and react)
    - 

## 🧪 Testing

```bash
# Run Unit Tests
nx test web-ui
nx test rest-api

# Run E2E Tests
nx e2e web-ui-e2e
```

## 📦 Build for Production

```bash
nx build web-ui --prod
nx build rest-api --prod

# this will build both the frontend app and backend app in parallel
npm run build
```

## 📝 License

[Your License - e.g., MIT]

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For issues or questions, please open a GitHub issue.
