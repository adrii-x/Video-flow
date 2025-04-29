
import React, { useState ,useRef, useEffect } from "react";
import Header from "@/components/navigation/Header";
import { User, Lock, Bell, Eye, Monitor, Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useProfile } from "./ProfileContext";



const Settings = () => {
  const { profileData, updateProfileData, updateProfileImage } = useProfile();
    const [activeTab, setActiveTab] = useState("profile");
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Local form state to track changes before saving
    const [formData, setFormData] = useState({
      displayName: profileData.fullName,
      email: profileData.email,
      bio: profileData.bio
    });
  
    // Update local form whenever profile data changes
    useEffect(() => {
      setFormData({
        displayName: profileData.fullName,
        email: profileData.email,
        bio: profileData.bio
      });
    }, [profileData]);
  
    const handleTabChange = (value: string) => {
      setActiveTab(value);
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
            toast.success("Avatar updated successfully!");
          }
        };
        reader.readAsDataURL(file);
      }
    };
  
    const handleSaveChanges = () => {
      // Map form data to profile data structure
      updateProfileData({
        fullName: formData.displayName,
        email: formData.email,
        bio: formData.bio
      });
      toast.success("Settings saved successfully!");
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
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <div className="flex-1 p-6 bg-editor-bg">
          <h1 className="text-2xl font-heading font-semibold text-editor-text mb-4">Settings</h1>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-editor-surface rounded-lg p-4 border border-editor-text/10">
              <nav className="space-y-1">
                <button 
                  onClick={() => handleTabChange("profile")}
                  className={`w-full text-left flex items-center px-3 py-2 rounded ${activeTab === "profile" ? "text-editor-primary bg-editor-primary/10" : "text-editor-text-subtle hover:text-editor-text hover:bg-editor-text/5"}`}
                >
                  <User size={18} className="mr-3" />
                  <span>Profile</span>
                </button>
                <button 
                  onClick={() => handleTabChange("security")}
                  className={`w-full text-left flex items-center px-3 py-2 rounded ${activeTab === "security" ? "text-editor-primary bg-editor-primary/10" : "text-editor-text-subtle hover:text-editor-text hover:bg-editor-text/5"}`}
                >
                  <Lock size={18} className="mr-3" />
                  <span>Security</span>
                </button>
                <button 
                  onClick={() => handleTabChange("notifications")}
                  className={`w-full text-left flex items-center px-3 py-2 rounded ${activeTab === "notifications" ? "text-editor-primary bg-editor-primary/10" : "text-editor-text-subtle hover:text-editor-text hover:bg-editor-text/5"}`}
                >
                  <Bell size={18} className="mr-3" />
                  <span>Notifications</span>
                </button>
                <button 
                  onClick={() => handleTabChange("appearance")}
                  className={`w-full text-left flex items-center px-3 py-2 rounded ${activeTab === "appearance" ? "text-editor-primary bg-editor-primary/10" : "text-editor-text-subtle hover:text-editor-text hover:bg-editor-text/5"}`}
                >
                  <Eye size={18} className="mr-3" />
                  <span>Appearance</span>
                </button>
                <button 
                  onClick={() => handleTabChange("display")}
                  className={`w-full text-left flex items-center px-3 py-2 rounded ${activeTab === "display" ? "text-editor-primary bg-editor-primary/10" : "text-editor-text-subtle hover:text-editor-text hover:bg-editor-text/5"}`}
                >
                  <Monitor size={18} className="mr-3" />
                  <span>Display</span>
                </button>
              </nav>
            </div>
            
            <div className="md:col-span-2 bg-editor-surface rounded-lg p-6 border border-editor-text/10">
              {activeTab === "profile" && (
                            <>
                              <h2 className="text-xl font-medium text-editor-text mb-6">Profile Settings</h2>
                              
                              <div className="space-y-6">
                                <div className="flex items-center">
                                  <div className="relative">
                                    <Avatar className="w-16 h-16">
                                      {profileData.profileImage ? (
                                        <AvatarImage src={profileData.profileImage} alt="User" />
                                      ) : (
                                        <AvatarFallback className="bg-editor-secondary text-white">
                                          {getInitials()}
                                        </AvatarFallback>
                                      )}
                                    </Avatar>
                                    <input
                                      type="file"
                                      id="avatar-upload"
                                      className="hidden"
                                      accept="image/*"
                                      onChange={handleAvatarChange}
                                      ref={fileInputRef}
                                    />
                                  </div>
                                  <div className="ml-4">
                                    <label htmlFor="avatar-upload" className="cursor-pointer">
                                      <Button 
                                        variant="outline" 
                                        type="button" 
                                        className="text-sm bg-gradient-to-r from-editor-primary to-editor-secondary hover:bg-editor-primary/90 hover:to-editor-secondary/90 text-white"
                                        onClick={() => fileInputRef.current?.click()}
                                      >
                                        Change Avatar
                                      </Button>
                                    </label>
                                  </div>
                                </div>
                                
                                <div>
                                  <Label htmlFor="display-name" className="block text-sm font-medium text-editor-text-subtle mb-2">
                                    Display Name
                                  </Label>
                                  <Input 
                                    id="display-name"
                                    type="text"
                                    value={formData.displayName}
                                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                                    className="w-full bg-editor-bg border border-editor-text/20 rounded px-4 py-2 text-editor-text"
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor="email" className="block text-sm font-medium text-editor-text-subtle mb-2">
                                    Email
                                  </Label>
                                  <Input 
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="w-full bg-editor-bg border border-editor-text/20 rounded px-4 py-2 text-editor-text"
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor="bio" className="block text-sm font-medium text-editor-text-subtle mb-2">
                                    Bio
                                  </Label>
                                  <textarea 
                                    id="bio"
                                    rows={3}
                                    value={formData.bio}
                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                    className="w-full bg-editor-bg border border-editor-text/20 rounded px-4 py-2 text-editor-text"
                                  ></textarea>
                                </div>
                                
                                <div className="pt-4">
                                  <Button 
                                    className="bg-editor-primary hover:bg-editor-primary/90 text-white px-6 py-2 rounded-md"
                                    onClick={handleSaveChanges}
                                  >
                                    Save Changes
                                  </Button>
                                </div>
                              </div>
                            </>
              )}
              
              {activeTab === "security" && (
                <>
                  <h2 className="text-xl font-medium text-editor-text mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="current-password" className="block text-sm font-medium text-editor-text-subtle mb-2">
                        Current Password
                      </Label>
                      <Input 
                        id="current-password"
                        type="password"
                        className="w-full bg-editor-bg border border-editor-text/20 rounded px-4 py-2 text-editor-text"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="new-password" className="block text-sm font-medium text-editor-text-subtle mb-2">
                        New Password
                      </Label>
                      <Input 
                        id="new-password"
                        type="password"
                        className="w-full bg-editor-bg border border-editor-text/20 rounded px-4 py-2 text-editor-text"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="confirm-password" className="block text-sm font-medium text-editor-text-subtle mb-2">
                        Confirm New Password
                      </Label>
                      <Input 
                        id="confirm-password"
                        type="password"
                        className="w-full bg-editor-bg border border-editor-text/20 rounded px-4 py-2 text-editor-text"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch id="two-factor" />
                      <Label htmlFor="two-factor">Enable Two-Factor Authentication</Label>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        className="bg-editor-primary hover:bg-editor-primary/90 text-white px-6 py-2 rounded-md"
                        onClick={handleSaveChanges}
                      >
                        Update Security Settings
                      </Button>
                    </div>
                  </div>
                </>
              )}
              
              {activeTab === "notifications" && (
                <>
                  <h2 className="text-xl font-medium text-editor-text mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-editor-text/10">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-editor-text-subtle">Receive project updates via email</p>
                      </div>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b border-editor-text/10">
                      <div>
                        <h3 className="font-medium">Export Notifications</h3>
                        <p className="text-sm text-editor-text-subtle">Get notified when exports complete</p>
                      </div>
                      <Switch id="export-notifications" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b border-editor-text/10">
                      <div>
                        <h3 className="font-medium">Team Updates</h3>
                        <p className="text-sm text-editor-text-subtle">Receive updates when team members make changes</p>
                      </div>
                      <Switch id="team-notifications" />
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <h3 className="font-medium">Marketing Communications</h3>
                        <p className="text-sm text-editor-text-subtle">Receive news about features and updates</p>
                      </div>
                      <Switch id="marketing-notifications" />
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        className="bg-editor-primary hover:bg-editor-primary/90 text-white px-6 py-2 rounded-md"
                        onClick={() => toast.success("Notification preferences saved!")}
                      >
                        Save Preferences
                      </Button>
                    </div>
                  </div>
                </>
              )}
              
              {activeTab === "appearance" && (
                <>
                  <h2 className="text-xl font-medium text-editor-text mb-6">Appearance Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Theme</h3>
                      <div className="grid grid-cols-3 gap-3">
                        <div 
                          className="aspect-square bg-editor-bg border-2 border-editor-primary rounded-md flex items-center justify-center cursor-pointer"
                          onClick={() => toast.info("Dark theme selected")}
                        >
                          <span className="text-sm">Dark</span>
                        </div>
                        <div 
                          className="aspect-square bg-white text-black border border-editor-text/20 rounded-md flex items-center justify-center cursor-pointer"
                          onClick={() => toast.info("Light theme selected")}
                        >
                          <span className="text-sm">Light</span>
                        </div>
                        <div 
                          className="aspect-square bg-gradient-to-r from-editor-bg to-editor-surface border border-editor-text/20 rounded-md flex items-center justify-center cursor-pointer"
                          onClick={() => toast.info("System theme selected")}
                        >
                          <span className="text-sm">System</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3">UI Density</h3>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => toast.info("Compact UI selected")}
                        >
                          Compact
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 bg-editor-primary/10 border-editor-primary"
                          onClick={() => toast.info("Default UI selected")}
                        >
                          Default
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => toast.info("Comfortable UI selected")}
                        >
                          Comfortable
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3">Font Size</h3>
                      <Input 
                        type="range" 
                        className="w-full accent-editor-primary" 
                        min="12" 
                        max="20" 
                        defaultValue="16"
                        onChange={() => toast.info("Font size adjusted")}
                      />
                      <div className="flex justify-between text-xs text-editor-text-subtle">
                        <span>Small</span>
                        <span>Default</span>
                        <span>Large</span>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        className="bg-editor-primary hover:bg-editor-primary/90 text-white px-6 py-2 rounded-md"
                        onClick={handleSaveChanges}
                      >
                        Save Appearance
                      </Button>
                    </div>
                  </div>
                </>
              )}
              
              {activeTab === "display" && (
                <>
                  <h2 className="text-xl font-medium text-editor-text mb-6">Display Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Default Project Resolution</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <Button 
                          variant="outline" 
                          className="bg-editor-primary/10 border-editor-primary"
                          onClick={() => toast.info("1080p selected as default")}
                        >
                          1080p (FHD)
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => toast.info("720p selected as default")}
                        >
                          720p (HD)
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => toast.info("4K selected as default")}
                        >
                          4K (UHD)
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3">Timeline Settings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="show-timecode">Show timecode</Label>
                          <Switch id="show-timecode" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="snap-to-grid">Snap to grid</Label>
                          <Switch id="snap-to-grid" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="auto-scroll">Auto-scroll timeline</Label>
                          <Switch id="auto-scroll" defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3">Performance Settings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="preview-quality" className="block mb-1">Preview Quality</Label>
                            <p className="text-xs text-editor-text-subtle">Lower quality improves performance</p>
                          </div>
                          <select 
                            id="preview-quality"
                            className="bg-editor-bg border border-editor-text/20 rounded px-3 py-2 text-editor-text"
                            onChange={() => toast.info("Preview quality updated")}
                          >
                            <option>High</option>
                            <option selected>Medium</option>
                            <option>Low</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        className="bg-editor-primary hover:bg-editor-primary/90 text-white px-6 py-2 rounded-md"
                        onClick={handleSaveChanges}
                      >
                        Save Display Settings
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;





// import React, { useState } from "react";
// import Header from "@/components/navigation/Header";
// import { User, Lock, Bell, Eye, Monitor, Upload } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Switch } from "@/components/ui/switch"
// import { Label } from "@/components/ui/label";
// import { toast } from "sonner";
// import { useProfile } from "./ProfileContext";



// const Settings = () => {
//   const [activeTab, setActiveTab] = useState("profile");
//   const [profileImage, setProfileImage] = useState<string | null>(null);

//   const handleTabChange = (value: string) => {
//     setActiveTab(value);
//     toast.info(`Switched to ${value} settings`);
//   };

//   const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         if (typeof e.target?.result === 'string') {
//           setProfileImage(e.target.result);
//           toast.success("Avatar updated successfully!");
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSaveChanges = () => {
//     toast.success("Settings saved successfully!");
//   };

//   return (
//     <div className="min-h-screen flex">
      
//       <div className="flex-1 flex flex-col">
//         <Header />
        
//         <div className="flex-1 p-6 bg-editor-bg">
//           <h1 className="text-2xl font-heading font-semibold text-editor-text mb-4">Settings</h1>
          
//           <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="md:col-span-1 bg-editor-surface rounded-lg p-4 border border-editor-text/10">
//               <nav className="space-y-1">
//                 <button 
//                   onClick={() => handleTabChange("profile")}
//                   className={`w-full text-left flex items-center px-3 py-2 rounded ${activeTab === "profile" ? "text-editor-primary bg-editor-primary/10" : "text-editor-text-subtle hover:text-editor-text hover:bg-editor-text/5"}`}
//                 >
//                   <User size={18} className="mr-3" />
//                   <span>Profile</span>
//                 </button>
//                 <button 
//                   onClick={() => handleTabChange("security")}
//                   className={`w-full text-left flex items-center px-3 py-2 rounded ${activeTab === "security" ? "text-editor-primary bg-editor-primary/10" : "text-editor-text-subtle hover:text-editor-text hover:bg-editor-text/5"}`}
//                 >
//                   <Lock size={18} className="mr-3" />
//                   <span>Security</span>
//                 </button>
//                 <button 
//                   onClick={() => handleTabChange("notifications")}
//                   className={`w-full text-left flex items-center px-3 py-2 rounded ${activeTab === "notifications" ? "text-editor-primary bg-editor-primary/10" : "text-editor-text-subtle hover:text-editor-text hover:bg-editor-text/5"}`}
//                 >
//                   <Bell size={18} className="mr-3" />
//                   <span>Notifications</span>
//                 </button>
//                 <button 
//                   onClick={() => handleTabChange("appearance")}
//                   className={`w-full text-left flex items-center px-3 py-2 rounded ${activeTab === "appearance" ? "text-editor-primary bg-editor-primary/10" : "text-editor-text-subtle hover:text-editor-text hover:bg-editor-text/5"}`}
//                 >
//                   <Eye size={18} className="mr-3" />
//                   <span>Appearance</span>
//                 </button>
//                 <button 
//                   onClick={() => handleTabChange("display")}
//                   className={`w-full text-left flex items-center px-3 py-2 rounded ${activeTab === "display" ? "text-editor-primary bg-editor-primary/10" : "text-editor-text-subtle hover:text-editor-text hover:bg-editor-text/5"}`}
//                 >
//                   <Monitor size={18} className="mr-3" />
//                   <span>Display</span>
//                 </button>
//               </nav>
//             </div>
            
//             <div className="md:col-span-2 bg-editor-surface rounded-lg p-6 border border-editor-text/10">
//               {activeTab === "profile" && (
//                 <>
//                   <h2 className="text-xl font-medium text-editor-text mb-6">Profile Settings</h2>
                  
//                   <div className="space-y-6">
//                     <div className="flex items-center">
//                       <div className="relative">
//                         <Avatar className="w-16 h-16">
//                           {profileImage ? (
//                             <AvatarImage src={profileImage} alt="User" />
//                           ) : (
//                             <AvatarFallback className="bg-editor-secondary text-white">
//                               <User size={24} />
//                             </AvatarFallback>
//                           )}
//                         </Avatar>
//                         <input
//                           type="file"
//                           id="avatar-upload"
//                           className="hidden"
//                           accept="image/*"
//                           onChange={handleAvatarChange}
//                         />
//                       </div>
//                       <div className="ml-4">
//                         <label htmlFor="avatar-upload" className="cursor-pointer">
//                           <Button variant="outline" type="button" className="text-sm bg-gradient-to-r from-editor-primary to-editor-secondary hover:bg-editor-primary/90 hover:to-editor-secondary/90 text-white">
//                             Change Avatar
//                           </Button>
//                         </label>
//                       </div>
//                     </div>
                    
//                     <div>
//                       <Label htmlFor="display-name" className="block text-sm font-medium text-editor-text-subtle mb-2">
//                         Display Name
//                       </Label>
//                       <Input 
//                         id="display-name"
//                         type="text"
//                         defaultValue="Johnny Test"
//                         className="w-full bg-editor-bg border border-editor-text/20 rounded px-4 py-2 text-editor-text"
//                       />
//                     </div>
                    
//                     <div>
//                       <Label htmlFor="email" className="block text-sm font-medium text-editor-text-subtle mb-2">
//                         Email
//                       </Label>
//                       <Input 
//                         id="email"
//                         type="email"
//                         defaultValue="Test@example.com"
//                         className="w-full bg-editor-bg border border-editor-text/20 rounded px-4 py-2 text-editor-text"
//                       />
//                     </div>
                    
//                     <div>
//                       <Label htmlFor="bio" className="block text-sm font-medium text-editor-text-subtle mb-2">
//                         Bio
//                       </Label>
//                       <textarea 
//                         id="bio"
//                         rows={3}
//                         defaultValue="Video editor and content creator."
//                         className="w-full bg-editor-bg border border-editor-text/20 rounded px-4 py-2 text-editor-text"
//                       ></textarea>
//                     </div>
                    
//                     <div className="pt-4">
//                       <Button 
//                         className="bg-editor-primary hover:bg-editor-primary/90 text-white px-6 py-2 rounded-md"
//                         onClick={handleSaveChanges}
//                       >
//                         Save Changes
//                       </Button>
//                     </div>
//                   </div>
//                 </>
//               )}
              
//               {activeTab === "security" && (
//                 <>
//                   <h2 className="text-xl font-medium text-editor-text mb-6">Security Settings</h2>
                  
//                   <div className="space-y-6">
//                     <div>
//                       <Label htmlFor="current-password" className="block text-sm font-medium text-editor-text-subtle mb-2">
//                         Current Password
//                       </Label>
//                       <Input 
//                         id="current-password"
//                         type="password"
//                         className="w-full bg-editor-bg border border-editor-text/20 rounded px-4 py-2 text-editor-text"
//                       />
//                     </div>
                    
//                     <div>
//                       <Label htmlFor="new-password" className="block text-sm font-medium text-editor-text-subtle mb-2">
//                         New Password
//                       </Label>
//                       <Input 
//                         id="new-password"
//                         type="password"
//                         className="w-full bg-editor-bg border border-editor-text/20 rounded px-4 py-2 text-editor-text"
//                       />
//                     </div>
                    
//                     <div>
//                       <Label htmlFor="confirm-password" className="block text-sm font-medium text-editor-text-subtle mb-2">
//                         Confirm New Password
//                       </Label>
//                       <Input 
//                         id="confirm-password"
//                         type="password"
//                         className="w-full bg-editor-bg border border-editor-text/20 rounded px-4 py-2 text-editor-text"
//                       />
//                     </div>
                    
//                     <div className="flex items-center space-x-2 pt-2">
//                       <Switch id="two-factor" />
//                       <Label htmlFor="two-factor">Enable Two-Factor Authentication</Label>
//                     </div>
                    
//                     <div className="pt-4">
//                       <Button 
//                         className="bg-editor-primary hover:bg-editor-primary/90 text-white px-6 py-2 rounded-md"
//                         onClick={handleSaveChanges}
//                       >
//                         Update Security Settings
//                       </Button>
//                     </div>
//                   </div>
//                 </>
//               )}
              
//               {activeTab === "notifications" && (
//                 <>
//                   <h2 className="text-xl font-medium text-editor-text mb-6">Notification Preferences</h2>
                  
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between py-2 border-b border-editor-text/10">
//                       <div>
//                         <h3 className="font-medium">Email Notifications</h3>
//                         <p className="text-sm text-editor-text-subtle">Receive project updates via email</p>
//                       </div>
//                       <Switch id="email-notifications" defaultChecked />
//                     </div>
                    
//                     <div className="flex items-center justify-between py-2 border-b border-editor-text/10">
//                       <div>
//                         <h3 className="font-medium">Export Notifications</h3>
//                         <p className="text-sm text-editor-text-subtle">Get notified when exports complete</p>
//                       </div>
//                       <Switch id="export-notifications" defaultChecked />
//                     </div>
                    
//                     <div className="flex items-center justify-between py-2 border-b border-editor-text/10">
//                       <div>
//                         <h3 className="font-medium">Team Updates</h3>
//                         <p className="text-sm text-editor-text-subtle">Receive updates when team members make changes</p>
//                       </div>
//                       <Switch id="team-notifications" />
//                     </div>
                    
//                     <div className="flex items-center justify-between py-2">
//                       <div>
//                         <h3 className="font-medium">Marketing Communications</h3>
//                         <p className="text-sm text-editor-text-subtle">Receive news about features and updates</p>
//                       </div>
//                       <Switch id="marketing-notifications" />
//                     </div>
                    
//                     <div className="pt-4">
//                       <Button 
//                         className="bg-editor-primary hover:bg-editor-primary/90 text-white px-6 py-2 rounded-md"
//                         onClick={() => toast.success("Notification preferences saved!")}
//                       >
//                         Save Preferences
//                       </Button>
//                     </div>
//                   </div>
//                 </>
//               )}
              
//               {activeTab === "appearance" && (
//                 <>
//                   <h2 className="text-xl font-medium text-editor-text mb-6">Appearance Settings</h2>
                  
//                   <div className="space-y-6">
//                     <div>
//                       <h3 className="font-medium mb-3">Theme</h3>
//                       <div className="grid grid-cols-3 gap-3">
//                         <div 
//                           className="aspect-square bg-editor-bg border-2 border-editor-primary rounded-md flex items-center justify-center cursor-pointer"
//                           onClick={() => toast.info("Dark theme selected")}
//                         >
//                           <span className="text-sm">Dark</span>
//                         </div>
//                         <div 
//                           className="aspect-square bg-white text-black border border-editor-text/20 rounded-md flex items-center justify-center cursor-pointer"
//                           onClick={() => toast.info("Light theme selected")}
//                         >
//                           <span className="text-sm">Light</span>
//                         </div>
//                         <div 
//                           className="aspect-square bg-gradient-to-r from-editor-bg to-editor-surface border border-editor-text/20 rounded-md flex items-center justify-center cursor-pointer"
//                           onClick={() => toast.info("System theme selected")}
//                         >
//                           <span className="text-sm">System</span>
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div>
//                       <h3 className="font-medium mb-3">UI Density</h3>
//                       <div className="flex items-center space-x-2">
//                         <Button 
//                           variant="outline" 
//                           className="flex-1"
//                           onClick={() => toast.info("Compact UI selected")}
//                         >
//                           Compact
//                         </Button>
//                         <Button 
//                           variant="outline" 
//                           className="flex-1 bg-editor-primary/10 border-editor-primary"
//                           onClick={() => toast.info("Default UI selected")}
//                         >
//                           Default
//                         </Button>
//                         <Button 
//                           variant="outline" 
//                           className="flex-1"
//                           onClick={() => toast.info("Comfortable UI selected")}
//                         >
//                           Comfortable
//                         </Button>
//                       </div>
//                     </div>
                    
//                     <div>
//                       <h3 className="font-medium mb-3">Font Size</h3>
//                       <Input 
//                         type="range" 
//                         className="w-full accent-editor-primary" 
//                         min="12" 
//                         max="20" 
//                         defaultValue="16"
//                         onChange={() => toast.info("Font size adjusted")}
//                       />
//                       <div className="flex justify-between text-xs text-editor-text-subtle">
//                         <span>Small</span>
//                         <span>Default</span>
//                         <span>Large</span>
//                       </div>
//                     </div>
                    
//                     <div className="pt-4">
//                       <Button 
//                         className="bg-editor-primary hover:bg-editor-primary/90 text-white px-6 py-2 rounded-md"
//                         onClick={handleSaveChanges}
//                       >
//                         Save Appearance
//                       </Button>
//                     </div>
//                   </div>
//                 </>
//               )}
              
//               {activeTab === "display" && (
//                 <>
//                   <h2 className="text-xl font-medium text-editor-text mb-6">Display Settings</h2>
                  
//                   <div className="space-y-6">
//                     <div>
//                       <h3 className="font-medium mb-3">Default Project Resolution</h3>
//                       <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//                         <Button 
//                           variant="outline" 
//                           className="bg-editor-primary/10 border-editor-primary"
//                           onClick={() => toast.info("1080p selected as default")}
//                         >
//                           1080p (FHD)
//                         </Button>
//                         <Button 
//                           variant="outline"
//                           onClick={() => toast.info("720p selected as default")}
//                         >
//                           720p (HD)
//                         </Button>
//                         <Button 
//                           variant="outline"
//                           onClick={() => toast.info("4K selected as default")}
//                         >
//                           4K (UHD)
//                         </Button>
//                       </div>
//                     </div>
                    
//                     <div>
//                       <h3 className="font-medium mb-3">Timeline Settings</h3>
//                       <div className="space-y-3">
//                         <div className="flex items-center justify-between">
//                           <Label htmlFor="show-timecode">Show timecode</Label>
//                           <Switch id="show-timecode" defaultChecked />
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <Label htmlFor="snap-to-grid">Snap to grid</Label>
//                           <Switch id="snap-to-grid" defaultChecked />
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <Label htmlFor="auto-scroll">Auto-scroll timeline</Label>
//                           <Switch id="auto-scroll" defaultChecked />
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div>
//                       <h3 className="font-medium mb-3">Performance Settings</h3>
//                       <div className="space-y-3">
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <Label htmlFor="preview-quality" className="block mb-1">Preview Quality</Label>
//                             <p className="text-xs text-editor-text-subtle">Lower quality improves performance</p>
//                           </div>
//                           <select 
//                             id="preview-quality"
//                             className="bg-editor-bg border border-editor-text/20 rounded px-3 py-2 text-editor-text"
//                             onChange={() => toast.info("Preview quality updated")}
//                           >
//                             <option>High</option>
//                             <option selected>Medium</option>
//                             <option>Low</option>
//                           </select>
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div className="pt-4">
//                       <Button 
//                         className="bg-editor-primary hover:bg-editor-primary/90 text-white px-6 py-2 rounded-md"
//                         onClick={handleSaveChanges}
//                       >
//                         Save Display Settings
//                       </Button>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Settings;
