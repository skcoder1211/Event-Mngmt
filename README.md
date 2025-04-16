# Event-Mngmt
It's a simple event management website and it just make for the improve skills 


# Event Management System - Backend

This is the backend API for the Event Management System, built with Node.js, Express, and MongoDB.

## Features

- RESTful API for event management
- MongoDB database integration
- User authentication and authorization
- Event creation, updating, and deletion
- Attendee registration system
- Database migrations
- MVC architecture with controllers

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/eventmanagement
   NODE_ENV=development
   ```

## Database Migrations

To set up the database schema, run:
```
npm run migrate
```

To rollback migrations:
```
npm run migrate:down
```

## Running the Application

### Development mode:
```
npm run dev
```

### Production mode:
```
npm start
```

## API Endpoints

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get a specific event
- `POST /api/events` - Create a new event
- `PUT /api/events/:id` - Update an event
- `DELETE /api/events/:id` - Delete an event

### Registration
- `POST /api/events/:id/register` - Register a user for an event
- `DELETE /api/events/:id/register` - Cancel a registration for an event

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a specific user
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user
- `GET /api/users/:userId/events` - Get all events for a specific user

## Project Structure

```
backend/
├── controllers/        # Controller files for handling request logic
│   ├── EventController.js
│   ├── UserController.js
│   └── RegistrationController.js
├── models/             # MongoDB models
│   ├── Event.js
│   └── User.js
├── routes/             # API routes
│   ├── events.js
│   └── users.js
├── migrations/         # Database migrations
│   ├── migration-runner.js
│   ├── create_users_table.js
│   └── create_events_table.js
├── .env                # Environment variables
├── .gitignore
├── index.js            # Main entry point
├── package.json
└── README.md
```

## License

ISC 
