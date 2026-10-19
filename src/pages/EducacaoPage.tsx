import { useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, BookOpen, CloudRain, CloudSun, Droplets, Sun } from "lucide-react"
import { Header } from "../components/Header"
import { Rodape } from "../components/Rodape"
import { temas } from "../data/temas"

const icones: Record<string, typeof Droplets> = {
  "seguranca-hidrica": BookOpen,
  "el-nino-la-nina": CloudSun,
  "secas-estiagens": Sun,
  "eventos-extremos": CloudRain,
  "uso-consciente": Droplets,
}

export function EducacaoPage() {
  useEffect(() => {
    document.title = "Educação hídrica • HidroConecta Bahia"
  }, [])

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl px-5 py-12">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-tide">Área aberta</p>
        <h1 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-deep sm:text-4xl">
          Educação hídrica
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-500">
          Conteúdos para entender a água na Bahia antes de falar com a Central. Esta área não exige
          login e pode ser lida por qualquer visitante.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {temas.map((tema) => {
            const Icone = icones[tema.slug] ?? Droplets
            return (
              <Link
                key={tema.slug}
                to={`/educacao/${tema.slug}`}
                className="group rounded-3xl border border-white bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-sky-50 text-tide">
                  <Icone size={22} />
                </span>
                <h2 className="mt-4 text-xl font-bold text-navy">{tema.titulo}</h2>
                <p className="mt-2 leading-relaxed text-slate-500">{tema.resumo}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                  Ler conteúdo
                  <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            )
          })}
        </div>
      </main>
      <Rodape />
    </div>
  )
}
