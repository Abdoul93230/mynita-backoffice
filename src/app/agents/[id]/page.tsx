import AgentDetailClient from './AgentDetailClient'
import { seedAgents } from '@/lib/store'

export async function generateStaticParams() {
  return seedAgents.map((a) => ({ id: a.id }))
}

export default function Page() {
  return <AgentDetailClient />
}
