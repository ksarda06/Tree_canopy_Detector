import React, { useState } from 'react';
import Mapcomponent from './Mapcomponent';

function App() {
  const [result, setResult] = useState(null);

  const handleAnalyze = async (bounds) => {
    console.log('Sending bounds to backend:', bounds);

    try {
      const response = await fetch("https://YOUR-BACKEND-URL/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bounds),
      });

      const data = await response.json();
      setResult(data.tree_coverage_percent);
    } catch (error) {
      console.error('Error calling backend:', error);
      alert("Backend error");
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Mapcomponent onAnalyze={handleAnalyze} />
    </div>
  );
}

export default App;
