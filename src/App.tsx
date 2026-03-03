import { Routes, Route } from 'react-router-dom'
import Login from "./pages/Login"
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import Store from './pages/Store'
import Ranking from './pages/Ranking'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/store" element={<Store />} />
      <Route path="/ranking" element={<Ranking />} />
      <Route path="/" element={<Home />} />
    </Routes>
  )
}

export default App
