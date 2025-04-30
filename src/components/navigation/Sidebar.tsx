
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Film, FolderOpen, Settings, Upload, Share2, Download, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

type SidebarItemProps = {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  path?: string;
};

type SidebarProps = {
  activeItem?: string;
};

const SidebarItem = ({ icon: Icon, label, isActive = false, onClick }: SidebarItemProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 py-3 px-2 rounded-lg cursor-pointer transition-colors w-full",
        isActive 
          ? "bg-editor-primary/20 text-editor-primary" 
          : "text-editor-text-subtle hover:text-editor-text hover:bg-editor-text/5"
      )}
      onClick={onClick}
    >
      <Icon size={20} />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
};

const Sidebar = ({ activeItem }: SidebarProps = {}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const menuItems = [
    { id: "home", icon: Home, label: "Home", path: "/" },
    { id: "projects", icon: FolderOpen, label: "Projects", path: "/projects" },
    { id: "upload", icon: Upload, label: "Upload", path: "/upload" },
    { id: "editor", icon: Film, label: "Editor", path: "/editor" },
    { id: "export", icon: Download, label: "Export", path: "/export" },
    { id: "share", icon: Share2, label: "Share", path: "/share" },
    { id: "settings", icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <>
      {/* Mobile Mmnu Button */}
      <div className="md:hidden fixed top-[85px] right-5 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="text-editor-text" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 bg-editor-surface p-0">
            <div className="flex flex-col h-full py-6">
              <div className="flex-1 flex flex-col gap-4 px-2">
                {menuItems.map((item) => (
                  <SidebarItem
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    isActive={location.pathname === item.path || activeItem === item.id}
                    onClick={() => {
                      navigate(item.path);
                      setIsOpen(false);
                    }}
                  />
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block h-screen w-16 bg-editor-surface border-r border-editor-text/10 flex-col items-center py-6">
        <div className="mb-8">
          <div 
            className="w-10 h-10 bg-editor-primary rounded-lg flex items-center justify-center cursor-pointer mx-auto"
            onClick={() => navigate('/')}
          >
            <Film size={20} className="text-white" />
          </div>
        </div>
        
        <div className="flex flex-col gap-4 w-full px-2">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={location.pathname === item.path || activeItem === item.id}
              onClick={() => navigate(item.path)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
