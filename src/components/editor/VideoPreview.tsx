
import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Volume1, Maximize2, Minimize2, SkipBack, SkipForward, Move } from "lucide-react";
import { TimelineSegment } from "@/pages/Editor";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


interface VideoPreviewProps {
  src?: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  currentTime?: number;
  onTimeUpdate?: (time: number) => void;
  timelineSegments?: TimelineSegment[];
  onSegmentUpdate?: (updatedSegment: TimelineSegment) => void;
  selectedSegment?: TimelineSegment | null;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({
  src,
  isPlaying,
  onPlayPause,
  currentTime,
  onTimeUpdate,
  timelineSegments = [],
  onSegmentUpdate,
  selectedSegment
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayContainerRef = useRef<HTMLDivElement>(null);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeOverlays, setActiveOverlays] = useState<TimelineSegment[]>([]);
  const [editingOverlay, setEditingOverlay] = useState<TimelineSegment | null>(null);
  const [isDraggingElement, setIsDraggingElement] = useState(false);
  const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 });
  const [elementPosition, setElementPosition] = useState({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);
  
  const getMediaSrc = () => {
    if (src) return src;
    
    try {
      const uploadedMedia = JSON.parse(localStorage.getItem('uploadedMediaFiles') || '[]');
      const videoFiles = uploadedMedia.filter((media: any) => media.type === 'video');
      
      if (videoFiles.length > 0) {
        return videoFiles[0].url;
      }
    } catch (error) {
      console.error('Error getting media from localStorage:', error);
    }
    
    return "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  };

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(err => {
          console.error("Error playing video:", err);
          toast.error("Could not play video. Please check if video source is valid.");
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current && currentTime !== undefined && !isNaN(currentTime) && isFinite(currentTime) && duration > 0) {
      try {
        const timeInSeconds = (currentTime / 100) * duration;
        if (isFinite(timeInSeconds)) {
          videoRef.current.currentTime = timeInSeconds;
        }
      } catch (error) {
        console.error("Error setting video time:", error);
      }
    }
  }, [currentTime, duration]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    video.volume = isMuted ? 0 : volume;

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [volume, isMuted]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const updateActiveOverlays = () => {
      if (!videoRef.current) return;
      
      const currentVideoTime = videoRef.current.currentTime;
      const totalDuration = videoRef.current.duration || 0;
      
      if (totalDuration === 0) return;
      
      const currentTimePercent = (currentVideoTime / totalDuration) * 100;
      
      const active = timelineSegments.filter(segment => {
        return segment.type === 'text' || segment.type === 'image';
      }).filter(segment => {
        return currentTimePercent >= segment.start && 
               currentTimePercent <= (segment.start + segment.width);
      });
      
      setActiveOverlays(active);
    };
    
    const animate = () => {
      updateActiveOverlays();
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      updateActiveOverlays();
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, timelineSegments]);

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setCurrentProgress(progress);
      if (onTimeUpdate) {
        onTimeUpdate(progress);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : newVolume;
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.volume = !isMuted ? 0 : volume;
    }
  };

  const handleSkipBackward = () => {
    if (videoRef.current) {
      const newTime = Math.max(0, videoRef.current.currentTime - 10);
      if (isFinite(newTime)) {
        videoRef.current.currentTime = newTime;
        toast.info("Skipped back 10 seconds");
      }
    }
  };
  
  const handleSkipForward = () => {
    if (videoRef.current && videoRef.current.duration) {
      const newTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 10);
      if (isFinite(newTime)) {
        videoRef.current.currentTime = newTime;
        toast.info("Skipped forward 10 seconds");
      }
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (!isFinite(timeInSeconds)) return '00:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentTimeFormatted = videoRef.current ? formatTime(videoRef.current.currentTime) : '00:00';
  const durationFormatted = formatTime(duration);

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={16} />;
    if (volume < 0.5) return <Volume1 size={16} />;
    return <Volume2 size={16} />;
  };

  const getOverlayPosition = (segment: TimelineSegment) => {
    if (!segment || !segment.content) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    
    const position = segment.content?.position || 'center';
    const customX = segment.content?.customX;
    const customY = segment.content?.customY;
    
    if (customX !== undefined && customY !== undefined) {
      return {
        top: `${customY}%`,
        left: `${customX}%`,
        transform: 'translate(-50%, -50%)'
      };
    }
    
    switch (position) {
      case 'top-left': return { top: '4%', left: '4%', transform: 'none' };
      case 'top-center': return { top: '4%', left: '50%', transform: 'translateX(-50%)' };
      case 'top-right': return { top: '4%', right: '4%', transform: 'none' };
      case 'middle-left': return { top: '50%', left: '4%', transform: 'translateY(-50%)' };
      case 'middle-right': return { top: '50%', right: '4%', transform: 'translateY(-50%)' };
      case 'bottom-left': return { bottom: '4%', left: '4%', transform: 'none' };
      case 'bottom-center': return { bottom: '4%', left: '50%', transform: 'translateX(-50%)' };
      case 'bottom-right': return { bottom: '4%', right: '4%', transform: 'none' };
      default: return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  };

  const handleOverlayMouseDown = (e: React.MouseEvent, segment: TimelineSegment) => {
    if (!overlayContainerRef.current) return;
    
    setEditingOverlay(segment);
    
    const containerRect = overlayContainerRef.current.getBoundingClientRect();
    
    const relX = e.clientX - containerRect.left;
    const relY = e.clientY - containerRect.top;
    
    setStartDragPos({ x: relX, y: relY });
    
    const element = e.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    
    const centerX = ((rect.left + rect.width / 2) - containerRect.left) / containerRect.width * 100;
    const centerY = ((rect.top + rect.height / 2) - containerRect.top) / containerRect.height * 100;
    
    setElementPosition({ x: centerX, y: centerY });
    setIsDraggingElement(true);
  };

  const handleOverlayMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingElement || !overlayContainerRef.current) return;
    
    const containerRect = overlayContainerRef.current.getBoundingClientRect();
    
    const relX = e.clientX - containerRect.left;
    const relY = e.clientY - containerRect.top;
    
    const deltaX = relX - startDragPos.x;
    const deltaY = relY - startDragPos.y;
    
    const deltaXPercent = (deltaX / containerRect.width) * 100;
    const deltaYPercent = (deltaY / containerRect.height) * 100;
    
    const newX = Math.max(0, Math.min(100, elementPosition.x + deltaXPercent));
    const newY = Math.max(0, Math.min(100, elementPosition.y + deltaYPercent));
    
    setElementPosition({ x: newX, y: newY });
    
    if (editingOverlay && onSegmentUpdate) {
      const updatedSegment = {
        ...editingOverlay,
        content: {
          ...(editingOverlay.content || {}),
          customX: newX,
          customY: newY,
          position: 'custom'
        }
      };
      onSegmentUpdate(updatedSegment);
    }
    
    setStartDragPos({ x: relX, y: relY });
  };

  const handleOverlayMouseUp = () => {
    if (isDraggingElement) {
      setIsDraggingElement(false);
      toast.success("Position updated");
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingElement && overlayContainerRef.current) {
        const containerRect = overlayContainerRef.current.getBoundingClientRect();
        
        const relX = e.clientX - containerRect.left;
        const relY = e.clientY - containerRect.top;
        
        const deltaX = relX - startDragPos.x;
        const deltaY = relY - startDragPos.y;
        
        const deltaXPercent = (deltaX / containerRect.width) * 100;
        const deltaYPercent = (deltaY / containerRect.height) * 100;
        
        const newX = Math.max(0, Math.min(100, elementPosition.x + deltaXPercent));
        const newY = Math.max(0, Math.min(100, elementPosition.y + deltaYPercent));
        
        setElementPosition({ x: newX, y: newY });
        
        if (editingOverlay && onSegmentUpdate) {
          const updatedSegment = {
            ...editingOverlay,
            content: {
              ...(editingOverlay.content || {}),
              customX: newX,
              customY: newY,
              position: 'custom'
            }
          };
          onSegmentUpdate(updatedSegment);
        }
        
        setStartDragPos({ x: relX, y: relY });
      }
    };

    const handleMouseUp = () => {
      if (isDraggingElement) {
        setIsDraggingElement(false);
        toast.success("Position updated");
      }
    };

    if (isDraggingElement) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingElement, startDragPos, elementPosition, editingOverlay, onSegmentUpdate]);

  return (
    <div className="editor-panel" ref={containerRef}>
      <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          src={getMediaSrc()}
          onTimeUpdate={handleTimeUpdate}
          playsInline
          preload="auto"
          onError={(e) => {
            console.error("Video error:", e);
            toast.error("Error loading video source");
          }}
        />
        
        <div 
          ref={overlayContainerRef}
          className="absolute inset-0 pointer-events-none"
        >
          {activeOverlays.map((overlay) => {
            const isSelected = selectedSegment?.id === overlay.id;
            
            if (overlay.type === 'text' && overlay.content) {
              const content = overlay.content;
              const positionStyles = getOverlayPosition(overlay);
              
              return (
                <div 
                  key={overlay.id}
                  className={`absolute ${isSelected ? 'ring-2 ring-editor-primary' : ''}`}
                  style={{
                    ...positionStyles,
                    color: content.textColor || '#FFFFFF',
                    backgroundColor: content.bgColor || 'transparent',
                    fontSize: `${content.fontSize || 16}px`,
                    fontFamily: content.fontFamily || 'Inter',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    cursor: isSelected ? 'move' : 'default',
                    pointerEvents: 'auto',
                    zIndex: isSelected ? 20 : 10
                  }}
                  onMouseDown={(e) => handleOverlayMouseDown(e, overlay)}
                >
                  {content.text || content.preview || overlay.name}
                  
                  {isSelected && (
                    <div className="absolute -top-6 left-0 bg-editor-primary text-white text-xs px-2 py-1 rounded whitespace-nowrap flex items-center gap-1 opacity-80">
                      <Move size={12} /> Drag to reposition
                    </div>
                  )}
                </div>
              );
            }
            
            if (overlay.type === 'image' && overlay.content) {
              const content = overlay.content;
              const positionStyles = getOverlayPosition(overlay);
              const size = content.size || 40;
              
              return (
                <div 
                  key={overlay.id}
                  className={`absolute ${isSelected ? 'ring-2 ring-editor-primary' : ''}`}
                  style={{
                    ...positionStyles,
                    width: `${size}%`,
                    maxWidth: '80%',
                    opacity: content.opacity ? content.opacity / 100 : 1,
                    cursor: isSelected ? 'move' : 'default',
                    pointerEvents: 'auto',
                    zIndex: isSelected ? 20 : 10
                  }}
                  onMouseDown={(e) => handleOverlayMouseDown(e, overlay)}
                >
                  <img 
                    src={content.url || content.thumbnail} 
                    alt={overlay.name} 
                    className="w-full h-full object-contain rounded"
                    style={{
                      maskImage: content.shapeMask ? `url(${content.shapeMask})` : 'none',
                      WebkitMaskImage: content.shapeMask ? `url(${content.shapeMask})` : 'none',
                    }}
                  />
                  
                  {isSelected && (
                    <div className="absolute -top-6 left-0 bg-editor-primary text-white text-xs px-2 py-1 rounded whitespace-nowrap flex items-center gap-1 opacity-80">
                      <Move size={12} /> Drag to reposition
                    </div>
                  )}
                </div>
              );
            }
            
            return null;
          })}
        </div>
        
        {(!src && !isPlaying && activeOverlays.length === 0) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <p className="text-white text-opacity-80">Your video preview will appear here</p>
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <div 
          className="w-full h-2 bg-editor-text/10 rounded-full cursor-pointer mb-3 group relative"
          onClick={(e) => {
            if (!videoRef.current || !videoRef.current.duration) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            const newTime = pos * videoRef.current.duration;
            if (isFinite(newTime)) {
              videoRef.current.currentTime = newTime;
            }
          }}
        >
          <div 
            className="h-full bg-editor-primary rounded-full"
            style={{ width: `${currentProgress}%` }}
          ></div>
          <div 
            className="absolute top-1/2 -translate-y-1/2 h-4 w-4 bg-editor-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${currentProgress}%`, transform: 'translate(-50%, -50%)' }}
          ></div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline"
              size="icon"
              className="p-1 w-8 h-8 bg-editor-text/5 border-0 hover:bg-editor-text/10"
              onClick={handleSkipBackward}
              title="Skip back 10 seconds"
            >
              <SkipBack size={16} className="text-editor-text" />
            </Button>
            
            <Button 
              className="p-2 rounded-full bg-editor-primary hover:bg-editor-primary/80 text-white transition-colors"
              onClick={onPlayPause}
              size="icon"
            >
              {isPlaying ? (
                <Pause size={18} />
              ) : (
                <Play size={18} />
              )}
            </Button>
            
            <Button 
              variant="outline"
              size="icon"
              className="p-1 w-8 h-8 bg-editor-text/5 border-0 hover:bg-editor-text/10"
              onClick={handleSkipForward}
              title="Skip forward 10 seconds"
            >
              <SkipForward size={16} className="text-editor-text" />
            </Button>
            
            <span className="text-xs text-editor-text ml-2">
              {currentTimeFormatted} / {durationFormatted}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline"
              size="icon"
              className="p-1 w-8 h-8 bg-editor-text/5 border-0 hover:bg-editor-text/10"
              onClick={toggleMute}
            >
              {getVolumeIcon()}
            </Button>
            
            <div className="relative group">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 accent-editor-primary relative z-10 opacity-70 hover:opacity-100 transition-opacity"
              />
              <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-editor-text/10 rounded-full pointer-events-none">
                <div 
                  className="h-full bg-editor-primary rounded-full"
                  style={{ width: `${volume * 100}%` }}
                ></div>
              </div>
            </div>
            
            <Button 
              variant="outline"
              size="icon"
              className="p-1 w-8 h-8 bg-editor-text/5 border-0 hover:bg-editor-text/10 ml-2"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? (
                <Minimize2 size={14} className="text-editor-text" />
              ) : (
                <Maximize2 size={14} className="text-editor-text" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
