import React from 'react'
import { useSelector } from 'react-redux'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase'

const Profile = () => {
  const [file, setFile] = React.useState(undefined);
  const [filePercentage, setFilePercentage] = React.useState(0);
  const [fileUploadErr, setFileUploadErr] = React.useState(false);
  const [formData, setFormData] = React.useState({});
  const fileRef = React.useRef(null);
  const {currentUser} = useSelector(state => state.auth);

  console.log(formData)

  const handleOnChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]:e.target.value
    })
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
        console.log(downloadUrl)
        setFormData({...formData, avatar:downloadUrl})
      })
    })
  }

  React.useEffect(()=>{
    if(file){
      handleUpdateFile(file);
    }
  },[file]);

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center m-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input type='file' onChange={e=>setFile(e.target.files[0])} ref={fileRef} hidden accept='image/*'/>
        <img className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' src={formData.avatar || currentUser.avatar} onClick={()=>fileRef.current.click()} alt='profile'/>
        <p className='text-sm self-center'>
        {
          fileUploadErr ? (<span className='text-red-700'>Image Upload Failed</span>) : filePercentage>0 && filePercentage<100 ? 
          (<span className='text-slate-700'>{`File Uploading ${filePercentage}%`}</span>) : filePercentage===100 ? (<span className='text-green-700'>Image Uploaded</span>) :
          ''
        }
        </p>
        <input className='border p-3 rounded-lg outline-none' id='username' type="text" placeholder='username' onChange={handleOnChange}/>
        <input className='border p-3 rounded-lg outline-none' id='email' type="text" placeholder='email' onChange={handleOnChange}/>
        <input className='border p-3 rounded-lg outline-none' id='password' type="text" placeholder='password' onChange={handleOnChange}/>
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95' type='submit'>UPDATE</button>
      </form>

      <div className='flex justify-between mt-5'>
        <span className='text-red-600 cursor-pointer'>Delete</span>
        <span className='text-red-600 cursor-pointer'>SignOut</span>
      </div>
    </div>
  )
}

export default Profile