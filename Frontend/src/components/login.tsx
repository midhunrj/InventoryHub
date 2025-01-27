// import { ok } from 'assert'

import React, { useEffect, useState } from 'react'
import { useNavigate } from'react-router-dom'
import { userAuthenticate } from '../utils/userInterceptor'
import axios from 'axios'
import { useAuthContext } from '../context/authContext';
const baseURL = import.meta.env.VITE_USER_URL;
console.log(baseURL,"baseUrl");

const Login:React.FC = () => {
    const [email,setEmail]=useState<string>("")
    const[password,setPassword]=useState<string>("")
    const {setUserAuthenticated}=useAuthContext()
    const navigate=useNavigate()
    useEffect(()=>{

    },[])
    const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
  const response=await axios.post(`${baseURL}/login`,{email,password},{withCredentials:true})
     console.log(response.data);
     if(response.status==200)
     {
        const {accessToken,refreshToken}=response.data
        localStorage.setItem('inventoryAccessToken',accessToken)
        localStorage.setItem('inventoryRefreshToken',refreshToken)
        localStorage.setItem('inventoryData', JSON.stringify(true));
        setUserAuthenticated(true)
      navigate('/home')  
     }
    }
  return (
    <>
    <div className="relative flex items-center justify-center bg-gray-600 text-slate-950 min-h-screen">
    <div className=" absolute flex items-center bg-slate-900  rounded-lg justify-center mx-8 my-12 p-16 shadow-lg gap-6 h-96 flex-col">
    <h1 className='text-2xl text-white mt-4 font-semibold text-center'>Welcome to Inventory Management</h1>
    
    
    <form className='flex w-fit h-fit justify-center space-y-6 flex-col items-center' onSubmit={handleSubmit}>
    <input type='text' value={email} placeholder='Email' onChange={(e)=>setEmail(e.target.value)} className='w-full px-8 py-4 bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4 rounded-lg'/>
    <input type='password'value={password} placeholder='Password' onChange={(e)=>setPassword(e.target.value)} className='w-full px-8 py-4 bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4  rounded-lg'/>
    <button type='submit' className='w-fit bg-blue-600 cursor-pointer text-gray-200 hover:bg-blue-900  hover:text-white rounded-md h-fit  px-4 py-2 items-center'>Login</button>
    </form>
    
    </div>
    </div>
    </>
  )
}

export default Login