import React from 'react'
import { useDispatch } from 'react-redux';
import { signInSuccess , signInStarts, signInFailed} from '../redux/user.slice';
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase';

const OAuth = () => {
  const dispatch = useDispatch();

    const handleGoogleClick = async() => {
        try{
            dispatch(signInStarts());
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            
            const result = await signInWithPopup(auth, provider);

            const res = await fetch('/api/v1/auth/googlesignin', {
              method:"POST",
              headers:{
                'Content-Type':'application/json'
              },
              body:JSON.stringify({
                name:result.user.displayName,
                email:result.user.email,
                avatar:result.user.photoURL
              })
            })
            const data = await res.json();
            if(data.success === false){
              dispatch(signInFailed({message:data.message}))
            }
            dispatch(signInSuccess(data))
        }catch(err){
            console.log(err)
        }
    }

  return (
    <button className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95' onClick={handleGoogleClick}>continue with google</button>
  )
}

export default OAuth