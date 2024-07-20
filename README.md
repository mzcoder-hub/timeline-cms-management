# Multi-Timeline CMS

This is a simple CMS (Content Management System) for managing multiple timelines. It includes functionalities for adding, editing, viewing, and deleting timelines and their associated content. The project is built using React for the frontend and Node.js with Express for the backend, and it uses SQLite as the database.

## Features

- **Add, Edit, View, Delete Timelines**
- **Add, Edit, View, Delete Content within Timelines**
- **Upload and Download Files for Content**
- **Display Overdue and Upcoming Timelines**
- **User Authentication and Authorization**

## Tech Stack

### Frontend

- React
- Formik for form handling
- Bootstrap for styling
- React DataTable Component for listing data

### Backend

- Node.js
- Express
- SQLite

## Setup Instructions

### Prerequisites

- Node.js and npm installed on your machine

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/multi-timeline-cms.git
   cd multi-timeline-cms
   ```

2. **Install dependencies for the backend**

   ```bash
   cd server
   npm install
   ```

3. **Install dependencies for the frontend**

   ```bash
   cd ../client
   npm install
   ```

## Database Setup

The project uses SQLite as the database. The database file will be created automatically when you run the backend server for the first time.

## Running the Application

1. **Start the backend server**

   ```bash
   cd server
   npm start
   ```

   The backend server will start on http://localhost:5000.

2. **Start the frontend development server**

   ```bash
   cd ../client
   npm start
   ```

   The frontend development server will start on http://localhost:3000.

## API Endpoints

### Timelines
- GET /api/timelines - Get all timelines
- GET /api/timelines/:id - Get a specific timeline by ID
- POST /api/timelines - Create a new timeline
- PUT /api/timelines/:id - Update a specific timeline by ID
- DELETE /api/timelines/:id - Delete a specific timeline by ID
- GET /api/timelines/overdue - Get all overdue timelines
- GET /api/timelines/upcoming - Get all upcoming timelines

### Content

- GET /api/content/:timelineId - Get all content for a specific timeline
- POST /api/content - Create new content
- PUT /api/content/:id - Update a specific content by ID
- DELETE /api/content/:id - Delete a specific content by ID

### Authentication

- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login and get a token
- POST /api/auth/logout - Logout the user

## Project Structure

### Backend (server)
- `server.js` - Main entry point of the backend server
- `routes/timelines.js` - Routes for timeline-related endpoints
- `routes/content.js` - Routes for content-related endpoints
- `routes/auth.js` - Routes for authentication
- `middleware/auth.js` - Middleware for verifying tokens
- `database.js` - Database setup and connection

### Frontend (client)

- `src/App.js` - Main component and entry point for the frontend
- `src/components/OverdueTimelines.js` - Component for displaying overdue timelines
- `src/components/UpcomingTimelines.js` - Component for displaying upcoming timelines
- `src/components/Register.js` - Component for user registration
- `src/components/Login.js` - Component for user login
- `src/components/ProtectedRoute.js` - Component for protected routes
- `src/AuthContext.js` - Context for authentication

## Contributing

If you wish to contribute to this project, please fork the repository and submit a pull request. Contributions are welcome!
