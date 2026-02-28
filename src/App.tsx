import React, { useState } from 'react';
import SetupForm from './components/SetupForm';
import Dashboard from './components/Dashboard';
import { HackathonData } from './types';
import { INITIAL_DATA } from './constants';

export default function App() {
  const [data, setData] = useState<HackathonData | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // For demo purposes, we can pre-fill with mock data if needed
  // useEffect(() => {
  //   setData(INITIAL_DATA);
  //   setIsInitialized(true);
  // }, []);

  const handleSetupComplete = (setupData: HackathonData) => {
    // In a real app, we'd call an AI service here to generate tasks
    // For this demo, we'll use the initial mock tasks but with the user's team info
    setData({
      ...setupData,
      tasks: INITIAL_DATA.tasks, // Use mock tasks for the demo
    });
    setIsInitialized(true);
  };

  const handleUpdateData = (updatedData: HackathonData) => {
    setData(updatedData);
  };

  if (!isInitialized || !data) {
    return <SetupForm onComplete={handleSetupComplete} />;
  }

  return (
    <Dashboard 
      data={data} 
      onUpdateData={handleUpdateData} 
    />
  );
}
