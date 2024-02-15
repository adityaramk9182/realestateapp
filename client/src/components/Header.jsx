import React from 'react'
import { BsSearch } from "react-icons/bs";
import {Link, useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'

const Header = () => {
  const [searchValue, setSearchValue] = React.useState('');
  const [searchedListings, setSearchedListings] = React.useState([]);
  const [error, setError] = React.useState('');
  const {currentUser} = useSelector(state => state.auth);
  const navigate = useNavigate();

  const handleSearchListing = async(e) => {
    e.preventDefault();
    try{

      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set('searchTerm', searchValue);
      const searchQuery = urlParams.toString();
      navigate(`/search?${searchQuery}`);
      // const res = await fetch(`/api/v1/listing/all-listings?searchTerm=${searchValue}`);
      // const data = await res.json();
      // if(data.success === false){
      //   setError(data.message);
      // }
      // setSearchedListings(data.Listings)
    }catch(err){
      console.log(err)
    }
  }

  React.useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const searchTerm = urlParams.get('searchTerm');
    console.log(searchTerm)
    if(searchTerm){
      setSearchValue(searchTerm);
    }
  },[location.search]);

  return (
    <header className='bg-[#2BAE66] shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
      <Link to='/'>
      <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
        <span className='p-1 border-solid border-2 border-white'>
          <span className='text-white'>We</span>
          <span className='text-[#1A5D1A]'>Realestate</span>
        </span>
      </h1>
      </Link>

      <form className='bg-slate-100 p-3 rounded-lg' onSubmit={handleSearchListing}>
        <input className='bg-transparent focus:outline-none w-24 sm:w-64' type='text' placeholder='search...' value={searchValue} onChange={e=>setSearchValue(e.target.value)}/>
        <button type='submit'><BsSearch className='size-5 text-[#2BAE66]'/></button>
      </form>

      <ul className='flex gap-4'>
        <Link to='/'>
          <li className='hidden sm:inline text-[#FCF6F5] hover:underline'>Home</li>
        </Link>

        <Link to='/about'>
          <li className='hidden sm:inline text-[#FCF6F5] hover:underline'>About</li>
        </Link>

        <Link to='/profile'>
          {
            currentUser ? 
            (<img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='profile'/>) :
            (<li className='hidden sm:inline text-[#FCF6F5] hover:underline'>Login</li>)
          }
          </Link>
      </ul>
      </div>
    </header>
  )
}

export default Header