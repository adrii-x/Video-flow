
// import React, { useState, useRef } from "react";
// import Header from "@/components/navigation/Header";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { User, Mail, Calendar, Settings, Save } from "lucide-react";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { toast } from "sonner";

// const Profile = () => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [profileData, setProfileData] = useState({
//     fullName: "Johnney Test",
//     email: "Test@example.com",
//     username: "J-Test",
//     bio: "Video Creator"
//   });
//   const [profileImage, setProfileImage] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleEditToggle = () => {
//     if (isEditing) {
//       // Save  all changes
//       toast.success("Profile changes saved successfully!");
//     }
//     setIsEditing(!isEditing);
//   };

//   const handleInputChange = (field: keyof typeof profileData, value: string) => {
//     setProfileData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         if (typeof e.target?.result === 'string') {
//           setProfileImage(e.target.result);
//           toast.success("Profile image updated!");
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleAvatarButtonClick = () => {
//     fileInputRef.current?.click();
//   };

//   return (
//     <div className="min-h-screen flex">
//       <div className="flex-1">
//         <Header />
        
//         <div className="p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h1 className="text-2xl font-heading font-semibold">My Profile</h1>
//             <Button 
//               variant="outline" 
//               className="flex items-center gap-2 bg-gradient-to-r from-editor-primary to-editor-secondary hover:from-editor-primary/90 hover:to-editor-secondary/90 text-white"
//               onClick={handleEditToggle}
//             >
//               {isEditing ? <Save size={16} /> : <Settings size={16} />}
//               <span>{isEditing ? "Save Profile" : "Edit Profile"}</span>
//             </Button>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="md:col-span-1">
//               <Card>
//                 <CardContent className="pt-6">
//                   <div className="flex flex-col items-center">
//                     <div className="relative mb-4">
//                       <Avatar className="h-24 w-24">
//                         {profileImage ? (
//                           <AvatarImage src={profileImage} alt="User" />
//                         ) : (
//                           <AvatarFallback className="bg-editor-secondary text-white text-xl">
//                             {profileData.fullName.split(' ').map(n => n[0]).join('')}
//                           </AvatarFallback>
//                         )}
//                       </Avatar>
                      
//                       {isEditing && (
//                         <div className="absolute -bottom-2 -right-2">
//                           <label htmlFor="avatar-upload" className="bg-editor-primary text-white p-1 rounded-full cursor-pointer flex items-center justify-center shadow-md">
//                             <Settings size={16} />
//                             <input 
//                               type="file" 
//                               id="avatar-upload" 
//                               className="hidden" 
//                               accept="image/*"
//                               onChange={handleAvatarChange}
//                               ref={fileInputRef}
//                             />
//                           </label>
//                         </div>
//                       )}
//                     </div>
                    
//                     <h2 className="text-xl font-medium">{profileData.fullName}</h2>
//                     <p className="text-sm text-editor-text-subtle mb-4">{profileData.bio}</p>
                    
//                     <Button 
//                       onClick={handleAvatarButtonClick}
//                       className="w-full bg-editor-primary hover:bg-editor-primary/80 text-white transition-colors"
//                     >
//                       Change Avatar
//                     </Button>
                    
//                     <div className="w-full flex flex-col gap-3 mt-4">
//                       <div className="flex items-center gap-3">
//                         <Mail size={16} className="text-editor-text-subtle" />
//                         <span className="text-sm">{profileData.email}</span>
//                       </div>
//                       <div className="flex items-center gap-3">
//                         <Calendar size={16} className="text-editor-text-subtle" />
//                         <span className="text-sm">Joined April 2023</span>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
            
//             <div className="md:col-span-2">
//               <Card className="mb-6">
//                 <CardHeader className="pb-2">
//                   <h3 className="text-lg font-medium">Account Information</h3>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div>
//                       <label className="text-sm font-medium text-editor-text-subtle block mb-1">Full Name</label>
//                       <Input 
//                         value={profileData.fullName} 
//                         className="bg-editor-bg text-white"
//                         disabled={!isEditing}
//                         onChange={(e) => handleInputChange('fullName', e.target.value)}
//                       />
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-editor-text-subtle block mb-1">Email</label>
//                       <Input 
//                         value={profileData.email} 
//                         className="bg-editor-bg text-white"
//                         disabled={!isEditing}
//                         onChange={(e) => handleInputChange('email', e.target.value)}
//                       />
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-editor-text-subtle block mb-1">Username</label>
//                       <Input 
//                         value={profileData.username} 
//                         className="bg-editor-bg text-white"
//                         disabled={!isEditing}
//                         onChange={(e) => handleInputChange('username', e.target.value)}
//                       />
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-editor-text-subtle block mb-1">Bio</label>
//                       <textarea 
//                         value={profileData.bio}
//                         className="w-full bg-editor-text-A border border-input rounded-md px-3 py-2 text-white"
//                         disabled={!isEditing}
//                         onChange={(e) => handleInputChange('bio', e.target.value)}
//                         rows={3}
//                       ></textarea>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
              
//               <Card>
//                 <CardHeader className="pb-2">
//                   <h3 className="text-lg font-medium">Activity</h3>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div>
//                       <h4 className="font-medium mb-2">Recent Projects</h4>
//                       <div className="text-sm">
//                         <p className="flex justify-between py-2 border-b border-editor-text/5 hover:bg-editor-text/5 rounded px-2 cursor-pointer" onClick={() => window.location.href = '/editor'}>
//                           <span>Marketing Campaign Video</span>
//                           <span className="text-editor-text-subtle">2 hours ago</span>
//                         </p>
//                         <p className="flex justify-between py-2 border-b border-editor-text/5 hover:bg-editor-text/5 rounded px-2 cursor-pointer" onClick={() => window.location.href = '/editor'}>
//                           <span>Product Demo</span>
//                           <span className="text-editor-text-subtle">Yesterday</span>
//                         </p>
//                         <p className="flex justify-between py-2 hover:bg-editor-text/5 rounded px-2 cursor-pointer" onClick={() => window.location.href = '/editor'}>
//                           <span>Social Media Teaser</span>
//                           <span className="text-editor-text-subtle">3 days ago</span>
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;
















import React, { useState, useRef } from "react";
import Header from "@/components/navigation/Header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Calendar, Settings, Save } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useProfile } from "./ProfileContext";

const Profile = () => {
  const { profileData, updateProfileData, updateProfileImage } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profileData.fullName,
    email: profileData.email,
    username: profileData.username,
    bio: profileData.bio
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form data when profile data changes
  React.useEffect(() => {
    setFormData({
      fullName: profileData.fullName,
      email: profileData.email,
      username: profileData.username,
      bio: profileData.bio
    });
  }, [profileData]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes to context
      updateProfileData(formData);
      toast.success("Profile changes saved successfully!");
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          updateProfileImage(e.target.result);
          toast.success("Profile image updated!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarButtonClick = () => {
    fileInputRef.current?.click();
  };

  const getInitials = () => {
    return profileData.fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1">
        <Header />
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-heading font-semibold">My Profile</h1>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-gradient-to-r from-editor-primary to-editor-secondary hover:from-editor-primary/90 hover:to-editor-secondary/90 text-white"
              onClick={handleEditToggle}
            >
              {isEditing ? <Save size={16} /> : <Settings size={16} />}
              <span>{isEditing ? "Save Profile" : "Edit Profile"}</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <Avatar className="h-24 w-24">
                        {profileData.profileImage ? (
                          <AvatarImage src={profileData.profileImage} alt="User" />
                        ) : (
                          <AvatarFallback className="bg-editor-secondary text-white text-xl">
                            {getInitials()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      
                      {isEditing && (
                        <div className="absolute -bottom-2 -right-2">
                          <label htmlFor="avatar-upload" className="bg-editor-primary text-white p-1 rounded-full cursor-pointer flex items-center justify-center shadow-md">
                            <Settings size={16} />
                            <input 
                              type="file" 
                              id="avatar-upload" 
                              className="hidden" 
                              accept="image/*"
                              onChange={handleAvatarChange}
                              ref={fileInputRef}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                    
                    <h2 className="text-xl font-medium">{profileData.fullName}</h2>
                    <p className="text-sm text-editor-text-subtle mb-4">{profileData.bio}</p>
                    
                    <Button 
                      onClick={handleAvatarButtonClick}
                      className="w-full bg-editor-primary hover:bg-editor-primary/80 text-white transition-colors"
                    >
                      Change Avatar
                    </Button>
                    
                    <div className="w-full flex flex-col gap-3 mt-4">
                      <div className="flex items-center gap-3">
                        <Mail size={16} className="text-editor-text-subtle" />
                        <span className="text-sm">{profileData.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar size={16} className="text-editor-text-subtle" />
                        <span className="text-sm">Joined April 2023</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card className="mb-6">
                <CardHeader className="pb-2">
                  <h3 className="text-lg font-medium">Account Information</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-editor-text-subtle block mb-1">Full Name</label>
                      <Input 
                        value={formData.fullName} 
                        className="bg-editor-bg text-white"
                        disabled={!isEditing}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-editor-text-subtle block mb-1">Email</label>
                      <Input 
                        value={formData.email} 
                        className="bg-editor-bg text-white"
                        disabled={!isEditing}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-editor-text-subtle block mb-1">Username</label>
                      <Input 
                        value={formData.username} 
                        className="bg-editor-bg text-white"
                        disabled={!isEditing}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-editor-text-subtle block mb-1">Bio</label>
                      <textarea 
                        value={formData.bio}
                        className="w-full bg-editor-text-A border border-input rounded-md px-3 py-2 text-white"
                        disabled={!isEditing}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        rows={3}
                      ></textarea>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <h3 className="text-lg font-medium">Activity</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Recent Projects</h4>
                      <div className="text-sm">
                        <p className="flex justify-between py-2 border-b border-editor-text/5 hover:bg-editor-text/5 rounded px-2 cursor-pointer" onClick={() => window.location.href = '/editor'}>
                          <span>Marketing Campaign Video</span>
                          <span className="text-editor-text-subtle">2 hours ago</span>
                        </p>
                        <p className="flex justify-between py-2 border-b border-editor-text/5 hover:bg-editor-text/5 rounded px-2 cursor-pointer" onClick={() => window.location.href = '/editor'}>
                          <span>Product Demo</span>
                          <span className="text-editor-text-subtle">Yesterday</span>
                        </p>
                        <p className="flex justify-between py-2 hover:bg-editor-text/5 rounded px-2 cursor-pointer" onClick={() => window.location.href = '/editor'}>
                          <span>Social Media Teaser</span>
                          <span className="text-editor-text-subtle">3 days ago</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;


