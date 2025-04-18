import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.simplified'
import '../index.css'

console.log('Simplified main.tsx is running');

try {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('Root element not found');
    document.body.innerHTML = '<div style="padding: 20px; color: red;">Error: Root element not found</div>';
  } else {
    console.log('Root element found, creating React root');
    const root = ReactDOM.createRoot(rootElement);
    
    console.log('Rendering App component');
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('App rendered successfully');
  }
} catch (error) {
  console.error('Error in main.tsx:', error);
  document.body.innerHTML = `<div style="padding: 20px; color: red;">
    <h2>Error initializing application</h2>
    <p>${error instanceof Error ? error.message : String(error)}</p>
  </div>`;
}