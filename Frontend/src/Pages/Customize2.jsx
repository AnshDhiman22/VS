import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/userContext'
import axios from 'axios'
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const Customize2 = () => {
  const {userData,backendImage,selectedImage,serverUrl,setUserData} = useContext(userDataContext)
  const [assistantName,setAssistantName] = useState(userData?.AssistantName || "")
  const navigate = useNavigate()
 const handleUpdateAssistant = async ()=>{
 try {
  let formData = new FormData()
  formData.append("assistantName",assistantName)
  if(backendImage){
     formData.append("assistantImage",backendImage)
  }else{
    formData.append("imageUrl",selectedImage)
  }
  const result = await axios.post(`${serverUrl}/api/user/update`,formData,{withCredentials:true})
  console.log(result.data)
  setUserData(result.data)
  navigate("/")
 } catch (error) {
  console.log(error)

 }
 }

  return (
    <div className=' relative w-full h-[100vh] bg-gradient-to-t from-[black] to-[#000873] flex flex-col justify-center items-center gap-[20px] lg:p-[20px] lg:gap-[20px]'>
      <IoArrowBack className='absolute text-3xl text-white top-[30px] left-[30px] cursor-pointer' onClick={()=>navigate("/customize")}/>
      <h1 className='text-white text-[30px] lg:text-[40px]'>Enter Yoru <span className='text-blue-500'>Assistant Name</span></h1>
      <input type="text" placeholder='eg: siri' className='w-[80%] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[1-px] mt-5' required onChange={(e)=>setAssistantName(e.target.value)} value={assistantName} />
      {assistantName && <button className='w-[250px] h-[50px] cursor-pointer bg-white text-black mt-3 rounded-full outline-none border-none text-[20px] font-medium' onClick={()=>handleUpdateAssistant()}>Create Your Assistant</button>}
      
    </div>
  )
}

export default Customize2
