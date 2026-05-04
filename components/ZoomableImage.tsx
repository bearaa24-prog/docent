
import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ZoomableImageProps {
  src: string;
  alt: string;
}

const ZoomableImage: React.FC<ZoomableImageProps> = ({ src, alt }) => {
  const [scale, setScale] = useState(1);
  const controls = useAnimation();

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.5, 1));
  const handleReset = () => {
    setScale(1);
    controls.start({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full h-[60vh] overflow-hidden bg-neutral-900 rounded-t-[2rem] border-b border-neutral-100 shadow-inner group">
      {/* Background Blur to fill empty space without distorting original image */}
      <div 
        className="absolute inset-0 opacity-30 blur-2xl scale-110 pointer-events-none"
        style={{ 
          backgroundImage: `url(${src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      <motion.div
        animate={controls}
        className="relative w-full h-full cursor-move flex items-center justify-center"
        drag={scale > 1}
        dragConstraints={{ left: -300 * scale, right: 300 * scale, top: -300 * scale, bottom: 300 * scale }}
      >
        <motion.img
          src={src}
          alt={alt}
          animate={{ scale }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="max-w-full max-h-full object-contain origin-center shadow-2xl"
          draggable={false}
        />
      </motion.div>

      {/* Zoom Controls Overlay */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button 
          onClick={handleZoomIn}
          className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-xl hover:bg-white text-neutral-800 transition-colors"
        >
          <ZoomIn size={22} />
        </button>
        <button 
          onClick={handleZoomOut}
          className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-xl hover:bg-white text-neutral-800 transition-colors"
        >
          <ZoomOut size={22} />
        </button>
        <button 
          onClick={handleReset}
          className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-xl hover:bg-white text-neutral-800 transition-colors"
        >
          <RotateCcw size={22} />
        </button>
      </div>
      
      {scale > 1 && (
        <div className="absolute top-6 left-6 px-4 py-1.5 bg-black/60 text-white text-[10px] font-bold rounded-full backdrop-blur-md uppercase tracking-widest z-10">
          Zoomed x{scale.toFixed(1)}
        </div>
      )}
    </div>
  );
};

export default ZoomableImage;
