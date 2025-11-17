# Login Information

## How to Access Username and Password

### Method 1: Register a New Account (Recommended)

1. **Start the Backend Server** (if not running):
   ```bash
   cd ../backend
   python manage.py runserver
   ```

2. **Start the Frontend** (if not running):
   ```bash
   cd ../frontend
   npm run dev
   ```

3. **Register Your Account**:
   - Open browser: `http://localhost:5173/register`
   - Fill in:
     - **Username**: Your choice (e.g., `testuser`)
     - **Email**: Your email (e.g., `test@example.com`)
     - **Password**: At least 6 characters (e.g., `password123`)
     - **Confirm Password**: Same password
   - Click "Sign Up"
   - You'll be automatically logged in!

4. **Login Later**:
   - Go to `http://localhost:5173/login`
   - Use the same credentials you registered with

### Method 2: Create via Django Shell

If you want to create a test user programmatically:

```bash
cd ../backend
python manage.py shell
```

Then in the shell:
```python
from api.models import CustomUser
CustomUser.objects.create_user(username='testuser', email='test@example.com', password='testpass123')
exit()
```

### Current Backend Configuration

**Backend URL**: `http://127.0.0.1:8000`

**Available Endpoints**:
- `GET /api/hello/` - Test endpoint
- `POST /api/signup/` - User registration

**Expected Registration Payload**:
```json
{
  "username": "your_username",
  "email": "your@email.com",
  "password": "your_password"
}
```

### Backend Setup Status

**Note**: Your Django backend is set up with:
- ✅ Custom User model (`api.CustomUser`)
- ✅ User Registration endpoint (`/api/signup/`)
- ✅ CORS enabled for frontend
- ✅ Django REST Framework

**Authentication Status**:
- ⚠️ **JWT Authentication not yet configured**
- ⚠️ Currently using simple registration only
- ⚠️ Login endpoint needs to be added to backend

### Next Steps for Full Authentication

To enable JWT-based login/logout, you need to:

1. **Install djangorestframework-simplejwt**:
   ```bash
   pip install djangorestframework-simplejwt
   ```

2. **Update Django settings** to include JWT:
   ```python
   # In backend/Finance/settings.py
   INSTALLED_APPS = [
       # ... existing apps
       'rest_framework_simplejwt',
   ]
   
   REST_FRAMEWORK = {
       'DEFAULT_AUTHENTICATION_CLASSES': (
           'rest_framework_simplejwt.authentication.JWTAuthentication',
       ),
   }
   ```

3. **Add JWT URLs**:
   ```python
   # In backend/api/urls.py
   from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
   
   urlpatterns = [
       path('auth/login/', TokenObtainPairView.as_view()),
       path('auth/refresh/', TokenRefreshView.as_view()),
       # ... other URLs
   ]
   ```

### Troubleshooting

**"Cannot connect to backend"**:
- Make sure Django server is running: `python manage.py runserver`
- Check it's on port 8000: `http://localhost:8000`
- Verify CORS settings in `backend/Finance/settings.py`

**"Registration not working"**:
- Check Django console for errors
- Verify database migrations: `python manage.py migrate`
- Check browser console for API errors

**Current User Table**:
- Check existing users: `python manage.py shell`
- Then: `from api.models import CustomUser; CustomUser.objects.all()`

### Security Notes

- Passwords are hashed using Django's password hasher
- Never store passwords in plain text
- The CustomUser model extends Django's AbstractUser
- Username is used for login (can be changed to email)
