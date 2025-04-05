import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Collection trend data
const collectionData = [
  { date: '29/03', value: 1.2 },
  { date: '30/03', value: 2.1 },
  { date: '31/03', value: 1.8 },
  { date: '01/04', value: 2.8 },
  { date: '02/04', value: 2.4 },
  { date: '03/04', value: 2.0 },
  { date: '04/04', value: 3.2 }
];

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Function to format numbers with Indian currency notation
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Sidebar content component to reuse in both mobile and desktop views
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex items-center space-x-2">
        <img src="/logo.svg" alt="Malabar Eco" className="h-8" />
        <h1 className="text-xl font-bold">Malabar Eco</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            ) },
            { id: 'locations', label: 'Locations', icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ) },
            { id: 'collections', label: 'Collections', icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            ) },
            { id: 'inventory', label: 'Inventory', icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            ) },
            { id: 'sales', label: 'Sales', icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            ) },
            { id: 'expenses', label: 'Expenses', icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) },
            { id: 'reports', label: 'Reports', icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            ) },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (isMobile) setSidebarOpen(false);
              }}
              className={`w-full flex items-center rounded-lg transition-colors duration-200 px-3 py-2 ${
                activeTab === item.id 
                  ? 'bg-green-600 text-white' 
                  : 'text-gray-700 hover:text-green-600 hover:bg-gray-100'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="ml-3 font-medium">{item.label}</span>
            </button>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">TRANSPORT</div>
          <div className="mt-3 space-y-1">
            {[
              { id: 'vehicles', label: 'Vehicles', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              ) },
              { id: 'drivers', label: 'Drivers', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ) },
              { id: 'trips', label: 'Trips', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              ) },
              { id: 'token', label: 'Token Lookup', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              ) },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (isMobile) setSidebarOpen(false);
                }}
                className={`w-full flex items-center rounded-lg transition-colors duration-200 px-3 py-2 ${
                  activeTab === item.id 
                    ? 'bg-green-600 text-white' 
                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-100'
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="ml-3 font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
      
      {/* User profile */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1">
            <div className="font-medium">{user?.name || 'User'}</div>
            <div className="text-xs text-gray-500">Admin</div>
          </div>
          <button 
            onClick={onLogout}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Logout"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Mobile Sidebar */}
      {isMobile ? (
        <>
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="left" className="p-0 w-[280px] border-r">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </>
      ) : (
        /* Desktop Sidebar */
        <div className="w-64 bg-white shadow-md z-10 flex flex-col h-screen sticky top-0">
          <SidebarContent />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className={`sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200 ${isMobile ? 'block' : 'hidden'}`}>
          <div className="flex items-center justify-between px-4 py-3">
            <Button 
              variant="ghost" 
              size="sm"
              className="p-2 -ml-2"
              aria-label="Menu"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
            
            <div className="flex items-center">
              <img src="/logo.svg" alt="Malabar Eco" className="h-7" />
              <h1 className="text-lg font-bold ml-2">Malabar Eco</h1>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="p-2 rounded-full"
              aria-label="Profile"
            >
              <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </Button>
          </div>
        </div>
        
        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="p-4 md:p-6 lg:p-8">
            <div className="mb-6">
              <h1 className="text-xl md:text-2xl font-bold">Welcome, {user?.name || 'Admin User'}</h1>
              <p className="text-sm md:text-base text-gray-600">Here's an overview of Malabar Eco Solutions' operations</p>
            </div>

            {/* Stats Cards - Now scrollable horizontally on mobile */}
            <div className="mb-8 -mx-4 md:mx-0 px-4 md:px-0">
              <div className={isMobile ? "flex overflow-x-auto pb-2 space-x-4" : "grid grid-cols-2 lg:grid-cols-4 gap-6"}>
                {/* Stat cards with consistent min-width for mobile scrolling */}
                {[
                  {
                    title: "Total Collections",
                    value: "2",
                    subtext: "+0 today",
                    icon: (
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    )
                  },
                  {
                    title: "Inventory Value",
                    value: "₹44",
                    subtext: "Estimated value",
                    icon: (
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    )
                  },
                  {
                    title: "Total Sales",
                    value: "₹55,345",
                    subtext: "From all recorded sales",
                    icon: (
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    )
                  },
                  {
                    title: "Total Expenses",
                    value: "₹1,000",
                    subtext: "All recorded expenses",
                    icon: (
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )
                  },
                ].map((stat, index) => (
                  <div 
                    key={index} 
                    className={`bg-white rounded-lg shadow-sm p-5 border border-gray-100 flex-shrink-0 ${
                      isMobile ? 'w-[240px]' : 'w-full'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-700 font-medium">{stat.title}</span>
                      <div className="p-2 bg-gray-50 rounded-full">{stat.icon}</div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{stat.value}</h2>
                      <p className="text-sm text-gray-500 mt-1">{stat.subtext}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts & Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Collection Trend Chart - Using Recharts for better visualization */}
              <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
                <h2 className="text-lg font-medium mb-1">Collection Trend</h2>
                <p className="text-sm text-gray-500 mb-4">Daily collection amounts for the past week</p>
                
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={collectionData}
                      margin={{
                        top: 5,
                        right: 5,
                        left: 5,
                        bottom: 20,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `₹${value}`}
                        domain={[0, 'dataMax + 0.5']}
                      />
                      <Tooltip 
                        formatter={(value) => [`₹${value}`, 'Collection']}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="#10B981" 
                        radius={[4, 4, 0, 0]}
                        name="Collection"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Sales */}
              <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-lg font-medium mb-1">Recent Sales</h2>
                    <p className="text-sm text-gray-500">Latest sales transactions</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">
                    View All
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {[
                    {
                      title: "MALAPPURAM",
                      description: "4520 units of cardboard",
                      amount: 45220
                    },
                    {
                      title: "asap cement",
                      description: "10 units of metal",
                      amount: 10000
                    },
                    {
                      title: "Yy",
                      description: "12554 units of other",
                      amount: 125
                    }
                  ].map((sale, index) => (
                    <div 
                      key={index} 
                      className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="h-10 w-10 rounded-full flex items-center justify-center bg-green-100 text-green-600 mr-4">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{sale.title}</h3>
                        <p className="text-sm text-gray-500">{sale.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold">{formatCurrency(sale.amount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions Section - New for mobile experience */}
            {isMobile && (
              <div className="mt-8 bg-white rounded-lg shadow-sm p-5 border border-gray-100">
                <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { 
                      label: "New Collection", 
                      icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      ), 
                      color: "bg-green-100 text-green-600" 
                    },
                    { 
                      label: "Add Sale", 
                      icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      ), 
                      color: "bg-purple-100 text-purple-600" 
                    },
                    { 
                      label: "Scan Token", 
                      icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                      ), 
                      color: "bg-blue-100 text-blue-600" 
                    }
                  ].map((action, index) => (
                    <button 
                      key={index}
                      className="flex flex-col items-center justify-center p-4 rounded-lg transition-colors duration-200 border border-gray-100"
                    >
                      <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center mb-2`}>
                        {action.icon}
                      </div>
                      <span className="text-xs font-medium text-center">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Other tabs would go here but we're only keeping the dashboard as requested */}
        {activeTab !== 'dashboard' && (
          <div className="flex items-center justify-center h-[80vh]">
            <div className="text-center p-6">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-700">Coming Soon</h2>
              <p className="text-gray-500 mt-2">This section is under development</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setActiveTab('dashboard')}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;