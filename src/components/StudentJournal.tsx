import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Sparkles, AlertTriangle, CheckCircle2, Heart, BookOpen } from "lucide-react";
import { analyzeJournalEntry, AnalysisResult } from "../services/geminiService";
import { cn } from "../lib/utils";

export default function StudentJournal() {
  const [entry, setEntry] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showRedFlag, setShowRedFlag] = useState(false);

  const handleSubmit = async () => {
    if (!entry.trim()) return;
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeJournalEntry(entry);
      setResult(analysis);
      if (analysis.redFlag) {
        setShowRedFlag(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-sleek-bg p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-sleek-primary/10 text-sleek-primary text-xs font-bold uppercase tracking-widest"
          >
            <BookOpen size={14} />
            Diario Personal
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl text-sleek-text-main font-extrabold tracking-tight"
          >
            ¿Cómo te sientes hoy?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sleek-text-dim text-lg max-w-lg mx-auto"
          >
            Este es un espacio seguro. Tus palabras son analizadas para ayudarte a entender mejor tus emociones.
          </motion.p>
        </header>

        <main className="space-y-8">
          <motion.div 
            layout
            className="relative group sleek-card overflow-hidden"
          >
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Escribe lo que tienes en mente..."
              className="w-full min-h-[300px] p-8 bg-white border-none focus:ring-0 text-lg leading-relaxed resize-none transition-all placeholder:text-sleek-text-dim/30"
            />
            <div className="absolute bottom-6 right-6 flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={isAnalyzing || !entry.trim()}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all",
                  isAnalyzing 
                    ? "bg-sleek-bg text-sleek-text-dim cursor-not-allowed" 
                    : "bg-sleek-primary text-white hover:bg-sleek-primary/90 active:scale-95 shadow-lg shadow-sleek-primary/20"
                )}
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="animate-pulse" size={18} />
                    Analizando...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Guardar Entrada
                  </>
                )}
              </button>
            </div>
          </motion.div>

          <AnimatePresence>
            {result && !showRedFlag && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="sleek-card p-8 space-y-6"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-[10px] uppercase tracking-widest text-sleek-text-dim font-bold">Análisis de Bienestar</h3>
                    <p className="text-xl text-sleek-text-main font-medium italic">"{result.summary}"</p>
                  </div>
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                    result.sentiment === "Positivo" ? "bg-sleek-success/10 text-sleek-success" :
                    result.sentiment === "Negativo" ? "bg-sleek-danger/10 text-sleek-danger" : "bg-sleek-primary/10 text-sleek-primary"
                  )}>
                    {result.sentiment}
                  </div>
                </div>

                <div className="pt-6 border-t border-sleek-border">
                  <p className="text-sleek-text-dim text-sm mb-2 italic">Siguiente paso sugerido:</p>
                  <p className="text-lg text-sleek-text-main font-semibold">{result.suggestedPrompt}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {result.distortions.map((d, i) => (
                    <span key={i} className="px-3 py-1 rounded-md bg-sleek-bg text-sleek-text-dim text-[10px] font-bold uppercase">
                      {d}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {showRedFlag && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-10 rounded-2xl bg-sleek-danger text-white shadow-2xl space-y-6 text-center"
              >
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle size={40} className="text-white" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-extrabold tracking-tight">Estamos aquí para ti</h2>
                  <p className="text-white/80 text-lg">
                    Hemos detectado que podrías estar pasando por un momento muy difícil. 
                    Un profesional de bienestar ha sido notificado y se pondrá en contacto contigo pronto.
                  </p>
                </div>
                <div className="grid gap-4 pt-4">
                  <button className="w-full py-4 bg-white text-sleek-danger rounded-xl font-bold hover:bg-neutral-50 transition-colors shadow-lg">
                    Llamar a Emergencias Universitarias
                  </button>
                  <button 
                    onClick={() => setShowRedFlag(false)}
                    className="w-full py-4 bg-sleek-danger/50 text-white rounded-xl font-bold hover:bg-sleek-danger/60 transition-colors border border-white/20"
                  >
                    Entendido, gracias
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="text-center pt-12 pb-6 border-t border-sleek-border">
          <p className="text-sleek-text-dim text-[10px] uppercase tracking-widest font-bold">
            Mentis v1.0 • Desarrollado para el Bienestar Universitario
          </p>
        </footer>
      </div>
    </div>
  );
}
