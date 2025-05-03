import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PieChart, Receipt, Tag, Menu, X } from 'lucide-react';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  const closeSidebar = () => {
    setIsOpen(false);
  };
  
  const navItems = [
    {
      to: '/dashboard',
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard'
    },
    {
      to: '/categories',
      icon: <Tag size={20} />,
      label: 'Categories'
    },
    {
      to: '/transactions',
      icon: <Receipt size={20} />,
      label: 'Transactions'
    }
  ];
  
  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 block md:hidden">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-200 shadow-md hover:text-primary-500 dark:hover:text-primary-400 focus:outline-none"
          aria-label="Open sidebar"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-25 md:hidden"
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out md:sticky md:top-0`}
      >
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
            <PieChart size={24} className="text-primary-600 dark:text-primary-400" />
            <h2 className="ml-2 text-xl font-bold text-gray-900 dark:text-white">FinanceTrack</h2>
          </div>
          
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-primary-500 flex items-center justify-center">
                  <span className="text-white text-xs font-medium">FT</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Personal Tracker</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Version 1.0</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;