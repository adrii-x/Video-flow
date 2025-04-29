
import React, { useState } from "react";
import HelpDialog from "./HelpDialog";

import SearchDialog from "./SearchDialog";
import NotificationsMenu from "./NotificationsMenu";
import UserMenu from "./UserMenu";

const Header = () => {
  // const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <header className="h-16 bg-editor-surface border-b border-editor-text/10 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <h1 
          className="text-xl font-heading font-semibold text-editor-text cursor-pointer"
        >
          VideoFlow
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <SearchDialog showSearch={showSearch} setShowSearch={setShowSearch} />
        <HelpDialog showHelp={showHelp} setShowHelp={setShowHelp} />
        <NotificationsMenu />
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;
