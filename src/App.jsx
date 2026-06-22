import AppRoutes from './components/routes/AppRoutes'
import { CartProvider } from './components/contexts/CartContext'

const App = () => {
  return (
    <CartProvider>
      <AppRoutes/>
    </CartProvider>
  )
}

export default App