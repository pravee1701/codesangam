import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './Layout/Layout'
import { Signup } from './components/Signup'
import Login from './components/Login'
import { ForgotPassword } from './pages/ForgotPassword'
import { ChangePassword } from './pages/ChangePassword'
import UpcomingContestsPage from './pages/UpcomingContestPage'
import PastContestsPage from './pages/PastContestPage'
import ProfilePage from './pages/ProfilePage'
import ForLoggedInUsers from './protectedRoutes/ForLoggedInUsers'
import HomePage from './pages/HomePage'
import BookmarkPage from './pages/BookmarkPage'


const RoutePaths = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Layout />} >
                    <Route path='/' element = { <HomePage/>} />
                    <Route path='signup' element={<Signup />} />
                    <Route path='login' element={<Login />} />
                    <Route path='forgot-password' element={<ForgotPassword />} />
                    <Route element = {<ForLoggedInUsers />} >
                        <Route path='change-password' element={<ChangePassword />} />
                        <Route path='upcoming-contest' element={<UpcomingContestsPage />} />
                        <Route path='bookmarks' element={<BookmarkPage />} />
                        <Route path='past-contest' element={<PastContestsPage />} />
                        <Route path='current-user' element={<ProfilePage />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default RoutePaths