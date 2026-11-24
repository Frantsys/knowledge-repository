import { BookOpen } from "lucide-react";

// Materiais não têm imagem na API: a capa é um tom fixo por disciplina (mesma disciplina = mesma cor).
// Tons sóbrios e bem distintos entre si, sem roxo: o roxo é da marca e, repetido nas capas, apagava a diferença entre disciplinas
const GRADIENTS = [
  "from-teal-800 to-teal-600",
  "from-sky-900 to-sky-700",
  "from-orange-800 to-amber-600",
  "from-emerald-900 to-emerald-700",
  "from-rose-900 to-rose-700",
  "from-slate-800 to-slate-600",
];

function gradientFor(subject: string) {
  let hash = 0;
  for (const char of subject) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return GRADIENTS[hash % GRADIENTS.length];
}

export default function SubjectCover({
  subject,
  className = "",
  children,
}: {
  subject: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradientFor(subject)} ${className}`}>
      <BookOpen
        aria-hidden="true"
        strokeWidth={1.25}
        className="absolute -bottom-6 -right-4 h-36 w-36 text-white/15"
      />
      {children}
    </div>
  );
}
