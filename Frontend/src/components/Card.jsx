import React, { useContext } from 'react'
import { userDataContext } from '../context/userContext'

const Card = ({image}) => {
      const {serverUrl,userData,setUserData,frontendImage,setFrontendImage,backendImage,setBackendImage,selectedImage,SetSelectedImage} =useContext(userDataContext)
  return (
    <div className={`w-[100px] h-[150px] lg:w-[200px] lg:h-[300px] bg-[#04043b] border-2 border-[white] overflow-hidden hover:border-4 hover:border-blue-500 cursor-pointer ${selectedImage==image?"border-4 border-blue-500" : null}`} onClick={()=>{SetSelectedImage(image)
      setBackendImage(null)
      setFrontendImage(null)
    }}>

            <img src={image} className='h-full object-cover'/>

    </div>
  )
}

export default Card
