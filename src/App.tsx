import React, { useState } from "react";
import StudentJournal from "./components/StudentJournal";
import PsychologistDashboard from "./components/PsychologistDashboard";
import { motion, AnimatePresence } from "motion/react";
import { User, ShieldCheck, LayoutDashboard, ListTodo, BarChart3, Settings, FileText } from "lucide-react";
import { cn } from "./lib/utils";

export default function App() {
  const [view, setView] = useState<"student" | "psychologist">("student");

  return (
    <div className="relative min-h-screen flex">
      {/* Sidebar for Psychologist View */}
      {view === "psychologist" && (
        <aside className="w-60 bg-sleek-sidebar h-screen sticky top-0 p-8 flex flex-col text-white shrink-0">
          <div className="text-xl font-extrabold tracking-tight mb-12 flex items-center gap-2">
            <span className="text-sleek-primary">●</span> SENTIA AI
          </div>
          
          <nav className="flex flex-col gap-2 flex-1">
            <div className="sleek-sidebar-item active">
              <LayoutDashboard size={18} />
              Dashboard Principal
            </div>
            <div className="sleek-sidebar-item">
              <ListTodo size={18} />
              Fila de Intervención
            </div>
            <div className="sleek-sidebar-item">
              <BarChart3 size={18} />
              Métricas de Bienestar
            </div>
            <div className="sleek-sidebar-item">
              <Settings size={18} />
              Configuración NLP
            </div>
            <div className="sleek-sidebar-item">
              <FileText size={18} />
              Reportes HIPAA
            </div>
          </nav>

          <div className="pt-6 border-t border-white/10 text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">
            AES-256 Encrypted<br />
            Session ID: 882-XR-9
          </div>
        </aside>
      )}

      <main className="flex-1 overflow-auto">
        {/* View Switcher (For Demo Purposes) */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex p-1 bg-white/80 backdrop-blur-xl border border-neutral-200 rounded-full shadow-2xl">
          <button
            onClick={() => setView("student")}
            className={cn(
              "flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all",
              view === "student" ? "bg-sleek-primary text-white shadow-lg" : "text-neutral-500 hover:bg-neutral-100"
            )}
          >
            <User size={16} />
            Estudiante
          </button>
          <button
            onClick={() => setView("psychologist")}
            className={cn(
              "flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all",
              view === "psychologist" ? "bg-sleek-primary text-white shadow-lg" : "text-neutral-500 hover:bg-neutral-100"
            )}
          >
            <ShieldCheck size={16} />
            Psicólogo
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-full"
          >
            {view === "student" ? <StudentJournal /> : <PsychologistDashboard />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
