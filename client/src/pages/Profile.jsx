import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Message } from 'rsuite'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase'
import {profileUpdateStarts, profileUpdateSuccess, profileUpdateFailed, 
deleteUserStarts, deleteUserSuccess, deleteUserFailed, signoutUserStarts, signoutUserSuccess, signInFailed, signoutUserFailed} from '../redux/user.slice'
import { Link } from 'react-router-dom'

const Profile = () => {
  const [file, setFile] = React.useState(undefined);
  const [filePercentage, setFilePercentage] = React.useState(0);
  const [fileUploadErr, setFileUploadErr] = React.useState(false);
  const [formData, setFormData] = React.useState({});
  const [listings, setListings] = React.useState([]);
  const [isListings, setIsListings] = React.useState(false);
  const fileRef = React.useRef(null);
  const {currentUser, loading, response} = useSelector(state => state.auth);
  const dispatch = useDispatch()

  const handleOnChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]:e.target.value
    })
  }

  const handleSubmit = async(e) => {
    try{
      e.preventDefault();
      dispatch(profileUpdateStarts())
      const res = await fetch(`/api/v1/user/update/${currentUser._id}`, {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(formData)
      });
  
      const data = await res.json();

      if(data.success === false){
        dispatch(profileUpdateFailed({message:data.message}))
      }
      dispatch(profileUpdateSuccess(data))
    }catch(err){
      console.log(err)
    }
  }

  const fetchAvailableListings = async() => {
    try{
      const res = await fetch(`/api/v1/listing/fetch/${currentUser._id}`);
      const data = await res.json();
      if(data.success === false){
        setIsListings(false);
      }
      setIsListings(true);
      setListings(data.listings);
    }catch(err){
      console.log(err)
    }
  }

  const handleDeleteUser = async() => {
    try{
      dispatch(deleteUserStarts())
      const res = await fetch(`/api/v1/user/delete/${currentUser._id}`, {
        method:"DELETE"
      })

      const data = await res.json();

      if(data.success === false){
        dispatch(deleteUserFailed(data.message));
      }

      dispatch(deleteUserSuccess(data.message))

    }catch{
      dispatch(deleteUserFailed(data.message));
    }
  }

  const handleUserSignOut = async() => {
    try{
      dispatch(signoutUserStarts())
      const res = await fetch('/api/v1/auth/signout');
      const data = await res.json();
      if(data.success ===  false){
        dispatch(signoutUserFailed(data.message));
      }
      dispatch(signoutUserSuccess(data.message));
    }catch{
      dispatch(signoutUserFailed(data.message));
    }
  }

  const handleUpdateFile = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime()+file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    uploadTask.on('state_changed', (snapshot)=>{
      const progress = (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
      setFilePercentage(Math.round(progress));
    },
    (err)=>{
      setFileUploadErr(true);
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=>{
        setFormData({...formData, avatar:downloadUrl})
      })
    })
  }

  const handleDeleteListing = async(id) => {
    try{
      const res = await fetch(`/api/v1/listing/delete/${id}`,{
        method:"DELETE"
      });
      const data = await res.json();
      if(data.success === false){
        return;
      }

      setListings((prev)=>prev.filter(list => list._id !== id))
    }catch(err){
      console.log(err)
    }
  }

  React.useEffect(()=>{
    if(file){
      handleUpdateFile(file); 
    }
  },[file]);

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center m-7'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type='file' onChange={e=>setFile(e.target.files[0])} ref={fileRef} hidden accept='image/*'/>
        <img className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' src={formData.avatar || currentUser.avatar} onClick={()=>fileRef.current.click()} alt='profile'/>
        <p className='text-sm self-center'>
        {
          fileUploadErr ? (<span className='text-red-700'>Image Upload Failed</span>) : filePercentage>0 && filePercentage<100 ? 
          (<span className='text-slate-700'>{`File Uploading ${filePercentage}%`}</span>) : filePercentage===100 ? (<span className='text-green-700'>Image Uploaded</span>) :
          ''
        }
        </p>
        <input className='border p-3 rounded-lg outline-none' id='username' type="text" placeholder='username' onChange={handleOnChange} defaultValue={currentUser.username}/>
        <input className='border p-3 rounded-lg outline-none' id='email' type="text" placeholder='email' onChange={handleOnChange} defaultValue={currentUser.email}/>
        <input className='border p-3 rounded-lg outline-none' id='password' type="password" placeholder='password' onChange={handleOnChange}/>
        {response.includes('Successfully') ? <Message className='bg-[#FCF6F5] text-[#2BAE66] font-semibold' type='success' closable>Updated Sucessfully</Message> : 
        response.includes('Error') ? <Message className='bg-[#FCF6F5] text-red-600 font-semibold' type='error' closable>{response}</Message> : null
        }
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95' type='submit' disabled={loading}>{loading ? "Updating.." : "UPDATE"}</button>
        <Link to='/createlisting' className='bg-[#2BAE66] text-[#FCF6F5] text-center p-3 rounded-lg uppercase hover:opacity-95'>Create Listing</Link>
      </form>

      <div className='flex justify-between mt-5'>
        <span className='text-red-600 cursor-pointer' onClick={handleDeleteUser}>Delete</span>
        <span className='text-red-600 cursor-pointer' onClick={handleUserSignOut}>SignOut</span>
      </div>

      <div className='text-center cursor-pointer'>
        <span className='text-[#2BAE66]' onClick={fetchAvailableListings}>View Listings</span>
      </div>

      {
        listings && listings.length>0 && (
          <div className='flex flex-col gap-4'>
            <h1 className='text-center mt-7 text-2xl'>Your listings</h1>
            {listings.map((item, index)=>{
              return(
                <div className='flex justify-between items-center p-3 border rounded-lg gap-4' key={index}>
                  <Link to={`/listing/${item._id}`}>
                  <img className='w-16 h-16 object-contain' src={item.imageUrls[0]} alt='pic'/>
                  </Link>
                  <Link className='text-slate-700 font-semibold flex-1 hover:underline truncate' to={`/listing/${item._id}`}>
                  <p>{item.name}</p>
                  </Link>
                  <div className='flex flex-col items-center'>
                    <button className='text-red-700 border uppercase' onClick={()=>handleDeleteListing(item._id)}>delete</button>
                    <Link to={`/updatelisting/${item._id}`}><button className='text-green-700 border uppercase'>edit</button></Link>
                  </div>
                </div>
              )
            })}
          </div>
        )
      }
    </div>
  )
}

export default Profile