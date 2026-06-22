import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContextValue"

export const useAuth = () => {
  return useContext(AuthContext)
}
