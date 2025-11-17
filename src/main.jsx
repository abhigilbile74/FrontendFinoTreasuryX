import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { store } from './store'
import './index.css'
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute.jsx'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Reports from './pages/Reports'
import FinoTreasuryLanding from './pages/FinoTreasuryLanding'
import TransactionList from './components/TransactionList'
import BudgetOverview from './components/BudgetOverview'
import AnalyticsOverview from './components/AnalyticsOverview'
import Goals from './pages/Goals'
import ChatbotWidget from './components/ChatbotWidget.jsx'
import ChatbotPage from './chatbot/ChatbotPage'
import Investment from './pages/Investment'
import { Navigate } from 'react-router-dom'

// Build routes mirroring App.jsx
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PublicRoute>
        <FinoTreasuryLanding />
      </PublicRoute>
    ),
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
  {
    path: '/chatbot',
    element: (
      <ProtectedRoute>
        <ChatbotPage />
      </ProtectedRoute>
    ),
  },
  
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <TransactionList showAddButton={true} />
            <BudgetOverview />
          </div>
        ),
      },
      { path: 'transactionslist', element: <TransactionList showAddButton={true} /> },
      { path: 'budgetsoverview', element: <BudgetOverview /> },
      { path: 'analyticsoverview', element: <AnalyticsOverview /> },
      { path: 'goalslist', element: <Goals /> },
      { path: 'chatbot', element: <ChatbotPage /> },
      { path: 'investment', element: <Investment /> },
    ],
  },
  {
    path: '/reports',
    element: (
      <ProtectedRoute>
        <Reports />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to={localStorage.getItem('token') ? "/dashboard" : "/"} replace />,
  },
], { future: { v7_relativeSplatPath: true, v7_startTransition: true } });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
