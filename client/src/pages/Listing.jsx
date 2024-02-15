import React from 'react'
import { useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaBed, FaBath, FaParking, FaChair } from "react-icons/fa";
import {Swiper, SwiperSlide} from 'swiper/react'
import SwiperCore from 'swiper'
import {Navigation} from 'swiper/modules'
import 'swiper/css/bundle'

const Listing = () => {
    SwiperCore.use([Navigation]);
    const [listingData, setListingData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [contactLandLord, setContactLandLord] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const params = useParams();
    const {currentUser} = useSelector(state => state.auth)

    console.log(currentUser)

    const handleToggleLandLord = () => {
        setContactLandLord(prev=>!prev);
    }

    const handleContactMsg = (e) => {
        setMessage(e.target.value);
    }

    React.useEffect(()=>{
        const fetchListing = async() => {
            try{
                setLoading(true);
                const res = await fetch(`/api/v1/listing/getlisting/${params.id}`);
                const data = await res.json();
                if(data.success === false){
                    setError(true);
                    setLoading(false);
                }
                setLoading(false);
                setError(false);
                setListingData(data);

            }catch(err){
                setLoading(false);
                setError(true);
            }
        }
        fetchListing()
    },[])

  return (
    <main className='flex flex-col justify-center items-center gap-5'>
        {loading && <p className='text-center fs-3'>Loading</p>}
        {listingData && !loading && !error &&
        (
            <div>
            <Swiper navigation>
                {
                    listingData?.imageUrls.map((item)=>{
                        return(
                            <SwiperSlide key={item}>
                            <div className='h-[550px]'
                            style={{background:`url(${item})center no-repeat`, backgroundSize:'cover'}}
                            ></div>
                            </SwiperSlide>
                        )
                    })
                }
            </Swiper>
            </div>
        ) 
        }

        {listingData && !loading && !error && 
        (
            <main className='flex justify-center items-center gap-1'>
            <section className='flex flex-col justify-center items-center gap-4'>
                {/* <div className=''> */}
                <div className='flex font-bold text-2xl w-full'><p>{listingData.name} - </p><p> {`${listingData.offer ? +listingData.normalPrice - +listingData.discountedPrice : listingData.normalPrice} $`}</p></div>
                <div className='flex justify-start items-center gap-1 text-green-700 text-center w-full'><span><FaMapMarkerAlt/></span><span>{listingData.address}</span></div>
                <div className='flex justify-center items-center gap-1 w-full'>
                <p className='bg-red-800 w-full max-w-[200px] text-white text-center p-1 rounded-md cursor-pointer uppercase font-bold'>{listingData.type}</p>
                {listingData.offer && <p className='bg-green-800 w-full max-w-[200px] text-white text-center p-1 rounded-md cursor-pointer uppercase font-bold'>{listingData.discountedPrice}$</p>}
                </div>
                <div className='text-sm w-96'><span className='font-semibold text-sm'>Description -</span>{listingData.description}</div>
                <div className='flex justify-start items-start gap-5 w-full'>
                    <div className='flex justify-center items-center gap-1 text-green-700'><span className='text-xl'><FaBed/></span><span>{`${listingData.bedRooms} beds`}</span></div>
                    <div className='flex justify-center items-center gap-1 text-green-700'><span className='text-xl'><FaBath/></span><span>{`${listingData.bathRooms} baths`}</span></div>
                    {listingData.parking === true && <div className='flex justify-center items-center gap-1 text-green-700'><span className='text-xl'><FaParking/></span><span>yes</span></div>}
                    <div className='flex justify-center items-center gap-1 text-green-700'><span className='text-xl'><FaChair/></span><span>{`${listingData.furnished ? 'Furnished' : 'Not Furnished' }`}</span></div>
                </div>
                <div className='w-full flex justify-start items-start'>
                    {currentUser && listingData.userRef !== currentUser._id && 
                    <button className='text-white  w-full max-w-[200px] bg-slate-600 text-sm uppercase p-2 rounded-md' onClick={handleToggleLandLord}>contact landlord</button>
                    }

                    {/* {contactLandLord && */}
                    <div className='w-full flex flex-col gap-3'>
                        <p className='text-lg text-gray-500'>Contact <span className='font-bold'>{currentUser.username}</span> for <span className='font-bold'>{listingData.name}</span></p>
                        <form className='flex flex-col gap-3'>
                            <textarea className='p-2' rows="4" cols="50" placeholder='enter your message...' value={message} onChange={handleContactMsg}></textarea>
                            <Link to={`mailto:${currentUser.email}?subject=Regarding ${listingData.name}&body=${message}`} 
                            className='bg-red-800 text-white text-center p-1 rounded-md'>
                            Send Message
                            </Link> 
                        </form>
                    </div>
                    {/* } */}
                </div>
                {/* </div> */}
            </section>
            </main>
        )
        }
    </main>
  )
}

export default Listing