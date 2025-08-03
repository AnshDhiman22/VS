import React, { createContext, useEffect, useState } from 'react'
import axios from "axios"
export const userDataContext = createContext()

const UserContext = ({ children }) => {
    const serverUrl="https://vs-backend-mb3v.onrender.com"
    const [userData,setUserData] = useState(null)
    const [frontendImage,setFrontendImage] = useState(null)
    const [backendImage,setBackendImage] = useState(null)
    const [selectedImage,SetSelectedImage] =useState(null)
    const handleCurrentUser = async ()=> {
        try {
            const result = await axios.get(`${serverUrl}/api/user/current`, {withCredentials:true})
            setUserData(result.data)
            console.log(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getGeminiResponse = async (command)=>{
        try {
            console.log(command)
            const result = await axios.post(`${serverUrl}/api/user/asktoassistant`,{command},{withCredentials:true})
            return result.data
        } catch (error) {
            console.log("error")
        }
    }

     useEffect(()=>{
      handleCurrentUser()
     },[])

    const value={
       serverUrl,userData,setUserData,frontendImage,setFrontendImage,backendImage,setBackendImage,selectedImage,SetSelectedImage,getGeminiResponse
    }
    return (
        <div>
            <userDataContext.Provider value={value}>
                {children}
            </userDataContext.Provider>

        </div>
    )
}

export default UserContext
