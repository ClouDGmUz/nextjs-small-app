import Head from 'next/head';
import Layout from '@/components/Layout';

export default function AboutPage() {
  const features = [
    {
      title: "Yuqori sifat",
      description: "Barcha mahsulotlarimiz xalqaro standartlarga javob beradi va eng yuqori sifat talablariga mos keladi.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    },
    {
      title: "Keng assortiment",
      description: "Motor moylari, antifrizlar va boshqa avtomobil uchun zarur bo'lgan barcha turdagi mahsulotlar.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      title: "24/7 Yetkazib berish",
      description: "O'zbekiston bo'ylab tezkor va ishonchli yetkazib berish xizmati.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];

  return (
    <Layout>
      <Head>
        <title>Biz Haqimizda - Condor</title>
        <meta 
          name="description" 
          content="Condor - O'zbekistondagi eng ishonchli va sifatli motor moylari, antifrizlar va boshqa avtomobil mahsulotlari yetkazib beruvchisi" 
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-primary-light">
        {/* Hero Section */}
        <div className="relative z-10 py-32 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl mb-6 animate-fade-in">
                Condor Haqida
              </h1>
              <p className="text-xl text-secondary max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-100">
                O&apos;zbekistondagi eng ishonchli va sifatli motor moylari, antifrizlar va boshqa avtomobil mahsulotlari yetkazib beruvchisi
              </p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16 backdrop-blur-sm bg-white/5 p-8 rounded-2xl shadow-xl border border-white/10">
            <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
              Bizning Maqsadimiz
            </h2>
            <p className="text-xl text-secondary max-w-3xl mx-auto leading-relaxed">
              Mijozlarimizga eng sifatli avtomobil mahsulotlarini taqdim etish va ularning avtomobillariga g&apos;amxo&apos;rlik qilishda yordam berish
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="backdrop-blur-sm bg-white/5 rounded-xl shadow-xl p-6 hover:shadow-lg transition-all duration-300 border border-white/10 hover:scale-105"
              >
                <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center text-secondary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-secondary">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Queue Section */}
          <div className="backdrop-blur-sm bg-white/5 rounded-2xl shadow-xl p-8 text-center border border-white/10 mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Navbat Holati
            </h2>
            <p className="text-secondary mb-8">
              Hozirgi vaqtdagi navbat holati bilan tanishing
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="backdrop-blur-sm bg-white/10 rounded-xl p-6 border border-white/20">
                <div className="text-4xl font-bold text-secondary mb-2">12</div>
                <div className="text-white">Kutilayotgan</div>
              </div>
              <div className="backdrop-blur-sm bg-white/10 rounded-xl p-6 border border-white/20">
                <div className="text-4xl font-bold text-secondary mb-2">3</div>
                <div className="text-white">Xizmat ko&rsquo;rsatilmoqda</div>
              </div>
              <div className="backdrop-blur-sm bg-white/10 rounded-xl p-6 border border-white/20">
                <div className="text-4xl font-bold text-secondary mb-2">~15</div>
                <div className="text-white">Kutish vaqti (min)</div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="backdrop-blur-sm bg-white/5 rounded-2xl shadow-xl p-8 text-center border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-4">
              Biz bilan bog&apos;lanish
            </h2>
            <p className="text-secondary mb-6">
              Savollaringiz bormi? Biz sizga yordam berishdan mamnunmiz!
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-secondary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+998 88 394-00-13</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-secondary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@condoroil.uz</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-secondary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Dangara tumani., Mastona Bozori!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
