import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Video, Music, Image as ImageIcon, Text, Clock, Star, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface VideoItem {
  id: string;
  name: string;
  thumbnail?: string;
  url?: string;
  duration: string;
  type?: 'video';
}

interface AudioItem {
  id: string;
  name: string;
  waveform?: string;
  url?: string;
  duration: string;
  type?: 'audio';
}

interface ImageItem {
  id: string;
  name: string;
  thumbnail?: string;
  url?: string;
  size: string;
  type?: 'image';
}

interface TextItem {
  id: string;
  name: string;
  preview: string;
  style?: string;
  type?: 'text';
}

type MediaItemType = VideoItem | AudioItem | ImageItem | TextItem;

function isVideoItem(item: MediaItemType): item is VideoItem {
  return item.type === 'video';
}

function isAudioItem(item: MediaItemType): item is AudioItem {
  return item.type === 'audio';
}

function isImageItem(item: MediaItemType): item is ImageItem {
  return item.type === 'image';
}

function isTextItem(item: MediaItemType): item is TextItem {
  return item.type === 'text';
}

const mockVideos: VideoItem[] = [
  { 
    id: "v1", 
    name: "Intro Video.mp4", 
    thumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300&q=80", 
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", 
    duration: "0:15", 
    type: 'video' 
  },
  { 
    id: "v2", 
    name: "Main Sequence.mp4", 
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=300&q=80", 
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    duration: "1:30", 
    type: 'video' 
  },
  { 
    id: "v3", 
    name: "B-Roll Footage.mp4", 
    thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=300&q=80", 
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    duration: "0:45", 
    type: 'video' 
  },
];

const mockAudio: AudioItem[] = [
  { 
    id: "a1", 
    name: "Background Music.mp3", 
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    waveform: "▁▂▃▅▆▇█▆▅▃▂▁", 
    duration: "3:24", 
    type: 'audio' 
  },
];

const mockImages: ImageItem[] = [
  { 
    id: "i1", 
    name: "Mountain Landscape.jpg", 
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=300&q=80", 
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
    size: "420 KB", 
    type: 'image' 
  },
  { 
    id: "i2", 
    name: "City Skyline.jpg", 
    thumbnail: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=300&q=80", 
    url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80",
    size: "380 KB", 
    type: 'image' 
  },
  { 
    id: "i3", 
    name: "Ocean Waves.jpg", 
    thumbnail: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=300&q=80", 
    url: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1200&q=80",
    size: "510 KB", 
    type: 'image' 
  },
];

interface MediaItemProps {
  item: MediaItemType;
  type: string;
  onSelect: (item: MediaItemType) => void;
}

const MediaItem: React.FC<MediaItemProps> = ({ item, type, onSelect }) => {
  const handleClick = () => {
    onSelect(item);
  };

  if (type === "video" && isVideoItem(item)) {
    const videoItem = item;
    return (
      <div 
        className="p-2 rounded-md hover:bg-editor-text/5 cursor-pointer transition-colors"
        onClick={handleClick}
      >
        <div className="aspect-video bg-editor-surface rounded-md overflow-hidden mb-2 relative">
          {videoItem.thumbnail && (
            <img src={videoItem.thumbnail} alt={videoItem.name} className="w-full h-full object-cover" />
          )}
          {videoItem.url && !videoItem.thumbnail && (
            <div className="w-full h-full bg-editor-bg/70 flex items-center justify-center">
              <Video size={24} className="text-editor-primary" />
            </div>
          )}
          <span className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
            {videoItem.duration}
          </span>
        </div>
        <p className="text-sm truncate">{videoItem.name}</p>
      </div>
    );
  }

  if (type === "audio" && isAudioItem(item)) {
    const audioItem = item;
    return (
      <div 
        className="p-2 rounded-md hover:bg-editor-text/5 cursor-pointer transition-colors"
        onClick={handleClick}
      >
        <div className="h-12 bg-editor-surface rounded-md flex items-center px-3 justify-between mb-2">
          <span className="text-editor-primary font-mono text-sm">{audioItem.waveform}</span>
          <span className="text-xs text-editor-text-subtle">{audioItem.duration}</span>
        </div>
        <p className="text-sm truncate">{audioItem.name}</p>
      </div>
    );
  }

  if (type === "image" && isImageItem(item)) {
    const imageItem = item;
    return (
      <div 
        className="p-2 rounded-md hover:bg-editor-text/5 cursor-pointer transition-colors"
        onClick={handleClick}
      >
        <div className="aspect-square bg-editor-surface rounded-md overflow-hidden mb-2">
          {imageItem.thumbnail && (
            <img src={imageItem.thumbnail} alt={imageItem.name} className="w-full h-full object-cover" />
          )}
          {imageItem.url && !imageItem.thumbnail && (
            <img src={imageItem.url} alt={imageItem.name} className="w-full h-full object-cover" />
          )}
        </div>
        <p className="text-sm truncate">{imageItem.name}</p>
        <p className="text-xs text-editor-text-subtle">{imageItem.size}</p>
      </div>
    );
  }

  if (type === "text" && isTextItem(item)) {
    const textItem = item;
    return (
      <div 
        className="p-2 rounded-md hover:bg-editor-text/5 cursor-pointer transition-colors flex flex-col"
        onClick={handleClick}
      >
        <div className="h-12 bg-editor-surface rounded-md flex items-center justify-center mb-2">
          <span className="text-editor-text">
            {textItem.preview}
          </span>
        </div>
        <p className="text-sm">{textItem.name}</p>
      </div>
    );
  }

  return null;
};

interface MediaLibraryProps {
  onSelectItem?: (item: MediaItemType, type: string) => void;
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({ onSelectItem }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [videos, setVideos] = useState<VideoItem[]>(mockVideos);
  const [audios, setAudios] = useState<AudioItem[]>(mockAudio);
  const [images, setImages] = useState<ImageItem[]>(mockImages);
  
  useEffect(() => {
    const uploadedMedia = localStorage.getItem('uploadedMediaFiles');
    if (uploadedMedia) {
      try {
        const media = JSON.parse(uploadedMedia);
        
        const uploadedVideos = media
          .filter((m: any) => m.type === 'video')
          .map((v: any) => ({
            id: v.id,
            name: v.name,
            url: v.url,
            thumbnail: v.thumbnail || undefined,
            duration: v.duration || "0:30",
            type: 'video' as const
          }));
        
        const uploadedAudios = media
          .filter((m: any) => m.type === 'audio')
          .map((a: any) => ({
            id: a.id,
            name: a.name,
            url: a.url,
            waveform: a.waveform || "▁▂▃▅▆▇█▆▅▃▂▁",
            duration: a.duration || "0:30",
            type: 'audio' as const
          }));
        
        const uploadedImages = media
          .filter((m: any) => m.type === 'image')
          .map((i: any) => ({
            id: i.id,
            name: i.name,
            url: i.url,
            thumbnail: i.thumbnail || undefined,
            size: i.size ? `${Math.round(i.size / 1024)} KB` : "100 KB",
            type: 'image' as const
          }));
        
        if (uploadedVideos.length > 0) {
          setVideos([...uploadedVideos, ...mockVideos]);
        }
        
        if (uploadedAudios.length > 0) {
          setAudios([...uploadedAudios, ...mockAudio]);
        }
        
        if (uploadedImages.length > 0) {
          setImages([...uploadedImages, ...mockImages]);
        }
      } catch (error) {
        console.error("Error loading media from localStorage:", error);
      }
    }
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectItem = (item: MediaItemType, type: string) => {
    if (onSelectItem) {
      onSelectItem(item, type);
    }
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (!file) return;
    
    const fileUrl = URL.createObjectURL(file);
    
    if (type === 'video') {
      const video = document.createElement('video');
      video.src = fileUrl;
      
      video.onloadedmetadata = () => {
        const minutes = Math.floor(video.duration / 60);
        const seconds = Math.floor(video.duration % 60);
        const durationStr = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        
        const newVideo: VideoItem = {
          id: `video-${Date.now()}`,
          name: file.name,
          url: fileUrl,
          duration: durationStr,
          type: 'video'
        };
        
        setVideos(prev => [newVideo, ...prev]);
        
        try {
          const existingMedia = JSON.parse(localStorage.getItem('uploadedMediaFiles') || '[]');
          const newFileData = {
            id: newVideo.id,
            name: file.name,
            type,
            size: file.size,
            lastModified: file.lastModified,
            url: fileUrl,
            duration: durationStr
          };
          
          localStorage.setItem('uploadedMediaFiles', JSON.stringify([newFileData, ...existingMedia]));
        } catch (error) {
          console.error("Error saving to localStorage:", error);
        }
        
        toast.success(`Video ${file.name} uploaded successfully!`);
      };
      
      video.onerror = () => {
        toast.error("Error loading video file. Please try another.");
      };
      
    } else if (type === 'audio') {
      const audio = document.createElement('audio');
      audio.src = fileUrl;
      
      audio.onloadedmetadata = () => {
        const minutes = Math.floor(audio.duration / 60);
        const seconds = Math.floor(audio.duration % 60);
        const durationStr = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        
        const newAudio: AudioItem = {
          id: `audio-${Date.now()}`,
          name: file.name,
          url: fileUrl,
          waveform: "▁▂▃▅▆▇█▆▅▃▂▁",
          duration: durationStr,
          type: 'audio'
        };
        //
        setAudios(prev => [newAudio, ...prev]);
        
        try {
          const existingMedia = JSON.parse(localStorage.getItem('uploadedMediaFiles') || '[]');
          const newFileData = {
            id: newAudio.id,
            name: file.name,
            type,
            size: file.size,
            lastModified: file.lastModified,
            url: fileUrl,
            duration: durationStr
          };
          
          localStorage.setItem('uploadedMediaFiles', JSON.stringify([newFileData, ...existingMedia]));
        } catch (error) {
          console.error("Error saving to localStorage:", error);
        }
        
        toast.success(`Audio ${file.name} uploaded successfully!`);
      };
      
      audio.onerror = () => {
        toast.error("Error loading audio file. Please try another.");
      };
      
    } else if (type === 'image') {
      const img = document.createElement('img');
      img.src = fileUrl;
      
      img.onload = () => {
        const fileSizeKB = Math.round(file.size / 1024);
        
        const newImage: ImageItem = {
          id: `image-${Date.now()}`,
          name: file.name,
          url: fileUrl,
          size: `${fileSizeKB} KB`,
          type: 'image'
        };
        
        setImages(prev => [newImage, ...prev]);
        
        try {
          const existingMedia = JSON.parse(localStorage.getItem('uploadedMediaFiles') || '[]');
          const newFileData = {
            id: newImage.id,
            name: file.name,
            type,
            size: file.size,
            lastModified: file.lastModified,
            url: fileUrl
          };
          
          localStorage.setItem('uploadedMediaFiles', JSON.stringify([newFileData, ...existingMedia]));
        } catch (error) {
          console.error("Error saving to localStorage:", error);
        }
        
        toast.success(`Image ${file.name} uploaded successfully!`);
      };
      
      img.onerror = () => {
        toast.error("Error loading image file. Please try another.");
      };
    }
  };
  
  const handleUploadClick = () => {
    navigate('/upload');
  };

  const createCustomText = () => {
    const customText: TextItem = {
      id: `text-${Date.now()}`,
      name: "Custom Text",
      preview: "Your Text Here",
      type: 'text'
    };
    handleSelectItem(customText, 'text');
    toast.success("Custom text added to timeline");
  };

  return (
    <div className="editor-panel min-h-[30rem]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Media Library</h2>
        <Button 
          size="sm" 
          onClick={handleUploadClick}
          className="text-editor-primary bg-editor-text/5 hover:bg-editor-text/10"
        >
          <Upload size={14} className="mr-1" /> Upload
        </Button>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-editor-text-subtle" />
          <input 
            type="text" 
            placeholder="Search library..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-8 pr-4 py-2 bg-editor-surface/70 border border-editor-text/10 rounded-md text-editor-text placeholder:text-editor-text-subtle focus:outline-none focus:ring-1 focus:ring-editor-primary"
          />
        </div>
      </div>

      <div className="flex mb-4 gap-2">
        <button 
          onClick={() => handleFilterClick('recent')}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${activeFilter === 'recent' ? 'bg-editor-primary text-white' : 'bg-editor-text/5 text-editor-text-subtle hover:bg-editor-text/10'}`}
        >
          <Clock size={14} />
          <span>Recent</span>
        </button>
        <button 
          onClick={() => handleFilterClick('favorite')}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${activeFilter === 'favorite' ? 'bg-editor-primary text-white' : 'bg-editor-text/5 text-editor-text-subtle hover:bg-editor-text/10'}`}
        >
          <Star size={14} />
          <span>Favorites</span>
        </button>
      </div>

      <Tabs defaultValue="videos" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="videos" className="flex items-center gap-1">
            <Video size={14} />
            <span>Videos</span>
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center gap-1">
            <Music size={14} />
            <span>Audio</span>
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-1">
            <ImageIcon size={14} />
            <span>Images</span>
          </TabsTrigger>
          <TabsTrigger value="text" className="flex items-center gap-1">
            <Text size={14} />
            <span>Text</span>
          </TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-96">
          <TabsContent value="videos" className="mt-0">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2">
                <label 
                  className="aspect-video bg-editor-text/5 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-editor-text/10 transition-colors"
                >
                  <Plus size={24} className="text-editor-text-subtle mb-1" />
                  <span className="text-xs text-editor-text-subtle">Add Video</span>
                  <input 
                    type="file" 
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => handleFileInputChange(e, 'video')}
                  />
                </label>
              </div>
              
              {videos
                .filter(video => video.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(video => (
                  <MediaItem 
                    key={video.id} 
                    item={video} 
                    type="video"
                    onSelect={(item) => handleSelectItem(item, 'video')} 
                  />
                ))
              }
            </div>
          </TabsContent>
          
          <TabsContent value="audio" className="mt-0">
            <div className="space-y-2">
              <div className="p-2">
                <label 
                  className="h-12 bg-editor-text/5 rounded-md flex items-center justify-center cursor-pointer hover:bg-editor-text/10 transition-colors"
                >
                  <Plus size={18} className="text-editor-text-subtle mr-1" />
                  <span className="text-xs text-editor-text-subtle">Add Audio</span>
                  <input 
                    type="file" 
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => handleFileInputChange(e, 'audio')}
                  />
                </label>
              </div>
              
              {audios
                .filter(audio => audio.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(audio => (
                  <MediaItem 
                    key={audio.id} 
                    item={audio} 
                    type="audio" 
                    onSelect={(item) => handleSelectItem(item, 'audio')}
                  />
                ))
              }
            </div>
          </TabsContent>
          
          <TabsContent value="images" className="mt-0">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2">
                <label 
                  className="aspect-square bg-editor-text/5 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-editor-text/10 transition-colors"
                >
                  <Plus size={24} className="text-editor-text-subtle mb-1" />
                  <span className="text-xs text-editor-text-subtle">Add Image</span>
                  <input 
                    type="file" 
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileInputChange(e, 'image')}
                  />
                </label>
              </div>
              
              {images
                .filter(image => image.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(image => (
                  <MediaItem 
                    key={image.id} 
                    item={image} 
                    type="image" 
                    onSelect={(item) => handleSelectItem(item, 'image')}
                  />
                ))
              }
            </div>
          </TabsContent>
          
          <TabsContent value="text" className="mt-0">
            <div className="grid grid-cols-2 gap-2">
              <div 
                className="p-2 rounded-md hover:bg-editor-text/5 cursor-pointer transition-colors"
                onClick={createCustomText}
              >
                <div className="h-12 bg-editor-text/5 rounded-md flex items-center justify-center mb-2">
                  <Plus size={18} className="text-editor-text-subtle mr-1" />
                  <span className="text-sm text-editor-text-subtle">Custom Text</span>
                </div>
                <p className="text-sm">Add Custom Text</p>
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default MediaLibrary;
