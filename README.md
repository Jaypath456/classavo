# Classavo LMS

A simple Learning Management System built with Django REST Framework + React.

## Tech Stack
- **Backend**: Django + Django REST Framework + SimpleJWT
- **Frontend**: React (Create React App) + Slate.js (Plate.js-compatible editor) + React Router

---

## Project Structure

```
lms/
├── backend/          # Django project
│   ├── lms_project/  # Main Django config (settings, urls)
│   ├── users/        # User model + auth (register, login)
│   ├── courses/      # Course, Chapter, Enrollment models + API
│   ├── manage.py
│   └── requirements.txt
└── frontend/         # React app
    └── src/
        ├── api/          # axios instance
        ├── components/   # Navbar, PlateEditor, ProtectedRoute
        ├── context/      # AuthContext (JWT storage)
        └── pages/
            ├── auth/         # Login, Register
            ├── instructor/   # Dashboard, CourseList, CourseForm, CourseDetail, ChapterForm
            └── student/      # Catalog, MyCourses, CourseView, ChapterReader
```

---

## Setup & Running

### Backend

```bash
cd backend

# Create and activate virtual environment (if not already done)
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# (Optional) create an admin user
python manage.py createsuperuser

# Start the server
python manage.py runserver
```

Backend runs at: http://localhost:8000

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at: http://localhost:3000

---

## Features

### Instructor
- Register/login as instructor
- Create and manage courses (with publish/unpublish toggle)
- Add chapters to courses using the rich text editor
- Set each chapter as **public** or **private**
- View enrolled student count per course

### Student
- Register/login as student
- Browse all published courses
- Join/enroll in a course
- Read public chapters via the chapter reader

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/login/` | Login, returns JWT |
| GET | `/api/auth/me/` | Get current user |
| GET | `/api/courses/` | All published courses |
| GET | `/api/courses/mine/` | Instructor's courses |
| POST | `/api/courses/create/` | Create a course |
| GET/PUT/DELETE | `/api/courses/{id}/` | Course CRUD |
| POST | `/api/courses/{id}/enroll/` | Student enroll |
| GET | `/api/courses/{id}/enrollment-status/` | Check if enrolled |
| GET | `/api/courses/{id}/chapters/` | List chapters |
| POST | `/api/courses/{id}/chapters/create/` | Create chapter |
| GET/PUT/DELETE | `/api/chapters/{id}/` | Chapter CRUD |
| GET | `/api/my-courses/` | Student's enrolled courses |

---

## Notes on the Editor

The chapter editor uses **Slate.js** (which Plate.js is built on top of). Chapter content is stored as a **JSON document tree** in the database (`JSONField`), the same format Plate.js uses. This makes it easy to swap in the full Plate.js UI library later without changing the data model.

Supported formatting: Bold, Italic, Underline, Inline Code, H1, H2, Bullet List, Numbered List, Block Quote.

---

## Known Issues / Intentional Simplifications

- No pagination on the course catalog (fine for demo scale)
- The `order_index` field for chapters must be set manually; there's no drag-to-reorder UI
- No image upload support in the editor
- JWT refresh token rotation is not implemented (access token lasts 24h for demo convenience)
