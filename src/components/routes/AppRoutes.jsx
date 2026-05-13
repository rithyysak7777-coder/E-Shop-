
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'

const AppRoutes = () => {
  return (
    <BrowserRouter>
        <Routes>

            {/* public route */}
            <Route path='/' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>


        </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes