import React, { useState, useEffect } from "react";
import { Megaphone, X } from "lucide-react";

export default function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem("bookify_banner_dismissed");
    if (isDismissed) {
      setDismissed(true);
    }

    fetch("http://localhost:5000/api/settings/public")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.data?.announcementEnabled && data?.data?.announcementText?.trim()) {
          setAnnouncement(data.data.announcementText.trim());
        }
      })
      .catch((err) => {
        console.debug("Could not fetch public settings banner:", err);
      });
  }, []);

  if (!announcement || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("bookify_banner_dismissed", "true");
  };

  return (
    <div className="bg-gradient-to-r from-[#6C4BF4] via-[#5b3ed9] to-[#4828c2] text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-sm relative z-50">
      <div className="flex-1 flex items-center justify-center gap-2 text-center truncate">
        <Megaphone size={14} className="shrink-0 text-amber-300 animate-pulse" />
        <span className="truncate">{announcement}</span>
      </div>
      <button
        onClick={handleDismiss}
        className="text-white/80 hover:text-white p-1 transition cursor-pointer shrink-0 ml-2"
        aria-label="Close Announcement"
      >
        <X size={14} />
      </button>
    </div>
  );
}
