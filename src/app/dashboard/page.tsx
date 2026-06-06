'use client'

import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { StatCard } from '@/components/shared/StatCard'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { getStats, getComptes, getAgents, getAuditLogs } from '@/lib/store'
import { formatDateTime, formatRelative } from '@/lib/utils'
import { CreditCard, Clock, CheckCircle, Users, AlertTriangle } from 'lucide-react'
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import Link from 'next/link'

const COLORS = ['#F59E0B', '#10B981', '#EF4444']

export default function DashboardPage() {
  const [stats, setStats] = useState<ReturnType<typeof getStats> | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setStats(getStats())
  }, [])

  if (!mounted || !stats) return null

  const comptes = getComptes()
  const agents = getAgents()
  const auditLogs = getAuditLogs().slice(0, 5)

  // Simulated monthly data for line chart
  const monthlyData = [
    { month: 'Déc', creations: 3 },
    { month: 'Jan', creations: 5 },
    { month: 'Fév', creations: 4 },
    { month: 'Mar', creations: 7 },
    { month: 'Avr', creations: 6 },
    { month: 'Mai', creations: stats.comptesCeMois || 8 },
  ]

  // Pie chart data
  const pieData = [
    { name: 'En attente', value: stats.enAttente },
    { name: 'Actifs', value: stats.actifs },
    { name: 'Désactivés', value: stats.desactives },
  ]

  // Alerts: comptes en attente + agents suspendus
  const comptesEnAttente = comptes.filter(c => c.statut === 'en_attente')
  const agentsSuspendus = agents.filter(a => a.statut === 'suspendu')

  return (
    <AppLayout title="Dashboard">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Comptes"
          value={stats.totalComptes}
          icon={CreditCard}
          color="bg-[#2352C8]"
          subtitle={`${stats.tauxActivation}% activés`}
        />
        <StatCard
          title="En Attente"
          value={stats.enAttente}
          icon={Clock}
          color="bg-[#F59E0B]"
          subtitle="Nécessitent validation"
        />
        <StatCard
          title="Comptes Actifs"
          value={stats.actifs}
          icon={CheckCircle}
          color="bg-[#10B981]"
          subtitle={`${stats.comptesCeMois} ce mois`}
        />
        <StatCard
          title="Total Agents"
          value={stats.totalAgents}
          icon={Users}
          color="bg-[#F2714A]"
          subtitle={`${stats.agentsActifs} actifs`}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Line Chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Créations de comptes (6 derniers mois)
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="creations"
                  stroke="#2352C8"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#2352C8' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Répartition des statuts
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {(comptesEnAttente.length > 0 || agentsSuspendus.length > 0) && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
            <h3 className="text-sm font-semibold text-gray-900">Alertes</h3>
          </div>
          <div className="space-y-3">
            {comptesEnAttente.slice(0, 3).map(compte => (
              <div key={compte.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{compte.nomComplet}</p>
                    <p className="text-xs text-gray-500">En attente depuis {formatRelative(compte.dateCreation)}</p>
                  </div>
                </div>
                <Link
                  href={`/comptes/${compte.id}`}
                  className="text-xs text-[#2352C8] hover:underline font-medium"
                >
                  Voir
                </Link>
              </div>
            ))}
            {agentsSuspendus.map(agent => (
              <div key={agent.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{agent.prenom} {agent.nom}</p>
                    <p className="text-xs text-gray-500">Agent suspendu - {agent.zone}</p>
                  </div>
                </div>
                <Link
                  href={`/agents/${agent.id}`}
                  className="text-xs text-[#2352C8] hover:underline font-medium"
                >
                  Voir
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Dernières activités
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="pb-3 font-medium">Admin</th>
                <th className="pb-3 font-medium">Action</th>
                <th className="pb-3 font-medium">Cible</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map(log => (
                <tr key={log.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-3 text-gray-900 font-medium">{log.adminNom}</td>
                  <td className="py-3 text-gray-600">{log.action}</td>
                  <td className="py-3 text-gray-600">{log.cible}</td>
                  <td className="py-3 text-gray-500 text-xs">{formatDateTime(log.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  )
}
