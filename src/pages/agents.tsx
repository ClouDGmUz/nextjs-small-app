import Head from 'next/head';
import { useState, useEffect } from 'react';
import { Agent } from '@/lib/types';
import AgentCard from '@/components/AgentCard';
import Layout from '@/components/Layout';

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('/api/agents');
        const data = await response.json();
        // Filter only active agents
        setAgents(data.filter((agent: Agent) => agent.status === 'active'));
        setIsLoading(false);
      } catch {
        setError('Failed to load agents');
        setIsLoading(false);
      }
    };

    fetchAgents();
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <Head>
          <title>Agentlar - Condor</title>
          <meta name="description" content="Condorning professional agentlari safiga qo'shiling" />
        </Head>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-gray-600">Yuklanmoqda...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Head>
          <title>Agentlar - Condor</title>
          <meta name="description" content="Condorning professional agentlari safiga qo'shiling" />
        </Head>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-red-600">{error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Agentlar - Condor</title>
        <meta name="description" content="Condorning professional agentlari safiga qo'shiling" />
      </Head>
      <div className="bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Bizning Agentlar
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional agentlarimiz bilan tanishing
            </p>
          </div>

          {agents.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              Hozirda faol agentlar mavjud emas
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <div 
                  key={agent.id}
                  className="transform hover:scale-105 transition-transform duration-300"
                >
                  <AgentCard agent={agent} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
