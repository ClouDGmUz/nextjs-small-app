import { useState, useEffect } from 'react';
import { Agent } from '@/lib/types';
import Head from 'next/head';
import Layout from '@/components/Layout';

export default function AdminPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    phoneNumber: '',
    location: '',
    status: 'active',
    telegram: '',
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
      name: agent.name,
      phoneNumber: agent.phoneNumber,
      location: agent.location,
      status: agent.status,
      telegram: agent.telegram || '',
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
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
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
      
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Agentlarni Boshqarish</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
              {isEditing ? 'Agentni Tahrirlash' : 'Yangi Agent Qo&apos;shish'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1">Ism</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block mb-1">Telefon</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block mb-1">Manzil</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Telegram</label>
              <input
                type="text"
                value={formData.telegram || ''}
                onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="@username"
              />
            </div>
            
            <div>
              <label className="block mb-1">Holati</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Faol</option>
                <option value="inactive">Faol emas</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="text-red-500 mt-4 p-2 bg-red-50 rounded">{error}</div>
          )}

          <div className="mt-6 flex gap-2">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all"
            >
              {isEditing ? 'Yangilash' : 'Qo&apos;shish'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Bekor qilish
              </button>
            )}
          </div>
        </form>

        {/* Agents Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left">Ism</th>
                  <th className="py-3 px-4 text-left">Telefon</th>
                  <th className="py-3 px-4 text-left">Manzil</th>
                  <th className="py-3 px-4 text-left">Telegram</th>
                  <th className="py-3 px-4 text-left">Holati</th>
                  <th className="py-3 px-4 text-left">Qo&apos;shilgan sana</th>
                  <th className="py-3 px-4 text-left">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
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
                    <td className="py-3 px-4">
                      {new Date(agent.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(agent)}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
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
