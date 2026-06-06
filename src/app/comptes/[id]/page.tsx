import CompteDetailClient from './CompteDetailClient'
import { seedComptes } from '@/lib/store'

export async function generateStaticParams() {
  return seedComptes.map((c) => ({ id: c.id }))
}

export default function Page() {
  return <CompteDetailClient />
}
