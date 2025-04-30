
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Upload, Plus, Film, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import UploadArea from "@/components/upload/UploadArea";
import Header from "@/components/navigation/Header";
import Sidebar from "@/components/navigation/Sidebar";
import { toast } from "sonner";

// Mock data for project
const recentProjects = [
  {
    id: 1,
    title: "Marketing Campaign Video",
    thumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300&q=80",
    duration: "2:15",
    lastEdited: "2 hours ago"
  },
  {
    id: 2,
    title: "Product Demo",
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=300&q=80",
    duration: "1:30",
    lastEdited: "Yesterday"
  },
  {
    id: 3,
    title: "Social Media Teaser",
    thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=300&q=80",
    duration: "0:45",
    lastEdited: "3 days ago"
  }
];

const HomePage = () => {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState("recent");

  const handleFileUpload = (files: File[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
    
    // Store uploaded files in localStorage
    try {
      const existingFiles = JSON.parse(localStorage.getItem('uploadedMediaFiles') || '[]');
      const newFilesData = files.map(file => ({
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type.startsWith('video/') ? 'video' : 
              file.type.startsWith('audio/') ? 'audio' : 
              file.type.startsWith('image/') ? 'image' : 'other',
        size: file.size,
        lastModified: file.lastModified,
        url: URL.createObjectURL(file)
      }));
      
      localStorage.setItem('uploadedMediaFiles', JSON.stringify([...existingFiles, ...newFilesData]));
    } catch (error) {
      console.error("Error storing files in localStorage:", error);
    }
    
    toast.success(`${files.length} file(s) uploaded successfully!`);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  const handleNewProject = () => {
    toast.success("Creating new project");
    navigate('/');
  };

  const navigateToSection = (section: string) => {
    switch (section) {
      case "upload":
        navigate('/upload');
        toast.info("Navigating to upload page");
        break;
      case "edit":
        navigate('/');
        break;
      case "preview":
        navigate('/');
        break;
      default:
        break;
    }
  };
  
  const handleProjectClick = (project: any) => {
    // Store selected project in localStorage for use in editor
    localStorage.setItem('selectedProject', JSON.stringify(project));
    navigate('/');
    toast.success(`Opening project: ${project.title}`);
  };
  
  return (
    <div className="min-h-screen flex">
      <Sidebar activeItem="home" />
      
      <div className="flex-1">
        <Header />
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-heading font-semibold">Dashboard</h1>
            <Button 
              className="flex items-center gap-2 bg-gradient-to-r from-editor-primary to-editor-secondary hover:bg-editor-primary/90 hover:to-editor-secondary/90 text-white"
              onClick={handleNewProject}
            >
              <Plus size={16} />
              <span>New Project</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Quick Upload */}
            <div className="lg:col-span-2">
              <div className="editor-panel">
                <h2 className="text-xl font-heading font-semibold mb-4">Quick Upload</h2>
                <UploadArea onFileSelected={handleFileUpload} />
                
                {uploadedFiles.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2 text-editor-text-subtle">Recently Uploaded</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="bg-editor-surface/50 p-2 rounded-md">
                          <div className="aspect-video bg-editor-surface/80 rounded flex items-center justify-center mb-2">
                            <Film size={24} className="text-editor-text-subtle" />
                          </div>
                          <p className="text-sm truncate">{file.name}</p>
                          <p className="text-xs text-editor-text-subtle">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-6 flex justify-end">
                  <Button 
                    className="flex items-center gap-2 bg-editor-text/5 text-editor-primary hover:bg-gradient-to-r hover:from-editor-primary hover:to-editor-secondary hover:text-white transition-colors"
                    onClick={() => {
                      navigate('/');
                    }}
                  >
                    <Play size={16} />
                    <span>Start Editing</span>
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Getting Started */}
            <div>
              <div className="editor-panel">
                <h2 className="text-xl font-heading font-semibold mb-4">Getting Started</h2>
                <ul className="space-y-3">
                  <li 
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-editor-text/5 transition-colors cursor-pointer"
                    onClick={() => navigateToSection('upload')}
                  >
                    <div className="p-2 bg-editor-primary/10 rounded-full">
                      <Upload size={16} className="text-editor-primary" />
                    </div>
                    <span className="text-sm">Upload your media</span>
                  </li>
                  <li 
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-editor-text/5 transition-colors cursor-pointer"
                    onClick={() => navigateToSection('edit')}
                  >
                    <div className="p-2 bg-editor-primary/10 rounded-full">
                      <Film size={16} className="text-editor-primary" />
                    </div>
                    <span className="text-sm">Edit your video</span>
                  </li>
                  <li 
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-editor-text/5 transition-colors cursor-pointer"
                    onClick={() => navigateToSection('preview')}
                  >
                    <div className="p-2 bg-editor-primary/10 rounded-full">
                      <Play size={16} className="text-editor-primary" />
                    </div>
                    <span className="text-sm">Preview and export</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Projects */}
          <div className="editor-panel">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-heading font-semibold">Your Projects</h2>
              <div className="flex">
                <button 
                  onClick={() => handleTabChange("recent")}
                  className={`flex items-center gap-1 px-3 py-1 rounded-l-md text-sm border ${activeTab === "recent" ? 'bg-editor-primary border-editor-primary text-white' : 'border-editor-text/20 text-editor-text-subtle hover:bg-editor-text/5'}`}
                >
                  <Clock size={14} />
                  <span>Recent</span>
                </button>
                <button 
                  onClick={() => handleTabChange("favorites")}
                  className={`flex items-center gap-1 px-3 py-1 rounded-r-md text-sm border ${activeTab === "favorites" ? 'bg-editor-primary border-editor-primary text-white' : 'border-editor-text/20 text-editor-text-subtle hover:bg-editor-text/5'}`}
                >
                  <Star size={14} />
                  <span>Favorites</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentProjects.map(project => (
                <div key={project.id} onClick={() => handleProjectClick(project)}>
                  <Card className="hover:border-editor-primary transition-colors cursor-pointer">
                    <CardHeader className="p-0">
                      <div className="aspect-video relative overflow-hidden rounded-t-lg">
                        <img 
                          src={project.thumbnail} 
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                          <div className="p-3 w-full">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-white">{project.duration}</span>
                              <Button variant="outline" size="icon" className="h-7 w-7 rounded-full bg-white/20 border-white/30">
                                <Play size={14} className="text-white" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <h3 className="font-medium truncate">{project.title}</h3>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <p className="text-xs text-editor-text-subtle">Last edited {project.lastEdited}</p>
                    </CardFooter>
                  </Card>
                </div>
              ))}
              
              <Card 
                className="border-dashed border-editor-text/20 cursor-pointer hover:border-editor-primary/60 transition-colors" 
                onClick={handleNewProject}
              >
                <CardContent className="flex flex-col items-center justify-center h-full py-10">
                  <div className="p-3 bg-editor-text/5 rounded-full mb-3">
                    <Plus size={24} className="text-editor-text-subtle" />
                  </div>
                  <p className="text-editor-text-subtle">Create New Project</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
