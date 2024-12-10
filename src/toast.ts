import { toast as hotToast } from 'react-hot-toast';

const toast = {
  success: (message: string) => {
    hotToast.success(message, {
      style: {
        background: '#000',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
      duration: 2000,
    });
  },
  error: (message: string) => {
    hotToast.error(message, {
      style: {
        background: '#fff',
        color: '#000',
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid #f87171',
      },
      duration: 3000,
    });
  },
};

export default toast;
