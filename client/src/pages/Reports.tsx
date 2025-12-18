import { useMemo } from 'react'
import { useDataStore } from '../store/dataStore'

export default function Reports() {
  const { transactions } = useDataStore()
  const byCategory = useMemo(() => {
    const map: Record<string, number> = {}
    transactions.filter(t=>t.type==='expense').forEach(t => { map[t.category] = (map[t.category]||0) + t.amount })
    return Object.entries(map).sort((a,b)=>b[1]-a[1])
  }, [transactions])
  const top5 = byCategory.slice(0,5)
  return (
    <div className="grid gap-4 md:gap-6">
      <div className="rounded shadow p-3 md:p-4 border border-gray-200 bg-gray-50">
        <div className="text-base md:text-lg font-medium mb-3">Resumo por Categoria</div>
        <ul className="space-y-2">
          {byCategory.map(([cat, val]) => (
            <li key={cat} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
              <span className="px-2 py-1 rounded-full text-xs sm:text-sm bg-green-100 text-green-700 inline-block w-fit">{cat}</span>
              <span className="font-medium text-sm sm:text-base">R$ {val.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded shadow p-3 md:p-4 border border-gray-200 bg-gray-50">
        <div className="text-base md:text-lg font-medium mb-3">Top 5 Despesas</div>
        <ul className="space-y-2">
          {top5.map(([cat, val]) => (
            <li key={cat} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
              <span className="px-2 py-1 rounded-full text-xs sm:text-sm bg-gray-200 text-gray-700 inline-block w-fit">{cat}</span>
              <span className="font-medium text-sm sm:text-base">R$ {val.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
