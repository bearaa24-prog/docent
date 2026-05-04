
import React from 'react';
import { Pencil } from 'lucide-react';
import ZoomableImage from './ZoomableImage';
import AudioPlayer from './AudioPlayer';
import { Artwork } from '../types';

interface GalleryCardProps {
  artwork: Artwork;
  onEdit?: (artwork: Artwork) => void;
}

const GalleryCard: React.FC<GalleryCardProps> = ({ artwork, onEdit }) => {
  return (
    <div className="flex flex-col h-full max-h-[82vh] w-full max-w-[420px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-neutral-100 m-auto relative transform transition-transform duration-500">
      <ZoomableImage src={artwork.image} alt={artwork.title} />
      
      <div className="flex flex-col p-6 space-y-4">
        <div className="flex justify-between items-end gap-4">
          <div className="flex-1">
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1.5">
              {artwork.docent} 도슨트
            </p>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-neutral-900 leading-tight serif truncate">
                {artwork.title}
              </h2>
              {onEdit && (
                <button 
                  onClick={() => onEdit(artwork)}
                  className="p-2 text-neutral-300 hover:text-neutral-900 transition-colors"
                  title="수정하기"
                >
                  <Pencil size={14} />
                </button>
              )}
            </div>
          </div>
          <div className="w-8 h-8 rounded-full border border-neutral-100 flex items-center justify-center shrink-0">
             <span className="text-[9px] font-black italic text-neutral-300">#0{artwork.id.slice(0,1)}</span>
          </div>
        </div>

        <div className="w-full pt-1">
           <AudioPlayer src={artwork.audio} />
        </div>
      </div>
      
      {/* Subtle Archive label */}
      <div className="absolute top-8 left-8 mix-blend-difference pointer-events-none">
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-white/60 text-[10px] tracking-widest font-medium uppercase">온라인 감상실</span>
         </div>
      </div>
    </div>
  );
};

export default GalleryCard;
