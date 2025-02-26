import React, { useState, useRef, useEffect } from "react";

const CreateWorkshopModal = ({ isOpen, onClose, onSave, onRequest }) => {
  const [workshopData, setWorkshopData] = useState({
    name: "",
    location: "",
    date: "",
    image: "",
    ticketPrice: "",
    ticketSlots: ""
  });
  
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkshopData({
      ...workshopData,
      [name]: value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg p-6 w-full max-w-md my-4 shadow-xl"
      >
        <h2 className="text-xl font-bold mb-4">Create new workshop</h2>
        
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <div className="mb-3">
            <label className="block mb-1">Workshop Name</label>
            <input
              type="text"
              name="name"
              value={workshopData.name}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>
          
          <div className="mb-3">
            <label className="block mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={workshopData.location}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>
          
          <div className="mb-3">
            <label className="block mb-1">Date</label>
            <input
              type="text"
              name="date"
              value={workshopData.date}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>
          
          <div className="mb-3">
            <label className="block mb-1">Image</label>
            <div className="flex">
              <input
                type="text"
                name="image"
                value={workshopData.image}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
              <button className="ml-2 border rounded-md p-2">+</button>
            </div>
          </div>
          
          <div className="mb-3">
            <label className="block mb-1">Ticket Price</label>
            <input
              type="text"
              name="ticketPrice"
              value={workshopData.ticketPrice}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>
          
          <div className="mb-5">
            <label className="block mb-1">Ticket Slots</label>
            <input
              type="text"
              name="ticketSlots"
              value={workshopData.ticketSlots}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>
        </div>
        
        <div className="flex justify-between pt-3 border-t mt-2">
          <div>
            <button 
              onClick={onRequest}
              className="bg-white border rounded-md px-4 py-2 mr-2"
            >
              Request
            </button>
            <button 
              onClick={onClose}
              className="bg-white border rounded-md px-4 py-2"
            >
              Cancel
            </button>
          </div>
          <button 
            onClick={() => onSave(workshopData)}
            className="bg-white border rounded-md px-4 py-2"
          >
            Save as Draft
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkshopModal; 