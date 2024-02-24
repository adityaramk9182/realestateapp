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
            <Swiper navigation>
                {
                    listingData?.imageUrls.map((item)=>{
                        return(
                            <SwiperSlide className='w-52' key={item}>
                            <div className='h-[550px]'
                            style={{background:`url(${item})center no-repeat`, backgroundSize:'cover'}}
                            ></div>
                            </SwiperSlide>
                        )
                    })
                }
            </Swiper>
        ) 
        }

        {listingData && !loading && !error && 
        (
            <main className='flex justify-center items-center gap-1 p-6'>
            <section className='flex flex-col justify-center items-center gap-2'>
                {/* <div className=''> */}
                <div className='flex font-bold text-sm w-full sm:text-2xl p-2'><p>{listingData.name} - </p><p> {`${listingData.offer ? +listingData.normalPrice - +listingData.discountedPrice : listingData.normalPrice} $`}</p></div>
                <div className='flex justify-start items-center gap-1 text-green-700 text-center w-full p-2'><span><FaMapMarkerAlt/></span><span>{listingData.address}</span></div>
                <div className='flex flex-col justify-center items-center gap-1 sm:flex-row sm:justify-start sm:items-start w-full'>
                <p className='bg-red-800 w-full max-w-[200px] text-white text-center rounded-md uppercase font-semibold p-2'>{listingData.type}</p>
                {listingData.offer && <p className='bg-green-800 w-full max-w-[200px] text-white text-center p-2 rounded-md uppercase font-bold'>{listingData.discountedPrice}$</p>}
                </div>
                <div className='text-xs sm:text-sm p-2'><span className='font-semibold'>Description -</span>{listingData.description}</div>
                <div className='flex flex-wrap sm:flex-row justify-start items-start gap-5 w-full p-2'>
                    <div className='flex justify-center items-center gap-1 text-green-700'><span className='text-lg sm:text-xl'><FaBed/></span><span className='text-sm sm:text-lg'>{`${listingData.bedRooms} beds`}</span></div>
                    <div className='flex justify-center items-center gap-1 text-green-700'><span className='text-lg sm:text-xl'><FaBath/></span><span className='text-sm sm:text-lg'>{`${listingData.bathRooms} baths`}</span></div>
                    {listingData.parking === true && <div className='flex justify-center items-center gap-1 text-green-700'><span className='text-lg sm:text-xl'><FaParking/></span><span className='text-sm sm:text-lg'>yes</span></div>}
                    <div className='flex justify-center items-center gap-1 text-green-700'><span className='text-lg sm:text-xl'><FaChair/></span><span className='text-sm sm:text-lg'>{`${listingData.furnished ? 'Furnished' : 'Not Furnished' }`}</span></div>
                </div>
                <div className='w-full flex justify-start items-start'>
                    {currentUser && listingData.userRef !== currentUser._id && 
                    <button className='text-white  w-full max-w-[200px] bg-slate-600 text-xs uppercase rounded-md' onClick={handleToggleLandLord}>contact landlord</button>
                    }

                    {contactLandLord &&
                    <div className='w-full flex flex-col gap-3'>
                        <p className='text-sm text-center sm:text-lg sm:text-start text-gray-500'>Contact <span className='font-bold'>{currentUser.username}</span> for <span className='font-bold'>{listingData.name}</span></p>
                        <form className='flex flex-col gap-3'>
                            <textarea className='p-2 border rounded-lg border-green-600' rows="4" cols="40" placeholder='enter your message...' value={message} onChange={handleContactMsg}></textarea>
                            <Link to={`mailto:${currentUser.email}?subject=Regarding ${listingData.name}&body=${message}`} 
                            className='bg-red-800 text-white text-center rounded-md w-max p-3'>
                            Send Message
                            </Link> 
                        </form>
                    </div>
                    }
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