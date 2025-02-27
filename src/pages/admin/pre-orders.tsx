import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';

type PreOrder = {
  id: string;
  name: string;
  phoneNumber: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export default function PreOrdersAdminPage() {
  const [preOrders, setPreOrders] = useState<PreOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<PreOrder>>({});

  // Fetch pre-orders
  const fetchPreOrders = async () => {
    try {
      const response = await fetch('/api/pre-orders');
      const data = await response.json();
      setPreOrders(data);
      setIsLoading(false);
    } catch {
      setError('Buyurtmalarni yuklashda xatolik yuz berdi');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPreOrders();
  }, []);

  // Update pre-order status
  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/pre-orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update status');
      
      fetchPreOrders();
    } catch {
      setError('Holatni yangilashda xatolik yuz berdi');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <Head>
          <title>Buyurtmalar - Admin Panel - Condor</title>
          <meta name="robots" content="noindex,nofollow" />
        </Head>
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Buyurtmalar - Admin Panel - Condor</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      
      <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-primary-dark via-primary to-primary-light">
        <h1 className="text-3xl font-bold mb-8 text-white dark:text-secondary">Buyurtmalarni Boshqarish</h1>

        {/* Pre-orders Table */}
        <div className="bg-primary-dark/90 dark:bg-primary-dark/95 backdrop-blur-sm rounded-lg shadow-xl border border-primary/20 dark:border-primary-light/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-primary/20">
                <tr>
                  <th className="py-3 px-4 text-left text-white">Ism</th>
                  <th className="py-3 px-4 text-left text-white">Telefon</th>
                  <th className="py-3 px-4 text-left text-white">Holati</th>
                  <th className="py-3 px-4 text-left text-white">Izohlar</th>
                  <th className="py-3 px-4 text-left text-white">Sana</th>
                  <th className="py-3 px-4 text-left text-white">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/20">
                {preOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/5">
                    <td className="py-3 px-4 text-white">{order.name}</td>
                    <td className="py-3 px-4 text-white">{order.phoneNumber}</td>
                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className="px-2 py-1 rounded bg-white/10 text-white border border-primary/30 focus:ring-2 focus:ring-primary-light focus:border-primary-light"
                      >
                        <option value="pending" className="bg-primary-dark">Kutilmoqda</option>
                        <option value="contacted" className="bg-primary-dark">Bog'lanildi</option>
                        <option value="completed" className="bg-primary-dark">Yakunlandi</option>
                        <option value="cancelled" className="bg-primary-dark">Bekor qilindi</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-white">{order.notes || '-'}</td>
                    <td className="py-3 px-4 text-white">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'completed')}
                        className="px-3 py-1 text-sm bg-green-100/10 text-green-400 rounded-lg hover:bg-green-100/20 mr-2"
                      >
                        Yakunlash
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                        className="px-3 py-1 text-sm bg-red-100/10 text-red-400 rounded-lg hover:bg-red-100/20"
                      >
                        Bekor qilish
                      </button>
                    </td>
                  </tr>
                ))}
                {preOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 px-4 text-center text-gray-400">
                      Buyurtmalar topilmadi
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-100/10 border border-red-400/20 rounded-lg text-red-400">
            {error}
          </div>
        )}
      </div>
    </Layout>
  );
}