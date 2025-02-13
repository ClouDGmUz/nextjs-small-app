import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 animate-pulse">
          Tez Kunda
        </h1>
        <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-2xl mx-auto">
          Condor &mdash; O&apos;zbekistondagi eng ishonchli va sifatli motor moylari va avtomobil mahsulotlari
        </p>
        <Link 
          href="/agents" 
          className="px-8 py-3 text-lg font-semibold text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition-colors duration-300 transform hover:scale-105"
        >
          Bizning Agentlar
        </Link>
      </div>

      {/* Animated background circles */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full opacity-20 animate-pulse delay-100"></div>
      </div>
    </div>
  );
}
