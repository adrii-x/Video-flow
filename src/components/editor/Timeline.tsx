
import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, ChevronRight, Video, Music, Text, Image, Trash2, Scissors, Merge } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// Define the timeline segment/clip types
export interface TimelineSegment {
  id: string;
  start: number; // Start position in percentage (0-100)
  width: number; 
  type: "video" | "audio" | "text" | "image";
  name: string;
  color?: string;
  content?: any;
  trimStart?: number;
  trimEnd?: number;
  duration?: number;
}

export interface TrackData {
  id: string;
  name: string;
  type: "video" | "audio" | "text" | "image";
  segments: TimelineSegment[];
}

// Icon mapping for track types
const trackIcons = {
  video: Video,
  audio: Music,
  text: Text,
  image: Image,
};

interface TimelineProps {
  segments?: TimelineSegment[];
  onTimeChange?: (time: number) => void;
  onSegmentClick?: (segment: TimelineSegment) => void;
  onSegmentUpdate?: (segments: TimelineSegment[]) => void;
  currentTime?: number;
  duration?: number;
  isPlaying?: boolean;
  onPlayPause?: () => void;
}

const Timeline: React.FC<TimelineProps> = ({ 
  segments = [],
  onTimeChange, 
  onSegmentClick,
  onSegmentUpdate,
  currentTime = 0,
  duration = 100,
  isPlaying = false,
  onPlayPause
}) => {
  // Convert tracks structure to use provided segments
  const buildTracksFromSegments = (segmentList: TimelineSegment[]): TrackData[] => {
    const trackMap: Record<string, TrackData> = {
      "video-1": {
        id: "video-1",
        name: "Video",
        type: "video",
        segments: [],
      },
      "audio-1": {
        id: "audio-1",
        name: "Audio",
        type: "audio",
        segments: [],
      },
      "text-1": {
        id: "text-1",
        name: "Text",
        type: "text",
        segments: [],
      },
      "image-1": {
        id: "image-1",
        name: "Image",
        type: "image",
        segments: [],
      },
    };
    
    // Sort segments by type into appropriate tracks
    segmentList.forEach(segment => {
      const trackId = `${segment.type}-1`;
      if (trackMap[trackId]) {
        trackMap[trackId].segments.push(segment);
      }
    });
    
    return Object.values(trackMap);
  };

  const [tracks, setTracks] = useState<TrackData[]>(buildTracksFromSegments(segments));
  const [zoom, setZoom] = useState(100);
  const [draggingSegment, setDraggingSegment] = useState<{ id: string, trackId: string, initialPos: number } | null>(null);
  const [resizingSegment, setResizingSegment] = useState<{ id: string, trackId: string, edge: 'start' | 'end', initialWidth: number, initialStart: number } | null>(null);
  const [splitPoint, setSplitPoint] = useState<number | null>(null);
  const [currentPosition, setCurrentPosition] = useState(currentTime);
  const [formattedTime, setFormattedTime] = useState("00:00:00:00");
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [lastClickedTrack, setLastClickedTrack] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineTracksRef = useRef<HTMLDivElement>(null);
  
  // Format time display (hours:minutes:seconds:frames)
  useEffect(() => {
    if (duration > 0) {
      const timeInSeconds = (currentTime / 100) * duration;
      const hours = Math.floor(timeInSeconds / 3600);
      const minutes = Math.floor((timeInSeconds % 3600) / 60);
      const seconds = Math.floor(timeInSeconds % 60);
      const frames = Math.floor((timeInSeconds * 30) % 30); // Assuming 30fps
      
      setFormattedTime(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`
      );
    }
  }, [currentTime, duration]);
  
  // Update tracks when new segments are added from props
  useEffect(() => {
    if (segments.length > 0) {
      setTracks(buildTracksFromSegments(segments));
    }
  }, [segments]);
  
  // Update parent component when tracks change
  useEffect(() => {
    if (onSegmentUpdate) {
      const allSegments: TimelineSegment[] = [];
      tracks.forEach(track => {
        track.segments.forEach(segment => {
          allSegments.push(segment);
        });
      });
      onSegmentUpdate(allSegments);
    }
  }, [tracks, onSegmentUpdate]);
  
  useEffect(() => {
    setCurrentPosition(currentTime);
  }, [currentTime]);
  
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      const newPosition = Math.max(0, Math.min(100, percentage));
      setCurrentPosition(newPosition);
      
      if (onTimeChange) {
        onTimeChange(newPosition);
      }

      // Clear selection when clicking on empty timeline area
      setSelectedSegments([]);
    }
  };

  const handleSegmentClick = (segment: TimelineSegment, trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Set as active segment
    if (onSegmentClick) {
      onSegmentClick(segment);
    }

    // Track management for multi-select
    setLastClickedTrack(trackId);
    
    // Handle selection (single or multi with shift key)
    if (e.shiftKey) {
      // Add to selection or remove if already selected
      if (selectedSegments.includes(segment.id)) {
        setSelectedSegments(prev => prev.filter(id => id !== segment.id));
      } else {
        setSelectedSegments(prev => [...prev, segment.id]);
      }
    } else {
      // Single selection
      setSelectedSegments([segment.id]);
    }

    toast(`Selected: ${segment.name}`, {
      description: `${segment.type} segment in timeline`
    });
  };
  
  // Handle segment drag start
  const handleSegmentDragStart = (segmentId: string, trackId: string, initialPos: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDraggingSegment({ id: segmentId, trackId, initialPos });
    document.body.style.cursor = 'grabbing';
    
    // Ensure this segment is selected
    if (!selectedSegments.includes(segmentId)) {
      setSelectedSegments([segmentId]);
    }
  };

  // Handle mouse move for segment dragging
  const handleTimelineMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((!draggingSegment && !resizingSegment) || !timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    
    // Handle segment dragging
    if (draggingSegment) {
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      
      // Calculate the delta movement from initial position
      const delta = percentage - draggingSegment.initialPos;
      
      // Update all selected segments' positions
      setTracks(prev => 
        prev.map(track => ({
          ...track,
          segments: track.segments.map(segment => {
            // Only move selected segments
            if (selectedSegments.includes(segment.id)) {
              // Calculate new start position, ensuring it doesn't go below 0
              const newStart = Math.max(0, segment.start + delta);
              return { ...segment, start: newStart };
            }
            return segment;
          })
        }))
      );
      
      // Update dragging segment with new initial position to prevent accumulating deltas
      setDraggingSegment({
        ...draggingSegment,
        initialPos: percentage
      });
    }
    
    // Handle segment resizing
    if (resizingSegment) {
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      
      setTracks(prev => prev.map(track => {
        if (track.id === resizingSegment.trackId) {
          return {
            ...track,
            segments: track.segments.map(segment => {
              if (segment.id === resizingSegment.id) {
                if (resizingSegment.edge === 'start') {
                  // Resize from start edge (left)
                  const diff = percentage - resizingSegment.initialStart;
                  const newStart = Math.min(resizingSegment.initialStart + diff, 
                                          resizingSegment.initialStart + resizingSegment.initialWidth - 5);
                  const newWidth = resizingSegment.initialWidth - (newStart - resizingSegment.initialStart);
                  
                  return { 
                    ...segment, 
                    start: newStart,
                    width: newWidth
                  };
                } else { 
                  // Resize from end edge (right)
                  const newWidth = Math.max(5, percentage - segment.start);
                  return { 
                    ...segment, 
                    width: newWidth
                  };
                }
              }
              return segment;
            })
          };
        }
        return track;
      }));
    }
  };
  
  // Handle segment resize start
  const handleResizeStart = (segmentId: string, trackId: string, edge: 'start' | 'end', initialWidth: number, initialStart: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setResizingSegment({ id: segmentId, trackId, edge, initialWidth, initialStart });
    document.body.style.cursor = edge === 'start' ? 'w-resize' : 'e-resize';
    
    // Clear multi-selection when resizing
    setSelectedSegments([segmentId]);
  };

  // Handle mouse up to end dragging/resizing
  const handleTimelineMouseUp = () => {
    if (draggingSegment) {
      setDraggingSegment(null);
      document.body.style.cursor = 'default';
      toast.success("Segment position updated");
    }
    
    if (resizingSegment) {
      setResizingSegment(null);
      document.body.style.cursor = 'default';
      toast.success("Segment duration updated");
    }
  };

  // Handle splitting a segment at current time position
  const handleSplitSegment = (segmentId?: string, trackId?: string) => {
    // Find the segment to split - either specified or any segment at current time position
    let segmentToSplit: TimelineSegment | undefined;
    let trackIndex = -1;
    
    if (segmentId && trackId) {
      // Split specific segment
      tracks.forEach((track, idx) => {
        if (track.id === trackId) {
          trackIndex = idx;
          segmentToSplit = track.segments.find(s => s.id === segmentId);
        }
      });
    } else {
      // Find any segment at current playhead position
      tracks.forEach((track, idx) => {
        track.segments.forEach(segment => {
          if (currentPosition >= segment.start && 
              currentPosition <= segment.start + segment.width &&
              (track.type === 'video' || track.type === 'audio')) { // Only split video/audio
            trackIndex = idx;
            segmentToSplit = segment;
            return;
          }
        });
      });
    }
    
    if (!segmentToSplit || trackIndex === -1 || currentPosition <= segmentToSplit.start || 
        currentPosition >= segmentToSplit.start + segmentToSplit.width) {
      toast.error("Cannot split - position the playhead inside a video or audio segment");
      return;
    }
    
    // Calculate split position relative to segment
    const splitPercentage = (currentPosition - segmentToSplit.start) / segmentToSplit.width;
    const firstWidth = segmentToSplit.width * splitPercentage;
    const secondWidth = segmentToSplit.width - firstWidth;
    
    // Create two segments from one
    const firstSegment: TimelineSegment = {
      ...segmentToSplit,
      width: firstWidth,
      name: `${segmentToSplit.name.split(' (part')[0]} (part 1)`
    };
    
    const secondSegment: TimelineSegment = {
      ...segmentToSplit,
      id: `${segmentToSplit.id}-split-${Date.now()}`,
      start: segmentToSplit.start + firstWidth,
      width: secondWidth,
      name: `${segmentToSplit.name.split(' (part')[0]} (part 2)`
    };
    
    // Update tracks with split segments
    setTracks(prev => {
      const newTracks = [...prev];
      newTracks[trackIndex] = {
        ...newTracks[trackIndex],
        segments: [
          ...newTracks[trackIndex].segments.filter(s => s.id !== segmentToSplit!.id),
          firstSegment,
          secondSegment
        ]
      };
      return newTracks;
    });
    
    // Select the new segments
    setSelectedSegments([firstSegment.id, secondSegment.id]);
    toast.success("Segment split successfully");
  };
  
  // Merge selected segments
  const handleMergeSegments = () => {
    if (selectedSegments.length < 2) {
      toast.error("Select at least 2 segments to merge");
      return;
    }
    
    // Check if all selected segments are on the same track
    let targetTrack: TrackData | undefined;
    let selectedTrackSegments: TimelineSegment[] = [];
    
    for (const track of tracks) {
      const trackSelectedSegments = track.segments.filter(
        segment => selectedSegments.includes(segment.id)
      );
      
      if (trackSelectedSegments.length > 0) {
        if (!targetTrack) {
          targetTrack = track;
          selectedTrackSegments = trackSelectedSegments;
        } else {
          // Segments selected from multiple tracks
          toast.error("Can only merge segments from the same track");
          return;
        }
      }
    }
    
    if (!targetTrack || selectedTrackSegments.length < 2) {
      toast.error("Select at least 2 segments on the same track to merge");
      return;
    }
    
    // Only allow merging video or audio segments
    if (targetTrack.type !== 'video' && targetTrack.type !== 'audio') {
      toast.error("Only video and audio segments can be merged");
      return;
    }
    
    // Sort selected segments by start position
    selectedTrackSegments.sort((a, b) => a.start - b.start);
    
    // Check if segments are adjacent (with small tolerance)
    for (let i = 0; i < selectedTrackSegments.length - 1; i++) {
      const current = selectedTrackSegments[i];
      const next = selectedTrackSegments[i + 1];
      const gap = next.start - (current.start + current.width);
      
      if (gap > 0.5) { // 0.5% tolerance
        toast.error("Only adjacent segments can be merged");
        return;
      }
    }
    
    // Create merged segment
    const first = selectedTrackSegments[0];
    const last = selectedTrackSegments[selectedTrackSegments.length - 1];
    
    const mergedSegment: TimelineSegment = {
      id: `merged-${Date.now()}`,
      name: `${first.name.split(' (part')[0]} (merged)`,
      type: targetTrack.type as "video" | "audio" | "text" | "image",
      start: first.start,
      width: (last.start + last.width) - first.start,
      content: first.content,
    };
    
    // Update the track with the merged segment
    setTracks(prev => prev.map(track => {
      if (track.id === targetTrack!.id) {
        return {
          ...track,
          segments: [
            ...track.segments.filter(segment => !selectedSegments.includes(segment.id)),
            mergedSegment
          ]
        };
      }
      return track;
    }));
    
    // Select the new merged segment
    setSelectedSegments([mergedSegment.id]);
    toast.success("Segments merged successfully");
  };
  
  // Delete a segment
  const handleDeleteSegment = (segmentId: string, trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    let segmentsToDelete: string[] = [segmentId];
    
    // If this segment is part of a multi-selection, delete all selected segments
    if (selectedSegments.includes(segmentId) && selectedSegments.length > 1) {
      segmentsToDelete = selectedSegments;
    }
    
    setTracks(prev => prev.map(track => {
      return {
        ...track,
        segments: track.segments.filter(s => !segmentsToDelete.includes(s.id))
      };
    }));
    
    // Clear selection
    setSelectedSegments([]);
    toast.success(`${segmentsToDelete.length > 1 ? 'Segments' : 'Segment'} removed from timeline`);
  };

  const togglePlayback = () => {
    if (onPlayPause) {
      onPlayPause();
    }
  };

  // Helper function to get track icon
  const getTrackIcon = (type: "video" | "audio" | "text" | "image") => {
    const Icon = trackIcons[type];
    return <Icon size={16} />;
  };

  // Handle horizontal scrolling with mouse wheel
  const handleWheel = (e: React.WheelEvent) => {
    if (timelineTracksRef.current && e.deltaY !== 0) {
      if (e.shiftKey) {
        // Horizontal scroll when shift is pressed
        timelineTracksRef.current.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }
  };

  // Effect for keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete key to remove selected segments
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedSegments.length > 0) {
        setTracks(prev => prev.map(track => ({
          ...track,
          segments: track.segments.filter(s => !selectedSegments.includes(s.id))
        })));
        
        setSelectedSegments([]);
        toast.success(`${selectedSegments.length > 1 ? 'Segments' : 'Segment'} removed from timeline`);
      }
      
      // Space bar to toggle play/pause
      if (e.key === ' ' && !e.target) {
        togglePlayback();
        e.preventDefault();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedSegments, togglePlayback]);

  return (
    <div className="editor-panel mt-4">
      <div className="flex items-center mb-4 gap-2">
        <Button 
          className="p-2 rounded-full bg-editor-text/5 hover:bg-editor-text/10 transition-colors"
          onClick={togglePlayback}
        >
          {isPlaying ? (
            <Pause size={16} className="text-editor-text" />
          ) : (
            <Play size={16} className="text-editor-text" />
          )}
        </Button>
        
        <div className="text-sm text-editor-text bg-editor-surface/80 px-2 py-1 rounded border border-editor-text/10">
          {formattedTime}
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            className="p-1 rounded bg-editor-text/5 hover:bg-editor-text/10 transition-colors"
            title="Split segment at playhead"
            onClick={() => handleSplitSegment()}
          >
            <Scissors size={16} className="text-editor-text-subtle" />
          </Button>
          
          <Button 
            className="p-1 rounded bg-editor-text/5 hover:bg-editor-text/10 transition-colors"
            title="Merge selected segments"
            onClick={handleMergeSegments}
          >
            <Merge size={16} className="text-editor-text-subtle" />
          </Button>
        </div>
        
        <div className="ml-auto text-sm flex items-center gap-2">
          <span className="text-editor-text-subtle">Zoom:</span>
          <select 
            className="bg-editor-surface border border-editor-text/20 rounded px-2 py-1 text-editor-text-subtle"
            value={zoom}
            onChange={(e) => setZoom(parseInt(e.target.value))}
          >
            <option value="200">200%</option>
            <option value="150">150%</option>
            <option value="100">100%</option>
            <option value="75">75%</option>
            <option value="50">50%</option>
          </select>
        </div>
      </div>
      
      <div className="relative mb-1 h-6 bg-editor-surface/80 border-b border-editor-text/10">
        {/* Time markers */}
        <div className="flex absolute inset-0">
          {[...Array(11)].map((_, i) => (
            <div key={i} className="flex-1 border-r border-editor-text/10 relative">
              <span className="absolute -bottom-5 left-0 text-[10px] text-editor-text-subtle">
                {i}s
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div 
        ref={timelineRef} 
        className="relative" 
        onClick={handleTimelineClick}
        onMouseMove={handleTimelineMouseMove}
        onMouseUp={handleTimelineMouseUp}
        onWheel={handleWheel}
        style={{ 
          width: '100%',
          overflowX: zoom > 100 ? 'auto' : 'visible'
        }}
      >
        {/* Playhead */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-editor-primary z-10"
          style={{ left: `${currentPosition}%` }}
        >
          <div className="w-3 h-3 bg-editor-primary rounded-full -ml-1 -mt-1"></div>
        </div>
        
        {/* Tracks */}
        <div 
          ref={timelineTracksRef}
          className="flex flex-col gap-2 overflow-x-auto"
          style={{ 
            width: `${zoom}%`,
            minWidth: '100%'
          }}
        >
          {tracks.map((track) => (
            <div key={track.id} className="flex">
              <div className="track-header min-w-[80px] w-20 shrink-0 bg-editor-bg/50 p-2 rounded-l-md border-r border-editor-text/10 flex items-center">
                <span className="flex items-center gap-1 text-xs truncate">
                  {getTrackIcon(track.type)}
                  <span className="truncate">{track.name}</span>
                </span>
              </div>
              
              <div className="timeline-track flex-1 relative h-14 bg-editor-bg/30 rounded-r-md overflow-hidden">
                {track.segments.map((segment) => {
                  // Determine segment color based on type
                  const getSegmentColor = () => {
                    switch(segment.type) {
                      case "video": return "border-blue-500 bg-blue-500/20";
                      case "audio": return "border-green-500 bg-green-500/20";
                      case "text": return "border-purple-500 bg-purple-500/20";
                      case "image": return "border-amber-500 bg-amber-500/20";
                      default: return "";
                    }
                  };
                  
                  const isSelected = selectedSegments.includes(segment.id);
                  
                  return (
                    <div 
                      key={segment.id}
                      className={cn(
                        "timeline-segment absolute top-1 bottom-1 border rounded select-none group",
                        getSegmentColor(),
                        isSelected ? "border-2 border-editor-primary ring-1 ring-editor-primary" : "",
                        draggingSegment?.id === segment.id ? "opacity-80" : ""
                      )}
                      style={{
                        left: `${segment.start}%`,
                        width: `${segment.width}%`,
                        cursor: isSelected ? 'move' : 'pointer',
                        zIndex: isSelected ? 10 : 1
                      }}
                      onClick={(e) => handleSegmentClick(segment, track.id, e)}
                      onMouseDown={(e) => handleSegmentDragStart(segment.id, track.id, segment.start, e)}
                    >
                      <div className="px-2 py-1 text-xs truncate flex-1 flex items-center justify-between gap-1 h-full">
                        <span className="truncate">{segment.name}</span>
                        <div className="flex items-center">
                          <button 
                            className={`${isSelected ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 p-0.5 hover:bg-editor-text/10 rounded`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSplitSegment(segment.id, track.id);
                            }}
                            title="Split at playhead"
                          >
                            <Scissors size={12} className="text-editor-text-subtle hover:text-editor-primary" />
                          </button>
                          <button 
                            className={`${isSelected ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 p-0.5 hover:bg-editor-text/10 rounded`}
                            onClick={(e) => handleDeleteSegment(segment.id, track.id, e)}
                            title="Remove segment"
                          >
                            <Trash2 size={12} className="text-editor-text-subtle hover:text-red-500" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Resize handles */}
                      <div 
                        className="absolute left-0 top-0 bottom-0 w-1 cursor-w-resize"
                        onMouseDown={(e) => handleResizeStart(segment.id, track.id, 'start', segment.width, segment.start, e)}
                      />
                      <div 
                        className="absolute right-0 top-0 bottom-0 w-1 cursor-e-resize"
                        onMouseDown={(e) => handleResizeStart(segment.id, track.id, 'end', segment.width, segment.start, e)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
