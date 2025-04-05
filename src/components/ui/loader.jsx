import { cn } from "@/lib/utils";
import { useState, useEffect } from 'react';

const Loader = ({ className }) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    setVisible(true);
    return () => setVisible(false);
  }, []);
  
  return (
    <div className={cn(
      "fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm",
      className
    )}>
      <div 
        className={cn(
          "relative h-16 w-16 transition-all duration-500",
          visible ? "opacity-100 scale-100" : "opacity-0 scale-75"
        )}
      >
        <img
          src="/logo.svg"
          alt="Loading..."
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
};

export default Loader;