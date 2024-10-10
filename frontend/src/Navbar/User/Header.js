export default function Header({}) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-xl font-semibold text-blue-900">HealthSync SL</h1>
      <div className="flex items-center">
        <span className="mr-2">Mr. Adithya</span>
        <img
          src="https://via.placeholder.com/40"
          alt="User Avatar"
          className="rounded-full w-10 h-10"
        />
      </div>
    </div>
  );
}
