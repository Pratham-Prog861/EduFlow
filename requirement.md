# LMS SaaS - Requirements Document

## 1. Project Overview

Build a Learning Management System (LMS) SaaS platform where:

* Instructors can create and manage courses
* Students can enroll and consume course content
* Platform supports video-based learning and progress tracking

This is an MVP version with free enrollment (no payments).

---

## 2. Tech Stack

### Frontend

* Next.js (App Router)
* Tailwind CSS
* ShadCN UI

### Backend & Database

* Convex (functions, queries, mutations, database)

### Authentication

* Clerk (user authentication and session management)

### Storage

* Cloudinary (video + image upload)

### AI Integration

* Gemini API (for course summary generation)

---

## 3. User Roles

### 3.1 Student

* View courses
* Enroll in courses (free)
* Watch lectures
* Track progress

### 3.2 Instructor

* Create and manage courses
* Add sections and lectures
* Upload videos
* View created courses

---

## 4. Core Features

### 4.1 Authentication

* Clerk-based authentication
* Protected routes for dashboard
* Role-based access (student / instructor)

---

### 4.2 Course Management (Instructor)

* Create course:

  * Title
  * Description
  * Thumbnail (Cloudinary)
* Edit course
* List instructor courses

---

### 4.3 Course Content

* Create sections
* Create lectures inside sections
* Upload lecture video (Cloudinary)
* Store video URL

---

### 4.4 Course Browsing (Student)

* Public course listing page
* Course detail page
* Enroll in course (free)

---

### 4.5 Course Player

* Video player
* Lecture sidebar
* Mark lecture as completed
* Progress tracking per course

---

### 4.6 AI Course Summary

* Button to generate summary
* Send course content to Gemini API
* Display summary in UI

---

## 5. Database Schema (Convex)

### Users

* _id
* name
* email
* role ("student" | "instructor")

### Courses

* _id
* title
* description
* thumbnailUrl
* instructorId

### Sections

* _id
* courseId
* title
* order

### Lectures

* _id
* sectionId
* title
* videoUrl
* order
* duration

### Enrollments

* _id
* userId
* courseId

### Progress

* _id
* userId
* lectureId
* completed (boolean)

---

## 6. Routing Structure (Next.js App Router)

### Public Routes

* /
* /courses
* /courses/[courseId]

### Auth Routes

* /sign-in
* /sign-up

### Dashboard (Protected)

* /dashboard/student

* /dashboard/student/courses

* /dashboard/student/learn/[courseId]

* /dashboard/instructor

* /dashboard/instructor/courses

* /dashboard/instructor/courses/create

* /dashboard/instructor/courses/[courseId]

* /dashboard/instructor/courses/[courseId]/edit

* /dashboard/instructor/courses/[courseId]/content

---

## 7. UI Components (ShadCN)

Use:

* button, input, form, textarea
* card, table, badge
* dialog, dropdown-menu
* progress, accordion
* toast, skeleton

---

## 8. Functional Requirements

* Only authenticated users can access dashboard
* Only instructors can create/edit courses
* Students can only access enrolled courses
* Video URLs must be stored after upload
* Progress updates when lecture is marked completed

---

## 9. Non-Functional Requirements

* Responsive UI (mobile + desktop)
* Fast page load
* Clean component structure
* Feature-based folder organization

---

## 10. Constraints

* No payment integration in MVP
* Free enrollment only
* Focus on core LMS features first
