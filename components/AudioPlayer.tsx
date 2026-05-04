
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showVolume, setShowVolume] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => setDuration(audio.duration);
    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', () => setIsPlaying(false));

    audio.volume = volume;

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
    };
  }, [src, volume]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setVolume(value);
  };

  const skip = (amount: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += amount;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full px-6 py-4 bg-white rounded-2xl shadow-sm border border-neutral-100">
      <audio ref={audioRef} src={src} />
      
      {/* Progress Bar */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-800"
        />
        <div className="flex justify-between text-[10px] text-neutral-400 mt-1 font-medium">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between relative">
        <div className="flex items-center gap-4 flex-1 justify-center">
          <button onClick={() => skip(-10)} className="text-neutral-400 hover:text-neutral-600 transition-colors">
            <SkipBack size={20} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center bg-neutral-900 text-white rounded-full shadow-lg active:scale-95 transition-all"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} className="ml-1" fill="currentColor" />}
          </button>

          <button onClick={() => skip(10)} className="text-neutral-400 hover:text-neutral-600 transition-colors">
            <SkipForward size={20} />
          </button>
        </div>
        
        <div className="flex items-center gap-2 group ml-2">
          <div 
            className={`flex items-center transition-all duration-300 ${showVolume ? 'w-20 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}
          >
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-800"
            />
          </div>
          <button 
            onClick={() => setShowVolume(!showVolume)}
            className="text-neutral-300 hover:text-neutral-600 transition-colors"
          >
            <Volume2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
