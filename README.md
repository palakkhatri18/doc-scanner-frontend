Doc Scanner App – Frontend : https://doc-scanner-frontend.vercel.app/

The backend for this project is available here:
https://github.com/palakkhatri18/doc-scanner-backend


This repository contains the frontend of the Doc Scanner App, a web application that allows users to:

Sign up and log in securely

Upload document images (PNG/JPG)

Preview the original document

Send the document for scanning

View the scanned (perspective-corrected) output

This frontend is built using React and integrates with Firebase, Cloudinary, and a FastAPI backend.

🧠 Why This Project?

The goal of this project is to simulate a real-world document scanning application like CamScanner or Adobe Scan, where:

Users authenticate securely

Images are uploaded to cloud storage

A backend service processes images

Results are shown back to the user

This frontend focuses on:

Clean UI

Clear user flow

Beginner-friendly architecture

Separation of concerns (auth, upload, styling)

🛠️ Tech Stack Used (and Why)
1️⃣ React (Frontend Framework)

Used to build a component-based UI

Makes it easy to manage state (logged in user, file, preview)

Allows dynamic updates without reloading the page

2️⃣ Firebase Authentication

Handles Signup and Login

Secure and production-ready

No need to build a custom auth backend

3️⃣ Firebase Firestore

Stores metadata like:

User ID

Original image URL

Scanned image URL

Upload timestamps

4️⃣ Cloudinary

Used to upload and host images

Provides public image URLs

Faster and safer than uploading images directly to backend

5️⃣ FastAPI Backend (Connected via API)

Receives image URL

Performs document scanning

Returns processed image URL


🔐 Authentication Workflow (Signup & Login)
Why Authentication?

Authentication ensures:

Each user has their own uploads

Secure access to scanning features

How It Works:

User opens the app

If not logged in, the Auth component is shown

Auth toggles between:

Login form

Signup form

Firebase Authentication handles:

User creation

Login verification

Once logged in:

Firebase returns a user object

App switches to the upload screen

🖼️ Upload & Scan Workflow (Core Feature)
Step-by-Step Flow
1️⃣ Select File

User selects an image file

A preview is shown immediately

This improves user confidence before uploading

2️⃣ Upload to Cloudinary

Image is uploaded to Cloudinary

Cloudinary returns a public image URL

This avoids sending large files directly to backend

3️⃣ Send Image URL to Backend

Frontend sends JSON to backend:

{
  "image_url": "https://cloudinary.com/..."
}


Backend processes the image

4️⃣ Receive Scanned Image URL

Backend returns a scanned image URL

Frontend displays the scanned output

User can open the full scanned image in a new tab

5️⃣ Save Metadata to Firestore

Original image URL

Scanned image URL

User ID

Timestamp

🧩 How App.js Controls Everything

App.js is the central controller.

What it does:

Listens for Firebase auth changes

Shows:

Auth UI if user is not logged in

Upload UI if user is logged in

Displays user email and logout button

Manages global layout

🎨 UI & Responsiveness
Design Decisions:

Centered cards for clarity

Single auth card for better UX

Small image previews to avoid clutter

Responsive layout for mobile screens

Responsive Behavior:

Layout adjusts on small screens

Buttons become full-width on mobile

No unnecessary empty space

🌐 Environment & Configuration
Firebase

Firebase configuration is stored in firebase.js.
For demo purposes, Firebase keys are visible (frontend-only keys).

Backend URL

The frontend communicates with the deployed backend using:

https://doc-scanner-backend-ku8a.onrender.com/process

▶️ How to Run the Frontend Locally
# Install dependencies
npm install

# Start development server
npm start


App runs at:

http://localhost:3000

🚀 Deployment

The frontend can be deployed using:

Render

Vercel

Netlify

Steps:

Push repo to GitHub

Connect repo to hosting platform

Set build command:

npm run build


Set start command:

npm start

✅ Key Features Implemented

Firebase Authentication (Signup/Login)

Cloudinary image upload

FastAPI backend integration

Scanned image preview

Firestore metadata storage

Responsive UI

Clean and readable code structure

📌 Final Notes

This frontend is designed to:

Be easy to understand for beginners

Follow real-world application patterns

Be scalable for future features (OCR, history, downloads)
