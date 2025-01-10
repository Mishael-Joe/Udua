import { Loader } from "lucide-react";

export const ReviewSpinningLoader = () => (
  <div className="w-full h-20 flex items-center justify-center">
    <p className="w-full h-full flex items-center justify-center">
      <Loader className="animate-spin" /> Loading...
    </p>
  </div>
);
