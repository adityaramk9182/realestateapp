import React from 'react'
import {Link} from 'react-router-dom'
import ListingCard from '../components/ListingCard'
import {Swiper, SwiperSlide} from 'swiper/react'
import SwiperCore from 'swiper'
import {Navigation} from 'swiper/modules'
import 'swiper/css/bundle'

const Home = () => {
  SwiperCore.use([Navigation]);
  const [offerListings, setOfferListings] = React.useState([])
  const [saleListings, setSaleListings] = React.useState([])
  const [rentListings, setRentListings] = React.useState([])
  
  console.log(offerListings)
  console.log(saleListings)
  console.log(rentListings)

  React.useEffect(()=>{
    const fetchOfferListings = async() => {
      try{
        const res = await fetch(`/api/v1/listing/all-listings?offer=true&limit=4`);
        const data = await res.json();
        setOfferListings(data.Listings)
        fetchRentListings()
      }catch(err){
        console.log(err)
      }
    }

    const fetchRentListings = async() => {
      try{
        const res = await fetch(`/api/v1/listing/all-listings?type=rent&limit=4`);
        const data = await res.json();
        setRentListings(data.Listings)
        fetchSaleListings()
      }catch(err){
        console.log(err)
      }
    }

    const fetchSaleListings = async() => {
      try{
        const res = await fetch(`/api/v1/listing/all-listings?type=sale&limit=4`);
        const data = await res.json();
        setSaleListings(data.Listings);
      }catch(err){
        console.log(err)
      }
    }
    fetchOfferListings();
  },[]);


  return (
    <main className='flex flex-col justify-start items-start gap-4'>
      <section className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <div>
          <p className='text-3xl text-slate-700 font-bold lg:text-6xl'>Find your next <span className='text-slate-400'>perfect</span><br/>place with ease</p>
        </div>
        <div>
          <p className='text-xs sm:text-sm text-gray-500'>We will help you to find your home fast, easy and comfortable. Our expert support are always available.</p>
        </div>
        <div>
          <Link className='text-xs sm:text-sm font-bold text-blue-900 hover:underline' to={`/search`}>Let's Start now..</Link>
        </div>
      </section>

      <section className='flex w-full'>
        <Swiper navigation>
            {
              offerListings && offerListings.length > 0 &&
              offerListings?.map((item, index)=>{
                  return(
                      <SwiperSlide key={index}>
                      <div className='h-[500px]'
                      style={{background:`url(${item.imageUrls[0]})center no-repeat`, backgroundSize:'cover'}}
                      ></div>
                      </SwiperSlide>
                  )
              })
            }
        </Swiper>
      </section>

      <section className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {
          offerListings && offerListings.length > 0 && 
          (
            <div>
              <div className='my-3'>
                <h4 className='text-2xl font-semibold text-green-600'>Recent Offers</h4>
                <Link to='/search?offer=true' className='text-sm text-blue-900 hover:underline'>show more offers</Link>
              </div>

              <div className='flex flex-wrap gap-4'>
                {
                  offerListings.map((item, index)=>{
                    return <ListingCard key={index} listing={item}/>
                  })
                }
              </div>
            </div>
          )
        }

        {
          rentListings && rentListings.length > 0 && 
          (
            <div>
              <div className='my-3'>
                <h4 className='text-2xl font-semibold text-green-600'>Recent places for rent</h4>
                <Link to='/search?type=rent' className='text-sm text-blue-900 hover:underline'>show more places for rent</Link>
              </div>

              <div className='flex flex-wrap gap-4'>
                {
                  rentListings.map((item, index)=>{
                    return <ListingCard key={index} listing={item}/>
                  })
                }
              </div>
            </div>
          )
        }

        {
          saleListings && saleListings.length > 0 && 
          (
            <div>
              <div className='my-3'>
                <h4 className='text-2xl font-semibold text-green-600'>Recent places for sale</h4>
                <Link to='/search?type=sale' className='text-sm text-blue-900 hover:underline'>show more places for sale</Link>
              </div>

              <div className='flex flex-wrap gap-4'>
                {
                  saleListings.map((item, index)=>{
                    return <ListingCard key={index} listing={item}/>
                  })
                }
              </div>
            </div>
          )
        }
      </section>
    </main>
  )
}

export default Home