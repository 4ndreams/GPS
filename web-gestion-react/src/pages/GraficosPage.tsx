import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"
import EstadoBarChart from '../charts/EstadoBarChart';

export default function GraficosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Gráficos de Estado</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Análisis de Estados de Despacho
              </CardTitle>
              <CardDescription>Visualización de datos del sistema de despacho</CardDescription>
            </CardHeader>
            <CardContent>
              <EstadoBarChart />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
