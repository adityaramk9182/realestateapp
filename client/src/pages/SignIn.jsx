import React from 'react'
import { Link, useNavigate} from 'react-router-dom'
import { Message} from 'rsuite'
import { useDispatch, useSelector} from 'react-redux'
import { signInSuccess, signInStarts, signInFailed } from '../redux/user.slice'
import OAuth from '../components/OAuth'
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignIn = () => {
  const [formData, setFormdata] = React.useState({});
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {response, loading} = useSelector(state => state.auth);

  const handleShowPasswordToggle = () => {
    setShowPassword(state => !state);
    const passwordInput = document.getElementById('password');
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
    } else {
      passwordInput.type = "password";
    }
  }

  const handleOnChange = (e) => {
    setFormdata({
      ...formData,
      [e.target.id]:e.target.value
    })
  }

  const handleSubmit = async(e) => {
    try{
      e.preventDefault();
      dispatch(signInStarts());
      const res = await fetch('/api/v1/auth/signin', {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(signInFailed({message:data.message}))
      }
      dispatch(signInSuccess({message:data.message, user:data.user, token:data.token}))
      setTimeout(()=>{
        navigate('/');
      }, 4000)
    }catch(err){
      console.log(err)
    }
  }

  return (
    <main className='signinsignupform'>
    <div className='p-3 max-w-lg mx-auto mt-20 bg-[#2BAE66] border rounded-lg'>
      <h1 className='text-2xl text-[#FCF6F5] text-center font-semibold my-7'>Sign In</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input className='border p-3 rounded-lg outline-none' id='email' type="email" placeholder='email' onChange={handleOnChange}/>
        <input className='border p-3 rounded-lg outline-none' id='password' type="password" placeholder='password' onChange={handleOnChange}/>
        {formData.password ? <div className='relative'>
          <span className='absolute -top-14 left-72 sm:left-auto sm:right-1 text-[#2BAE66] text-2xl' onClick={handleShowPasswordToggle}>{!showPassword ? <FaEye/> : <FaEyeSlash/>}</span>
        </div> : null}
        {response.includes('Authentication Successfull') ? <Message className='bg-[#FCF6F5] text-[#2BAE66] font-semibold' type='success' closable>{response}</Message> : 
        response.includes('INVALID PASSWORD') || response.includes('NOT FOUND') ? <Message className='bg-[#FCF6F5] text-red-600 font-semibold' type='error' closable>{response}</Message> : null
        }
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95' disabled={loading} type='submit'>{loading ? 'Loading..' : 'Sign in'}</button>
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-2'>
        <p className='text-[#FCF6F5]'>Don't have an account?</p>
        <span className='text-[#FCF6F5] hover:underline'><Link to='/signup'>signup</Link></span>
      </div>
    </div>
    </main>
  )
}

export default SignIn