
import React, { useState } from "react";
import {  Mail, Twitter, Facebook, Copy, Check } from "lucide-react";
import Header from "@/components/navigation/Header";
import Sidebar from "@/components/navigation/Sidebar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Share = () => {
  const [copied, setCopied] = useState(false);
  const [permissions, setPermissions] = useState({
    viewOnly: true,
    canEdit: false
  });
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://videoflow.app/share/project-123456").then(() => {
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  const handleShare = (platform: string) => {
    const shareUrl = "https://videoflow.app/share/project-123456";
    let shareLink = "";
    
    switch(platform) {
      case "email":
        shareLink = `mailto:?subject=Check out my video project&body=I wanted to share this project with you: ${shareUrl}`;
        break;
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?text=Check out my video project&url=${encodeURIComponent(shareUrl)}`;
        break;
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      default:
        break;
    }
    
    if (shareLink) {
      window.open(shareLink, "_blank");
      toast.success(`Sharing via ${platform}`);
    }
  };
  
  const handlePermissionChange = (permission: string) => {
    if (permission === "viewOnly") {
      setPermissions({
        viewOnly: true,
        canEdit: false
      });
      toast.info("Set to view only permission");
    } else if (permission === "canEdit") {
      setPermissions({
        viewOnly: false,
        canEdit: true
      });
      toast.info("Set to editing permission");
    }
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar activeItem="share" />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <div className="flex-1 p-6 bg-editor-bg">
          <h1 className="text-2xl font-heading font-semibold text-editor-text mb-4">Share Project</h1>
          <p className="text-editor-text-subtle">Share your video project with others.</p>
          
          <div className="mt-8 bg-editor-surface rounded-lg p-6 border border-editor-text/10">
            <h3 className="font-medium text-editor-text mb-6">Share Options</h3>
            
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-editor-text-subtle mb-2">
                  Project Link
                </label>
                <div className="flex">
                  <input 
                    type="text"
                    readOnly
                    value="https://videoflow.app/share/project-123456"
                    className="flex-1 bg-editor-bg border border-editor-text/20 rounded-l px-4 py-2 text-editor-text"
                  />
                  <button 
                    className="bg-editor-text/10 hover:bg-editor-text/20 px-4 rounded-r border border-editor-text/20 border-l-0 transition-colors"
                    onClick={handleCopyLink}
                  >
                    {copied ? <Check size={18} className="text-editor-success" /> : <Copy size={18} className="text-editor-text" />}
                  </button>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-editor-text-subtle mb-4">Share via</h4>
                <div className="flex space-x-4">
                  <Button 
                    variant="outline" 
                    className="flex items-center space-x-2 flex-1 text-editor-text bg-editor-bg hover:bg-editor-primary hover:text-white transition-colors"
                    onClick={() => handleShare("email")}
                  >
                    <Mail size={18} />
                    <span>Email</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center space-x-2 flex-1 text-editor-text bg-editor-bg hover:bg-editor-primary hover:text-white transition-colors"
                    onClick={() => handleShare("twitter")}
                  >
                    <Twitter size={18} />
                    <span>Twitter</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center space-x-2 flex-1 text-editor-text bg-editor-bg hover:bg-editor-primary hover:text-white transition-colors"
                    onClick={() => handleShare("facebook")}
                  >
                    <Facebook size={18} />
                    <span>Facebook</span>
                  </Button>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-editor-text-subtle mb-4">Permissions</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="view-only" 
                      className="mr-3 accent-editor-primary h-4 w-4" 
                      checked={permissions.viewOnly}
                      onChange={() => handlePermissionChange("viewOnly")}
                    />
                    <label htmlFor="view-only" className="text-editor-text">View only</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="can-edit" 
                      className="mr-3 accent-editor-primary h-4 w-4"
                      checked={permissions.canEdit}
                      onChange={() => handlePermissionChange("canEdit")}
                    />
                    <label htmlFor="can-edit" className="text-editor-text">Can edit</label>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  className="bg-editor-primary hover:bg-editor-primary/90 text-white px-6 py-2 rounded-md"
                  onClick={() => toast.success("Share settings updated")}
                >
                  Apply Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
