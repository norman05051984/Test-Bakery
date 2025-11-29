import React from 'react';
import { 
  LayoutDashboard, 
  ChefHat, 
  Package, 
  Calendar, 
  FolderOpen, 
  HelpCircle, 
  MessageSquare,
  Video,
  Settings
} from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const menuItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.RECIPES, label: 'Recipes', icon: ChefHat },
    { id: ViewState.INGREDIENTS, label: 'Ingredients', icon: Package },
  ];

  const planningItems = [
    { id: ViewState.PLANNING, label: 'Production Plans', icon: Calendar },
    { id: 'new_plan', label: 'New Plan', icon: Calendar },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0 z-10 font-sans">
      <div className="p-4 flex items-center space-x-2 border-b border-slate-700">
        <div className="bg-brand p-1.5 rounded-md">
           <ChefHat className="text-white w-6 h-6" />
        </div>
        <span className="font-bold text-white text-lg tracking-tight">BakeryCostPro</span>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-4 mb-2">
           <button className="w-full bg-white text-slate-900 rounded-full py-2 px-4 flex items-center justify-center font-medium hover:bg-gray-100 transition-colors">
             <MessageSquare className="w-4 h-4 mr-2" />
             Send Feedback
           </button>
        </div>

        <nav className="mt-4 px-2 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                currentView === item.id 
                  ? 'bg-sky-600 text-white shadow-md' 
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-8 px-5">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Planning</h3>
          <div className="space-y-1">
            {planningItems.map((item) => (
              <button
                key={item.id}
                onClick={() => item.id === ViewState.PLANNING && onViewChange(item.id)}
                 className={`w-full flex items-center px-0 py-2 text-sm font-medium transition-colors hover:text-white ${
                   currentView === item.id ? 'text-white' : 'text-slate-400'
                 }`}
              >
                <item.icon className="w-5 h-5 mr-3 opacity-70" />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 px-5">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Lists & Categories</h3>
          <div className="space-y-1">
             <button className="w-full flex items-center px-0 py-2 text-sm font-medium text-slate-400 hover:text-white">
                <FolderOpen className="w-5 h-5 mr-3 opacity-70" />
                Categories
             </button>
             <button className="w-full flex items-center px-0 py-2 text-sm font-medium text-slate-400 hover:text-white">
                <Package className="w-5 h-5 mr-3 opacity-70" />
                Suppliers
             </button>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <div className="space-y-3">
           <button className="flex items-center text-sm text-slate-400 hover:text-white">
              <Video className="w-5 h-5 mr-3" />
              Video Tutorials
           </button>
           <button className="flex items-center text-sm text-slate-400 hover:text-white">
              <HelpCircle className="w-5 h-5 mr-3" />
              Help Center
           </button>
           <button className="flex items-center text-sm text-slate-400 hover:text-white">
              <Settings className="w-5 h-5 mr-3" />
              Settings
           </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;