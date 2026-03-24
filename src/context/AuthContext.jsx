import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
export const AuthDataContext = createContext();

const AuthContext = ({children}) => {

    const [userData, setUserData] = useState({})
    const navigate = useNavigate();
    const login = async (state, credentials) => {
        try {
            // const {data} = await axios.post(`/api/auth/${state}`, credentials);
            // console.log(data)
            if(credentials.email == "aditya828326@gmail.com" && credentials.password == "aditya@123"){           
            setUserData(credentials)
            toast("Logged in successfully")
            navigate("/")
            } else {
                toast.error("Invalid credentials")
            }
        } catch (error) {
            // console.log(error.message)
            toast.error(error.message)
        }
    }

    const logout = () => {
          setUserData(null)
          toast("Logout Successfully")
          navigate("/login")

    }

    useEffect(() => {
      setUserData(null)
      navigate("/")
    }, [])
    

    const value = {
        userData, setUserData, login, logout
    }

  return (
    <AuthDataContext.Provider value={value}>
        {children}
    </AuthDataContext.Provider>
  )
}

export default AuthContext