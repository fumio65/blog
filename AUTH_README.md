# JWT Authentication Implementation

This document describes the JWT authentication system implemented for the blog project.

## Features Implemented

### Backend (Django)
- **Custom User Model**: Extended AbstractUser with additional fields (bio, avatar, etc.)
- **JWT Authentication**: Using `djangorestframework-simplejwt`
- **User Registration**: Complete signup flow with validation
- **User Login**: Email-based authentication
- **User Profile**: View and update user profile
- **Token Refresh**: Automatic token refresh mechanism
- **Logout**: Token blacklisting on logout

### Frontend (React)
- **Authentication Context**: Global state management for user authentication
- **Login Component**: User-friendly login form
- **Register Component**: Complete registration form with validation
- **Profile Component**: View and edit user profile
- **Protected Routes**: Route protection for authenticated users
- **Navbar**: Dynamic navigation based on authentication status
- **Token Management**: Automatic token refresh and storage

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/profile/` - Get user profile
- `PATCH /api/auth/profile/` - Update user profile
- `POST /api/auth/token/refresh/` - Refresh JWT token

## User Model Fields

```python
class User(AbstractUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    bio = models.TextField(max_length=500, blank=True)
    avatar = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Run Migrations**:
   ```bash
   python manage.py makemigrations user
   python manage.py migrate
   ```

3. **Create Superuser** (optional):
   ```bash
   python manage.py createsuperuser
   ```

4. **Start Development Servers**:
   ```bash
   # Backend
   cd backend
   python manage.py runserver
   
   # Frontend (in another terminal)
   cd frontend
   npm run dev
   ```

## Frontend Routes

- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/profile` - User profile (protected)
- `/blog/:id` - Blog view page

## JWT Configuration

The JWT tokens are configured with:
- **Access Token Lifetime**: 60 minutes
- **Refresh Token Lifetime**: 7 days
- **Token Rotation**: Enabled
- **Blacklist After Rotation**: Enabled

## Security Features

1. **Password Validation**: Django's built-in password validators
2. **Email Uniqueness**: Email addresses must be unique
3. **Token Blacklisting**: Logout invalidates refresh tokens
4. **Automatic Token Refresh**: Frontend automatically refreshes expired tokens
5. **Protected Routes**: Authentication required for sensitive pages

## Usage Examples

### Registration
```javascript
const userData = {
  username: 'johndoe',
  email: 'john@example.com',
  first_name: 'John',
  last_name: 'Doe',
  password: 'securepassword123',
  password_confirm: 'securepassword123',
  bio: 'Software developer'
};

const response = await register(userData);
```

### Login
```javascript
const credentials = {
  email: 'john@example.com',
  password: 'securepassword123'
};

const response = await login(credentials);
```

### Using Protected API Endpoints
```javascript
// Token is automatically added to requests
const blogs = await getBlogs();
const profile = await getUserProfile();
```

## Error Handling

The system includes comprehensive error handling:
- **Frontend**: User-friendly error messages and validation
- **Backend**: Proper HTTP status codes and error responses
- **Token Refresh**: Automatic handling of expired tokens

## Next Steps

To further enhance the authentication system, consider:
1. Email verification for new registrations
2. Password reset functionality
3. Social authentication (Google, GitHub, etc.)
4. Two-factor authentication
5. User roles and permissions
6. Account deactivation/deletion