"use client";

import { useState } from "react";

interface TrackingFormProps {
  onSearch: (trackingId: string) => void;
  params: { order_Id: string };
}

const TrackingForm: React.FC<TrackingFormProps> = ({ onSearch, params }) => {
  const [trackingId, setTrackingId] = useState(params.order_Id || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      onSearch(trackingId.trim());
    }
  };

  return (
    <div className="w-full p-4 max-w-lg mx-auto">
      <h1 className="text-lg sm:text-2xl font-semibold text-center mb-4">
        Order ID{trackingId !== "" && `: ${trackingId}`}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="text"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          placeholder="Enter your tracking ID"
          className="p-2 w-full border rounded-lg mb-4 focus:outline-none focus:border-udua-orange-primary"
        />
        <button
          type="submit"
          className="w-full bg-udua-orange-primary/85 text-white p-2 rounded-lg hover:bg-udua-orange-primary transition"
        >
          Track Order
        </button>
      </form>
    </div>
  );
};

export default TrackingForm;
