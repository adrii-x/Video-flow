
import React, { useState } from "react";
import Header from "@/components/navigation/Header";
import Sidebar from "@/components/navigation/Sidebar";
import { Download, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

const Export = () => {
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState("mp4");
  const [resolution, setResolution] = useState("1080p");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    toast.success("Starting export process...");
    
    // Simulate export process
    const timer = setTimeout(() => {
      setIsExporting(false);
      toast.success("Export completed successfully!");
    }, 3000);
    
    return () => clearTimeout(timer);
  };

  const getQualityLabel = () => {
    if (quality < 30) return "Low";
    if (quality < 70) return "Medium";
    return "High";
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar activeItem="export" />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <div className="flex-1 p-6 bg-editor-bg">
          <h1 className="text-2xl font-heading font-semibold text-editor-text mb-4">Export Project</h1>
          <p className="text-editor-text-subtle">Configure and export your video project.</p>
          
          <div className="mt-8 bg-editor-surface rounded-lg p-6 border border-editor-text/10">
            <h3 className="font-medium text-editor-text mb-4">Export Settings</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-editor-text-subtle mb-2">
                  Format
                </label>
                <select 
                  className="w-full bg-editor-bg border border-editor-text/20 rounded px-4 py-2 text-editor-text"
                  value={format}
                  onChange={(e) => {
                    setFormat(e.target.value);
                    toast.info(`Format changed to ${e.target.value.toUpperCase()}`);
                  }}
                >
                  <option value="mp4">MP4</option>
                  <option value="webm">WebM</option>
                  <option value="gif">GIF</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-editor-text-subtle mb-2">
                  Resolution
                </label>
                <select 
                  className="w-full bg-editor-bg border border-editor-text/20 rounded px-4 py-2 text-editor-text"
                  value={resolution}
                  onChange={(e) => {
                    setResolution(e.target.value);
                    toast.info(`Resolution changed to ${e.target.value}`);
                  }}
                >
                  <option value="1080p">1080p (1920x1080)</option>
                  <option value="720p">720p (1280x720)</option>
                  <option value="480p">480p (854x480)</option>
                  <option value="4k">4K (3840x2160)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-editor-text-subtle mb-2 flex justify-between">
                  <span>Quality ({getQualityLabel()}: {quality}%)</span>
                </label>
                <div className="relative mt-2 mb-6">
                  <Slider
                    value={[quality]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setQuality(value[0])}
                    className="z-10 relative"
                  />
                  <div className="absolute left-0 right-0 h-2 -top-1 rounded-full overflow-hidden bg-gradient-to-r from-editor-bg via-editor-primary to-editor-secondary opacity-20"></div>
                  
                  <div className="absolute left-0 top-6 right-0">
                    <div className="relative">
                      <div 
                        className="absolute h-12 w-12 rounded-full bg-editor-primary/5 transition-all flex items-center justify-center" 
                        style={{ 
                          left: `calc(${quality}% - 24px)`,
                          borderColor: quality > 70 ? 'var(--editor-secondary)' : quality > 30 ? 'var(--editor-primary)' : 'var(--editor-bg)'
                        }}
                      >
                        <div 
                          className={`h-8 w-8 rounded-full transition-all flex items-center justify-center text-xs font-medium ${
                            quality > 80 ? 'bg-editor-secondary text-white' : 
                            quality > 40 ? 'bg-editor-primary text-white' : 
                            'bg-editor-text/10 text-editor-text-subtle'
                          }`}
                        >
                          {quality}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between text-xs text-editor-text-subtle mt-10">
                  <span>Smaller file</span>
                  <span>{getQualityLabel()} • {quality}%</span>
                  <span>Higher quality</span>
                </div>
              </div>
              
              <div className="bg-editor-bg/50 p-4 rounded-md border border-editor-text/10">
                <h4 className="flex items-center text-sm font-medium mb-3">
                  <Settings2 size={16} className="mr-2" /> 
                  Advanced Settings
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-editor-text-subtle mb-2">
                      Codec
                    </label>
                    <select className="w-full bg-editor-bg border border-editor-text/20 rounded px-3 py-1 text-sm text-editor-text">
                      <option>H.264</option>
                      <option>H.265</option>
                      <option>AV1</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-editor-text-subtle mb-2">
                      Framerate
                    </label>
                    <select className="w-full bg-editor-bg border border-editor-text/20 rounded px-3 py-1 text-sm text-editor-text">
                      <option>30 fps</option>
                      <option>60 fps</option>
                      <option>24 fps</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  className="w-full bg-gradient-to-r from-editor-primary to-editor-secondary hover:from-editor-primary/90 hover:to-editor-secondary/90 text-white py-3 rounded-md flex items-center justify-center"
                  onClick={handleExport}
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download size={18} className="mr-2" />
                      Export Video
                    </>
                  )}
                </Button>
                
                {isExporting && (
                  <div className="mt-4 w-full h-1 bg-editor-text/10 overflow-hidden rounded-full">
                    <div className="h-full bg-editor-primary animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Export;
