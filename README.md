# Personal Finance Tracker

A modern, full-featured personal finance tracking application built with React, Redux, and Axios.

**🌐 Live Application:** https://finotreasuryx.onrender.com

## Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Transaction Management**: Add, edit, and delete income and expense transactions
- **Budget Tracking**: Set budgets for different categories and track spending
- **Visual Analytics**: Charts and graphs to visualize your financial data
- **Financial Reports**: Comprehensive reports with category breakdowns and insights
- **Responsive Design**: Beautiful, modern UI that works on all devices

## Tech Stack

- **Frontend**: React 19
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios with interceptors
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosInstance.js          # Axios instance with interceptors
│   ├── components/
│   │   ├── Navbar.jsx                # Navigation component
│   │   ├── TransactionForm.jsx       # Add/edit transaction form
│   │   ├── TransactionList.jsx       # Display transactions
│   │   ├── BudgetSummary.jsx         # Financial summary cards
│   │   └── ChartDashboard.jsx        # Expense charts
│   ├── pages/
│   │   ├── Login.jsx                 # Login page
│   │   ├── Register.jsx              # Registration page
│   │   ├── Dashboard.jsx             # Main dashboard
│   │   └── Reports.jsx               # Financial reports
│   ├── store/
│   │   ├── index.js                  # Redux store configuration
│   │   └── slices/
│   │       ├── authSlice.js          # Auth state management
│   │       ├── transactionSlice.js   # Transaction state
│   │       └── budgetSlice.js        # Budget state
│   ├── hooks/
│   │   └── useAuth.js                # Custom auth hook
│   ├── App.jsx                       # Main app component with routing
│   ├── main.jsx                      # Entry point
│   └── index.css                     # Tailwind CSS imports
├── package.json
├── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v20.19+ or v22.12+)
- npm or yarn

### Installation

1. Clone the repository:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `env.example` to `.env.local`
   - Update `VITE_API_BASE_URL` if your backend runs on a different host
   - See `RENDER_DEPLOYMENT.md` for Render-specific settings

Tailwind CSS is already configured in `tailwind.config.js` and `postcss.config.js` with custom colors and responsive settings.

### Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## API Integration

This application expects a Django REST Framework backend with the following endpoints:

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/token/refresh/` - Refresh JWT token
- `GET /api/auth/user/` - Get current user

### Transactions
- `GET /api/transactions/` - List transactions
- `POST /api/transactions/` - Create transaction
- `PUT /api/transactions/:id/` - Update transaction
- `DELETE /api/transactions/:id/` - Delete transaction

### Budgets
- `GET /api/budgets/` - List budgets
- `POST /api/budgets/` - Create budget
- `PUT /api/budgets/:id/` - Update budget
- `DELETE /api/budgets/:id/` - Delete budget

## Features in Detail

### Dashboard
- Overview of income, expenses, and balance
- Budget progress tracking
- Visual charts for spending by category
- Recent transactions list
- Quick add transaction button

### Reports
- Time range filters (7 days, 30 days, 90 days, 1 year)
- Top expense categories
- Top transactions
- Financial statistics

### Authentication
- JWT-based authentication
- Protected routes
- Automatic token refresh
- Session persistence

## Development

### State Management

The app uses Redux Toolkit for state management with three main slices:
- `authSlice`: Handles authentication state
- `transactionSlice`: Manages transaction CRUD operations
- `budgetSlice`: Manages budget CRUD operations

### Custom Hooks

- `useAuth`: Manages authentication state and session restoration

### Styling

- **Tailwind CSS v4** - Utility-first CSS framework
- Gradient backgrounds and smooth animations
- Fully responsive design with mobile-first approach
- Custom color palette with Indigo and Purple themes
- No custom CSS files - all styling via Tailwind utility classes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
