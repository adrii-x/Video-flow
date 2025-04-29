
import React from "react";
import { Button } from "@/components/ui/button";

import { User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,

  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserMenu = () => {
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-editor-text/5">
          {/* User Icon */}
          <div className="h-8 w-8 bg-editor-secondary rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      
      <DropdownMenuContent align="end" className="bg-editor-surface border-editor-text/10">
        <DropdownMenuItem>Profile</DropdownMenuItem>

        <DropdownMenuItem >Settings</DropdownMenuItem>
        <DropdownMenuItem>
          Logout
        </DropdownMenuItem>
        
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
