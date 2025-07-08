# E-ShoppingZone

## Overview
E-ShoppingZone is a full-featured e-commerce web application built with React and integrated with a Spring Boot backend. It provides functionalities for users to browse products, manage carts, place orders, and handle payments, while admins can manage products and orders. The application includes user authentication, profile management, and a responsive design using Tailwind CSS.

## Features
- User registration and login with JWT authentication.
- Product browsing and detailed views.
- Shopping cart management (add, update, remove, clear).
- Order placement and payment processing.
- Order history and details for users.
- Admin dashboard for managing products and orders.
- Profile management with update and delete options.

## Technologies Used
- **Frontend**: React, React Router, Tailwind CSS, Axios
- **State Management**: React Context API
- **Backend**: Spring Boot (assumed integration)
- **Authentication**: JWT
- **Build Tools**: React Scripts, Tailwind CSS, PostCSS, Autoprefixer

## Prerequisites
- Node.js and npm installed
- MySQL (for backend database, configure via backend settings)
- Backend server running on `http://localhost:8080`

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/e-shoppingzone.git
cd e-shoppingzone
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment
- Ensure the backend server is running on `http://localhost:8080`.
- Update `package.json` proxy if the backend URL differs.

### 4. Run the Application
```bash
npm start
```
Open `http://localhost:3000` in your browser.

## Usage
- Register or log in to access user features.
- Browse products, add to cart, and proceed to checkout.
- Admins can log in and manage products/orders via the admin dashboard.
- View order history and profile details.

## Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m "Add new feature"`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License
This project is currently unlicensed. Contact the maintainers for details.

## Contact
For issues or questions, open an issue on this repository or contact the project maintainers.