import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Messages() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/chat", { replace: true });
  }, [navigate]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#F8F7FF]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-[#6C4BF4] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          Redirecting to Chat...
        </span>
      </div>
    </div>
  );
}
