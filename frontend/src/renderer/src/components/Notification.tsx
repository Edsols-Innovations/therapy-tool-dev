// Notification.tsx
import React from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      padding: '10px 20px',
      borderRadius: '5px',
      backgroundColor: type === 'success' ? 'green' : 'red',
      color: 'white',
      zIndex: 1000,
    }}>
      <p>{message}</p>
      <button className='underline' onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>Close</button>
    </div>
  );
};

export default Notification;
