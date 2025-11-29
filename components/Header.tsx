import React from 'react';
import { Menu, Search, User, ChevronDown } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-10">
      <div className="flex items-center flex-1 max-w-2xl">
        <button className="mr-4 text-gray-500 lg:hidden">
            <Menu className="w-6 h-6" />
        </button>
        <div className="relative w-full max-w-md">
            <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none text-sm"
            />
            {/* Search icon could go here absolutely positioned if needed */}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm font-medium shadow-sm transition-colors">
            Choose Plan
        </button>
        
        <div className="relative group">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-medium flex items-center shadow-sm">
                Create New 
                <ChevronDown className="w-4 h-4 ml-2" />
            </button>
        </div>

        <div className="bg-gray-100 hover:bg-gray-200 p-2 rounded cursor-pointer border border-gray-300">
             <div className="flex items-center gap-2">
                 <User className="w-4 h-4 text-gray-600" />
                 <ChevronDown className="w-3 h-3 text-gray-500" />
             </div>
        </div>
      </div>
    </header>
  );
};

export default Header;