# ToursEngine

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Your new, shiny [Nx workspace](https://nx.dev) is almost ready ✨.

# Tours Engine 🌍✈️

## Quick Overview

Tours Engine is a comprehensive tour booking web application with a React frontend and NestJS backend, designed to simplify tour management and booking.

## 🚀 Tech Stack

- **Frontend**: React
- **Backend**: NestJS
- **Database**: PostgreSQL
- **Containerization**: Docker
- **Monorepo**: Nx Workspaces

## 📦 Features

- User Authentication
- Tour Browsing
- Booking Management
- User Profiles
- Secure Payment Processing (Stripe)

## 🔧 Prerequisites

- Node.js (v16+)
- npm or Yarn
- Docker (optional, but recommended)
- PostgreSQL

## 📋 Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/tours-engine.git
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
