
import React, { useState } from 'react';
import { Plus, LayoutGrid, SquareLibrary, ArrowUpRight, CheckCircle2, GalleryHorizontalEnd } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GalleryCard from './components/GalleryCard';
import AddWorkModal from './components/AddWorkModal';
import { Artwork } from './types';

const INITIAL_ARTWORKS: Artwork[] = [
  {
    id: '1',
    title: 'Starry Night',
    docent: 'Vincent van Gogh',
    image: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=1000&auto=format&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    createdAt: Date.now()
  },
  {
    id: '2',
    title: 'Modern Architecture',
    docent: 'Zaha Hadid',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    createdAt: Date.now()
  },
  {
    id: '3',
    title: 'Silent Mountains',
    docent: 'Ansel Adams',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    createdAt: Date.now()
  }
];

const App: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>(INITIAL_ARTWORKS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<Artwork | null>(null);
  const [viewMode, setViewMode] = useState<'GALLERY' | 'COLLECTION'>('COLLECTION');

  const handleSaveArtwork = (artwork: Artwork) => {
    if (editingWork) {
      setArtworks(artworks.map(a => a.id === artwork.id ? artwork : a));
    } else {
      setArtworks([artwork, ...artworks]);
      if (viewMode === 'GALLERY') setCurrentIndex(0);
    }
    setEditingWork(null);
  };

  const handleEdit = (artwork: Artwork) => {
    setEditingWork(artwork);
    setIsModalOpen(true);
  };

  const jumpToGallery = (index: number) => {
    setCurrentIndex(index);
    setViewMode('GALLERY');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-neutral-50 flex flex-col font-sans">
      {/* Refined Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-5 bg-gradient-to-b from-white/80 to-transparent backdrop-blur-sm">
        <div className="flex flex-col">
          <h1 className="text-xl font-black serif text-neutral-900 tracking-tighter">도슨트</h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">라이브 전시 중</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle Button */}
          <button 
            onClick={() => setViewMode(viewMode === 'GALLERY' ? 'COLLECTION' : 'GALLERY')}
            className="p-2.5 bg-white border border-neutral-200 text-neutral-800 rounded-full shadow-sm hover:bg-neutral-50 transition-all active:scale-95"
            title={viewMode === 'GALLERY' ? "소장품 보기" : "갤러리로 돌아가기"}
          >
            {viewMode === 'GALLERY' ? <LayoutGrid size={18} /> : <GalleryHorizontalEnd size={18} />}
          </button>

          {/* Add Button */}
          <button 
            onClick={() => {
              setEditingWork(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white rounded-full text-[10px] font-bold hover:bg-neutral-800 transition-all shadow-lg active:scale-95 border border-white/10"
          >
            <Plus size={14} /> 작품 추가
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-grow relative overflow-hidden">
        <AnimatePresence mode="wait">
          {viewMode === 'GALLERY' ? (
            <motion.main
              key="gallery-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full flex flex-col items-center justify-center pt-12 px-4"
            >
              {artworks.length > 0 ? (
                <div className="relative w-full max-w-[420px] h-[85vh] flex items-center justify-center">
                  <GalleryView 
                    artworks={artworks} 
                    currentIndex={currentIndex} 
                    setCurrentIndex={setCurrentIndex} 
                    onEdit={handleEdit}
                  />
                </div>
              ) : (
                <EmptyState />
              )}
            </motion.main>
          ) : (
            <motion.main
              key="collection-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full pt-28 pb-10 px-6 overflow-y-auto custom-scrollbar"
            >
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <h2 className="text-3xl font-black serif text-neutral-900">소장품</h2>
                  <p className="text-xs text-neutral-500 font-bold mt-2 lowercase tracking-normal">총 {artworks.length}개의 작품을 감상해보세요</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {artworks.map((work, index) => (
                    <motion.button
                      key={work.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => jumpToGallery(index)}
                      className={`group relative aspect-[3/4] rounded-[2rem] overflow-hidden transition-all duration-500 text-left ${index === currentIndex ? 'ring-2 ring-neutral-900 ring-offset-2' : 'shadow-sm border border-neutral-200'}`}
                    >
                      <img src={work.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                         <div className="flex justify-between items-center text-white">
                           <div className="overflow-hidden">
                             <p className="font-bold text-xs truncate">{work.title}</p>
                             <p className="text-[8px] opacity-70 uppercase tracking-widest truncate">{work.docent}</p>
                           </div>
                           <ArrowUpRight size={14} className="shrink-0 ml-2" />
                         </div>
                      </div>

                      {/* Top Indicator */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
                         <span className="px-2 py-0.5 bg-white/90 backdrop-blur-md text-neutral-900 text-[8px] font-black rounded-full shadow-sm">
                           #0{index + 1}
                         </span>
                         {index === currentIndex && (
                           <div className="bg-neutral-900 text-white p-1 rounded-full shadow-lg">
                             <CheckCircle2 size={10} />
                           </div>
                         )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.main>
          )}
        </AnimatePresence>
      </div>

      <AddWorkModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingWork(null);
        }} 
        onSave={handleSaveArtwork} 
        initialData={editingWork}
      />
    </div>
  );
};

// Sub-component: Gallery Logic
const GalleryView = ({ artworks, currentIndex, setCurrentIndex, onEdit }: { artworks: Artwork[], currentIndex: number, setCurrentIndex: any, onEdit: (artwork: Artwork) => void }) => {
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
      rotate: direction > 0 ? 8 : -8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
      rotate: direction < 0 ? 8 : -8,
    })
  };

  const paginate = (newDirection: number) => {
    const nextIndex = currentIndex + newDirection;
    if (nextIndex >= 0 && nextIndex < artworks.length) {
      setDirection(newDirection);
      setCurrentIndex(nextIndex);
    }
  };

  return (
    <>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={artworks[currentIndex].id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 220, damping: 24 },
            opacity: { duration: 0.2 },
            scale: { duration: 0.4 },
            rotate: { duration: 0.4 }
          }}
          className="absolute w-full h-full flex items-center justify-center"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => {
            const swipeThreshold = 50;
            if (info.offset.x < -swipeThreshold) paginate(1);
            else if (info.offset.x > swipeThreshold) paginate(-1);
          }}
        >
          <GalleryCard artwork={artworks[currentIndex]} onEdit={onEdit} />
        </motion.div>
      </AnimatePresence>

      {/* Modern Slim Pagination Dots */}
      <div className="absolute -bottom-10 flex gap-1.5 px-4 py-2 bg-white/50 backdrop-blur-md rounded-full border border-white">
        {artworks.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > currentIndex ? 1 : -1);
              setCurrentIndex(i);
            }}
            className={`h-1 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-neutral-900' : 'w-2 bg-neutral-200 hover:bg-neutral-300'}`}
          />
        ))}
      </div>
    </>
  );
};

const EmptyState = () => (
  <div className="text-center text-neutral-500">
    <SquareLibrary className="mx-auto mb-6 opacity-20" size={80} />
    <p className="text-xl font-black text-neutral-900 serif tracking-tight">전시된 작품이 없습니다</p>
    <p className="text-sm font-medium mt-3 text-neutral-400">첫 번째 걸작을 추가하여 갤러리를 시작해보세요</p>
  </div>
);

export default App;
