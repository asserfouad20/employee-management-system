// Toast notification utility
import { toast } from 'react-toastify';

export const showToast = {
  success: (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },
  error: (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },
  info: (message) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },
  warning: (message) => {
    toast.warning(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },
  confirm: (message, onConfirm, onCancel) => {
    const CustomToast = ({ closeToast }) => (
      <div className="animate-spread-in">
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-2xl p-6 border-2 border-orange-200">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-orange-100 rounded-full p-3">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <p className="text-center text-lg font-semibold text-gray-800 mb-6">{message}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                if (onCancel) onCancel();
                closeToast();
              }}
              className="px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                closeToast();
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );

    toast.warn(CustomToast, {
      position: "top-center",
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
      closeButton: false,
      transition: toast.TRANSITIONS.ZOOM,
      className: "toast-confirm-center",
      style: {
        marginTop: "20vh",
        minWidth: "400px",
      }
    });
  }
};
