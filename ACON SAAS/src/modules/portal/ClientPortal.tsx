import React, { useState } from 'react';
import PortalLayout from './PortalLayout';
import PortalDashboard from './PortalDashboard';
import PortalQuotes from './PortalQuotes';
import PortalTracking from './PortalTracking';
import PortalAIChat from './PortalAIChat';
import './Portal.css';

const ClientPortal: React.FC = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <PortalLayout activeTab={activeTab} onTabChange={setActiveTab}>
            {activeTab === 'dashboard' && <PortalDashboard />}
            {activeTab === 'quotes' && <PortalQuotes />}
            {activeTab === 'tracking' && <PortalTracking />}
            {activeTab === 'documents' && <PortalTracking />}
            {activeTab === 'ai-assistant' && <PortalAIChat />}
        </PortalLayout>
    );
};

// Revise: Since I want the layout to work, I'll update PortalLayout to be more flexible or just use it as is
// but I'll update PortalLayout.tsx to accept props for controlled state.

export default ClientPortal;
