import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 animate-pulse">
        Tez Orada
      </h1>
      <Link 
        href="/agents" 
        className="px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
      >
        Agentlar
      </Link>
    </div>
  );
}
