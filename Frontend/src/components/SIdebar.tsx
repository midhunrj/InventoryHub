import React, { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router';

import { Link } from 'react-router-dom';
import { FaHome, FaUsers, FaTheaterMasks, FaFilm, FaBars, FaClosedCaptioning, FaAtlas, FaTimes, FaSlack, FaSalesforce, FaChartLine, FaHistory, FaReceipt } from 'react-icons/fa'
import { FiLogOut } from 'react-icons/fi';
import { useAuthContext } from '../context/authContext';

type SidebarMenuProps = {
  children: ReactNode
};

const SidebarMenu: React.FC<SidebarMenuProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const{setUserAuthenticated}=useAuthContext()

  const handleLogout = () => {
    localStorage.removeItem('userData')
    setUserAuthenticated(false)
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div 
        className={`
          ${isCollapsed ? 'w-20' : 'w-1/5'} 
          bg-gradient-to-r from-slate-900 to-gray-800 
          text-white flex flex-col justify-around
          p-6 transition-all duration-500 ease-in-out
        `}
      >
        {/* Hamburger/Menu Toggle Button */}
        <div className="flex justify-around -mt-20">
          <button 
            onClick={toggleSidebar} 
            className={`${isCollapsed?'hover:bg-yellow-400 min-h-6 p-1':'p-2 rounded-lg transition duration-200'}`}
          >
            {!isCollapsed?<><FaBars className="text-xl" />
            </>:<FaTimes className="text-xl"/>}
          </button>
          {!isCollapsed?<>
            <div className="flex items-center space-x-2">
      
      {/* <img src="/movielogo 2.jpeg" alt="Logo" className="h-10 w-10 object-cover" />
       */}
      <h1 className="text-2xl font-bold">INVENTZZ</h1>
    </div></>:null}
          
        </div>

        <div>
          <div className="space-y-6">
            <Link
              to="/home"
              className={`
                ${isCollapsed ? 'justify-center px-2 py-2' : 'px-4 py-2'}
                rounded-lg transition duration-200 flex items-center 
                ${isActive('/home') ? 'bg-yellow-500 text-blue-950' : 'hover:bg-yellow-400 hover:text-blue-950'}
              `}
            >
              <FaHome className="text-lg" />
              {!isCollapsed && <span className="ml-2">Dashboard</span>}
            </Link>
            <Link
              to="/sales"
              className={`
                ${isCollapsed ? 'justify-center px-2 py-2' : 'px-4 py-2'}
                rounded-lg transition duration-200 flex items-center 
                ${isActive('/sales') ? 'bg-yellow-500 text-blue-950' : 'hover:bg-yellow-400 hover:text-blue-950'}
              `}
            >
              <FaUsers className="text-lg" />
              {!isCollapsed && <span className="ml-2">Sales</span>}
            </Link>
            <Link
              to="/customers"
              className={`
                ${isCollapsed ? 'justify-center px-2 py-2' : 'px-4 py-2'}
                rounded-lg transition duration-200 flex items-center 
                ${isActive('/customers') ? 'bg-yellow-500 text-blue-950' : 'hover:bg-yellow-400 hover:text-blue-950'}
              `}
            >
              <FaTheaterMasks className="text-lg" />
              {!isCollapsed && <span className="ml-2">customers</span>}
            </Link>
            <Link
              to="/products"
              className={`
                ${isCollapsed ? 'justify-center px-2 py-2' : 'px-4 py-2'}
                rounded-lg transition duration-200 flex items-center 
                ${isActive('/products')  ? 'bg-yellow-500 text-blue-950' : 'hover:bg-yellow-400 hover:text-blue-950'}
              `}
            >
              <FaFilm className="text-lg" />
              {!isCollapsed && <span className="ml-2">Product Management</span>}
            </Link>
            <Link
              to="/sale-reports"
              className={`
                ${isCollapsed ? 'justify-center px-2 py-2' : 'px-4 py-2'}
                rounded-lg transition duration-200 flex items-center 
                ${isActive('/sale-reports')  ? 'bg-yellow-500 text-blue-950' : 'hover:bg-yellow-400 hover:text-blue-950'}
              `}
            >
              <FaReceipt className="text-lg" />
              {!isCollapsed && <span className="ml-2">Sale reports</span>}
            </Link>
          </div>
        </div>

        {/* Logout Button */}
        <div>
        <button
          onClick={handleLogout}
          className={`
            ${isCollapsed ? 'justify-center px-2 py-2 w-fit ' : 'px-4 py-2 w-full '}
            min-h-8 bg-red-500  rounded-lg hover:bg-red-600 
            transition duration-200 flex items-center 
          `}
        >
          <FiLogOut className="text-lg" />
          {!isCollapsed && <span className="ml-2">Logout</span>}
        </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`
        ${isCollapsed ? 'w-[calc(100%-5rem)]' : 'w-4/5'} 
        bg-gray-100 p-8 overflow-y-auto 
        transition-all duration-300 ease-in-out
      `}>
        {children}
      </div>
    </div>
  );
};

export default SidebarMenu;