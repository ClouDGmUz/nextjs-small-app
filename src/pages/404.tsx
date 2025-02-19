import Head from 'next/head';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>Sahifa topilmadi - Condor</title>
        <meta name="description" content="404 - Sahifa topilmadi" />
      </Head>
      
      <div className="min-h-[80vh] flex items-center justify-center px-4 relative">
        {/* Decorative background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full opacity-20"></div>
        </div>

        <div className="text-center">
          <div className="mb-8">
            <svg
              className="w-24 h-24 mx-auto text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            404 - Sahifa topilmadi
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki o&apos;chirilgan
          </p>
          
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Bosh sahifaga qaytish
          </Link>

          {/* Additional info */}
          <p className="mt-8 text-sm text-gray-500">
            Agar bu xatolik takrorlansa, biz bilan bog&apos;laning
          </p>
        </div>
      </div>
    </>
  );
}
