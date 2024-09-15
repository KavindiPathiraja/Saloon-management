import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import homebg from '../images/home1.jpg';
import './Home.css';
import Card from './HomeCard/Hcard';
import Footer from './footer/Footer';
import Logo from '../images/logo.png';
import Swal from 'sweetalert2';
import {  useParams } from 'react-router-dom';
import axios from 'axios';

const ReadOneHome = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState('');
  const [buttonPressed, setButtonPressed] = useState(false);
  const [customer, setCustomer] = useState('');
  const { Email } = useParams();
  const navigate = useNavigate(); // Use navigate for routing

  useEffect(() => {
    axios
        .get(`http://localhost:8076/customers/${Email}`)
        .then((res) => {
          setCustomer(res.data.data);
            console.log(res.data.data);
        })
        .catch((error) => {
            console.log(error);
        });
}, [Email]); 

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const sections = ['about', 'products'];
      const positions = sections.reduce((acc, section) => {
        acc[section] = document.getElementById(section)?.offsetTop || 0;
        return acc;
      }, {});

      if (scrollPos >= positions.about && scrollPos < positions.products) {
        setSelectedLink('about');
      } else if (scrollPos >= positions.products) {
        setSelectedLink('products');
      } else {
        setSelectedLink('');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (event, sectionId) => {
    event.preventDefault();
    if (sectionId === 'home') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      const target = document.getElementById(sectionId);
      if (target) {
        window.scrollTo({
          top: target.offsetTop,
          behavior: 'smooth',
        });
      }
    }
  };

  const handleMenuToggle = () => {
    setMenuOpen(prev => !prev);
  };

  const handleButtonPress = (event) => {
    setButtonPressed(event.type === 'mousedown');
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to log out?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Add your logout logic here
        window.location.href = '/';
      }
    });
  };

  const handleAppointmentClick = () => {
    navigate(`/appointments/create/${customer.Email}`); // Navigate to the appointments page
  };

  return (
    <div>
      <div className="min-h-screen text-white flex flex-col items-center">
        <div className="fixed top-0 left-0 right-0 bg-gray-200 text-gray-600 z-50 hidden md:flex justify-between items-center p-4">
          <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img 
              src={Logo} 
              alt="logo" 
              style={{ width: '30px', height: '30px', borderRadius: '50%' }} 
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap">Bashi</span>
          </a>
          <ul className="flex space-x-8 py-4">
            {['home', 'about', 'products'].map((section) => (
              <li
                key={section}
                className={classNames('hover:text-pink-500', {
                  'text-pink-500': selectedLink === section
                })}
              >
                <a
                  href={`#${section}`}
                  onClick={(e) => handleSmoothScroll(e, section)}
                >
                  {section.toUpperCase()}
                </a>
              </li>
            ))}
          </ul>

          {/* Make Appointment Button */}
          <button 
            onClick={handleAppointmentClick} 
            className=" text-pink font-semibold hover:bg-pink-200"
          >
            Make Appointment
          </button>

          <a 
            href="#"
            onClick={handleLogout}
            className="text-pink-500 font-semibold hover:underline ml-4"
          >
            Logout
          </a>
        </div>

        <div className="text-center pt-32 pb-16 min-h-screen min-w-[100%]" style={{ 
          backgroundImage: `url(${homebg})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center'
        }}>
          <div className="flex items-center justify-center space-x-4">
            <div className="w-3/5 border-t border-pink-500"></div>
            <div className="text-white text-6xl font-light tracking-widest animate-fadeIn">PANNIPITIYA</div>
            <div className="w-3/5 border-t border-pink-500"></div>
          </div>
          <h1 className="text-white text-9xl font-light my-8 animate-slideIn">CUT &#8216;N&#8217; CURL</h1>
          <h2 className="text-pink-500 text-6xl font-light tracking-wide animate-bounce">BASHI BRIDAL BEAUTY SALON</h2>
        </div>

        {/* Rest of the content */}
        <div id="about" className="relative bg-white py-16 px-8 md:px-16 min-h-screen animate-fadeIn">
          {/* About section content */}
        </div>

        <div id="products" className="bg-gray-200 py-16 px-8 md:px-16 min-h-screen w-[100%] animate-fadeIn rounded-t-[20%]">
          <h3 className="text-3xl font-light text-center mb-8 text-black">Products <span className="text-pink-500">&rhard;</span></h3>
          <div className="flex flex-col md:flex-row justify-center space-y-8 md:space-y-0 md:space-x-8">
            <Card />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReadOneHome;
