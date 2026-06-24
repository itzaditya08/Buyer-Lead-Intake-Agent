import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';

export default function App() {
    const [isGlobalLoading, setIsGlobalLoading] = useState(false);
    const [leadsData, setLeadsData] = useState(null);

    return (
        <Layout isGlobalLoading={isGlobalLoading}>
            <Dashboard 
                leadsData={leadsData} 
                setLeadsData={setLeadsData} 
                setIsGlobalLoading={setIsGlobalLoading} 
            />
        </Layout>
    );
}