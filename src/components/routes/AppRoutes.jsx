
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Dashboard from '../pages/dashboard/Dashboard'
// import PrivateRoute from './PrivateRoute'S
import AdminRoute from './AdminRoute'
import NotFound from '../pages/errors/NotFound'
import AdminLayout from '../layouts/AdminLayout'

const AppRoutes = () => {
  return (
    <BrowserRouter>
        <Routes>

            {/* public route */}
            <Route path='/' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>

            <Route path='/login' element={<Login/>}/>

            {/* dashboard */}
            <Route path='/dashboard' element={
              <AdminRoute>
                  <AdminLayout/>
              </AdminRoute>
            }/>

            {/* Not Found page */}
            <Route path='*' element={<NotFound/>} />

        </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes