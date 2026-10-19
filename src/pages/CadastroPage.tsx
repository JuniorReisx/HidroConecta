import { useEffect, useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Header } from "../components/Header"
import type { Perfil } from "../context/SessaoContext"
import { instituicoes, type InstituicaoId } from "../data/instituicoes"
import { municipios } from "../data/municipios"

export function CadastroPage() {
  const navigate = useNavigate()
  const [perfil, setPerfil] = useState<Perfil>("prefeitura")
  const [nome, setNome] = useState("")
  const [organizacao, setOrganizacao] = useState("")
  const [instituicaoId, setInstituicaoId] = useState<InstituicaoId>("embasa")
  const [municipio, setMunicipio] = useState("Salvador")
  const [email, setEmail] = useState("")
  const [erro, setErro] = useState("")

  useEffect(() => {
    document.title = "Solicitar cadastro • HidroConecta Bahia"
  }, [])

  function enviar(event: FormEvent) {
    event.preventDefault()
    if (perfil === "prefeitura" && !organizacao.trim()) {
      setErro("Informe o nome da prefeitura.")
      return
    }
    if (!nome.trim()) {
      setErro("Informe seu nome.")
      return
    }
    if (!email.includes("@")) {
      setErro("Informe um e-mail institucional.")
      return
    }
    navigate("/central", { state: { cadastro: true } })
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-xl px-5 py-12">
        <section className="rounded-[2rem] border border-white bg-white/90 p-6 shadow-card sm:p-8">
        <h1 className="text-center text-3xl font-extrabold tracking-tight text-deep">
          Solicite cadastro
        </h1>
        <p className="mt-3 text-center text-slate-500">
          O acesso é destinado a representantes de instituições e prefeituras.
        </p>
        <form onSubmit={enviar} className="mt-8 space-y-4">
          <Campo label="Nome completo" value={nome} onChange={setNome} />
          <label className="block text-sm font-semibold text-navy">
            Você representa
            <select
              value={perfil}
              onChange={(event) => setPerfil(event.target.value as Perfil)}
              className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 outline-none ring-tide focus:ring-2"
            >
              <option value="instituicao">Uma instituição</option>
              <option value="prefeitura">Uma prefeitura</option>
            </select>
          </label>
          {perfil === "prefeitura" ? (
            <Campo label="Prefeitura" value={organizacao} onChange={setOrganizacao} />
          ) : (
            <label className="block text-sm font-semibold text-navy">
              Instituição
              <select
                value={instituicaoId}
                onChange={(event) => setInstituicaoId(event.target.value as InstituicaoId)}
                className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 outline-none ring-tide focus:ring-2"
              >
                {instituicoes.map((instituicao) => (
                  <option key={instituicao.id} value={instituicao.id}>
                    {instituicao.sigla} — {instituicao.nome}
                  </option>
                ))}
              </select>
            </label>
          )}
          {perfil === "prefeitura" && (
          <label className="block text-sm font-semibold text-navy">
            Município
            <select
              value={municipio}
              onChange={(event) => setMunicipio(event.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 outline-none ring-tide focus:ring-2"
            >
              {municipios.map((cidade) => (
                <option key={cidade}>{cidade}</option>
              ))}
            </select>
          </label>
          )}
          <Campo label="E-mail institucional" value={email} onChange={setEmail} type="email" />
          {erro && <p className="text-sm text-red-600">{erro}</p>}
          <button
            type="submit"
            className="h-12 w-full rounded-2xl bg-gradient-to-r from-brand to-[#128eab] font-semibold text-white hover:brightness-110"
          >
            Enviar solicitação
          </button>
        </form>
        <p className="mt-6 text-center text-sm">
          <Link to="/central" className="font-semibold text-brand">
            Voltar ao acesso
          </Link>
        </p>
        </section>
      </main>
    </div>
  )
}

function Campo({
  label,
  value,
  onChange,
  type = "text",
  readOnly = false,
}: {
  label: string
  value: string
  onChange: (valor: string) => void
  type?: string
  readOnly?: boolean
}) {
  return (
    <label className="block text-sm font-semibold text-navy">
      {label}
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 font-normal outline-none ring-tide read-only:bg-slate-50 focus:ring-2"
      />
    </label>
  )
}
