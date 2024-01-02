import {createBrowserRouter, createRoutesFromElements, Route, Routes} from 'react-router-dom'
import Home from '../pages/Home'
import About from '../pages/About'
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import Profile from '../pages/Profile'
import Layout from '../components/Layout'
import ProtectedRoute from '../components/ProtectedRoute'


export const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={<Layout/>}>
        <Route index element={<Home/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/signin' element={<SignIn/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route element={<ProtectedRoute/>}>
        <Route path='/profile' element={<Profile/>}/>
        </Route>
    </Route>
))