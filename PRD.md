---

Product Requirements Document (PRD)

Product Name

Doubt Desk


---

1. Objective

Build a web platform where:

Instructors upload course transcripts (SRT files).

Students can view available courses.

Students request access to courses.

Instructors approve or reject access.

Approved students can ask doubts.

The system answers strictly using transcript content.

Every answer includes timestamp references.

No hallucination is allowed.


Accuracy and access control are top priority.


---

2. Target Users

Instructor

Logs in via Google

Creates and manages courses

Uploads transcripts

Reviews and approves/rejects student access requests

Monitors Q&A activity


Student

Logs in via Google

Views all available courses

Requests access

Asks doubts (if approved)

Receives timestamp-grounded answers



---

3. Core Features (MVP Scope)

3.1 Authentication

Google login via Auth.js

Users stored in database

Default role: student

Instructor role assigned manually in DB



---

3.2 Course Management (Instructor Only)

Instructor can:

Create a course (name required)

View own courses

Upload transcript files


Validation:

Only users with role = instructor can create courses

Only course owner can upload transcripts



---

3.3 Course Discovery (Student)

Students can:

View list of all available courses

See enrollment status per course:

Not Requested

Pending

Active

Rejected




---

3.4 Access Request Workflow

Student Flow:

Click “Enroll”

Enrollment record created with status = pending

Student cannot re-request if rejected


Instructor Flow:

View enrollments grouped by status

Approve → status becomes active

Reject → status becomes rejected


System Rules:

Only instructor can change enrollment status

Unique constraint: one enrollment per user per course

Only status = active allows Q&A access



---

3.5 Transcript Upload & Processing

Instructor uploads SRT file.

System:

Parses SRT

Merges subtitle blocks into logical chunks

Extracts:

startTime (seconds)

endTime (seconds)

content


Generates embeddings (Gemini)

Stores chunks with vector embeddings in Postgres (pgvector)


Processing happens asynchronously using Inngest.


---

3.6 Doubt Asking (Core AI Feature)

Student submits question for a course.

Backend Flow:

1. Authenticate user


2. Verify enrollment status = active


3. Generate embedding for question


4. Perform vector similarity search:

Filter by courseId

Retrieve top 5 transcript chunks



5. Send chunks + question to Gemini


6. Return:

Answer

Timestamp references

Supporting transcript snippets




Strict Grounding Rule: If answer not present in transcript excerpts, system must return: “This is not covered in the transcript.”

No external knowledge allowed.


---

4. Non-Functional Requirements

4.1 Accuracy

Low temperature for model

Strict system prompt

Always show supporting timestamps

No hallucinated content


4.2 Security

All API routes require authentication

Enrollment check required before RAG execution

Instructor ownership check before transcript upload

Vector search always scoped by courseId

No global vector search


4.3 Data Isolation

Transcript chunks isolated per course

Students cannot access non-enrolled courses

Cross-course leakage must not be possible



---

5. Database Model

User

id

email (unique)

role (student | instructor)


Course

id

name

description

instructorId


Enrollment

id

userId

courseId

status (pending | active | rejected)

unique(userId, courseId)


TranscriptChunk

id

courseId

startTime (seconds)

endTime (seconds)

content

embedding (vector)



---

6. System Architecture

Frontend: Next.js
Authentication: Auth.js (Google Provider)
Database: PostgreSQL + pgvector
AI: Gemini (free tier)
Background Jobs: Inngest

Flow:

Instructor Upload → Inngest → Parse + Embed → Store
Student Question → Enrollment Check → Vector Search → Gemini → Grounded Answer


---

7. API Endpoints

POST /api/courses

Create course (instructor only)


GET /api/courses

List all courses with enrollment status


POST /api/courses/[courseId]/enroll

Student requests access


GET /api/enrollments

Instructor views all enrollments


PATCH /api/enrollments/[enrollmentId]

Approve or reject access


POST /api/courses/[courseId]/upload

Upload transcript (instructor only)


POST /api/courses/[courseId]/chat

Ask doubt (active enrollment required)



---

8. Out of Scope (Not in MVP)

Payment integration

Video hosting

Udemy API integration

Email notifications

Analytics dashboard

Multi-instructor organizations

Agent frameworks

Hybrid search



---

9. Success Criteria

The product is successful if:

Instructor can create course and upload transcript

Student can request access

Instructor can approve or reject

Only approved students can ask doubts

Answers include correct timestamp references

Model refuses when answer is not in transcript

No cross-course data leakage occurs



---

10. Demo Script

1. Log in as instructor


2. Create course


3. Upload transcript


4. Log in as student


5. Request access


6. Approve access as instructor


7. Ask question as student


8. Show timestamp-grounded answer


9. Ask unrelated question


10. Show system refusal




---
