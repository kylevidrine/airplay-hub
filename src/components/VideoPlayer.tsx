import { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  url: string;
  onUpload: () => void;
  onScheduled: () => void;
  onSkip: () => void;
}

export const VideoPlayer = ({ url, onUpload, onScheduled, onSkip }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, [url]);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleUnmute = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play();
      setIsMuted(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !seeking) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex flex-col h-full bg-background pb-20">
      <div className="flex-1 relative bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          src={url}
          className="w-full h-full object-contain"
          autoPlay
          playsInline
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/80 to-transparent px-5 pb-5 safe-bottom">
        <div className="mb-4">
          <div className="text-foreground text-xs text-center mb-2">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeekChange}
            onMouseDown={() => setSeeking(true)}
            onMouseUp={() => setSeeking(false)}
            onTouchStart={() => setSeeking(true)}
            onTouchEnd={() => setSeeking(false)}
            className="w-full h-1.5 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
            style={{
              background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${progress}%, rgba(255, 255, 255, 0.3) ${progress}%, rgba(255, 255, 255, 0.3) 100%)`
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <Button
            onClick={handlePlayPause}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-3.5 font-semibold transition-transform active:scale-95"
          >
            {isPlaying ? <><Pause className="w-4 h-4 mr-2" /> Pause</> : <><Play className="w-4 h-4 mr-2" /> Play</>}
          </Button>
          {isMuted && (
            <Button
              onClick={handleUnmute}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-3.5 font-semibold transition-transform active:scale-95"
            >
              <Volume2 className="w-4 h-4 mr-2" /> Play Audio
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <Button
            onClick={onUpload}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-3.5 font-semibold transition-transform active:scale-95"
          >
            Ready To Upload
          </Button>
          <Button
            onClick={onScheduled}
            className="bg-warning hover:bg-warning/90 text-warning-foreground rounded-full py-3.5 font-semibold transition-transform active:scale-95"
          >
            Scheduled
          </Button>
          <Button
            onClick={onSkip}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full py-3.5 font-semibold transition-transform active:scale-95 col-span-2"
          >
            Skip
          </Button>
        </div>
      </div>
    </div>
  );
};
