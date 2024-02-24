import {createBrowserRouter, createRoutesFromElements, Route, Routes} from 'react-router-dom'
import Home from '../pages/Home'
import About from '../pages/About'
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import Profile from '../pages/Profile'
import Layout from '../components/Layout'
import ProtectedRoute from '../components/ProtectedRoute'
import CreateListing from '../pages/CreateListing'
import UpdateListing from '../pages/UpdateListing'
import Listing from '../pages/Listing'
import SearchListings from '../pages/SearchListings'

export const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={<Layout/>}>
        <Route index element={<Home/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/signin' element={<SignIn/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/listing/:id' element={<Listing/>}/>
        <Route path='/search' element={<SearchListings/>}/>
        <Route element={<ProtectedRoute/>}>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/createlisting' element={<CreateListing/>}/>
        <Route path='/updatelisting/:id' element={<UpdateListing/>}/>
        </Route>
    </Route>
))