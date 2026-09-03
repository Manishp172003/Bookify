import { ChevronRight } from "lucide-react";

function RecentMessages() {
  const messages = [
    {
      name: "Rahul Sharma",
      message: "Is the book still available?",
      time: "10:30 AM",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
    },
    {
      name: "Priya Verma",
      message: "Can we exchange?",
      time: "Yesterday",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
    },
  ];

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-[#17152A]">
          Recent Messages
        </h3>

        <button
          type="button"
          className="text-xs font-semibold text-[#6C4BF4] cursor-pointer hover:underline bg-transparent border-none"
        >
          View All
        </button>
      </div>

      <div className="space-y-5">
        {messages.map((message) => (
          <div
            key={message.name}
            className="flex items-center gap-3"
          >
            <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-gray-100 bg-[#EDE7FF]">
              <img 
                src={message.avatar} 
                alt={message.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#17152A]">
                {message.name}
              </p>

              <p className="mt-0.5 truncate text-xs text-gray-500">
                {message.message}
              </p>
            </div>

            <div className="flex flex-col items-end shrink-0 gap-1">
              <span className="text-[10px] text-gray-450">
                {message.time}
              </span>
              <button 
                type="button"
                className="flex h-5 w-5 items-center justify-center rounded-full bg-[#6C4BF4] text-white hover:bg-[#5B3DE0] cursor-pointer shadow-sm transition"
              >
                <ChevronRight size={12} strokeWidth={3} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentMessages;