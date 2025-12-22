# Authentication API Documentation

This document describes the authentication system for the Interview Management System.

## API Endpoints

### 1. POST `/api/auth/login`
Authenticate a user and return user information.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "admin" // Optional: filter by specific role
}
```

**Response (Success):**
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "name": "User Name",
  "role": "admin",
  "redirectPath": "/admin/dashboard",
  "message": "Login successful"
}
```

**Response (Error):**
```json
{
  "error": "Invalid email or password"
}
```

### 2. POST `/api/auth/logout`
Log out the current user.

**Response:**
```json
{
  "message": "Logout successful",
  "success": true
}
```

### 3. GET `/api/auth/me?userId=<userId>`
Get user information by user ID.

**Response (Success):**
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "admin",
    "createdAt": "2025-12-22T00:00:00.000Z",
    "updatedAt": "2025-12-22T00:00:00.000Z"
  },
  "message": "User information retrieved successfully"
}
```

## User Roles

- `admin`: Full system access
- `manager`: Team management access
- `hr`: Human resources access
- `interviewer`: Interviewer access
- `candidate`: Candidate access

## Role-Based Redirects

Each role has a default redirect path:
- Admin: `/admin/dashboard`
- Manager: `/manager/dashboard`
- HR: `/hr/dashboard`
- Interviewer: `/interviewer/dashboard`
- Candidate: `/candidate/dashboard`

## Usage Examples

### Client-Side Login
```javascript
import { login, setCurrentUser } from '@/lib/auth';

const handleLogin = async (email, password) => {
  const result = await login(email, password);

  if (result.user) {
    setCurrentUser(result.user, rememberMe);
    router.push(result.user.redirectPath);
  } else {
    setError(result.error);
  }
};
```

### Check Authentication
```javascript
import { getCurrentUser, isAuthenticated, hasRole } from '@/lib/auth';

const user = getCurrentUser();
if (isAuthenticated() && hasRole(user, 'admin')) {
  // User is authenticated and is an admin
}
```

### Logout
```javascript
import { logout } from '@/lib/auth';

const handleLogout = async () => {
  await logout();
  router.push('/login');
};
```

## Security Notes

- Passwords are currently stored in plain text (for development only)
- In production, implement proper password hashing
- Consider implementing JWT tokens for stateless authentication
- Add rate limiting to prevent brute force attacks
- Implement session management and token refresh