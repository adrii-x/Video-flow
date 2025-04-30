import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/navigation/Header";
import Sidebar from "@/components/navigation/Sidebar";
import VideoPreview from "@/components/editor/VideoPreview";
import Timeline from "@/components/editor/Timeline";
import ControlPanel from "@/components/editor/ControlPanel";
import MediaLibrary from "@/components/library/MediaLibrary";

export interface TimelineSegment {
  id: string;
  start: number;
  width: number;
  type: "video" | "audio" | "text" | "image";
  name: string;
  color?: string;
  content?: any;
  trimStart?: number;
  trimEnd?: number;
  duration?: number;
}

const Editor = () => {
  const navigate = useNavigate();
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeControlTab, setActiveControlTab] = useState("text");
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [timelineSegments, setTimelineSegments] = useState<TimelineSegment[]>([]);
  const [projectName, setProjectName] = useState("My Awesome Video Project");
  const [videoDuration, setVideoDuration] = useState(100);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const projectNameInputRef = useRef<HTMLInputElement>(null);
  const [lastEditTime, setLastEditTime] = useState<Date>(new Date());

  const loadProject = useCallback(() => {
    const selectedProject = localStorage.getItem('selectedProject');
    if (selectedProject) {
      try {
        const project = JSON.parse(selectedProject);
        setProjectName(project.title || "My Awesome Video Project");
        if (project.segments && Array.isArray(project.segments)) {
          setTimelineSegments(project.segments);
        }
        if (project.duration) {
          setVideoDuration(project.duration);
        }
        if (project.lastEdited) {
          setLastEditTime(new Date(project.lastEdited));
        }
        toast.success(`Loaded project: ${project.title}`);
        localStorage.removeItem('selectedProject');
      } catch (error) {
        console.error("Error parsing selected project:", error);
        toast.error("Failed to load project data");
      }
    } else {
      const currentProject = localStorage.getItem('currentProject');
      if (currentProject) {
        try {
          const project = JSON.parse(currentProject);
          setProjectName(project.name || "My Awesome Video Project");
          if (project.segments && Array.isArray(project.segments)) {
            setTimelineSegments(project.segments);
          }
          if (project.currentTime !== undefined) {
            setCurrentTime(project.currentTime);
          }
          if (project.duration) {
            setVideoDuration(project.duration);
          }
          if (project.lastEdited) {
            setLastEditTime(new Date(project.lastEdited));
          }
          toast.success(`Loaded current project: ${project.name}`);
        } catch (error) {
          console.error("Error loading current project:", error);
        }
      }
    }
    const uploadedMedia = localStorage.getItem('uploadedMediaFiles');
    if (uploadedMedia) {
      try {
        const media = JSON.parse(uploadedMedia);
        if (media.length > 0) {
          toast.info(`${media.length} media files available in your library`);
        }
      } catch (error) {
        console.error("Error loading uploaded media:", error);
      }
    }
  }, []);

  const getFormattedDuration = () => {
    const minutes = Math.floor(videoDuration / 60);
    const seconds = videoDuration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getLastEditedTime = () => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - lastEditTime.getTime()) / (1000 * 60));
    if (diffMinutes < 1) {
      return "just now";
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else if (diffMinutes < 1440) {
      const hours = Math.floor(diffMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return lastEditTime.toLocaleDateString();
    }
  };

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  const toggleMediaLibrary = () => {
    setIsMediaLibraryOpen(!isMediaLibraryOpen);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeChange = (newTime: number) => {
    setCurrentTime(newTime);
  };

  const handleControlTabChange = (tab: string) => {
    setActiveControlTab(tab);
  };

  const handleMediaSelect = (item: any, type: string) => {
    let segmentWidth = 15;
    let segmentDuration;
    if (type === 'video' || type === 'audio') {
      if (item.duration) {
        const parts = item.duration.split(':');
        const minutes = parseInt(parts[0], 10);
        const seconds = parts.length > 1 ? parseInt(parts[1], 10) : 0;
        segmentDuration = minutes * 60 + seconds;
        segmentWidth = (segmentDuration / videoDuration) * 100;
      }
    } else if (type === 'text') {
      segmentWidth = 15;
    } else if (type === 'image') {
      segmentWidth = 20;
    }
    let startPosition = timelineSegments.length > 0 ? 
        Math.max(...timelineSegments
          .filter(s => s.type === type)
          .map(s => s.start + s.width)) + 2 : 0;
    startPosition = Math.min(startPosition, 90);
    const newSegment: TimelineSegment = {
      id: `segment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      start: startPosition,
      width: segmentWidth,
      type: type as "video" | "audio" | "text" | "image",
      name: item.name,
      content: { 
        ...item, 
        type,
        ...(type === 'text' && { 
          textColor: '#FFFFFF',
          fontSize: 16,
          fontFamily: 'Inter',
          position: 'center',
          text: item.preview || "Your Text Here"
        }),
        ...(type === 'image' && {
          size: 40,
          opacity: 100,
          position: 'center'
        }),
        ...(type === 'audio' && {
          volume: 100,
          fadeIn: 0,
          fadeOut: 0
        })
      },
      duration: segmentDuration
    };
    setTimelineSegments(prev => [...prev, newSegment]);
    setSelectedMedia({ ...newSegment });
    setActiveControlTab(type);
    setLastEditTime(new Date());
    toast.success(`Added ${item.name} to timeline`);
  };

  const handleSegmentClick = (segment: TimelineSegment) => {
    setSelectedMedia(segment);
    setActiveControlTab(segment.type);
    setCurrentTime(segment.start);
    toast(`Selected: ${segment.name}`, {
      description: `${segment.type} segment in timeline`
    });
  };

  const handleSegmentUpdate = (updatedSegments: TimelineSegment[]) => {
    setTimelineSegments(updatedSegments);
    setLastEditTime(new Date());
  };

  const handleSingleSegmentUpdate = (updatedSegment: TimelineSegment) => {
    setTimelineSegments(prev => 
      prev.map(segment => 
        segment.id === updatedSegment.id ? updatedSegment : segment
      )
    );
    if (selectedMedia && selectedMedia.id === updatedSegment.id) {
      setSelectedMedia(updatedSegment);
    }
    setLastEditTime(new Date());
  };

  const handleSaveProject = () => {
    setIsSaving(true);
    const projectData = {
      name: projectName,
      lastEdited: new Date().toISOString(),
      segments: timelineSegments,
      currentTime: currentTime,
      duration: videoDuration
    };
    try {
      localStorage.setItem('currentProject', JSON.stringify(projectData));
      const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      const projectIndex = existingProjects.findIndex((p: any) => p.title === projectName);
      const projectSummary = {
        id: projectIndex >= 0 ? existingProjects[projectIndex].id : `proj-${Date.now()}`,
        title: projectName,
        lastEdited: new Date().toISOString(),
        duration: getFormattedDuration(),
        segments: timelineSegments,
        thumbnail: findProjectThumbnail(timelineSegments)
      };
      if (projectIndex >= 0) {
        existingProjects[projectIndex] = projectSummary;
      } else {
        existingProjects.push(projectSummary);
      }
      localStorage.setItem('projects', JSON.stringify(existingProjects));
      toast.success("Project saved successfully!");
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project");
    } finally {
      setIsSaving(false);
    }
  };

  const findProjectThumbnail = (segments: TimelineSegment[]) => {
    const imageSegment = segments.find(s => s.type === 'image' && s.content?.url);
    if (imageSegment?.content?.url) {
      return imageSegment.content.url;
    }
    const videoSegment = segments.find(s => s.type === 'video' && (s.content?.thumbnail || s.content?.url));
    if (videoSegment?.content?.thumbnail) {
      return videoSegment.content.thumbnail;
    }
    return "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=300&q=80";
  };

  const handleExport = () => {
    setIsExporting(true);
    const projectData = {
      name: projectName,
      lastEdited: new Date().toISOString(),
      segments: timelineSegments,
      currentTime: currentTime,
      duration: videoDuration
    };
    try {
      localStorage.setItem('currentProject', JSON.stringify(projectData));
      const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      const projectIndex = existingProjects.findIndex((p: any) => p.title === projectName);
      const projectSummary = {
        id: projectIndex >= 0 ? existingProjects[projectIndex].id : `proj-${Date.now()}`,
        title: projectName,
        lastEdited: new Date().toISOString(),
        duration: getFormattedDuration(),
        segments: timelineSegments,
        thumbnail: findProjectThumbnail(timelineSegments)
      };
      if (projectIndex >= 0) {
        existingProjects[projectIndex] = projectSummary;
      } else {
        existingProjects.push(projectSummary);
      }
      localStorage.setItem('projects', JSON.stringify(existingProjects));
      const exportData = {
        name: projectName,
        segments: timelineSegments,
        currentTime: currentTime,
        duration: videoDuration
      };
      localStorage.setItem('exportProject', JSON.stringify(exportData));
      navigate('/export');
    } catch (error) {
      console.error("Error preparing export:", error);
      toast.error("Failed to prepare project for export");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar activeItem="editor" />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 flex">
          <div className="flex-1 p-6 flex flex-col gap-4 overflow-auto">
            <div className="flex gap-4 flex-wrap lg:flex-nowrap">
              <div className="w-full lg:w-2/3">
                <VideoPreview 
                  isPlaying={isPlaying} 
                  onPlayPause={handlePlayPause}
                  currentTime={currentTime}
                  onTimeUpdate={handleTimeChange}
                  timelineSegments={timelineSegments}
                  onSegmentUpdate={handleSingleSegmentUpdate}
                  selectedSegment={selectedMedia}
                />
              </div>
              <div className="w-full lg:w-1/3">
                <ControlPanel 
                  activeTab={activeControlTab}
                  onTabChange={handleControlTabChange}
                  selectedMedia={selectedMedia}
                  onMediaUpdate={(updatedMedia) => {
                    if (!selectedMedia) return;
                    setSelectedMedia(updatedMedia);
                    if (selectedMedia.id) {
                      setTimelineSegments(prev => 
                        prev.map(seg => 
                          seg.id === selectedMedia.id 
                            ? { 
                                ...seg,
                                content: updatedMedia?.content ? 
                                  { ...(seg.content || {}), ...updatedMedia.content } : 
                                  seg.content
                              }
                            : seg
                        )
                      );
                      setLastEditTime(new Date());
                      toast.success("Media updated");
                    }
                  }}
                />
              </div>
            </div>
            <Timeline 
              segments={timelineSegments}
              onTimeChange={handleTimeChange}
              onSegmentClick={handleSegmentClick}
              onSegmentUpdate={handleSegmentUpdate}
              currentTime={currentTime}
              duration={videoDuration}
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
            />
            <div className="editor-panel">
              <div className="flex justify-between items-center">
                <div>
                  <div className="mb-1 flex items-center">
                    <input
                      ref={projectNameInputRef}
                      type="text"
                      className="text-lg font-medium bg-transparent focus:outline-none focus:ring-1 focus:ring-editor-primary px-1 rounded"
                      value={projectName}
                      onChange={(e) => {
                        setProjectName(e.target.value);
                        setLastEditTime(new Date());
                      }}
                    />
                  </div>
                  <p className="text-sm text-editor-text-subtle">Last edited: {getLastEditedTime()} • 720p • {getFormattedDuration()}</p>
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSaveProject}
                    disabled={isSaving}
                    className="bg-editor-primary hover:bg-editor-primary/80 text-white border-0"
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleExport}
                    disabled={isExporting}
                    className="bg-editor-primary hover:bg-editor-primary/80 text-white"
                  >
                    {isExporting ? "Preparing..." : "Export"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className={`transition-all duration-300 ${isMediaLibraryOpen ? 'w-80' : 'w-0 overflow-hidden'}`}>
            {isMediaLibraryOpen && (
              <div className="h-full p-4 border-l border-editor-text/10">
                <MediaLibrary onSelectItem={handleMediaSelect} />
              </div>
            )}
          </div>
          <button 
            className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-editor-surface p-2 rounded-l-md border border-editor-text/10 border-r-0 z-10"
            onClick={toggleMediaLibrary}
          >
            {isMediaLibraryOpen ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Editor;