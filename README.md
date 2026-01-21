# 🏨 Hotel Booking Platform – Full Stack Web Application

A full-stack hotel booking platform that allows users to browse hotels, view detailed information, book rooms securely, and manage their bookings. The platform also includes an admin dashboard for hotel and booking management, email notifications, and Stripe payment integration.

This project is built to simulate a real-world production-level booking system, focusing on clean architecture, authentication, and scalability.

---

## 🚀 Live Demo

- 🔗 **Live Website:** https://hotel-booking-beta-ochre.vercel.app/
- 🔗 **GitHub Repository:** [https://github.com/nitesh45176/Hotel-booking](https://github.com/nitesh45176/Hotel-booking)

---

## 🧠 Problem It Solves

Booking hotels online often involves:
- Confusing user interfaces
- Lack of booking transparency
- No centralized booking management
- Poor admin control
- Missing payment and email confirmation

**This platform solves these problems by providing:**
- A clean, modern UI for hotel discovery
- Secure user authentication
- Real-time booking management
- Automated email confirmations
- Secure online payments

---

## ✨ Key Features

### 👤 User Features
- User authentication using **JWT**
- Browse and search hotels
- View hotel details (images, pricing, amenities)
- Book hotels with selected dates
- Secure online payment via **Stripe**
- View all bookings in **My Bookings**
- Receive booking confirmation emails

### 🏨 Admin Features
- Admin dashboard
- Add, update, and delete hotels
- Manage users and bookings
- View booking analytics
- Control platform data from a single interface

### 🔐 Authentication & Security
- Authentication using **JWT** (Frontend + Backend)
- Protected routes for users and admins
- Secure JWT-based backend authorization
- Role-based access control

### 💳 Payment & Email
- **Stripe** payment gateway integration
- Booking confirmation email after successful payment
- Email notifications for booking events

---

## 🧩 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router
- Jwt Authentication
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Stripe API
- Resend (Email)

### Deployment
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

---

## 📂 Project Structure
```


├── client/
│   ├── components/
│   ├── pages/
│   ├── context/
│   └── services/
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── utils/
│
└── README.md
```

---

## 🛠️ How to Run Locally

### 1️⃣ Clone the repository
```bash
git clone https://github.com/nitesh45176/Hotel-booking.git

```

### 2️⃣ Setup Backend
```bash
cd server
npm install
```

Start backend:
```bash
npm run dev
```

### 3️⃣ Setup Frontend
```bash
cd client
npm install
npm run dev
```

---

## 📬 Booking Email Flow

1. User completes booking
2. Payment verified via Stripe
3. Booking stored in database
4. Confirmation email sent automatically

---

## 📈 Learning Outcomes

- Implemented real-world authentication using **JWT**
- Built scalable REST APIs
- Integrated **Stripe** payments
- Designed admin dashboards
- Managed complex frontend-backend integration
- Learned production-level project structure

---

## ⚠️ Limitations

- No hotel reviews yet
- No cancellation refund logic
- No real-time booking updates

---

## 🔮 Future Enhancements

- Hotel reviews & ratings
- Refund and cancellation system
- Advanced search & filters
- Real-time notifications
- Role-based admin permissions

---

## 👨‍💻 Author

**Nitesh Mishra**

- GitHub: [https://github.com/nitesh45176](https://github.com/nitesh45176)
- LinkedIn: [https://linkedin.com/in/nitesh-mishra-368662321](https://linkedin.com/in/nitesh-mishra-368662321)

---

## ⭐ Support

If you found this project helpful, please ⭐ the repository — it really helps!

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
