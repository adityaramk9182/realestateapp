import React from 'react'
import {useSelector} from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';

const CreateListing = () => {
  const {currentUser} = useSelector(state => state.auth);
  const [formData, setFormData] = React.useState({
    name:'',
    description:'',
    address:'',
    normalPrice:150,
    discountedPrice:0,
    bathRooms:1,
    bedRooms:1,
    furnished:false,
    parking:false,
    offer:false,
    type:'',
    imageUrls:[],
    userRef:currentUser._id
  });
  const [files, setFiles] = React.useState([]);
  const [imageUploadError, setImageUploadError] = React.useState(false);
  const [uploading, setUpLoading] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);


  console.log(formData)

  const handleOnChange = (e) => {
    if(e.target.id === 'sale' || e.target.id === 'rent'){
      setFormData({...formData, type:e.target.id});
    }

    if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
      setFormData({...formData, [e.target.id]:e.target.checked});
    }

    if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
      setFormData({...formData, [e.target.id]:e.target.value});
    }
  }

  const handleFilesUpload = () => {
    if(files.length > 0 && files.length+formData.imageUrls.length < 7){
      setUpLoading(true);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises).then((urls)=>{
        setFormData({...formData, imageUrls:formData.imageUrls.concat(urls)});
        setImageUploadError(false);
        setUpLoading(false);
      }).catch((err)=>{
        setImageUploadError('Image Upload Failed, (max 2mb size).');
        setUpLoading(false);
      })
    }else{
      setImageUploadError('You are only allowed to add only 6 images per listing.');
      setUpLoading(false);
    }
  }

  const storeImage = async(file) => {
    return new Promise((resolve, reject)=>{
      const storage = getStorage(app);
      const fileName = new Date().getDate()+file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot)=>{
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes)*100;
          console.log(`Uploading images ${progress}`);
        },
        (err)=>{
          reject(err);
        },
        ()=>{
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=>{
            resolve(downloadUrl);
          })
        }
      )
    })
  }

  const handleUnSelectImage = (imgIndex) => {
    setFormData({...formData, imageUrls:formData.imageUrls.filter((_, index)=>index !== imgIndex)})
  }

  const handleFormSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
    try{
      if(formData.imageUrls.length < 1) return setError('Select atleast one image.');
      if(+formData.discountedPrice > +formData.normalPrice) return setError('Discount price should be less than normal price.');
      const res = await fetch('/api/v1/listing/create', {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(formData)
      })
      setLoading(false);
      const data = await res.json();
      if(data.success === false){
        setError(data.message);
      }
    }catch(err){
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='font-semibold text-center text-3xl py-7'>Create a Listing</h1>
        <form className='flex flex-col sm:flex-row gap-4' onSubmit={handleFormSubmit}>
          <div className='flex flex-col gap-4 flex-1'>
            <input className='border p-3 rounded-lg outline-none' id='name' type="text" value={formData.name} placeholder='name' maxLength={62} minLength={10} onChange={handleOnChange} required/>
            <textarea className='border p-3 rounded-lg outline-none' id='description' cols="30" rows="5" value={formData.description} placeholder='description' onChange={handleOnChange} required/>
            <input className='border p-3 rounded-lg outline-none' id='address' type="text" value={formData.address} placeholder='address' onChange={handleOnChange} required/>
            <div className='flex gap-6 flex-wrap'>
              <div className="flex gap-2">
                <input type="checkbox" id='sale' className='w-5' checked={formData.type === 'sale'} onChange={handleOnChange}/>
                <span>Sale</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id='rent' className='w-5' checked={formData.type === 'rent'} onChange={handleOnChange}/>
                <span>Rent</span>
              </div> 
              <div className="flex gap-2">
                <input type="checkbox" id='parking' className='w-5' checked={formData.parking} onChange={handleOnChange}/>
                <span>Parking</span>
              </div>    
              <div className="flex gap-2">
                <input type="checkbox" id='furnished' className='w-5' checked={formData.furnished} onChange={handleOnChange}/>
                <span>Furnished</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id='offer' className='w-5' checked={formData.offer} onChange={handleOnChange}/>
                <span>Offer</span>
              </div>       
            </div>
            <div className='flex gap-5 flex-wrap'>
              <div className='flex items-center gap-2'>
                <input type="number" id='bedRooms' className='border p-3 rounded-lg border-gray-300 outline-none' value={formData.beds} max='10' min='1' onChange={handleOnChange} required/>
                <span>Beds</span>
              </div>
              <div className='flex items-center gap-2'>
                <input type="number" id='bathRooms' className='border p-3 rounded-lg border-gray-300 outline-none' value={formData.baths} max='10' min='1' onChange={handleOnChange} required/>
                <span>Baths</span>
              </div>
              <div className='flex items-center gap-2'>
                <input type="number" id='normalPrice' className='border p-3 rounded-lg border-gray-300 outline-none' value={formData.normalPrice} max='1000000' min='30' onChange={handleOnChange} required/>
                <span>Regular Price<p className='text-xs text-center'>( $ / month )</p></span> 
              </div>
              {
                formData.offer &&
                (
                  <div className='flex items-center gap-2'>
                  <input type="number" id='discountedPrice' className='border p-3 rounded-lg border-gray-300 outline-none' value={formData.discountedPrice} max='1000000' min='0' onChange={handleOnChange} required/>
                  <span>Discounted Price<p className='text-xs text-center'>( $ / month )</p></span> 
                </div>
                ) 
              }
            </div>
          </div>
          <div className='flex flex-col flex-1 gap-4'>
            <p className='font-semibold'>
              Images : <span className='font-normal text-gray-600'>The first image will be cover (max 6)</span>
            </p>
            <div className='flex gap-3'>
              <input className='p-3 border border-gray-300 rounded w-full' type="file" id='imageUrls' accept='image/*' multiple onChange={e=>setFiles(e.target.files)}/>
              <button className='p-3 text-[#2BAE66] border border-[#7eb597] rounded hover:shadow-lg disabled:opacity-80 uppercase' type='button' onClick={handleFilesUpload}>{uploading ? 'uploading...' : 'upload'}</button>
            </div>
            <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
            {
              formData.imageUrls.length > 0 && formData.imageUrls.map((item, index)=>{
                return(
                  <div className='flex justify-between p-3 border items-center' key={index}>
                    <img className='w-20 h-20 object-contain rounded-lg' src={item} alt="Listing Images" key={index}/>
                    <button className='text-red-700 rounded-lg uppercase p-3 hover:opacity-75' onClick={()=>handleUnSelectImage(index)}>Delete</button>
                  </div>
                )
              })
            }
            {error ? <p className='text-red-700 text-sm'>{error}</p> : null}
            <button className='p-3 border rounded-lg text-center text-[#FCF6F5] bg-[#2BAE66] uppercase font-semibold hover:opacity-95 disabled:opacity-85' type='submit' disabled={loading || uploading}>{loading ? 'Creating...' : 'Create Listing'}</button>
          </div>
        </form>
    </main>
  )
}
export default CreateListing