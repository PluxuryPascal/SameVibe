import React from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

export default function DesktopMainScreen() {
  return (
    <div className="flex flex-col h-screen bg-radial from-pink-400 from-40% to-white">
      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar />
        <ChatWindow />
      </div>
    </div>
  );
}
