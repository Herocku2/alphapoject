import { Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';

import Dashboard from './modules/dashboard/Dashboard';
import Quoter from './modules/quoter/Quoter';
import CRM from './modules/crm/CRM';
import Operations from './modules/operations/Operations';
import AIAssistant from './modules/ai/AIAssistant';
import Settings from './modules/admin/Settings';
import Pricing from './modules/admin/Pricing';
import VendorPricing from './modules/admin/VendorPricing';
import ClientPortal from './modules/portal/ClientPortal';

// All modules are now implemented and imported.

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<Dashboard />} />
        <Route path="quoter" element={<Quoter />} />
        <Route path="crm" element={<CRM />} />
        <Route path="operations" element={<Operations />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="vendor-pricing" element={<VendorPricing />} />
        <Route path="ai" element={<AIAssistant />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="/portal" element={<ClientPortal />} />
    </Routes>
  );
}

export default App;
