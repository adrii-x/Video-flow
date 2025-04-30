
import React from "react"
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface HelpDialogProps {
  showHelp: boolean;
  setShowHelp: (show: boolean) => void;
}

const HelpDialog = ({ showHelp, setShowHelp }: HelpDialogProps) => {
  return (
    <Dialog open={showHelp} onOpenChange={setShowHelp}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-editor-text/5">
          <HelpCircle className="text-editor-text-subtle" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-editor-surface border-editor-text/10 text-editor-text">
        <DialogHeader>
          <DialogTitle className="text-editor-text">Help Center</DialogTitle>
          <DialogDescription className="text-editor-text-subtle">
            Get help with VideoFlow features and tools.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 text-editor-text">
          <h3 className="font-medium mb-2">Quick Links</h3>
          <ul className="space-y-2">
            {[
              "Getting Started Guide",
              "Video Tutorials",
              "FAQs",
              "Contact Support"
            ].map((item) => (
              <li 
                key={item}
                className="hover:text-editor-primary cursor-pointer p-2 hover:bg-editor-text/5 rounded-md"
                onClick={() => {
                  toast.info(`Opening ${item}`);
                  setShowHelp(false);
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpDialog;
