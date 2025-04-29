
import React from "react";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface SearchDialogProps {
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
}

const SearchDialog = ({ showSearch, setShowSearch }: SearchDialogProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = () => {
    setSearchQuery("");
    setShowSearch(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {

    if (e.key === 'Enter') {

      handleSearch();
    }
  };


  return (
    <Dialog open={showSearch} onOpenChange={setShowSearch}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-editor-text/5">
          <Search className="text-editor-text-subtle" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-editor-surface border-editor-text/10">
        <DialogHeader>
          <DialogTitle className="text-editor-text">Search</DialogTitle>
          <DialogDescription className="text-editor-text-subtle">
            Search for projects, exports, or editing tools.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 mt-2">
          <Input 
            placeholder="Search projects, exports..." 
            className="text-editor-text bg-editor-bg border-editor-text/20 focus:border-editor-primary"
            value={searchQuery}
            onKeyUp={handleKeyPress}
          />
          <Button 
            onClick={handleSearch}
            className="bg-gradient-to-r from-sky-500 to-blue-600"
          >
            <ArrowRight size={16} />
          </Button>
        </div>
        <div className="mt-4 text-sm text-editor-text-subtle">
          Try searching for "projects", "export", or "edit"
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
