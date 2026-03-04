import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute, PublicRoute } from './components'
import Login from "./pages/Login"
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Home from './pages/Home'
import Store from './pages/Store'
import Ranking from './pages/Ranking'
import Calendar from './pages/Calendar'
import Settings from './pages/Settings'
import Questionnaire from './pages/Questionnaire'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute element={<Login />} />} />
      <Route path="/register" element={<PublicRoute element={<Register />} />} />
      <Route path="/forgot-password" element={<PublicRoute element={<ForgotPassword />} />} />
      <Route path="/reset-password" element={<PublicRoute element={<ResetPassword />} />} />
      <Route path="/store" element={<ProtectedRoute element={<Store />} />} />
      <Route path="/ranking" element={<ProtectedRoute element={<Ranking />} />} />
      <Route path="/calendar" element={<ProtectedRoute element={<Calendar />} />} />
      <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />
      <Route path="/questionnaire" element={<ProtectedRoute element={<Questionnaire />} />} />
      <Route path="/" element={<ProtectedRoute element={<Home />} />} />
    </Routes>
  )
}

export default App
