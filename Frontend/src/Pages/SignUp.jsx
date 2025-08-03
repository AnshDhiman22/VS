import React, { useContext, useState } from 'react'
import bg from "../assets/authBg.png"
import "../Pages/inclusive.css"
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/userContext';
import axios from "axios"
const SignUp = () => {

  const [showPassword, setShowPassword] = useState(false)
  const { serverUrl,userData,setUserData } = useContext(userDataContext)
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [err,setErr] = useState("")
  const [loading,setLoading] = useState(false)
  const handleSignUp = async (e) => {
    e.preventDefault()
    setErr("")
    setLoading(true)
    try {
       let result =await axios.post(`${serverUrl}/api/auth/signup`, {name,email,password}
        , {withCredentials:true}
       )
        setUserData(result.data)
       setLoading(false)
       navigate("/customize")
    } catch (error) {
       console.log(error)
       setUserData(null)
       setErr(error.response.data.message)
       setLoading(false)
    }
  }

  return (
    <div className='w-full h-[100vh] bg-cover bg-center flex justify-center items-center' style={{ backgroundImage: `url(${bg})` }}>
      <form className='w-[90%] h-[600px] max-w-[500px] bg-[#00000069] backdrop-blur flex flex-col items-center justify-center gap-20px' onSubmit={handleSignUp}>
        <div className='mb-5'>
          <h1 className='text-white text-center text-4xl font-normal' style={{ fontFamily: "Roboto" }}> Register to </h1>
          <h1 className='text-blue-500 text-center text-4xl font-normal ' style={{ fontFamily: "Roboto" }}>Virtual Asistant</h1>
        </div>

        <input type="text" required placeholder='Enter your Name' className='w-[90%] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[1-px] mt-5' onChange={(e) => setName(e.target.value)} value={name} />
        <input type="text" placeholder='Email' className='w-[90%] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[1-px] mt-5' required onChange={(e) => setEmail(e.target.value)} value={email} />
        <div className=' relative w-[90%] h-[60px] border-2 border-white bg-transparent text-white mt-5'>
          <input type={showPassword ? "text" : "password"} placeholder='Password' className=' w-[90%] h-full outline-none bg-transparent placeholder-gray-300 px-[20px] py-[10px]' required onChange={(e) => setPassword(e.target.value)} value={password} />
          {!showPassword && <IoMdEye className=' absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer' onClick={() => setShowPassword(true)} />}
          {showPassword && <IoMdEyeOff className=' absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer' onClick={() => setShowPassword(false)} />}
        </div>
        {err.length>0 && <p className='text-red-500 text-[18px] mt-2'>
          {err}</p>}
        <button className='w-[40%] h-[60px] cursor-pointer bg-white text-black mt-10 outline-none border-none text-[20px] font-medium' disabled={loading} style={{ fontFamily: "Roboto" }}>
          {loading? "Loading...": "Sign up"}
        </button>
        <p className='text-gray-300 mt-4'>Already have an account ? <span onClick={() => navigate("/signin")} className='text-blue-400 underline cursor-pointer'>Sign In</span></p>
      </form>
    </div>
  )
}

export default SignUp
