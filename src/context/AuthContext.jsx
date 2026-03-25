import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
export const AuthDataContext = createContext();

const AuthContext = ({children}) => {

    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("userData")) || null);
    const navigate = useNavigate();
    const login = async (state, credentials) => {
        try {
            // const {data} = await axios.post(`/api/auth/${state}`, credentials);
            // console.log(data)
            if(credentials.email == "aditya828326@gmail.com" && credentials.password == "aditya@123"){           
            setUserData(credentials)
            localStorage.setItem("userData", JSON.stringify(credentials))
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
            localStorage.removeItem("userData")
            navigate("/login")
            toast("Logout Successfully")

    }
  
    useEffect(() => {
        if(localStorage.getItem("userData")){
      setUserData(JSON.parse(localStorage.getItem("userData")) || null);
      navigate("/");
        } 
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