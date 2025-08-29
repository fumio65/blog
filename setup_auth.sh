#!/bin/bash

echo "Setting up JWT Authentication for Blog Project"
echo "=============================================="

# Navigate to backend directory
cd backend

echo "1. Installing Python dependencies..."
pip install -r requirements.txt

echo "2. Creating and running migrations..."
python manage.py makemigrations user
python manage.py makemigrations
python manage.py migrate

echo "3. Creating superuser (optional)..."
echo "You can create a superuser now or skip this step."
read -p "Do you want to create a superuser? (y/n): " create_superuser

if [ "$create_superuser" = "y" ] || [ "$create_superuser" = "Y" ]; then
    python manage.py createsuperuser
fi

echo ""
echo "Setup completed successfully!"
echo ""
echo "To start the development servers:"
echo "1. Backend: cd backend && python manage.py runserver"
echo "2. Frontend: cd frontend && npm run dev"
echo ""
echo "Available endpoints:"
echo "- POST /api/auth/register/ - User registration"
echo "- POST /api/auth/login/ - User login"
echo "- POST /api/auth/logout/ - User logout"
echo "- GET /api/auth/profile/ - Get user profile"
echo "- PATCH /api/auth/profile/ - Update user profile"
echo "- POST /api/auth/token/refresh/ - Refresh JWT token"