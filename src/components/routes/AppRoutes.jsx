
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Dashboard from '../pages/dashboard/Dashboard'

const AppRoutes = () => {
  return (
    <BrowserRouter>
        <Routes>

            {/* public route */}
            <Route path='/' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>

            {/* dashboard */}
            <Route path='/dashboard' element={<Dashboard/>}/>


        </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes