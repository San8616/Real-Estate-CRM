import { useState } from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Properties from './pages/Properties';
import Bookings from './pages/Bookings';
import PlaceholderPage from './pages/PlaceholderPage';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';

function AuthenticatedCRM() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <DashboardLayout
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      onNewLeadClick={() => setActiveTab('leads')}
    >
      {activeTab === 'dashboard' ? (
        <Dashboard onNavigate={setActiveTab} />
      ) : activeTab === 'leads' ? (
        <Leads />
      ) : activeTab === 'properties' ? (
        <Properties />
      ) : activeTab === 'bookings' ? (
        <Bookings />
      ) : (
        <PlaceholderPage
          pageId={activeTab}
          onBackToDashboard={() => setActiveTab('dashboard')}
        />
      )}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AuthenticatedCRM />
    </AuthProvider>
  );
}
