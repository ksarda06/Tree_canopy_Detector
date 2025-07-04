import React, { useState } from 'react';
import MapComponent from './Mapcomponent';

function App() {
  const [result, setResult] = useState(null);

  const handleAnalyze = async (bounds) => {
  console.log('Sending bounds to backend:', bounds);

  // Get the center point of the rectangle AOI:
  const lat = (bounds.north + bounds.south) / 2;
  const lng = (bounds.east + bounds.west) / 2;
  const zoom = 18; // Example zoom level for test

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/test-preprocess?lat=${lat}&lng=${lng}&zoom=${zoom}`,
      {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      }
    );

    const data = await response.json();
    console.log('✅ Backend response:', data);

    // Store entire JSON for inspection:
    setResult(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error calling backend:', error);
    alert('Backend error');
  }
};


  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <MapComponent onAnalyze={handleAnalyze} />
      {result && (
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            backgroundColor: '#fff',
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            fontWeight: 'normal',
            maxWidth: '300px',
            wordBreak: 'break-word',
          }}
        >
          <strong>Backend Response:</strong>
          <pre
            style={{
              textAlign: 'left',
              fontSize: '12px',
              marginTop: '0.5rem',
              maxHeight: '300px',
              overflowY: 'auto',
            }}
          >
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;
