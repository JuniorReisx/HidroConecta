import { useEffect, useState, type FormEvent, type ReactNode } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Building2, Eye, EyeOff, House, Lock, Mail } from "lucide-react"
import { Header } from "../components/Header"
import { useSessao, type Perfil } from "../context/SessaoContext"
import { buscarContaInstituicao } from "../data/instituicoes"
import { buscarPrefeitura } from "../data/prefeituras"

export function AcessoPage() {
  const { entrar } = useSessao()
  const navigate = useNavigate()
  const location = useLocation()
  const cadastroSolicitado = Boolean(
    (location.state as { cadastro?: boolean } | null)?.cadastro,
  )

  const [perfil, setPerfil] = useState<Perfil>("prefeitura")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState("")

  useEffect(() => {
    document.title = "Acesso à Central • HidroConecta Bahia"
  }, [])

  function enviar(event: FormEvent) {
    event.preventDefault()
    const emailInformado = email.trim().toLowerCase()

    if (perfil === "prefeitura") {
      const prefeitura = buscarPrefeitura(emailInformado)
      if (!prefeitura || senha !== prefeitura.senha) {
        setErro("E-mail ou senha da prefeitura não conferem.")
        return
      }
      entrar({
        email: prefeitura.email,
        perfil,
        municipio: prefeitura.municipio,
      })
      navigate("/central/atendimentos")
      return
    }

    const instituicao = buscarContaInstituicao(emailInformado)
    if (!instituicao || senha !== instituicao.senha) {
      setErro("E-mail ou senha da instituição não conferem.")
      return
    }
    entrar({
      email: instituicao.email,
      perfil,
      instituicaoId: instituicao.id,
    })
    navigate("/central/atendimentos")
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto flex max-w-lg flex-col px-5 py-10">
        <section className="rounded-[2rem] border border-white bg-white/90 p-6 shadow-card sm:p-8">
        <h1 className="text-center text-2xl font-extrabold tracking-tight text-deep sm:text-3xl">
          Acesse a Central de acompanhamento
        </h1>
        <p className="mt-3 text-center text-slate-500">
          Você representa uma instituição ou prefeitura?
        </p>
        <p className="mt-2 text-center text-sm text-slate-400">
          A prefeitura envia o relato. A instituição escolhida responde.
        </p>

        {cadastroSolicitado && (
          <p className="mt-6 rounded-xl bg-sky-50 px-4 py-3 text-center text-sm text-navy">
            Cadastro solicitado. Neste protótipo, entre com o e-mail informado para acessar o chat.
          </p>
        )}

        <form onSubmit={enviar} className="mt-8" noValidate>
          <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
            <PerfilOpcao
              ativo={perfil === "instituicao"}
              titulo="Instituição"
              icone={<Building2 size={18} />}
              onClick={() => setPerfil("instituicao")}
            />
            <PerfilOpcao
              ativo={perfil === "prefeitura"}
              titulo="Prefeitura"
              icone={<House size={18} />}
              onClick={() => setPerfil("prefeitura")}
            />
          </div>

          <label className="mt-6 block text-sm font-semibold text-navy" htmlFor="email">
            E-mail institucional
          </label>
          <div className="relative mt-2">
            <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="seu@email.institucional.br"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 outline-none transition focus:border-tide focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <label className="mt-5 block text-sm font-semibold text-navy" htmlFor="senha">
            Senha
          </label>
          <div className="relative mt-2">
            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="senha"
              type={mostrarSenha ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-11 pr-12 outline-none transition focus:border-tide focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              onClick={() => setMostrarSenha((valor) => !valor)}
              aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
            >
              {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {erro && <p className="mt-3 text-sm text-red-600">{erro}</p>}

          <button
            type="submit"
            className="mt-6 h-12 w-full rounded-2xl bg-gradient-to-r from-brand to-[#128eab] text-base font-semibold text-white transition hover:brightness-110"
          >
            Entrar
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Ainda não possui acesso?{" "}
          <Link to="/central/cadastro" className="font-semibold text-brand hover:underline">
            Solicite cadastro
          </Link>
        </p>
        </section>
      </main>
    </div>
  )
}

function PerfilOpcao({
  ativo,
  titulo,
  icone,
  onClick,
}: {
  ativo: boolean
  titulo: string
  icone: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativo}
      className={`flex items-center gap-3 rounded-2xl border bg-white px-3 py-3 text-left transition ${
        ativo ? "border-tide bg-sky-50 shadow-soft" : "border-slate-200 hover:border-sky-200"
      }`}
    >
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-sky-50 text-brand">{icone}</span>
      <span className="flex-1 text-sm font-semibold text-navy">{titulo}</span>
      <span
        className={`grid h-5 w-5 place-items-center rounded-full border-2 ${
          ativo ? "border-brand" : "border-slate-300"
        }`}
      >
        {ativo && <span className="h-2.5 w-2.5 rounded-full bg-brand" />}
      </span>
    </button>
  )
}
