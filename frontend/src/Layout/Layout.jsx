import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ProfilePage from '../pages/ProfilePage';

function Layout() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
    // This function will be passed to the Header component
    const toggleProfileSidebar = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    return (
        <>
            <Header onProfileClick={toggleProfileSidebar} />
            <main>
                <Outlet />
            </main>
            <Footer />
            
            <ProfilePage
                isOpen={isProfileOpen} 
                onClose={() => setIsProfileOpen(false)} 
            />
        </>
    );
}

export default Layout;