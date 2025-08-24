# Rating-App
“Full-stack web app for rating stores with role-based access for admins, users, and store owners.”
# Store Ratings Web Application

Welcome to **Store Ratings**! A full-stack web application that allows users to submit ratings for registered stores. The platform provides role-based access for administrators, normal users, and store owners.

---

## Tech Stack
- **Backend:** Express.js (or Loopback/NestJS)  
- **Database:** PostgreSQL / MySQL  
- **Frontend:** React.js  

---

## Features & Functionality

### System Administrator
- Add new stores, normal users, and admin users.
- Dashboard displaying:
  - Total users
  - Total stores
  - Total submitted ratings
- Manage users:
  - View user list (Name, Email, Address, Role)
  - View user details (Store Owner rating included)
  - Apply filters (Name, Email, Address, Role)
- Manage stores:
  - View store list (Name, Email, Address, Rating)
- Logout functionality

### Normal User
- Sign up and log in to the platform
- Update password
- View and search store listings by Name & Address
- Submit ratings (1–5) and modify their submitted ratings
- Store listings display:
  - Store Name
  - Address
  - Overall Rating
  - User's Submitted Rating
- Logout functionality

### Store Owner
- Log in to the platform
- Update password
- Dashboard functionalities:
  - View users who rated their store
  - View average rating of their store
- Logout functionality

---

## Form Validations
- **Name:** Min 20 characters, Max 60 characters  
- **Address:** Max 400 characters  
- **Password:** 8–16 characters, must include at least one uppercase letter and one special character  
- **Email:** Standard email format validation  

---

## Additional Notes
- Sorting supported for tables (ascending/descending) on key fields like Name, Email  
- Best practices followed for frontend and backend development  
- Database schema designed according to best practices  

---

## Demo Credentials
- **Admin (seed):** `admin@sys.com` / `Admin@123`  
- **Owner example (seed):** `owner@shop.com` / `Owner@123`  

---

## How to Run
1. Clone the repository:
   ```bash
   git clone https://github.com/AayushSingatkar2004/Rating-App.git
   cd Rating-App
