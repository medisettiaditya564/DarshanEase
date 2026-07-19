

# 🛕 DarshanEase – Smart Temple Darshan Booking & Management System

DarshanEase is a **full-stack MERN web application** designed to modernize temple visit management by allowing devotees to **book Darshan slots online, explore temples, and donate digitally**.

The system also provides **organizers with tools to manage temple schedules and bookings**, while **admins can monitor and manage the entire platform**.

DarshanEase bridges the gap between **traditional temple management systems and modern digital technology**, enabling devotees to experience a smoother and more organized spiritual journey.


---

# 📚 Project Documentation

Complete documentation including:

* System Architecture
* Diagrams
* Project Report
* Technical Documentation

👉 **Documentation Drive**

[https://drive.google.com/drive/folders/1IyEkKfrMh48te9qec6rgkzvSi5e0M9ZU?usp=drive_link](https://drive.google.com/drive/folders/10T3JQW8gM65rOyXdEmBOKn1YM8V8eayP)

---

# ✨ Key Features

## 🔐 Multi-Role Authentication

The system supports **secure login and role-based access control**.

Roles include:

* Devotee
* Organizer
* Admin

Security features include:

* JWT based authentication
* Password hashing using bcrypt
* Protected API routes
* Role-based authorization

---

# 🛕 Temple Discovery System

Devotees can explore temples and access detailed information.

Features include:

* Browse temples
* View temple details
* Temple images
* Location and timings
* Temple descriptions

---

# 🎟️ Darshan Slot Booking

The platform allows devotees to **book darshan slots digitally**.

Capabilities include:

* Select date and time slot
* Choose number of devotees
* Instant booking confirmation
* View booking history
* Cancel bookings
* Automatic slot availability update

---

# 💰 Temple Donation System

Devotees can donate to temples digitally.

Features include:

* Custom donation amounts
* Donation messages
* Transparent digital records

---

# 📊 Organizer Dashboard

Temple organizers can manage temple operations.

Functions include:

* Add temples
* Create darshan slots
* Manage temple schedules
* Track bookings

---

# 🛠️ Admin Control Panel

Admins have complete platform access.

Admin capabilities include:

* Manage users
* Manage organizers
* Monitor bookings
* View platform statistics
* Manage temples

---

# 🎨 User Interface

DarshanEase features a **modern temple-inspired design**.

UI Highlights:

* Responsive design
* Mobile friendly interface
* Clean navigation
* Dashboard based layout

---

# 🛠️ Technology Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* React Router DOM
* Axios
* Context API

---

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* bcrypt password hashing
* Morgan logging

---

# 📁 Project Structure

Based on the current repository layout:

DarshanEase
│
├── server                 # Backend (Node + Express)
│   ├── controllers        # Business logic
│   ├── middleware         # Authentication & authorization
│   ├── models             # MongoDB schemas
│   ├── routes             # API routes
│   ├── seed.js            # Database seed data
│   ├── server.js          # Express server entry
│   └── package.json
│
├── client                 # Frontend (Vite + React)
│   ├── public
│   ├── src                # React source files
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── Documentation          # Project documents and diagrams
│
├── DOCUMENTATION.md
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Install the following software:

* Node.js (v16 or higher)
* MongoDB Atlas
* Git

---

# Installation

### Clone the Repository

```
git clone <repository-url>
cd DarshanEase
```

---

### Install Backend Dependencies

```
cd server
npm install
```

---

### Install Frontend Dependencies

```
cd client
npm install
```

---

# Environment Variables

Create a `.env` file inside the **server/** directory:

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/darshanease
JWT_SECRET=darshanease_jwt_secret_key_2026
JWT_EXPIRE=30d
NODE_ENV=development

```

---

# Run the Application

### Start Backend

```
cd server
npm run dev
```

---

### Start Frontend

```
cd client
npm run dev
```

---

# Application URLs

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:5000
```

---

# 🔑 Dummy Credentials

Use these credentials to explore the platform.

### Admin

Email

```
admin@darshanease.com
```

Password 

```
Admin@123
```

---

### Organizer

Email

```
organizer@darshanease.com
```

Password

```
Org@123
```

---

### Devotee User

Email

```
user@darshanease.com
```

Password

```
User@123
```

---

# 👥 User Roles

| Role      | Permissions                                                 |
| --------- | ----------------------------------------------------------- |
| Devotee   | Browse temples, book darshan slots, cancel bookings, donate |
| Organizer | Manage temples, create slots, track bookings                |
| Admin     | Full platform management                                    |

---

# 🛡️ Security Features

DarshanEase follows industry best practices.

Security implementations include:

* JWT authentication
* Password hashing using bcrypt
* Role based access control
* Protected API routes
* Secure environment variables
* Input validation using Mongoose

---

# 📊 System Modules

The platform consists of the following modules:

1. User Authentication Module
2. Temple Management Module
3. Darshan Slot Booking Module
4. Donation Management Module
5. Organizer Dashboard
6. Admin Dashboard

---

# 📈 Future Enhancements

Future improvements may include:

* AI based crowd prediction
* Mobile application
* Multilingual support
* Virtual temple tours
* Integrated travel booking
* Pilgrimage route planning

---

# 👨‍💻 Project Team

### Developer
**Medisetti Pranav Aditya**  
*Solo Full-Stack Developer*

---

# 📄 License

This project is developed for **educational purposes** as part of the **Full Stack Development with MERN course**.

---

# 🙏 Acknowledgement

DarshanEase was developed to simplify the sacred experience of temple visits by integrating **modern web technologies with spiritual journey planning**.

The platform aims to create a **transparent, organized, and accessible temple booking system for devotees**.

---


