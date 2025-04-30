
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/navigation/Header";
import Sidebar from "@/components/navigation/Sidebar";
import { Upload as UploadIcon, Film, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface MediaFile extends File {
  preview?: string;
}

export interface UploadedMediaItem {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'image' | 'other';
  size: number;
  lastModified: number;
  url: string;
  thumbnail?: string;
  duration?: string;
}

const Upload = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<MediaFile[]>([]);
  
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files) as MediaFile[];
    handleFileUpload(files);
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files) as MediaFile[];
      handleFileUpload(files);
    }
  };
  
  const handleFileUpload = (files: MediaFile[]) => {
    setUploading(true);
    setUploadProgress(0);
    
    const timer = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setUploading(false);
          setUploadedFiles(prev => [...prev, ...files]);
          
          const existingFilesRaw = localStorage.getItem('uploadedMediaFiles');
          const existingFiles: UploadedMediaItem[] = existingFilesRaw ? JSON.parse(existingFilesRaw) : [];
          
          const newFilesData: UploadedMediaItem[] = files.map(file => {
            const mediaType = file.type.startsWith('video/') ? 'video' : 
                  file.type.startsWith('audio/') ? 'audio' : 
                  file.type.startsWith('image/') ? 'image' : 'other';
            
            let fileData: UploadedMediaItem = {
              id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              name: file.name,
              type: mediaType as 'video' | 'audio' | 'image' | 'other',
              size: file.size,
              lastModified: file.lastModified,
              url: URL.createObjectURL(file)
            };
            
            if (mediaType === 'video' || mediaType === 'audio') {
              fileData.duration = "0:30";
            }
            
            if (mediaType === 'image' || mediaType === 'video') {
              if (mediaType === 'image') {
                fileData.thumbnail = URL.createObjectURL(file);
              }
            }
            
            return fileData;
          });
          
          localStorage.setItem('uploadedMediaFiles', JSON.stringify([...newFilesData, ...existingFiles]));
          
          toast.success(`${files.length} file(s) uploaded successfully!`);
          return 0;
        }
        return prev + 5;
      });
    }, 100);
    
    return () => clearInterval(timer);
  };

  const handleBrowseClick = () => {
    document.getElementById('file-upload')?.click();
  };
  
  const handleGoToEditor = () => {
    navigate('/editor');
    toast.info("Taking you to the editor to work with your media");
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar activeItem="upload" />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <div className="flex-1 p-6 bg-editor-bg">
          <h1 className="text-2xl font-heading font-semibold text-editor-text mb-4">Upload Media</h1>
          
          <div 
            className="mt-8 border-2 border-dashed border-editor-text/20 rounded-lg p-12 flex flex-col items-center justify-center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
          >
            {uploading ? (
              <div className="w-full max-w-md">
                <div className="flex items-center justify-center mb-4">
                  <div className="mr-4">
                    <Film size={36} className="text-editor-primary animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-editor-text">Uploading media...</h3>
                    <div className="w-full h-2 bg-editor-text/10 rounded-full mt-2">
                      <div 
                        className="h-full bg-editor-primary rounded-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-editor-text-subtle mt-1">{uploadProgress}% complete</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <UploadIcon size={48} className="text-editor-text-subtle mb-4" />
                <h2 className="text-xl font-medium text-editor-text">Drag & Drop Files</h2>
                <p className="text-editor-text-subtle mt-2 mb-6">or click to browse files</p>
                <input 
                  id="file-upload"
                  type="file" 
                  multiple 
                  className="hidden"
                  onChange={handleFileInputChange}
                  accept="video/*,audio/*,image/*"
                />
                <Button 
                  className="bg-editor-primary hover:bg-editor-primary/90 text-white px-6 py-2 rounded-md"
                  onClick={handleBrowseClick}
                >
                  Browse Files
                </Button>
                <p className="text-xs text-editor-text-subtle mt-4">
                  Supported formats: MP4, WebM, MOV, JPG, PNG, MP3, WAV
                </p>
              </>
            )}
          </div>
          
          {uploadedFiles.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-editor-text">Recently Uploaded ({uploadedFiles.length})</h3>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 text-editor-primary hover:bg-editor-primary hover:text-white"
                  onClick={handleGoToEditor}
                >
                  <Check size={16} />
                  <span>Go to Editor</span>
                </Button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {uploadedFiles.map((file, index) => {
                  const isVideo = file.type.startsWith('video/');
                  const isAudio = file.type.startsWith('audio/');
                  const isImage = file.type.startsWith('image/');
                  
                  return (
                    <div key={index} className="bg-editor-surface/50 p-3 rounded-lg">
                      <div className="aspect-video bg-editor-surface/80 rounded-md flex items-center justify-center mb-2">
                        {isVideo && <Film size={24} className="text-editor-primary" />}
                        {isAudio && <UploadIcon size={24} className="text-editor-secondary" />}
                        {isImage && (
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt={file.name} 
                            className="w-full h-full object-cover rounded-md"
                          />
                        )}
                      </div>
                      <p className="text-sm truncate text-editor-text">{file.name}</p>
                      <p className="text-xs text-editor-text-subtle">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      // Comment: This section dynamically renders icons or thumbnails based on the file type (audio, image, or video).
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;
