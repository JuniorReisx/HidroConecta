import { useEffect } from "react"
import { Link, Navigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Header } from "../components/Header"
import { Rodape } from "../components/Rodape"
import { buscarTema } from "../data/temas"

export function TemaPage() {
  const { slug = "" } = useParams()
  const tema = buscarTema(slug)

  useEffect(() => {
    if (tema) document.title = `${tema.titulo} • HidroConecta Bahia`
  }, [tema])

  if (!tema) return <Navigate to="/educacao" replace />

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-12">
        <article className="rounded-[2rem] border border-white bg-white/90 p-6 shadow-soft sm:p-10">
        <Link
          to="/educacao"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand"
        >
          <ArrowLeft size={16} />
          Educação hídrica
        </Link>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-deep sm:text-4xl">{tema.titulo}</h1>
        <p className="mt-4 text-lg text-slate-500">{tema.resumo}</p>
        <div className="mt-8 space-y-5 text-base leading-8 text-ink">
          {tema.paragrafos.map((paragrafo) => (
            <p key={paragrafo}>{paragrafo}</p>
          ))}
        </div>
        </article>
      </main>
      <Rodape />
    </div>
  )
}
