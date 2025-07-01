import React, { useState, useCallback } from 'react';
import { GoogleMap, useLoadScript, DrawingManager } from '@react-google-maps/api';

const libraries = ['drawing'];

const mapContainerStyle = {
  width: '800px',
  height: '400px',
};

const center = {
  lat: 21.250000,
  lng: 81.629997,
}; // Default center (San Francisco)
export default function MapComponent({ onAnalyze }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyC-q9XC1HeM3zfEIzAsbLioaZJVhKe8ciI",  // REPLACE THIS
    libraries,
  });

  const [rectangleBounds, setRectangleBounds] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
    const [rectangleOverlay, setRectangleOverlay] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(12);   // NEW

  const [mapInstance, setMapInstance] = useState(null);
  const handleMapLoad = (map) => {
  map.setMapTypeId('satellite');
  setMapInstance(map);     // NEW
  setZoomLevel(map.getZoom());
  };
  const handleZoomChanged = () => {
    if (mapInstance) {
      setZoomLevel(mapInstance.getZoom());
    }
  };
  const onRectangleComplete = useCallback((rectangle) => {
    const bounds = rectangle.getBounds();
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    const selectedBounds = {
      north: ne.lat(),
      east: ne.lng(),
      south: sw.lat(),
      west: sw.lng(),
    };

     setRectangleOverlay(rectangle);
    setRectangleBounds(selectedBounds);
    setStatusMessage('Rectangle drawn. Click Submit to send.');

    // Optionally remove the rectangle from map after drawing
//rectangle.setMap(null);
  },[]);
  
   const handleSubmit = async () => {
    if (!rectangleBounds) {
      setStatusMessage('No rectangle drawn yet.');
      return;
    }

    try {
      setStatusMessage('Submitting polygon to backend...');

      // Example backend POST request
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rectangleBounds),
      });

      if (!response.ok) throw new Error('Server error');
      const data = await response.json();

      setStatusMessage('Polygon submitted successfully!');
      console.log('Server response:', data);
    } catch (error) {
      console.error(error);
      setStatusMessage('Error submitting polygon.');
    }
  };

  const handleClear = () => {
   if (rectangleOverlay) {
      rectangleOverlay.setMap(null);
      setRectangleOverlay(null);
    }
    setRectangleBounds(null);
    setStatusMessage('Polygon cleared.');
  };



  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div  style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f4f4f4',
      }}>
    <div style={{
          padding: '2rem',
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}>
      <h1 style={{ marginBottom: '1rem', color:'black'}}>Tree Canopy Detector</h1>
      <GoogleMap 
        mapContainerStyle={mapContainerStyle}
        zoom={40}
        center={center}
        //mapTypeId="satellite"
        options={{
          mapTypeControl: false,
        }}
        onLoad={handleMapLoad}
        onZoomChanged={handleZoomChanged}  // NEW

      >
        <DrawingManager
          onRectangleComplete={onRectangleComplete}
          options={{
            drawingControl: true,
            drawingControlOptions: {
              drawingModes: ['rectangle']
            }
          }}
        />
      </GoogleMap>
       <div style={{ marginTop: '0.5rem', fontWeight: 'bold', color:'black'}}>
          Current Zoom Level: {zoomLevel}
        </div>
      <div className="controls" style={{ marginTop: '1rem', textAlign: 'center' }}>
        <button  onClick={handleSubmit} style={{ marginRight: '1rem' }}>
          Submit Rectangle
        </button>
        <button onClick={handleClear}>
          Clear Rectangle
        </button>
      </div>

      <div id="result" style={{ marginTop: '1rem', textAlign: 'center' }}>
        <p id="status">h</p>
      </div>
      </div>
    </div>  
  );
}
