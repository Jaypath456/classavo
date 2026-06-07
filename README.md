# Classavo LMS

A small Learning Management System built for the Classavo Software Developer Intern assignment.

## Tech Stack

- Backend: Django, Django REST Framework, SimpleJWT
- Frontend: React, React Router, Plate.js, Axios
- Database: SQLite for local development

## Features

### Instructor

- Register and log in as an instructor
- Create, edit, publish, unpublish, and delete courses
- Create, edit, and delete chapters inside a course
- Write chapter content with a Plate.js rich text editor
- Mark each chapter as public or private
- See course chapter and enrollment counts

### Student

- Register and log in as a student
- Browse published courses
- Join a published course
- View joined courses
- Read public chapters from courses they have joined
- Private chapters and unjoined course content are blocked by the backend

## Project Structure

```text
backend/
  lms_project/      Django project settings and URLs
  users/            Custom user model, auth endpoints, serializers
  courses/          Course, chapter, enrollment models and APIs
frontend/
  src/
    api/            Axios API client
    components/     Navbar, protected routes, Plate editor
    context/        Auth state
    pages/          Auth, instructor, and student screens
```

## Setup

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The API runs at `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
npm start
```

The React app runs at `http://localhost:3000`.

## Useful API Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register/` | Register instructor or student |
| POST | `/api/auth/login/` | Log in and receive JWT tokens |
| GET | `/api/auth/me/` | Validate token and fetch current user |
| GET | `/api/courses/` | List published courses |
| GET | `/api/courses/mine/` | Instructor course list |
| POST | `/api/courses/create/` | Instructor creates course |
| GET/PUT/DELETE | `/api/courses/{id}/` | Course detail and management |
| POST | `/api/courses/{id}/enroll/` | Student joins course |
| GET | `/api/courses/{id}/chapters/` | List visible chapter metadata |
| POST | `/api/courses/{id}/chapters/create/` | Instructor creates chapter |
| GET/PUT/DELETE | `/api/chapters/{id}/` | Read or manage chapter |
| GET | `/api/my-courses/` | Student joined courses |

## Notes

- Access tokens are stored in `sessionStorage`, not `localStorage`.
- Django is the source of truth for authentication and permissions.
- Chapter content is stored as JSON in the database.
- This project intentionally keeps the UI and API simple for a short coding assignment.
