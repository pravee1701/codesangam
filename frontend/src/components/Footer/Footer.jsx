import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";
import ApiRequest from "../../services/ApiRequest";
import { useSelector } from "react-redux";
import { NOTIFICATION_BASE_URL } from "../../constants";

function Footer() {
  const authStatus = useSelector((state) => state.auth.isLoggedIn)
  const userData = useSelector((state) => state.auth.userData)
  const currentYear = new Date().getFullYear();
  const [isSubscribed, setIsSubscribed] = useState(userData?.isSubscribedToNotification || false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubscriptionToggle = async () => {
    if (!authStatus) {
      alert('Please log in to subscribe to notifications');
      return;
    }

    setIsLoading(true);
    
    try {
      let apiRequest = ''
      if(isSubscribed){

        apiRequest = new ApiRequest(`${NOTIFICATION_BASE_URL}/unsubscribe`)
      } else {
        apiRequest = new ApiRequest(`${NOTIFICATION_BASE_URL}/subscribe`)

      }
      const response = await apiRequest.postRequest()
      
      
      if (response.success) {
        setIsSubscribed(response?.data?.isSubscribedToNotification);
      } else {
        console.error('Failed to toggle subscription');
      }
    } catch (error) {
      console.error('Failed to toggle subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Footer navigation categories
  const footerLinks = [
    {
      title: "Company",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Contact", path: "/contact" },
        { name: "Careers", path: "/careers" },
        { name: "Privacy Policy", path: "/privacy" }
      ]
    },
    {
      title: "Contests",
      links: [
        { name: "All Contests", path: "/contests" },
        { name: "How It Works", path: "/how-it-works" },
        { name: "Leaderboard", path: "/leaderboard" },
        { name: "FAQs", path: "/faqs" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", path: "/docs" },
        { name: "Blog", path: "/blog" },
        { name: "Community", path: "/community" },
        { name: "Support", path: "/support" }
      ]
    }
  ];

  // Social media links
  const socialLinks = [
    { name: "Github", icon: <Github className="w-5 h-5" />, url: "https://github.com" },
    { name: "Twitter", icon: <Twitter className="w-5 h-5" />, url: "https://twitter.com" },
    { name: "LinkedIn", icon: <Linkedin className="w-5 h-5" />, url: "https://linkedin.com" },
    { name: "Email", icon: <Mail className="w-5 h-5" />, url: "mailto:contact@contesthub.com" }
  ];

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center mb-4">
              <span className="bg-indigo-900 h-8 w-8 rounded-full flex items-center justify-center mr-2 shadow-md">
                <span className="text-white font-bold">C</span>
              </span>
              <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent text-xl font-bold">
                CodeSangam
              </span>
            </Link>
            <p className="text-gray-400 mb-6 text-sm">
              Your ultimate platform for coding contests, challenges, and competitions. Join our community and test your skills against the best developers worldwide.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-indigo-400 transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((category) => (
            <div key={category.title}>
              <h3 className="text-white font-medium mb-4">{category.title}</h3>
              <ul className="space-y-3">
                {category.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-indigo-400 text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Subscription */}
      <div className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h4 className="text-white text-sm font-medium mb-2">Stay updated with CodeSangam</h4>
              <p className="text-gray-400 text-sm">Get notifications about new contests and features</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <button
                type="button"
                onClick={handleSubscriptionToggle}
                disabled={isLoading}
                className={`
                  font-medium py-2 px-4 rounded-md transition-colors sm:w-auto
                  ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 
                    isSubscribed ? 
                    'bg-gray-600 hover:bg-gray-700 text-white' : 
                    'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }
                `}
              >
                {isLoading ? 'Processing...' : (isSubscribed ? 'Unsubscribe' : 'Subscribe')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Area */}
      <div className="bg-gray-950 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-500 text-sm">
              © {currentYear} CodeSangam. All rights reserved.
            </p>
            <div className="flex items-center mt-2 md:mt-0">
              <p className="text-gray-500 text-sm flex items-center">
                Made with <Heart className="w-4 h-4 text-red-500 mx-1" /> by CodeSangam Team
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;