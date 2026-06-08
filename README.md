# Classavo LMS

A Learning Management System built for Classavo.

## Tech Stack

- **Backend:** Django, Django REST Framework, SimpleJWT
- **Frontend:** React, React Router, Plate.js, Axios
- **Database:** PostgreSQL

## Features

### Instructor

- Register and log in as an instructor
- Create, edit, publish, unpublish, and delete courses
- Create, edit, and delete chapters inside a course
- Write chapter content with a Plate.js rich text editor
- Mark each chapter as public or private
- View enrollment counts and access a detailed list of enrolled students with contact details
- "Save as Draft" functionality for form progress

### Student

- Register and log in as a student
- Browse published courses
- Join/Unenroll from a published course
- View joined courses
- Read public chapters from courses they have joined
- Private chapters and unjoined course content are restricted by backend permissions

## Project Structure

```text
backend/
  lms_project/      Django project settings and URLs
  users/            Custom user model, auth endpoints, serializers
  courses/          Course, chapter, enrollment models and APIs
  
frontend/
  src/
    api/            Axios API client
    components/     Navbar, protected routes, Plate editor, BackButton
    context/        Auth state
    pages/          Auth, instructor, and student screens
    utils/          Form helper utilities

## Configuration

This project uses environment variables to manage the API connection, ensuring the application remains environment-agnostic.

1. Create a `.env` file in the `frontend/` directory.
2. Copy the contents of `.env.example` into your new `.env` file.
3. Set `REACT_APP_API_URL` to your backend endpoint (e.g., `http://localhost:8000/api`).

## Key Features

### Instructor

**Course Management:** Create, publish/unpublish, and manage course lifecycles.

**Content Creation:** Utilize the Plate.js rich-text editor for detailed chapter content.

**Reporting:** View real-time enrollment counts and generate detailed student lists.

**Form Intelligence:** Built-in "Save as Draft" functionality for course/chapter forms, powered by `sessionStorage`.

### Student

**Catalog Browsing:** View and search published courses.

**Enrollment:** Join or unenroll from courses seamlessly.

**Access Control:** Content access is strictly enforced by backend permissions—only enrolled students can read chapter content.

## API Highlights

**Parallel Data Fetching:** Frontend utilizes `Promise.all` to minimize load times by fetching course, chapter, and enrollment data concurrently.

**Role-Based Access Control (RBAC):** All API endpoints are protected by JWT authentication and custom permission classes to ensure data security.

**Dirty-State Tracking:** Custom hooks monitor form modifications to prevent accidental data loss.