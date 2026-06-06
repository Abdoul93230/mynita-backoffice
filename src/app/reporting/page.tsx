'use client'

import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { getAgents, getComptes, getSettings } from '@/lib/store'
import { Agent, ClientAccount } from '@/lib/types'
import { Download, FileText, FileSpreadsheet } from 'lucide-react'
import {
  BarChart,
  Bar,
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

const PIE_COLORS = ['#F2714A', '#2352C8', '#10B981', '#F59E0B', '#EF4444']

export default function ReportingPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [comptes, setComptes] = useState<ClientAccount[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setAgents(getAgents())
    setComptes(getComptes())
  }, [])

  if (!mounted) return null

  const settings = getSettings()

  // Monthly activity data (simulated)
  const monthlyActivity = [
    { month: 'Jan', creations: 5, activations: 4, desactivations: 0 },
    { month: 'Fév', creations: 4, activations: 3, desactivations: 1 },
    { month: 'Mar', creations: 7, activations: 6, desactivations: 1 },
    { month: 'Avr', creations: 6, activations: 5, desactivations: 2 },
    { month: 'Mai', creations: 8, activations: 6, desactivations: 1 },
  ]

  // Agent performance
  const agentPerformance = agents
    .filter(a => a.statut === 'actif')
    .map(a => ({
      name: `${a.prenom} ${a.nom.charAt(0)}.`,
      comptesCrees: a.nbComptesCreesTotal,
      comptesActifs: a.nbComptesActifsTotal,
      zone: a.zone,
    }))

  // Deactivation reasons
  const desactivatedComptes = comptes.filter(c => c.statut === 'desactive' && c.motifDesactivation)
  const reasonCounts: Record<string, number> = {}
  desactivatedComptes.forEach(c => {
    const motif = c.motifDesactivation || 'Autre'
    reasonCounts[motif] = (reasonCounts[motif] || 0) + 1
  })
  const reasonsData = Object.entries(reasonCounts).map(([name, value]) => ({ name, value }))

  const handleExport = (format: string) => {
    alert(`Export ${format} en cours... (simulation)`)
  }

  return (
    <AppLayout title="Reporting">
      <PageHeader
        title="Reporting"
        description="Analyses et statistiques de la plateforme"
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('CSV')}
            >
              <Download className="w-4 h-4 mr-1" /> CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('Excel')}
            >
              <FileSpreadsheet className="w-4 h-4 mr-1" /> Excel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('PDF')}
            >
              <FileText className="w-4 h-4 mr-1" /> PDF
            </Button>
          </div>
        }
      />

      {/* Monthly Activity */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Activité globale par mois</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="creations" name="Créations" fill="#2352C8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="activations" name="Activations" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="desactivations" name="Désactivations" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Agent Performance */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Performance par agent</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-2 font-medium">Agent</th>
                  <th className="pb-2 font-medium">Zone</th>
                  <th className="pb-2 font-medium text-right">Créés</th>
                  <th className="pb-2 font-medium text-right">Actifs</th>
                  <th className="pb-2 font-medium text-right">Taux</th>
                </tr>
              </thead>
              <tbody>
                {agentPerformance.map((a, idx) => (
                  <tr key={idx} className="border-b border-gray-50 last:border-0">
                    <td className="py-2.5 font-medium text-gray-900">{a.name}</td>
                    <td className="py-2.5 text-gray-600">{a.zone}</td>
                    <td className="py-2.5 text-right text-gray-900">{a.comptesCrees}</td>
                    <td className="py-2.5 text-right text-gray-900">{a.comptesActifs}</td>
                    <td className="py-2.5 text-right">
                      <span className="text-emerald-600 font-medium">
                        {a.comptesCrees > 0 ? Math.round((a.comptesActifs / a.comptesCrees) * 100) : 0}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Deactivation Reasons */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Motifs de désactivation
          </h3>
          {reasonsData.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">Aucune donnée</p>
          ) : (
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reasonsData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name} (${value})`}
                  >
                    {reasonsData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
