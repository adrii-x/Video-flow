
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { 
  Type, Image, Volume2, 
  Scissors, Square, Circle, 
  Italic, Bold, Underline, AlignLeft, AlignCenter, AlignRight,
  Plus, Minus, Trash2, Check
} from "lucide-react";
import { toast } from "sonner";

interface ControlPanelProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  selectedMedia?: any;
  onMediaUpdate?: (updatedMedia: any) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  activeTab = "text", 
  onTabChange,
  selectedMedia,
  onMediaUpdate
}) => {
  const [fontSize, setFontSize] = useState(16);
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [bgColor, setBgColor] = useState("transparent");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [position, setPosition] = useState("center");
  const [size, setSize] = useState(50);
  const [opacity, setOpacity] = useState(100);
  const [volume, setVolume] = useState(80);
  const [fadeIn, setFadeIn] = useState(0.5);
  const [fadeOut, setFadeOut] = useState(0.5);
  const [audioEffect, setAudioEffect] = useState("none");
  const [customText, setCustomText] = useState("Your text here");
  
  // Initialize values from selected Media when it changes
  useEffect(() => {
    if (selectedMedia) {
      if (selectedMedia.fontSize) setFontSize(selectedMedia.fontSize);
      if (selectedMedia.textColor) setTextColor(selectedMedia.textColor);
      if (selectedMedia.bgColor) setBgColor(selectedMedia.bgColor);
      if (selectedMedia.fontFamily) setFontFamily(selectedMedia.fontFamily);
      if (selectedMedia.position) setPosition(selectedMedia.position);
      if (selectedMedia.size !== undefined) setSize(selectedMedia.size);
      if (selectedMedia.opacity !== undefined) setOpacity(selectedMedia.opacity);
      if (selectedMedia.volume !== undefined) setVolume(selectedMedia.volume);
      if (selectedMedia.fadeIn !== undefined) setFadeIn(selectedMedia.fadeIn);
      if (selectedMedia.fadeOut !== undefined) setFadeOut(selectedMedia.fadeOut);
      if (selectedMedia.audioEffect) setAudioEffect(selectedMedia.audioEffect);
      if (selectedMedia.content?.text) setCustomText(selectedMedia.content.text);
    }
  }, [selectedMedia]);
  
  const handleTabChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
    }
  };
  
  // Apply changes to selected media
  const handleApplyChanges = (mediaType: string) => {
    if (!onMediaUpdate || !selectedMedia) return;
    
    const updates: any = { ...selectedMedia };
    
    switch (mediaType) {
      case "text":
        updates.fontSize = fontSize;
        updates.textColor = textColor;
        updates.bgColor = bgColor;
        updates.fontFamily = fontFamily;
        if (!updates.content) updates.content = {};
        updates.content.text = customText;
        updates.content.fontSize = fontSize;
        updates.content.textColor = textColor;
        updates.content.bgColor = bgColor;
        updates.content.fontFamily = fontFamily;
        break;
      case "image":
        updates.position = position;
        updates.size = size;
        updates.opacity = opacity;
        if (!updates.content) updates.content = {};
        updates.content.position = position;
        updates.content.size = size;
        updates.content.opacity = opacity;
        break;
      case "audio":
        updates.volume = volume;
        updates.fadeIn = fadeIn;
        updates.fadeOut = fadeOut;
        updates.audioEffect = audioEffect;
        if (!updates.content) updates.content = {};
        updates.content.volume = volume;
        updates.content.fadeIn = fadeIn;
        updates.content.fadeOut = fadeOut;
        updates.content.audioEffect = audioEffect;
        break;
    }
    
    onMediaUpdate(updates);
    toast.success(`Applied ${mediaType} changes`);
  };

  const isMediaSelected = !!selectedMedia;
  const selectedMediaName = selectedMedia?.name || "No media selected";
  
  return (
    <div className="editor-panel">
      {isMediaSelected && (
        <div className="mb-3 pb-3 border-b border-editor-text/10">
          <p className="text-sm font-medium flex items-center justify-between">
            <span>Editing: {selectedMediaName}</span>
            <button 
              className="text-xs px-2 py-0.5 bg-editor-text/5 hover:bg-editor-text/10 rounded"
              onClick={() => {
                if (onMediaUpdate) {
                  onMediaUpdate(null);
                  toast.info("Deselected media");
                }
              }}
            >
              Deselect
            </button>
          </p>
        </div>
      )}
      
      <Tabs 
        defaultValue={activeTab} 
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="text" className="flex items-center gap-2">
            <Type size={14} />
            <span>Text</span>
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center gap-2">
            <Image size={14} />
            <span>Image</span>
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center gap-2">
            <Volume2 size={14} />
            <span>Audio</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="space-y-4">
          <div>
            <label className="text-sm text-editor-text-subtle block mb-2">Text Content</label>
            <Textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Enter your text here"
              className="w-full bg-editor-surface border border-editor-text/20 rounded p-2 text-editor-text"
            />
          </div>
          
          <div>
            <label className="text-sm text-editor-text-subtle block mb-2">Font Family</label>
            <select 
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full bg-editor-surface border border-editor-text/20 rounded p-2 text-editor-text"
            >
              <option value="Inter">Inter</option>
              <option value="Poppins">Poppins</option>
              <option value="Roboto">Roboto</option>
              <option value="Montserrat">Montserrat</option>
            </select>
          </div>
          
          <div>
            <label className="text-sm text-editor-text-subtle block mb-2">Font Size: {fontSize}px</label>
            <div className="flex items-center gap-3">
              <button 
                className="p-1 rounded bg-editor-text/10 hover:bg-editor-text/20"
                onClick={() => setFontSize(Math.max(8, fontSize - 1))}
              >
                <Minus size={14} />
              </button>
              <Slider 
                value={[fontSize]} 
                min={8} 
                max={72} 
                step={1}
                onValueChange={(values) => setFontSize(values[0])}
                className="flex-1"
              />
              <button 
                className="p-1 rounded bg-editor-text/10 hover:bg-editor-text/20"
                onClick={() => setFontSize(Math.min(72, fontSize + 1))}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
          
          <div>
            <label className="text-sm text-editor-text-subtle block mb-2">Text Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-none overflow-hidden bg-transparent"
              />
              <input
                type="text"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="flex-1 bg-editor-surface border border-editor-text/20 rounded p-2 text-editor-text text-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm text-editor-text-subtle block mb-2">Background</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor === "transparent" ? "#000000" : bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-none overflow-hidden bg-transparent"
              />
              <select
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="flex-1 bg-editor-surface border border-editor-text/20 rounded p-2 text-editor-text text-sm"
              >
                <option value="transparent">Transparent</option>
                <option value="#000000">Black</option>
                <option value="#FFFFFF">White</option>
                <option value="#FF0000">Red</option>
                <option value="#00FF00">Green</option>
                <option value="#0000FF">Blue</option>
                <option value="custom">Custom...</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="text-sm text-editor-text-subtle block mb-2">Format</label>
            <div className="flex items-center gap-1">
              <button className="p-2 rounded hover:bg-editor-text/10">
                <Bold size={16} className="text-editor-text-subtle" />
              </button>
              <button className="p-2 rounded hover:bg-editor-text/10">
                <Italic size={16} className="text-editor-text-subtle" />
              </button>
              <button className="p-2 rounded hover:bg-editor-text/10">
                <Underline size={16} className="text-editor-text-subtle" />
              </button>
              <div className="w-px h-6 bg-editor-text/10 mx-1"></div>
              <button className="p-2 rounded hover:bg-editor-text/10">
                <AlignLeft size={16} className="text-editor-text-subtle" />
              </button>
              <button className="p-2 rounded hover:bg-editor-text/10">
                <AlignCenter size={16} className="text-editor-text-subtle" />
              </button>
              <button className="p-2 rounded hover:bg-editor-text/10">
                <AlignRight size={16} className="text-editor-text-subtle" />
              </button>
            </div>
          </div>
          
          <Button 
            onClick={() => handleApplyChanges("text")}
            disabled={!isMediaSelected || selectedMedia?.type !== "text"}
            className="w-full bg-editor-primary/20 hover:bg-editor-primary/30 text-editor-primary flex items-center justify-center gap-2"
          >
            <Check size={16} />
            Apply Text Changes
          </Button>
        </TabsContent>
        
        <TabsContent value="image" className="space-y-4">
          <div>
            <label className="text-sm text-editor-text-subtle block mb-2">Position</label>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setPosition("top-left")}
                className={`p-2 ${position === "top-left" ? "bg-editor-primary/20 text-editor-primary" : "bg-editor-text/5"} rounded hover:bg-editor-text/10 text-sm`}
              >
                Top Left
              </button>
              <button 
                onClick={() => setPosition("top-center")}
                className={`p-2 ${position === "top-center" ? "bg-editor-primary/20 text-editor-primary" : "bg-editor-text/5"} rounded hover:bg-editor-text/10 text-sm`}
              >
                Top Center
              </button>
              <button 
                onClick={() => setPosition("top-right")}
                className={`p-2 ${position === "top-right" ? "bg-editor-primary/20 text-editor-primary" : "bg-editor-text/5"} rounded hover:bg-editor-text/10 text-sm`}
              >
                Top Right
              </button>
              <button 
                onClick={() => setPosition("middle-left")}
                className={`p-2 ${position === "middle-left" ? "bg-editor-primary/20 text-editor-primary" : "bg-editor-text/5"} rounded hover:bg-editor-text/10 text-sm`}
              >
                Middle Left
              </button>
              <button 
                onClick={() => setPosition("center")}
                className={`p-2 ${position === "center" ? "bg-editor-primary/20 text-editor-primary" : "bg-editor-text/5"} rounded hover:bg-editor-text/10 text-sm`}
              >
                Center
              </button>
              <button 
                onClick={() => setPosition("middle-right")}
                className={`p-2 ${position === "middle-right" ? "bg-editor-primary/20 text-editor-primary" : "bg-editor-text/5"} rounded hover:bg-editor-text/10 text-sm`}
              >
                Middle Right
              </button>
              <button 
                onClick={() => setPosition("bottom-left")}
                className={`p-2 ${position === "bottom-left" ? "bg-editor-primary/20 text-editor-primary" : "bg-editor-text/5"} rounded hover:bg-editor-text/10 text-sm`}
              >
                Bottom Left
              </button>
              <button 
                onClick={() => setPosition("bottom-center")}
                className={`p-2 ${position === "bottom-center" ? "bg-editor-primary/20 text-editor-primary" : "bg-editor-text/5"} rounded hover:bg-editor-text/10 text-sm`}
              >
                Bottom Center
              </button>
              <button 
                onClick={() => setPosition("bottom-right")}
                className={`p-2 ${position === "bottom-right" ? "bg-editor-primary/20 text-editor-primary" : "bg-editor-text/5"} rounded hover:bg-editor-text/10 text-sm`}
              >
                Bottom Right
              </button>
            </div>
          </div>
          
          <div>
            <label className="text-sm text-editor-text-subtle block mb-2">Size: {size}%</label>
            <Slider 
              value={[size]} 
              min={10} 
              max={100} 
              step={1}
              onValueChange={(values) => setSize(values[0])}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-sm text-editor-text-subtle block mb-2">Opacity: {opacity}%</label>
            <Slider 
              value={[opacity]} 
              min={0} 
              max={100} 
              step={1}
              onValueChange={(values) => setOpacity(values[0])}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-sm text-editor-text-subtle block mb-2">Shape Mask</label>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded bg-editor-primary/20 hover:bg-editor-primary/30">
                <Square size={16} className="text-editor-text" />
              </button>
              <button className="p-2 rounded hover:bg-editor-text/10">
                <Circle size={16} className="text-editor-text-subtle" />
              </button>
              <button className="p-2 rounded hover:bg-editor-text/10">
                <Scissors size={16} className="text-editor-text-subtle" />
              </button>
            </div>
          </div>
          
          <Button 
            onClick={() => handleApplyChanges("image")}
            disabled={!isMediaSelected || selectedMedia?.type !== "image"}
            className="w-full bg-editor-primary/20 hover:bg-editor-primary/30 text-editor-primary flex items-center justify-center gap-2"
          >
            <Check size={16} />
            Apply Image Changes
          </Button>
        </TabsContent>
        
        <TabsContent value="audio" className="space-y-4">
          <div>
            <label className="text-sm  block mb-2">Volume: {volume}%</label>
            <div className="relative mt-2">
              <Slider 
                value={[volume]} 
                min={0} 
                max={100} 
                step={1}
                onValueChange={(values) => setVolume(values[0])}
                className="w-full"
              />
              <div className="absolute left-0 right-0 -top-1 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full "
                  style={{ width: `${volume}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div>
            <label className="text-sm text-editor-text-subtle block mb-2">Fade In: {fadeIn}s</label>
            <Slider 
              value={[fadeIn]} 
              min={0} 
              max={5} 
              step={0.1}
              onValueChange={(values) => setFadeIn(values[0])}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-sm text-editor-text-subtle block mb-2">Fade Out: {fadeOut}s</label>
            <Slider 
              value={[fadeOut]} 
              min={0} 
              max={5} 
              step={0.1}
              onValueChange={(values) => setFadeOut(values[0])}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-sm text-editor-text-subtle block mb-2">Effects</label>
            <select 
              className="w-full bg-editor-surface border border-editor-text/20 rounded p-2 text-editor-text"
              value={audioEffect}
              onChange={(e) => setAudioEffect(e.target.value)}
            >
              <option value="none">None</option>
              <option value="echo">Echo</option>
              <option value="reverb">Reverb</option>
              <option value="normalize">Normalize</option>
            </select>
          </div>
          
          <Button 
            onClick={() => handleApplyChanges("audio")}
            disabled={!isMediaSelected || selectedMedia?.type !== "audio"}
            className="w-full bg-editor-primary/20 hover:bg-editor-primary/30 text-editor-primary flex items-center justify-center gap-2"
          >
            <Check size={16} />
            Apply Audio Changes
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ControlPanel;
