import React, { useContext, useRef, useState } from 'react'
import Card from '../components/Card'
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.jpg"
import image4 from "../assets/image4.png"
import image5 from "../assets/image5.png"
import image6 from "../assets/image6.jpeg"
import image7 from "../assets/image7.jpeg"
import image3 from "../assets/authBg.png"
import { LuImagePlus } from "react-icons/lu";
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { IoArrowBack } from "react-icons/io5";
const Customize = () => {
  const {serverUrl,userData,setUserData,frontendImage,setFrontendImage,backendImage,setBackendImage,selectedImage,SetSelectedImage} =useContext(userDataContext)
  const inputImage = useRef()
  const navigate = useNavigate()

  const handleImage=(e)=>{
    const file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }
  return (
    <div className=' relative w-full h-[100vh] bg-gradient-to-t from-[black] to-[#000873] flex flex-col justify-center items-center gap-[20px] lg:p-[20px] lg:gap-[20px]'>
            <IoArrowBack className='absolute text-3xl text-white top-[30px] left-[30px] cursor-pointer' onClick={()=>navigate("/")}/>
      <h1 className='text-white text-[30px] lg:text-[40px]'>Select Your <span className='text-blue-500'>Assistant Iamge</span></h1>
      <div className='w-[90%] max-w-[60%] flex justify-center items-center flex-wrap gap-[20px] '>
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />
        <div className={`w-[100px] h-[150px] lg:w-[200px] lg:h-[300px] bg-[#04043b] border-2 border-[white] overflow-hidden hover:border-4 hover:border-blue-500 cursor-pointer flex justify-center items-center ${selectedImage=="input"?"border-4 border-blue-500" : null} `} onClick={()=>{
          inputImage.current.click()
          SetSelectedImage("input")
        }}>
          {!frontendImage && <LuImagePlus className='text-white w-[30px] h-[30px]' />}
          {frontendImage && <img src={frontendImage} className='h-full object-cover' /> }
          
        </div>
        <input type="file" accept='image/*' ref={inputImage} hidden onChange={handleImage}/>
      </div>
{selectedImage &&  <button className='w-[150px] h-[50px] cursor-pointer bg-white text-black mt-3 rounded-full outline-none border-none text-[20px] font-medium' onClick={()=>navigate("/customize2")}>Next</button>}
       
    </div>
  )
}

export default Customize
