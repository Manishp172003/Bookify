function AuthCard({ children }) {
  return (
    <div className="w-full rounded-3xl border border-gray-100 bg-white p-7 shadow-[0_20px_70px_rgba(23,21,42,0.08)] sm:p-9">
      {children}
    </div>
  );
}

export default AuthCard;