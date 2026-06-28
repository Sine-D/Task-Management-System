# ⚡ Issue Tracker

## 🛠️ Setup Instructions

1. **📂 Clone the Repository**
   ```bash
   git clone <repository-url>
   cd Issue-Tracker
   ```

2. **🖥️ Backend Setup**
   - Navigate to the server directory: `cd server`
   - Install dependencies: `npm install`
   - Create a `.env` file in the `server` directory and add the following:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     CLIENT_ORIGIN=http://localhost:5173
     NODE_ENV=development
     ```

3. **💻 Frontend Setup**
   - Navigate to the client directory: `cd client`
   - Install dependencies: `npm install`

## 📦 Dependencies

### ⚙️ Backend
- **Core**: Express, Mongoose, MongoDB
- **Security**: Bcryptjs, Jsonwebtoken
- **Middleware**: CORS, Morgan, Dotenv, Express-validator
- **Development**: Nodemon

### 🎨 Frontend
- **Core**: React 19, Vite, React Router Dom
- **State Management**: Redux Toolkit, React Redux
- **Styling & Icons**: TailwindCSS, Framer Motion, Lucide-react, React-icons
- **Utilities**: Axios, Clsx, React-hot-toast

## 🚀 Usage

1. **📡 Start the Backend Server**
   - From the `server` directory:
     ```bash
     npm run dev
     ```
   - The server will start on `http://localhost:5000`.

2. **🌐 Start the Frontend Development Server**
   - From the `client` directory:
     ```bash
     npm run dev
     ```
   - The application will be accessible at `http://localhost:5173`.

3. **🔄 General Flow**
   - 🔑 Register a new account or log in.
   - 📋 Use the dashboard to create, track, and manage project issues.
   - 🔍 Filter issues by status, priority, or severity.
   - ✅ Update issue status as progress is made.
