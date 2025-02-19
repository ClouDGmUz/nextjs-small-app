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
        // Filter active agents and sort by order
        const activeAgents = data.filter((agent: Agent) => agent.status === 'active');
        const sortedAgents = activeAgents.sort((a: Agent, b: Agent) => (a.order || 0) - (b.order || 0));
        setAgents(sortedAgents);
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
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-blue-300 text-lg">Yuklanmoqda...</div>
          </div>
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
          <div className="text-red-400 bg-red-900/20 px-6 py-4 rounded-lg border border-red-800/50 backdrop-blur-sm">{error}</div>
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
      <div className="bg-gradient-to-br from-primary-dark via-primary to-primary-light min-h-screen py-16 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 backdrop-blur-sm bg-white/5 p-8 rounded-2xl shadow-xl border border-white/10">
            <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">
              Bizning Agentlar
            </h1>
            <p className="text-xl text-secondary max-w-2xl mx-auto leading-relaxed">
              Professional agentlarimiz bilan tanishing
            </p>
          </div>

          {agents.length === 0 ? (
            <div className="text-center text-secondary py-16 bg-primary/30 rounded-2xl backdrop-blur-sm border border-primary/50 shadow-lg">
              Hozirda faol agentlar mavjud emas
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {agents.map((agent) => (
                <div 
                  key={agent.id}
                  className="transform hover:scale-105 hover:rotate-1 transition-all duration-300 ease-out backdrop-blur-sm"
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
