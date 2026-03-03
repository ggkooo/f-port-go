import { Routes, Route } from 'react-router-dom'
import Login from "./pages/Login"
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/" element={<Home />} />
    </Routes>
  )
}

export default App
