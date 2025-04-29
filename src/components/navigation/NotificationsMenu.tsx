
import React from "react";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Notification {
  id: number;
  text: string;
}

const NotificationsMenu = () => {
  const [notifications] = React.useState<Notification[]>([
    { id: 1, text: "New update available" },
    { id: 2, text: "Your export is complete" },
  ]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-editor-text/5 relative">
          <Bell className="text-editor-text-subtle" />
          {notifications.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-editor-primary rounded-full" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-editor-surface bg-editor-text/10">
        {notifications.map((notification) => (
          <DropdownMenuItem key={notification.id} onClick={() => toast.info(notification.text)}>
            {notification.text}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsMenu;
