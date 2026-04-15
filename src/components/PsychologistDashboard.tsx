import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Users, 
  AlertCircle, 
  TrendingUp, 
  Search, 
  Filter, 
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { cn } from "../lib/utils";

const data = [
  { name: "Lun", riesgo: 40, alertas: 2 },
  { name: "Mar", riesgo: 30, alertas: 1 },
  { name: "Mie", riesgo: 65, alertas: 5 },
  { name: "Jue", riesgo: 45, alertas: 3 },
  { name: "Vie", riesgo: 80, alertas: 8 },
  { name: "Sab", riesgo: 55, alertas: 4 },
  { name: "Dom", riesgo: 60, alertas: 3 },
];

export default function PsychologistDashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, aRes] = await Promise.all([
          fetch("/api/students"),
          fetch("/api/alerts")
        ]);
        setStudents(await sRes.json());
        setAlerts(await aRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-sleek-bg p-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-sleek-border">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Monitor de Riesgo Socioemocional</h1>
            <p className="text-sm text-sleek-text-dim">Centro de Psicología - Universidad de Tecnología</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-sleek-border rounded-full text-[11px] font-bold">
            <span className="text-sleek-success">●</span> Gemini Engine Active (v2.4)
          </div>
        </header>

        {/* Statistics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <StatCard title="Alertas Activas" value="14" change="+12% vs. semana pasada" up />
          <StatCard title="Intervenciones Hoy" value="03" change="2 pendientes urgentes" up={false} />
          <StatCard title="Sentiment Score Avg" value="-0.24" change="Escala (-1.0 a +1.0)" up={true} />
          <StatCard title="Tasa de Adhesión" value="82.4%" change="-2.1% Journaling" up={false} />
        </div>

        {/* Dashboard Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alerts Table */}
          <div className="lg:col-span-2 sleek-panel">
            <div className="p-4 border-b border-sleek-border flex items-center justify-between bg-neutral-50/50">
              <h3 className="text-sm font-bold">Alertas Críticas de IA (Red Flags)</h3>
              <div className="px-2 py-1 bg-white border border-sleek-border rounded-md text-[10px] font-bold text-sleek-text-dim">
                Últimas 24 horas
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 text-[10px] uppercase font-bold text-sleek-text-dim">
                    <th className="p-4">Estudiante</th>
                    <th className="p-4">Nivel Riesgo</th>
                    <th className="p-4">Patrón Detectado</th>
                    <th className="p-4">NLP Score</th>
                    <th className="p-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id} className="border-b border-sleek-border hover:bg-neutral-50 transition-colors group">
                      <td className="p-4">
                        <div className="font-bold text-sm">{s.name}</div>
                        <div className="text-[10px] text-sleek-text-dim">ID: {Math.floor(Math.random() * 90000) + 10000}</div>
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          "text-[10px] font-bold uppercase",
                          s.risk === "Alto" ? "text-sleek-danger" : 
                          s.risk === "Medio" ? "text-sleek-warning" : "text-sleek-success"
                        )}>
                          {s.risk === "Alto" ? "CRÍTICO" : s.risk === "Medio" ? "MEDIO" : "ESTABLE"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          <span className="px-2 py-0.5 bg-neutral-100 rounded text-[10px] font-bold text-sleek-text-dim">Ideación</span>
                          <span className="px-2 py-0.5 bg-neutral-100 rounded text-[10px] font-bold text-sleek-text-dim">Aislamiento</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-mono font-bold text-sleek-primary text-xs">
                          -{ (Math.random() * 0.9).toFixed(2) }
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="px-3 py-1 bg-white border border-sleek-border rounded-md text-[10px] font-bold hover:bg-sleek-bg transition-colors">
                          Contactar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Emotional Distribution */}
          <div className="sleek-panel">
            <div className="p-4 border-b border-sleek-border bg-neutral-50/50">
              <h3 className="text-sm font-bold">Distribución Emocional</h3>
            </div>
            <div className="p-6 space-y-6">
              <HeatmapRow label="Ansiedad" value={75} color="bg-sleek-danger" />
              <HeatmapRow label="Depresión" value={42} color="bg-sleek-warning" />
              <HeatmapRow label="Soledad" value={60} color="bg-indigo-500" />
              <HeatmapRow label="Burnout" value={88} color="bg-sleek-danger" />

              <div className="pt-6 border-t border-sleek-border space-y-3">
                <h4 className="text-xs font-bold">Nube de Conceptos NLP</h4>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-bold">Finales</span>
                  <span className="text-[10px] text-sleek-text-dim">Exámenes</span>
                  <span className="text-lg font-extrabold text-sleek-danger">Cansancio</span>
                  <span className="text-xs text-sleek-text-dim">Futuro</span>
                  <span className="text-sm font-semibold">Presión</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeatmapRow({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[11px] font-bold">
        <span className="text-sleek-text-dim">{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function StatCard({ title, value, change, up }: { title: string, value: string, change: string, up: boolean }) {
  return (
    <div className="sleek-card p-5 space-y-2">
      <p className="text-[10px] text-sleek-text-dim uppercase font-bold tracking-wider">{title}</p>
      <div className="space-y-1">
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        <p className={cn(
          "text-[10px] font-bold",
          up ? "text-sleek-danger" : "text-sleek-success"
        )}>
          {change}
        </p>
      </div>
    </div>
  );
}
