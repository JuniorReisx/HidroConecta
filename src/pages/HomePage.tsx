import { useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, BookOpen, CloudSun, Droplets, MessagesSquare, School } from "lucide-react"
import { Header } from "../components/Header"
import { HeroCena } from "../components/HeroCena"
import { Rodape } from "../components/Rodape"
import { instituicoes } from "../data/instituicoes"
import { temas } from "../data/temas"

const icones = {
  "seguranca-hidrica": BookOpen,
  "el-nino-la-nina": CloudSun,
  "uso-consciente": Droplets,
}

const passos = [
  { titulo: "A prefeitura entra", texto: "O município já vem definido pelo acesso institucional." },
  { titulo: "Escolhe quem recebe", texto: "O relato segue para a instituição responsável pelo caso." },
  { titulo: "A instituição responde", texto: "A orientação volta no mesmo atendimento, em tempo real." },
]

export function HomePage() {
  useEffect(() => {
    document.title = "HidroConecta Bahia"
  }, [])

  const destaques = temas.filter((tema) => tema.destaque)

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-8 px-5 pb-6 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:pt-14">
          <div>
            <p className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-tide shadow-soft sm:tracking-[0.14em]">
              <School size={14} />
              Protótipo acadêmico · Unijorge
            </p>
            <h1 className="mt-5 max-w-xl text-3xl font-extrabold leading-[1.08] tracking-tight text-deep sm:text-5xl">
              Informação e participação para cuidar da água.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600">
              Um canal direto entre prefeituras e as instituições que acompanham a água na Bahia.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/central"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand to-[#128eab] px-6 py-3.5 text-center text-base font-semibold text-white shadow-card transition hover:brightness-110"
              >
                Central de acompanhamento
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/educacao"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-sky-100 bg-white px-6 py-3.5 text-center font-semibold text-navy shadow-soft transition hover:border-sky-200"
              >
                Educação hídrica
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {instituicoes.map((instituicao) => (
                <span
                  key={instituicao.id}
                  className="rounded-full border border-sky-100 bg-white px-3 py-1 text-xs font-bold tracking-wide text-brand"
                >
                  {instituicao.sigla}
                </span>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] shadow-card ring-1 ring-white">
              <HeroCena />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-8">
          <div className="grid gap-4 md:grid-cols-3">
            {passos.map((passo, indice) => (
              <article key={passo.titulo} className="rounded-3xl border border-white bg-white/80 p-5 shadow-soft">
                <span className="grid h-9 w-9 place-items-center rounded-2xl bg-sky-50 text-sm font-bold text-brand">
                  {indice + 1}
                </span>
                <h2 className="mt-4 text-lg font-bold text-navy">{passo.titulo}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">{passo.texto}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-4">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-tide">Conheça mais sobre o tema</p>
              <h2 className="mt-1 text-2xl font-extrabold text-deep">Educação hídrica</h2>
            </div>
            <Link to="/educacao" className="shrink-0 text-sm font-semibold text-brand">
              Ver todos
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {destaques.map((tema) => {
              const Icone = icones[tema.slug as keyof typeof icones] ?? Droplets
              return (
                <Link
                  key={tema.slug}
                  to={`/educacao/${tema.slug}`}
                  className="group rounded-3xl border border-white bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-sky-50 to-cyan-50 text-tide">
                    <Icone size={22} />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-navy">{tema.titulo}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{tema.resumo}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                    Ler
                    <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-8">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-gradient-to-r from-deep to-brand px-6 py-8 text-white shadow-card sm:flex-row sm:items-center sm:px-10">
            <div>
              <MessagesSquare className="text-cyan-200" />
              <h2 className="mt-3 text-2xl font-extrabold">A Central está pronta para o relato.</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-sky-100">
                A prefeitura descreve a situação. A instituição escolhida acompanha e responde.
              </p>
            </div>
            <Link
              to="/central"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-brand"
            >
              Entrar
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
      <Rodape />
    </div>
  )
}
