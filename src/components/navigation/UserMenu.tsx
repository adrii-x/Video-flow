
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { User } from "lucide-react";
// import { toast } from "sonner";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// const UserMenu = () => {
//   const navigate = useNavigate();
  
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" size="icon" className="hover:bg-editor-text/5">
//           {/* User Icon */}
//           <div className="h-8 w-8 bg-editor-secondary rounded-full flex items-center justify-center">
//             <User size={16} className="text-white" />
//           </div>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" className="bg-editor-surface border-editor-text/10">
//         <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
//         <DropdownMenuItem onClick={() => navigate('/settings')}>Settings</DropdownMenuItem>
//         <DropdownMenuItem onClick={() => {
//           toast.info("Logged out successfully");
//           navigate('/');
//         }}>
//           Logout
//         </DropdownMenuItem>

//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// };

// export default UserMenu;




import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useProfile } from "@/pages/ProfileContext";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserMenu = () => {
  const navigate = useNavigate();
  const { profileData } = useProfile();
  
  // Get initials for avatar fallback
  const getInitials = () => {
    return profileData.fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-editor-text/5">
          {/* User Avatar - now displays profile image if available */}
          <Avatar className="h-8 w-8">
            {profileData.profileImage ? (
              <AvatarImage src={profileData.profileImage} alt={profileData.fullName} />
            ) : (
              <AvatarFallback className="bg-editor-secondary text-white">
                {getInitials()}
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-editor-surface border-editor-text/10">
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => navigate('/profile')}
        >
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => navigate('/settings')}
        >
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => {
            toast.info("Logged out successfully");
            navigate('/');
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;