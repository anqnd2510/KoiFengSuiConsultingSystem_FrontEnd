import React, { useRef, useEffect } from "react";

const ViewWorkshopModal = ({ isOpen, onClose, workshop }) => {
  const modalRef = useRef(null);
  
  // Xử lý sự kiện click bên ngoài modal
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !workshop) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg p-6 w-full max-w-md my-4 shadow-xl"
      >
        <h2 className="text-xl font-bold mb-4">View workshop</h2>
        
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <div className="mb-3">
            <label className="block mb-1">Workshops Name</label>
            <input
              type="text"
              value={workshop.name || ""}
              readOnly
              className="w-full border rounded-md p-2 bg-gray-50"
            />
          </div>
          
          <div className="mb-3">
            <label className="block mb-1">Location</label>
            <input
              type="text"
              value={workshop.location || ""}
              readOnly
              className="w-full border rounded-md p-2 bg-gray-50"
            />
          </div>
          
          <div className="mb-3">
            <label className="block mb-1">Date</label>
            <input
              type="text"
              value={workshop.date || ""}
              readOnly
              className="w-full border rounded-md p-2 bg-gray-50"
            />
          </div>
          
          <div className="mb-3">
            <label className="block mb-1">Image</label>
            <div className="flex">
              <input
                type="text"
                value={workshop.image || ""}
                readOnly
                className="w-full border rounded-md p-2 bg-gray-50"
              />
              <button className="ml-2 border rounded-md p-2">+</button>
            </div>
          </div>
          
          <div className="mb-3">
            <label className="block mb-1">Ticket Price</label>
            <input
              type="text"
              value={workshop.ticketPrice || ""}
              readOnly
              className="w-full border rounded-md p-2 bg-gray-50"
            />
          </div>
          
          <div className="mb-3">
            <label className="block mb-1">Ticket Slots</label>
            <input
              type="text"
              value={workshop.ticketSlots || ""}
              readOnly
              className="w-full border rounded-md p-2 bg-gray-50"
            />
          </div>
          
          <div className="mb-5">
            <label className="block mb-1">Status</label>
            <input
              type="text"
              value={workshop.status || ""}
              readOnly
              className="w-full border rounded-md p-2 bg-gray-50"
            />
          </div>
        </div>
        
        <div className="flex justify-center pt-3 border-t mt-2">
          <button 
            onClick={onClose}
            className="bg-white border rounded-md px-4 py-2"
          >
            Return
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewWorkshopModal; 