import { useEffect } from "react"
import { Link } from "react-router-dom"
import { Header } from "../components/Header"
import { Rodape } from "../components/Rodape"

const passos = [
  "A prefeitura acessa a Central e informa o município.",
  "Ela escolhe a instituição que deve receber o relato.",
  "Descreve o que está acontecendo na cidade e envia o relato.",
  "A instituição escolhida recebe o atendimento e responde com a orientação.",
]

export function SobrePage() {
  useEffect(() => {
    document.title = "Sobre o projeto • HidroConecta Bahia"
  }, [])

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-12">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-tide">Unijorge</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-deep sm:text-4xl">Sobre o projeto</h1>
        <div className="mt-6 space-y-5 text-base leading-8 text-ink">
          <p>
            O HidroConecta Bahia é um protótipo acadêmico de plataforma digital voltada à segurança
            hídrica, à educação ambiental e à comunicação entre cidadãos, instituições, prefeituras
            e uma Central de acompanhamento.
          </p>
          <p>
            A prefeitura registra o que está acontecendo no município e encaminha o relato a uma
            instituição. Quem responde é a SIHS, a EMBASA, a CERB, o INEMA, a AGERSA, a SEMA,
            a Casa Civil ou a Defesa Civil, conforme a situação encaminhada.
          </p>
          <p>
            Este site é um trabalho de apresentação da Unijorge. Não é um sistema oficial implantado
            pelo Governo da Bahia.
          </p>
        </div>
        <ol className="mt-8 space-y-3">
          {passos.map((passo, indice) => (
            <li key={passo} className="flex gap-4 rounded-3xl border border-white bg-white p-4 shadow-soft">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand text-sm font-bold text-white">
                {indice + 1}
              </span>
              <span className="pt-1 text-ink">{passo}</span>
            </li>
          ))}
        </ol>
        <Link
          to="/central"
          className="mt-8 inline-flex rounded-full bg-gradient-to-r from-brand to-[#128eab] px-6 py-3 font-semibold text-white"
        >
          Acessar a Central
        </Link>
      </main>
      <Rodape />
    </div>
  )
}
