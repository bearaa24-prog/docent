
import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Music, User, Type } from 'lucide-react';
import { Artwork } from '../types';

interface AddWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (artwork: Artwork) => void;
  initialData?: Artwork | null;
}

const AddWorkModal: React.FC<AddWorkModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [title, setTitle] = useState('');
  const [docent, setDocent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [audio, setAudio] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDocent(initialData.docent);
      setImage(initialData.image);
      setAudio(initialData.audio);
    } else {
      setTitle('');
      setDocent('');
      setImage(null);
      setAudio(null);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudio(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !docent || !image || !audio) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    onSave({
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      title,
      docent,
      image,
      audio,
      createdAt: initialData?.createdAt || Date.now(),
    });
    
    // Reset
    setTitle('');
    setDocent('');
    setImage(null);
    setAudio(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 flex justify-between items-center border-b border-neutral-100">
          <h3 className="text-lg font-bold text-neutral-800">{initialData ? '작품 수정' : '새 작품 추가'}</h3>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            {/* Title Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-neutral-700 mb-2">
                <Type size={16} /> 작품 제목
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="작품의 제목을 입력하세요"
                className="w-full px-4 py-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-200 transition-all text-base font-semibold"
              />
            </div>

            {/* Docent Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-neutral-700 uppercase tracking-tight mb-2">
                <User size={16} /> 도슨트 이름
              </label>
              <input
                type="text"
                value={docent}
                onChange={(e) => setDocent(e.target.value)}
                placeholder="도슨트의 이름을 입력하세요"
                className="w-full px-4 py-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-200 transition-all text-base font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Image Input */}
              <div className="relative">
                <label className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                  <ImageIcon size={14} /> 이미지
                </label>
                <div className={`relative h-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all overflow-hidden ${image ? 'border-green-400 bg-neutral-900' : 'border-neutral-200 hover:border-neutral-300'}`}>
                  {image ? (
                    <img src={image} className="h-full w-full object-contain rounded-xl" />
                  ) : (
                    <>
                      <Upload size={20} className="text-neutral-400 mb-1" />
                      <span className="text-[10px] text-neutral-500">사진 업로드</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>

              {/* Audio Input */}
              <div className="relative">
                <label className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                  <Music size={14} /> 음성 파일
                </label>
                <div className={`relative h-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all ${audio ? 'border-green-400 bg-green-50' : 'border-neutral-200 hover:border-neutral-300'}`}>
                   {audio ? (
                     <div className="flex flex-col items-center">
                        <Music size={24} className="text-green-500 mb-1" />
                        <span className="text-[10px] text-green-600 font-medium">업로드 완료</span>
                     </div>
                   ) : (
                    <>
                      <Upload size={20} className="text-neutral-400 mb-1" />
                      <span className="text-[10px] text-neutral-500">MP3 업로드</span>
                    </>
                   )}
                  <input type="file" accept="audio/*" onChange={handleAudioChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-neutral-900 text-white rounded-xl font-bold hover:bg-neutral-800 shadow-lg active:scale-[0.98] transition-all"
          >
            {initialData ? '변경사항 저장하기' : '갤러리에 추가하기'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddWorkModal;
