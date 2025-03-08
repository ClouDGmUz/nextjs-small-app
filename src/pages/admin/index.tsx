import { useState, useEffect } from 'react';
import { Agent } from '@/lib/types';
import Head from 'next/head';
import Layout from '@/components/Layout';

export default function AdminPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Omit<Agent, 'id' | 'createdAt' | 'updatedAt'> & { order?: number }>({    name: '',
    phoneNumber: '',
    location: '',
    status: 'active',
    telegram: '',
    order: 0,
    category: 'General'
  });
  // Fetch agents
  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/agents');
      const data = await response.json();
      setAgents(data);
      setIsLoading(false);
    } catch {
      setError('Agentlarni yuklashda xatolik yuz berdi');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  // Create/Update agent
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = '/api/agents';
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save agent');
      
      fetchAgents();
      resetForm();
    } catch {
      setError('Agentni saqlashda xatolik yuz berdi');
    }
  };

  // Delete agent
  const handleDelete = async (id: string) => {
    if (!confirm('Agentni o&apos;chirishni xohlaysizmi?')) return;
    
    try {
      const response = await fetch(`/api/agents?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete agent');
      
      fetchAgents();
    } catch {
      setError('Agentni o&apos;chirishda xatolik yuz berdi');
    }
  };

  // Edit agent
  const handleEdit = (agent: Agent) => {
    setFormData({
      id: agent.id,
      name: agent.name,
      phoneNumber: agent.phoneNumber,
      location: agent.location,
      status: agent.status,
      telegram: agent.telegram || '',
      order: agent.order || 0,
    });
    setIsEditing(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      phoneNumber: '',
      location: '',
      status: 'active',
      telegram: '',
      order: 0,
    });
    setIsEditing(false);
    setError('');
  };

  if (isLoading) {
    return (
      <Layout>
        <Head>
          <title>Admin Panel - Condor</title>
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
        <title>Admin Panel - Condor</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      
      <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-primary-dark via-primary to-primary-light">
        <h1 className="text-3xl font-bold mb-8 text-white dark:text-secondary">Agentlarni Boshqarish</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-primary-dark/90 dark:bg-primary-dark/95 backdrop-blur-sm rounded-lg shadow-xl border border-primary/20 dark:border-primary-light/20">
          <h2 className="text-xl font-semibold mb-4 text-white dark:text-secondary">
              {isEditing ? 'Agentni Tahrirlash' : 'Yangi Agent Qo\'shish'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 text-white dark:text-secondary">Ism</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 bg-white/10 border border-primary/30 text-white rounded focus:ring-2 focus:ring-primary-light focus:border-primary-light"
                required
              />
            </div>
            
            <div>
              <label className="block mb-1 text-white dark:text-secondary">Telefon</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full p-2 bg-white/10 border border-primary/30 text-white rounded focus:ring-2 focus:ring-primary-light focus:border-primary-light"
                required
              />
            </div>
            
            <div>
              <label className="block mb-1 text-white dark:text-secondary">Manzil</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-2 bg-white/10 border border-primary/30 text-white rounded focus:ring-2 focus:ring-primary-light focus:border-primary-light"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-white dark:text-secondary">Telegram</label>
              <input
                type="text"
                value={formData.telegram || ''}
                onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                className="w-full p-2 bg-white/10 border border-primary/30 text-white rounded focus:ring-2 focus:ring-primary-light focus:border-primary-light"
                placeholder="@username"
              />
            </div>
            <div>
              <label className="block mb-1 text-white dark:text-secondary">Category</label>
              <input
                type="text"
                value={formData.category || 'General'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2 bg-white/10 border border-primary/30 text-white rounded focus:ring-2 focus:ring-primary-light focus:border-primary-light"
                placeholder="Enter category"
              />
            </div>
            <div>
              <label className="block mb-1 text-white dark:text-secondary">Holati</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2 bg-white/10 border border-primary/30 text-white rounded focus:ring-2 focus:ring-primary-light focus:border-primary-light"
              >
                <option value="active" className="bg-primary-dark">Faol</option>
                <option value="inactive" className="bg-primary-dark">Faol emas</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-white dark:text-secondary">Tartib raqami</label>
              <input
                type="number"
                value={formData.order || 0}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-full p-2 bg-white/10 border border-primary/30 text-white rounded focus:ring-2 focus:ring-primary-light focus:border-primary-light"
                min="0"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 mt-4 p-2 bg-red-900/20 rounded border border-red-800/50">{error}</div>
          )}

          <div className="mt-6 flex gap-2">
            <button
              type="submit"
              className="px-6 py-2 bg-primary-light text-white rounded-lg hover:bg-primary transform hover:scale-105 transition-all shadow-lg"
            >
              {isEditing ? 'Yangilash' : 'Qo\'shish'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-primary/30 text-white rounded-lg hover:bg-primary/40 shadow-lg"
              >
                Bekor qilish
              </button>
            )}
          </div>
        </form>

        {/* Agents Table */}
        <div className="bg-primary-dark/90 dark:bg-primary-dark/95 backdrop-blur-sm rounded-lg shadow-xl border border-primary/20 dark:border-primary-light/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-primary/20">
                <tr>
                  <th className="py-3 px-4 text-left text-white">Ism</th>
                  <th className="py-3 px-4 text-left text-white">Telefon</th>
                  <th className="py-3 px-4 text-left text-white">Manzil</th>
                  <th className="py-3 px-4 text-left text-white">Telegram</th>
                  <th className="py-3 px-4 text-left text-white">Holati</th>
                  <th className="py-3 px-4 text-left text-white">Tartib</th>
                  <th className="py-3 px-4 text-left text-white">Qo&rsquo;shilgan sana</th>
                  <th className="py-3 px-4 text-left text-white">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/20">
                {agents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">{agent.name}</td>
                    <td className="py-3 px-4">{agent.phoneNumber}</td>
                    <td className="py-3 px-4">{agent.location}</td>
                    <td className="py-3 px-4">{agent.telegram || '-'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        agent.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {agent.status === 'active' ? 'Faol' : 'Faol emas'}
                      </span>
                    </td>
                    <td className="py-3 px-4">{agent.order || 0}</td>
                    <td className="py-3 px-4">
                      {new Date(agent.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(agent)}
                          className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20"
                        >
                          Tahrirlash
                        </button>
                        <button
                          onClick={() => handleDelete(agent.id)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                        >
                          O&apos;chirish
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {agents.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 px-4 text-center text-gray-500">
                      Agentlar topilmadi
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
