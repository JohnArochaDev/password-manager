import React from 'react';
import ReactDOM from 'react-dom';

const Popup = () => {
  const handleClick = () => {
    chrome.runtime.sendMessage({ action: 'reopenExtension' });
  };

  return (
    <div style={popupStyle}>
      <h3>SafePass Notification</h3>
      <p>Your extension is closed. Click here to reopen it.</p>
      <button onClick={handleClick}>Reopen</button>
    </div>
  );
};

const popupStyle = {
  position: 'fixed',
  bottom: '10px',
  right: '10px',
  width: '300px',
  height: '150px',
  backgroundColor: 'white',
  border: '1px solid #ccc',
  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  zIndex: '10000',
  padding: '10px',
};

export default Popup;

// Function to render the popup
export const renderPopup = () => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  ReactDOM.render(<Popup />, div);
  console.log('Popup rendered');
};