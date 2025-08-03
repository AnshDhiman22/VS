import React, { useContext, useRef, useState } from 'react'
import { userDataContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useEffect } from 'react'
import aiImg from "../assets/ai.gif"
import userImg from "../assets/user.gif"
const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext)
  const navigate = useNavigate()
  const [listning, setListning] = useState(false)
  const [userText,setUserText] = useState("")
  const [aiText,setAiText] = useState("")
  const isSpeakingRef = useRef(false)
  const recognitionRef = useRef(null)
  const isRecognizingRef = useRef(false)
  const synth = window.speechSynthesis



  const handleLogOut = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      setUserData(null)
      navigate("/signup")

    } catch (error) {
      setUserData(null)
      console.log(error)
    }
  }

  const startRecognition = () => {
    if(!isSpeakingRef.current && !isRecognizingRef.current){
    try {
      recognitionRef.current?.start();
      console.log("Recognition requested to start assistant")
    } catch (error) {
      if (error.name !== "InvalidStateEroor") {
        console.error("start error:", error);
      }
    }
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'hi-IN';
    const voices = window.speechSynthesis.getVoices()
    const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }


    isSpeakingRef.current = true
    utterance.onend = () => {
      setAiText("")
      isSpeakingRef.current = false;
      setTimeout(()=>{
        startRecognition();
      }, 800);
      
    }
    synth.cancel();
    synth.speak(utterance);
  }

  const handleCommand = (data) => {
    const { type, userInput, response } = data
    console.log(type)
    speak(response);

    if (type === 'google-search') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, '_blank')
    }
    if (type === 'calculator-open') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=calculator`, '_blank')
    }
    if (type === 'instagram-open') {
      window.open(`https://www.instgarm.com/`, '_blank')
    }
    if (type === 'facebook-open') {
      window.open(`https://www.facebook.com/`, '_blank')
    }
    if (type === 'weather-show') {
      window.open(`https://www.google.com/search?q=weather`, '_blank')
    }
    if (type === 'youtube-search' || type === 'youtube-play') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank')
    }

  }

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
      recognition.lang = 'en-US';
      recognition.interimResults = false

    recognitionRef.current = recognition;


    let isMounted = true;
    const startTimeout = setTimeout(()=>{
      if(isMounted && !isSpeakingRef.current && !isRecognizingRef.current){
        try {
          recognition.start();
          console.log("recognitin requested to start");
        } catch (error) {
          if(error.name !== "InvalidStateError"){
            console.log(error);
          }
        }
      }
    }, 1000);

    recognition.onstart = () => {
      console.log("recognition started");
      isRecognizingRef.current = true;
      setListning(true)
    };

    recognition.onend = () => {
     isRecognizingRef.current = false;
     setListning(false);
     if(isMounted && !isSpeakingRef.current){
      setTimeout(()=>{
        if(isMounted){
          try {
            recognition.start();
            console.log("Recognition restarted");
          } catch (error) {
            if(error.name !== "InvalidStateError"){
              console.log(error)
            }
          }
        }
      })
     }

    };

        recognition.onerror = (event) => {
      console.warn("recognition error", event.error)
      isRecognizingRef.current = false;
      setListning(false);
      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
         if(isMounted) {
          try {
             recognition.start();
             console.log("recognitin restarted after error")
          } catch (error) {
            if(error.name !== "InvalidStateError"){
              console.log(error)
          }
         }
        }
        }, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim()
      console.log(transcript)
      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        setAiText("")
        setUserText(transcript)
        recognition.stop()
        isRecognizingRef.current = false
        setListning(false)
        const data = await getGeminiResponse(transcript)
        handleCommand(data)
        setAiText(data.response)
        setUserText("")
      }
    }

      const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`);
      greeting.lang = 'hi-IN';
      window.speechSynthesis.speak(greeting);


    return () => {
      isMounted = false;
      clearTimeout(startTimeout);
      recognition.stop()
      setListning(false)
      isRecognizingRef.current = false
    }

  }, [])



  return (
    <div className='relative gap-[15px] w-full h-[100vh] bg-gradient-to-t from-[black] to-[#00054b] flex flex-col justify-center items-center '>
      <button className=' absolute w-[100px] h-[40px]   rounded-full cursor-pointer bg-white text-black outline-none border-none text-[15px] lg:text-[20px] font-medium top-[20px] right-[20px]' onClick={() => handleLogOut()}>Logout</button>
      <button className=' w-[200px] h-[40px]  lg:w-[300px] lg:h-[50px] rounded-full cursor-pointer bg-white text-black mt-10 outline-none border-none text-[15px] lg:text-[20px] font-medium' onClick={() => navigate('/customize')} >Customize Your Assistant</button>
      <div className='w-[240px] h-[600px] lg:h-[600px] flex flex-col justify-center items-center overflow-hidden '>
        <img src={userData?.assistantImage} className='h-[100%] object-cover border-2 border-white' />
        <h1 className='text-white text-[20px] '>Hello, {userData?.name} I'm <span className='text-blue-500'>{userData?.assistantName}</span></h1>
        {!aiText && <img src={userImg} alt="" className='w-[200px]' /> }
         {aiText && <img src={aiImg} alt="" className='w-[200px]' /> }

        <h1 className='text-white text-center text-wrap'>{userText?userText:aiText?aiText:null}</h1>

      </div>
    </div>
  )
}

export default Home
