import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { Agent, PreviewData } from '@/lib/types';
import useSWR, { mutate as swr_mutate } from 'swr';

export default function AdminPage() {
  const { data: swrAgents, mutate } = useSWR<Agent[]>('/api/agents', async (url: string) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  });

  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Omit<Agent, 'createdAt' | 'updatedAt'> & { order?: number }>({    
    name: '',
    phoneNumber: '',
    location: '',
    status: 'active',
    telegram: '',
    order: 0,
    category: 'General'
  });
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [previewData, setPreviewData] = useState<PreviewData[]>([]);
  const [showPreview, setShowPreview] = useState(false);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/agents/upload', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();

      if (response.ok) {
        if (result.requireConfirmation) {
          setPreviewData(result.preview);
          setShowPreview(true);
          setUploadError('');
          setUploadSuccess('');
        } else {
          setUploadSuccess(result.message);
          setUploadError('');
          fetchAgents();
        }
      } else {
        setUploadError(result.error || 'Failed to upload file');
        setUploadSuccess('');
      }
    } catch {
      setUploadError('Failed to upload file');
      setUploadSuccess('');
    }
  };

  const handleConfirmUpload = async () => {
    const formData = new FormData();
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      formData.append('file', fileInput.files[0]);
      formData.append('confirm', 'true');
      
      try {
        const response = await fetch('/api/agents/upload', {
          method: 'POST',
          body: formData
        });
        const result = await response.json();
        
        if (response.ok) {
          setUploadSuccess(result.message);
          setUploadError('');
          setShowPreview(false);
          setPreviewData([]);
          fetchAgents();
        } else {
          setUploadError(result.error || 'Failed to upload file');
          setUploadSuccess('');
        }
      } catch {
        setUploadError('Failed to upload file');
        setUploadSuccess('');
      }
    }
  };

  const handleCancelUpload = () => {
    setShowPreview(false);
    setPreviewData([]);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  useEffect(() => {
    if (swrAgents) {
      setAgents(swrAgents);
      setIsLoading(false);
    }
  }, [swrAgents]);

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
    if (!window.confirm('Are you sure you want to delete this agent?')) return;
    
    try {
      const response = await fetch(`/api/admin/agents/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        await mutate();
        await fetchAgents();
      } else {
        const error = await response.json();
        console.error('Failed to delete agent:', error);
      }
    } catch (error) {
      console.error('Error deleting agent:', error);
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
      category: agent.category || 'General'
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
      category: 'General'
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

        {/* Bulk Upload Section */}
        <div className="mb-8 p-6 bg-primary-dark/90 dark:bg-primary-dark/95 backdrop-blur-sm rounded-lg shadow-xl border border-primary/20 dark:border-primary-light/20">
          <h2 className="text-xl font-semibold mb-4 text-white dark:text-secondary">Excel Fayldan Import</h2>
          
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-light"
            />
          </div>

          {showPreview && previewData.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2 text-white">Ma'lumotlarni tasdiqlang</h3>
              <div className="bg-primary-dark/50 p-4 rounded-lg max-h-60 overflow-y-auto mb-4">
                <table className="w-full text-sm text-white">
                  <thead>
                    <tr className="border-b border-primary/30">
                      {Object.keys(previewData[0] || {}).map((key) => (
                        <th key={key} className="py-2 px-3 text-left">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, index) => (
                      <tr key={index} className="border-b border-primary/10">
                        {Object.values(row).map((value: string | number | null, cellIndex) => (
                          <td key={i} className="py-2 px-3">{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleConfirmUpload}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Tasdiqlash
                </button>
                <button
                  onClick={handleCancelUpload}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Bekor qilish
                </button>
              </div>
            </div>
          )}

          {uploadSuccess && (
            <div className="mt-4 p-3 bg-green-900/20 text-green-400 rounded-lg border border-green-800/50">
              {uploadSuccess}
            </div>
          )}

          {uploadError && (
            <div className="mt-4 p-3 bg-red-900/20 text-red-400 rounded-lg border border-red-800/50">
              {uploadError}
            </div>
          )}
        </div>

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
                  <th className="py-3 px-4 text-left text-white">Category</th>
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
                    <td className="py-3 px-4">{agent.category || 'General'}</td>
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
                    <td colSpan={9} className="py-8 px-4 text-center text-gray-500">
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