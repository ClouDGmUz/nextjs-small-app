import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative z-10 py-32 md:py-48 flex flex-col items-center justify-center bg-gradient-to-br from-primary-dark via-primary to-primary-light min-h-[90vh]">
        <div className="container-custom text-center px-4 md:px-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 animate-fade-in">
            Condor x Dew
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-2xl mx-auto animate-fade-in-up delay-100">
            Condor &mdash; O&apos;zbekistondagi eng ishonchli va sifatli motor moylari va avtomobil mahsulotlari
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up delay-200">
            <Link 
              href="/agents" 
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all transform hover:scale-105 inline-flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Bizning Agentlar
            </Link>
          </div>
        </div>

        {/* Enhanced background animation */}
        <div className="absolute inset-0 -z-10 overflow-hidden min-h-full">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-light/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-2xl animate-pulse"></div>
        </div>
      </div>


    </div>
  );
}
