import Head from 'next/head';
import Layout from '@/components/Layout';
import { useState } from 'react';

export default function PreOrderPage() {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/pre-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit pre-order');
      }
      
      setSubmitStatus({
        type: 'success',
        message: 'Buyurtmangiz muvaffaqiyatli qabul qilindi. Tez orada siz bilan bog\'lanamiz!'
      });
      setFormData({ name: '', phoneNumber: '' });
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Dew Motor Oil - Oldindan buyurtma - Condor</title>
        <meta 
          name="description" 
          content="Dew motor moylarini oldindan buyurtma qiling. Sifatli va ishonchli motor moylari." 
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-primary-light py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4 animate-fade-in">
              Dew Motor Oil - Oldindan buyurtma
            </h1>
            <p className="text-xl text-secondary max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100">
              Sifatli va ishonchli motor moylarini oldindan buyurtma qiling
            </p>
          </div>

          <div className="backdrop-blur-sm bg-white/5 rounded-2xl shadow-xl p-8 border border-white/10 animate-fade-in-up delay-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-white mb-2">
                  Ismingiz
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  required
                  placeholder="To'liq ismingizni kiriting"
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-white mb-2">
                  Telefon raqamingiz
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  required
                  placeholder="+998 XX XXX-XX-XX"
                />
              </div>

              {submitStatus && (
                <div className={`p-4 rounded-lg ${submitStatus.type === 'success' ? 'bg-green-100/10 text-green-400' : 'bg-red-100/10 text-red-400'}`}>
                  {submitStatus.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 rounded-lg text-white font-semibold transition-all transform hover:scale-105 ${isSubmitting ? 'bg-primary-dark/50 cursor-not-allowed' : 'bg-secondary hover:bg-secondary/80'}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Yuborilmoqda...
                  </span>
                ) : 'Buyurtma berish'}
              </button>
            </form>
          </div>

          <div className="mt-12 text-center backdrop-blur-sm bg-white/5 rounded-2xl shadow-xl p-8 border border-white/10 animate-fade-in-up delay-300">
            <h2 className="text-2xl font-bold text-white mb-4">
              Qo'shimcha ma'lumot uchun
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-secondary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+998 88 394-00-13</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}