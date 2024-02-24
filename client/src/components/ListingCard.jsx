import React from 'react'
import { Link } from 'react-router-dom'
import {useSelector} from 'react-redux'
import { FaMapMarkerAlt } from 'react-icons/fa'

const ListingCard = ({listing}) => {
    const {currentUser} = useSelector(state => state.auth)
    return (
        <main className='bg-white shadow-md  md:shadow-lg transition-shadow overflow-hidden rounded w-full sm:w-[330px]'>
            <Link to={`${currentUser ? `/listing/${listing._id}` : `/signin`}`}>
                <img className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-all duration-300' src={listing.imageUrls[0]} alt="listing"/>
                <div className='flex flex-col gap-1 p-2 w-full'>
                <h4 className='truncate text-lg font-semibold text-slate-900'>{listing.name}</h4>
                <div className='flex justify-start items-center gap-1 text-green-700 text-center w-full'>
                    <span><FaMapMarkerAlt/></span>
                    <span className='truncate'>{listing.address}</span>
                </div>
                <div className='text-sm'>
                    <p className='text-sm text-gray-500 line-clamp-2'>{listing.description}</p>
                </div>
                <div className='text-gray-500 font-bold text-2xl w-full'>
                    <p> {`${listing.offer ? +listing.normalPrice - +listing.discountedPrice : listing.normalPrice}$`}</p>
                </div>
                <div className='flex justify-start items-center gap-2'>
                    <span className='text-slate-900 font-semibold'>{listing.bedRooms} beds</span>
                    <span className='text-slate-900 font-semibold'>{listing.bathRooms} baths</span>
                </div>
                </div>
            </Link>
        </main>
    )
}

export default ListingCard