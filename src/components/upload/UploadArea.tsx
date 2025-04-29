import React, { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type UploadAreaProps = {
  onFileSelected: (files: File[]) => void;
};

const UploadArea = ({ onFileSelected }: UploadAreaProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    // Filter files to only include video files
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith("video/")
    );
    
    if (files.length === 0) {
      toast.error("Please upload video files only");
      return;
    }
    
    simulateUpload(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Ensure only video files are selected
      const files = Array.from(e.target.files).filter(file => 
        file.type.startsWith("video/")
      );
      
      if (files.length === 0) {
        toast.error("Please upload video files only");
        return;
      }
      
      simulateUpload(files);
    }
  };

  const simulateUpload = (files: File[]) => {
    setIsUploading(true);
    setProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          onFileSelected(files); // Notify parent component of uploaded files
          toast.success(`${files.length} video${files.length > 1 ? 's' : ''} uploaded successfully`);
          return 0;
        }
        return prev + 5;
      });
    }, 100);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div 
      className={cn(
        "video-drop-area bg-editor-surface/50",
        isDragging ? "animate-pulse-border border-editor-primary" : "border-editor-text/20"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={triggerFileInput}
    >
      <input 
        type="file" 
        accept="video/*" 
        multiple 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileSelect}
      />
      
      {isUploading ? (
        <div className="w-full max-w-xs">
          <div className="text-center mb-4">
            <h3 className="text-lg font-medium mb-1">Uploading</h3>
            <p className="text-editor-text-subtle text-sm">{progress}% complete</p>
          </div>
          <div className="w-full h-2 bg-editor-text/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-editor-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      ) : (
        <>
          <div className="p-4 bg-editor-primary/10 rounded-full mb-4">
            <Upload size={32} className="text-editor-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">Drag & Drop Video Files</h3>
          <p className="text-editor-text-subtle text-sm mb-4">or click to browse</p>
          {/* Display supported file formats and size */}
          <p className="text-xs text-editor-text-subtle max-w-xs text-center">
            Supported formats: MP4, WebM, AVI, MOV (max 500MB)
          </p>
        </>
      )}
    </div>
  );
};

export default UploadArea;