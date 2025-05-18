# Dimora Real Estate MERN Application

Dimora Real Estate is a full-stack web application for real estate listings, built with the MERN stack (MongoDB, Express, React, Node.js). It supports user authentication, property listing, admin dashboard, analytics, and more.

---

## 🚀 Features

- **User Authentication:** Register, login, and role-based access (admin, seller, contractor, customer).
- **Property Listings:** Create, view, edit, and delete real estate listings with images and map integration.
- **Admin Dashboard:** Manage users, view analytics, handle verification requests, and monitor security alerts.
- **Analytics:** Visualize user and listing data with charts.
- **Messaging:** Contact sellers via WhatsApp.
- **Responsive UI:** Modern, mobile-friendly design.
- **Testing:** Unit, integration, and E2E tests using Vitest and Cypress.

---

## 🛠️ Tech Stack

- **Frontend:** React, React Router, Redux, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT
- **File Storage:** Firebase Storage
- **Maps:** Leaflet.js
- **Testing:** Vitest, React Testing Library, Cypress, Supertest

---

## 📦 Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/dimora-realestate.git
   cd dimora-realestate
   ```

2. **Install dependencies for client and server:**
   ```sh
   cd client
   npm install
   cd ../server
   npm install
   ```

3. **Set up environment variables:**

   - Create `.env` files in both `client` and `server` directories.
   - Example for `server/.env`:
     ```
     MONGO_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     ```
   - Example for `client/.env`:
     ```
     REACT_APP_FIREBASE_API_KEY=your_firebase_key
     ```

4. **Start the development servers:**
   - In one terminal:
     ```sh
     cd server
     npm run dev
     ```
   - In another terminal:
     ```sh
     cd client
     npm start
     ```

5. **Visit the app:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)

---

## 🧪 Testing

### **Frontend Unit/Integration Tests**
```sh
cd client
npm run test
```
- Uses **Vitest** and **React Testing Library**.

### **Backend Tests**
```sh
cd server
npm run test
```
- Uses **Jest** and **Supertest**.

### **End-to-End (E2E) Tests**
```sh
npx cypress open
```
- Uses **Cypress**. Make sure both frontend and backend are running.

---

## 📁 Project Structure

```
DimoraRealestate/
├── client/         # React frontend
│   ├── src/
│   ├── public/
│   └── ...
├── server/         # Express backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── ...
├── README.md
└── ...
```

---

## 📝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgements

- [React](https://react.dev/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Leaflet](https://leafletjs.com/)
- [Firebase](https://firebase.google.com/)
- [Vitest](https://vitest.dev/)
- [Cypress](https://www.cypress.io/)

---

> **Dimora Real Estate** – Modern MERN stack real estate platform.
