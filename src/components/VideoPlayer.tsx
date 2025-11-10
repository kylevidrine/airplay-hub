import { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Upload,
  Calendar,
  XCircle,
  CheckCircle,
  MoreVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface VideoPlayerProps {
  url: string;
  originalFilePath: string;
  onUpload: () => void;
  onScheduled: () => void;
  onSkip: () => void;
  onUnskip: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

// Key: Store mute state **outside** the useEffect that runs on url change
let globalMuted = true; // default = muted (first video)

export const VideoPlayer = ({
  url,
  originalFilePath,
  onUpload,
  onScheduled,
  onSkip,
  onUnskip,
  onNext,
  onPrevious,
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(globalMuted); // sync with global
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Apply saved mute state + autoplay (without forcing mute)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = globalMuted;     // respect user choice
      videoRef.current.volume = globalMuted ? 0 : 0.8;
      videoRef.current.play().catch(() => {});
    }
  }, [url]); // re-run when video changes

  const formatTime = (s: number) => {
    if (isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${m}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (videoRef.current?.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !videoRef.current.muted;
      videoRef.current.muted = newMuted;
      globalMuted = newMuted;        // persist globally
      setIsMuted(newMuted);
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) videoRef.current.currentTime += seconds;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <div className="flex-1 relative bg-black flex items-center justify-center pb-32">
        <video
          ref={videoRef}
          src={url}
          className="max-w-full max-h-full object-contain"
          autoPlay
          playsInline
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />

        {/* Floating ±10s buttons */}
        <div className="absolute inset-0 flex items-center justify-between px-8 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          <button
            onClick={() => skip(-10)}
            className="bg-black/60 backdrop-blur-sm text-white p-4 rounded-full pointer-events-auto active:scale-95 transition"
          >
            <SkipBack className="w-10 h-10" />
          </button>
          <button
            onClick={() => skip(10)}
            className="bg-black/60 backdrop-blur-sm text-white p-4 rounded-full pointer-events-auto active:scale-95 transition"
          >
            <SkipForward className="w-10 h-10" />
          </button>
        </div>
      </div>

      {/* Fixed control bar */}
      <div className="fixed bottom-16 left-0 right-0 z-40 pointer-events-none">
        <div className="bg-black/95 backdrop-blur-md border-t border-white/10 pointer-events-auto">
          <div className="flex items-center justify-between px-4 py-2">
            {/* Left: Media Controls */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={togglePlay} className="text-white hover:bg-white/20 h-9 px-3">
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span className="ml-1 text-xs">{isPlaying ? 'Pause' : 'Play'}</span>
              </Button>

              <Button variant="ghost" size="sm" onClick={toggleMute} className="text-white hover:bg-white/20 h-9 px-3">
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="ml-1 text-xs">{isMuted ? 'Unmute' : 'Mute'}</span>
              </Button>

              <Button variant="ghost" size="sm" onClick={onPrevious} className="text-white hover:bg-white/20 h-9 px-3">
                <SkipBack className="w-4 h-4" />
                <span className="ml-1 text-xs">Prev</span>
              </Button>

              <Button variant="ghost" size="sm" onClick={onNext} className="text-white hover:bg-white/20 h-9 px-3">
                <SkipForward className="w-4 h-4" />
                <span className="ml-1 text-xs">Next</span>
              </Button>
            </div>

            {/* Center: Progress */}
            <div className="flex-1 max-w-md mx-4">
              <div className="text-white/70 text-xs text-center mb-1">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-white/20 rounded-full cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                style={{
                  background: `linear-gradient(to right, white 0%, white ${progress}%, rgba(255,255,255,0.2) ${progress}%, rgba(255,255,255,0.2) 100%)`,
                }}
              />
            </div>

            {/* Right: Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-9 px-3">
                  <MoreVertical className="w-4 h-4" />
                  <span className="ml-1 text-xs">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={onUpload}>
                  <Upload className="w-4 h-4 mr-2" /> Ready to Upload
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onScheduled}>
                  <Calendar className="w-4 h-4 mr-2" /> Scheduled
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onSkip} className="text-destructive">
                  <XCircle className="w-4 h-4 mr-2" /> Skip
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onUnskip} className="text-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" /> Unskip
                </DropdownMenuItem>
              </DropdownMenuContent>
arisons>
            </DropdownMenu>
          </div>

          <div className="text-center pb-2 px-4">
            <p className="text-white/40 text-[10px] font-mono truncate">
              {originalFilePath}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};