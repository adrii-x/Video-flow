
import React, { useState } from "react";
import Header from "@/components/navigation/Header";
import Sidebar from "@/components/navigation/Sidebar";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Plus, Trash2, Play, Calendar, Clock, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface Project {
  id: number;
  title: string;
  thumbnail: string;
  description: string;
  lastEdited: string;
  duration: string;
}

const Projects = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      title: "Marketing Campaign Video",
      thumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300&q=80",
      description: "A promotional video for our new product line.",
      lastEdited: "2 hours ago",
      duration: "2:15"
    },
    {
      id: 2,
      title: "Product Demo",
      thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=300&q=80",
      description: "Detailed demonstration of product features.",
      lastEdited: "Yesterday",
      duration: "1:30"
    },
    {
      id: 3,
      title: "Social Media Teaser",
      thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=300&q=80",
      description: "Short teaser for social media platforms.",
      lastEdited: "3 days ago",
      duration: "0:45"
    }
  ]);
  
  const handleCreateProject = () => {
    toast.success("Creating new project");
    navigate("/");
  };
  
  const handleOpenProject = (id: number) => {
    toast.info(`Opening project #${id}`);
    navigate("/");
  };
  
  const handleDeleteProject = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjects(projects.filter(project => project.id !== id));
    toast.success("Project deleted successfully");
  };
  
  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex">
      <Sidebar activeItem="projects" />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <div className="flex-1 p-6 bg-editor-bg">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-heading font-semibold text-editor-text">Projects</h1>
            <Button 
              className="flex items-center gap-2 bg-editor-primary hover:bg-editor-primary/90"
              onClick={handleCreateProject}
            >
              <Plus size={16} />
              New Project
            </Button>
          </div>
          <p className="text-editor-text-subtle mb-6">Manage your video projects here.</p>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-editor-text-subtle" size={16} />
              <Input 
                placeholder="Search projects" 
                className="pl-10 bg-editor-surface border-editor-text/10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2 bg-gradient-to-r from-editor-primary to-editor-secondary hover:bg-editor-primary/90 hover:to-editor-secondary/90 text-white">
              <Filter size={16} /> 
              Filter
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <Card 
                key={project.id}
                className="border-editor-text/10 hover:border-editor-primary transition-colors cursor-pointer overflow-hidden"
                onClick={() => handleOpenProject(project.id)}
              >
                <div className="aspect-video relative">
                  <img 
                    src={project.thumbnail} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                    <div className="p-3 text-white w-full">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center text-xs">
                          <Clock size={12} className="mr-1" />
                          {project.duration}
                        </span>
                        <div className="flex gap-2">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-6 w-6 rounded-full bg-white/20 hover:bg-white/40"
                            onClick={(e) => handleDeleteProject(project.id, e)}
                          >
                            <Trash2 size={12} className="text-white" />
                          </Button>
                          <Button 
                            size="icon"
                            variant="ghost" 
                            className="h-6 w-6 rounded-full bg-white/20 hover:bg-white/40"
                          >
                            <Play size={12} className="text-white" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-1">{project.title}</h3>
                  <p className="text-sm text-editor-text-subtle line-clamp-2">{project.description}</p>
                  <div className="flex items-center mt-2 pt-2 border-t border-editor-text/5">
                    <div className="flex items-center text-sm text-editor-text-subtle">
                      <Calendar size={14} className="mr-1" />
                      <span>Last edited {project.lastEdited}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            
            <Card 
              className="border-dashed border-editor-text/20 cursor-pointer hover:border-editor-primary/60 transition-colors"
              onClick={handleCreateProject}
            >
              <div className="flex flex-col items-center justify-center h-full py-12">
                <div className="p-4 bg-editor-text/5 rounded-full mb-4">
                  <FileText size={24} className="text-editor-text-subtle" />
                </div>
                <p className="text-editor-text-subtle font-medium mb-2">Create New Project</p>
                <p className="text-xs text-editor-text-subtle text-center max-w-[200px]">
                  Start a new video project from scratch
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
