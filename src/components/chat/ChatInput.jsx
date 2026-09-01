import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile, Image as ImageIcon, Sparkles, X } from "lucide-react";

function ChatInput({ onSendMessage, sellerName, bookTitle }) {
  const [inputText, setInputText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const quickReplies = [
    "Is this book still available?",
    "Can you ship to Delhi campus today?",
    "Are all pages and binding intact?",
    "Can you share more pictures of the index?"
  ];

  const emojis = ["👍", "👋", "📚", "✨", "🤝", "😊", "🙏", "✅", "🎉", "🔥"];

  const handleSend = (e) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed && !selectedFile) return;

    let finalMessage = trimmed;
    if (selectedFile) {
      finalMessage = `${trimmed ? trimmed + " " : ""}[Attached image: ${selectedFile.name}]`;
    }

    onSendMessage(finalMessage);
    setInputText("");
    setSelectedFile(null);
    setShowEmojiPicker(false);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickReply = (reply) => {
    onSendMessage(reply);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const addEmoji = (emoji) => {
    setInputText((prev) => prev + emoji);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="border-t border-gray-100 bg-white p-3 sm:p-4">
      {/* Quick Replies Bar */}
      <div className="mb-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="flex items-center gap-1 text-[11px] font-semibold text-gray-400 shrink-0">
          <Sparkles size={12} className="text-[#6C4BF4]" /> Quick:
        </span>
        {quickReplies.map((reply, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleQuickReply(reply)}
            className="shrink-0 rounded-full border border-gray-200 bg-[#F8F7FF] px-3 py-1 font-medium text-gray-600 transition hover:border-[#6C4BF4] hover:bg-[#F0ECFF] hover:text-[#6C4BF4] active:scale-95 cursor-pointer text-xs"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Attachment Preview (if any) */}
      {selectedFile && (
        <div className="mb-2 flex items-center justify-between rounded-xl bg-[#F0ECFF] px-3 py-2 text-xs font-semibold text-[#6C4BF4]">
          <div className="flex items-center gap-2 truncate">
            <ImageIcon size={16} />
            <span className="truncate">{selectedFile.name}</span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedFile(null)}
            className="text-gray-400 hover:text-red-500 cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Emoji Picker Popup */}
      {showEmojiPicker && (
        <div className="mb-2 flex flex-wrap items-center gap-2 rounded-2xl border border-gray-100 bg-[#F8F7FF] p-2 shadow-sm">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => addEmoji(emoji)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-base hover:bg-white transition cursor-pointer"
            >
              {emoji}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(false)}
            className="ml-auto text-xs font-semibold text-gray-400 hover:text-gray-600 px-2 cursor-pointer"
          >
            Close
          </button>
        </div>
      )}

      {/* Form Input Area */}
      <form onSubmit={handleSend} className="flex items-end gap-2">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* Attachment Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Attach book photo"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-gray-400 transition hover:bg-[#F8F7FF] hover:text-[#6C4BF4] cursor-pointer"
        >
          <Paperclip size={19} />
        </button>

        {/* Emoji Button */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          title="Insert Emoji"
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition cursor-pointer ${
            showEmojiPicker ? "bg-[#F0ECFF] text-[#6C4BF4]" : "text-gray-400 hover:bg-[#F8F7FF] hover:text-[#6C4BF4]"
          }`}
        >
          <Smile size={19} />
        </button>

        {/* Text Input */}
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${sellerName || "seller"}... (Enter to send)`}
            className="max-h-28 w-full resize-none rounded-2xl border border-gray-200 bg-[#F8F7FF] px-4 py-2.5 text-sm text-[#17152A] outline-none transition placeholder:text-gray-400 focus:border-[#6C4BF4] focus:bg-white focus:ring-3 focus:ring-[#6C4BF4]/10"
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!inputText.trim() && !selectedFile}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#6C4BF4] text-white shadow-md shadow-[#6C4BF4]/25 transition hover:bg-[#5B3DE0] hover:shadow-lg active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}

export default ChatInput;
