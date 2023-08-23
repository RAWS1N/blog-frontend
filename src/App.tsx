import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar/Navbar'
import Home from './pages/Home'
import BlogWriter from './pages/BlogWriter'
import Signin from './pages/Siginin'
import Signup from './pages/Signup'
import { Toaster } from 'react-hot-toast'
import SingleBlog from './components/singleBlog/SingleBlog'
import BlogEditor from './pages/BlogEditor'
import Profile from './pages/Profile'
import ProtectedRoute from './utils/ProtectedRoute'
import AuthProvider from './context/AuthContext'



const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/write" element={<BlogWriter />} />

        <Route path="/edit/:id" element={
          <ProtectedRoute>
            <BlogEditor />
          </ProtectedRoute>}
        />

        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/blog/:id" element={<SingleBlog />} />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

      </Routes>
      <Toaster />
      </AuthProvider>
    </BrowserRouter>

  )
}

export default App