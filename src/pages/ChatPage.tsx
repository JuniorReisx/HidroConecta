import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react"
import { Navigate } from "react-router-dom"
import { Building2, ClipboardList, Clock3, Plus, UserRound } from "lucide-react"
import { Header } from "../components/Header"
import { useSessao } from "../context/SessaoContext"
import {
  criarRelato,
  enviarMensagem,
  statusDoAtendimento,
  useAtendimentos,
} from "../data/atendimentos"
import { buscarInstituicao, instituicoes, type InstituicaoId } from "../data/instituicoes"

export function ChatPage() {
  const { sessao, sair } = useSessao()
  const atendimentos = useAtendimentos()
  const prefeitura = sessao?.perfil === "prefeitura"
  const visiveis = atendimentos.filter((atendimento) =>
    prefeitura
      ? atendimento.prefeituraEmail === sessao?.email
      : atendimento.instituicaoId === sessao?.instituicaoId,
  )

  const [selecionadoId, setSelecionadoId] = useState<string | "novo">("novo")
  const [instituicaoId, setInstituicaoId] = useState<InstituicaoId | "">("")
  const [texto, setTexto] = useState("")
  const [erro, setErro] = useState("")
  const listaRef = useRef<HTMLDivElement>(null)

  const selecionado = visiveis.find((atendimento) => atendimento.id === selecionadoId) ?? null
  const modoNovo = prefeitura && selecionadoId === "novo"

  useEffect(() => {
    document.title = prefeitura
      ? "Relato em tempo real • HidroConecta Bahia"
      : "Relatos recebidos • HidroConecta Bahia"
  }, [prefeitura])

  useEffect(() => {
    if (prefeitura) {
      if (selecionadoId === "novo" || visiveis.some((item) => item.id === selecionadoId)) return
      setSelecionadoId("novo")
      return
    }
    if (selecionadoId === "novo" || !visiveis.some((item) => item.id === selecionadoId)) {
      if (selecionadoId !== "") setSelecionadoId("")
    }
  }, [prefeitura, selecionadoId, visiveis])

  useEffect(() => {
    const lista = listaRef.current
    if (!lista) return
    lista.scrollTop = lista.scrollHeight
  }, [selecionado?.mensagens.length, modoNovo])

  if (!sessao) return <Navigate to="/central" replace />
  if (sessao.perfil === "prefeitura" && !sessao.municipio) {
    return <Navigate to="/central" replace />
  }
  if (sessao.perfil === "instituicao" && !sessao.instituicaoId) {
    return <Navigate to="/central" replace />
  }

  const instituicaoDaSessao = sessao.instituicaoId
    ? buscarInstituicao(sessao.instituicaoId)
    : null
  const instituicaoEscolhida = instituicoes.find((item) => item.id === instituicaoId)
  const instituicaoDoRelato = selecionado
    ? buscarInstituicao(selecionado.instituicaoId)
    : instituicaoEscolhida

  function enviar(event?: FormEvent) {
    event?.preventDefault()
    const relato = texto.trim()
    if (!relato || !sessao) return

    if (modoNovo) {
      if (!instituicaoId || !sessao.municipio) {
        setErro("Escolha a instituição que vai receber o relato.")
        return
      }
      const id = criarRelato({
        municipio: sessao.municipio,
        instituicaoId,
        prefeituraEmail: sessao.email,
        texto: relato,
      })
      setSelecionadoId(id)
      setTexto("")
      setErro("")
      return
    }

    if (!selecionado) return
    enviarMensagem(selecionado.id, prefeitura ? "prefeitura" : "instituicao", relato)
    setTexto("")
  }

  function aoTeclar(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      enviar()
    }
  }

  return (
    <div className="flex h-dvh flex-col">
      <Header />
      <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-sky-100 bg-white/80 md:flex">
          <nav className="flex flex-col gap-1 p-4">
            <button
              type="button"
              onClick={() => setSelecionadoId(visiveis[0]?.id ?? (prefeitura ? "novo" : ""))}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold ${
                !modoNovo ? "bg-sky-50 text-brand" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <ClipboardList size={18} />
              Atendimentos
            </button>
            {prefeitura && (
              <button
                type="button"
                onClick={() => {
                  setSelecionadoId("novo")
                  setTexto("")
                }}
                className={`flex items-center gap-3 rounded-xl border-l-4 px-3 py-3 text-left text-sm font-semibold ${
                  modoNovo
                    ? "border-brand bg-sky-50 text-brand"
                    : "border-transparent text-slate-500 hover:bg-slate-50"
                }`}
              >
                <Plus size={18} />
                Novo relato
              </button>
            )}
          </nav>
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 pb-4">
            {visiveis.map((atendimento) => (
              <button
                key={atendimento.id}
                type="button"
                onClick={() => setSelecionadoId(atendimento.id)}
                className={`w-full rounded-xl border px-3 py-3 text-left ${
                  atendimento.id === selecionadoId
                    ? "border-brand bg-sky-50"
                    : "border-slate-200 bg-white hover:bg-mist"
                }`}
              >
                <p className="font-semibold text-navy">{atendimento.municipio}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {prefeitura
                    ? `Para ${buscarInstituicao(atendimento.instituicaoId).sigla}`
                    : "Prefeitura"}
                  {" · "}
                  {statusDoAtendimento(atendimento)}
                </p>
              </button>
            ))}
            {visiveis.length === 0 && (
              <p className="px-1 text-sm text-slate-400">Nenhum relato recebido ainda.</p>
            )}
          </div>
          <div className="mt-auto border-t border-slate-100 p-4 text-sm">
            <p className="truncate font-semibold text-navy">{sessao.email}</p>
            <p className="mt-1 text-slate-400">
              {prefeitura ? "Prefeitura" : instituicaoDaSessao?.sigla}
            </p>
            <button type="button" onClick={sair} className="mt-3 font-semibold text-brand">
              Sair
            </button>
          </div>
        </aside>

        <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-white/90">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-3 py-3 md:hidden">
            <button
              type="button"
              onClick={() => setSelecionadoId(visiveis[0]?.id ?? (prefeitura ? "novo" : ""))}
              className="text-xs font-semibold text-slate-500 sm:text-sm"
            >
              Atendimentos
            </button>
            {prefeitura && (
              <button
                type="button"
                onClick={() => setSelecionadoId("novo")}
                className="text-xs font-semibold text-brand sm:text-sm"
              >
                Novo relato
              </button>
            )}
            <button type="button" onClick={sair} className="text-xs font-semibold text-slate-400 sm:text-sm">
              Sair
            </button>
          </div>
          {visiveis.length > 0 && (
            <div className="flex gap-2 overflow-x-auto border-b border-slate-100 px-4 py-3 md:hidden">
              {visiveis.map((atendimento) => (
                <button
                  key={atendimento.id}
                  type="button"
                  onClick={() => setSelecionadoId(atendimento.id)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold ${
                    atendimento.id === selecionadoId ? "bg-brand text-white" : "bg-slate-100 text-navy"
                  }`}
                >
                  {atendimento.municipio} · {buscarInstituicao(atendimento.instituicaoId).sigla}
                </button>
              ))}
            </div>
          )}

          {!selecionado && !modoNovo ? (
            <div className="grid flex-1 place-items-center px-6 text-center">
              <div>
                <Building2 className="mx-auto text-tide" />
                <h1 className="mt-3 text-2xl font-extrabold text-deep">Nenhum relato por aqui</h1>
                <p className="mt-2 max-w-sm text-slate-500">
                  {instituicaoDaSessao
                    ? `Quando uma prefeitura enviar um relato para a ${instituicaoDaSessao.sigla}, ele aparece nesta tela.`
                    : "Escolha um atendimento para continuar."}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-8">
                <div>
                  <h1 className="text-2xl font-extrabold text-deep">
                    {prefeitura ? "Relato em tempo real" : "Resposta da instituição"}
                  </h1>
                  {modoNovo ? (
                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      <p className="text-sm text-slate-500">
                        Município:{" "}
                        <span className="font-semibold text-navy">{sessao.municipio}</span>
                      </p>
                      <CampoSelect
                        label="Instituição"
                        value={instituicaoId}
                        onChange={(valor) => {
                          setInstituicaoId(valor as InstituicaoId | "")
                          setErro("")
                        }}
                        opcoes={[
                          { valor: "", rotulo: "Selecione" },
                          ...instituicoes.map((instituicao) => ({
                            valor: instituicao.id,
                            rotulo: instituicao.sigla,
                          })),
                        ]}
                      />
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-slate-500">
                      Município:{" "}
                      <span className="font-semibold text-navy">{selecionado?.municipio}</span>
                      <span className="mx-2 text-slate-300">|</span>
                      Instituição:{" "}
                      <span className="font-semibold text-navy">{instituicaoDoRelato?.sigla}</span>
                    </p>
                  )}
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  {prefeitura
                    ? instituicaoDoRelato
                      ? `Relato para a ${instituicaoDoRelato.sigla}`
                      : "Escolha a instituição"
                    : `Respondendo como ${instituicaoDaSessao?.sigla}`}
                </span>
              </div>

              <div ref={listaRef} className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-6 sm:px-8">
                {modoNovo && (
                  <p className="text-sm text-slate-400">
                    {instituicaoEscolhida
                      ? `O relato de ${sessao.municipio} será enviado para a ${instituicaoEscolhida.sigla}.`
                      : `O município ${sessao.municipio} já está definido pelo seu e-mail. Escolha a instituição que vai receber o relato.`}
                  </p>
                )}
                {selecionado?.mensagens.map((mensagem) => (
                  <Bolha
                    key={mensagem.id}
                    minha={prefeitura ? mensagem.autor === "prefeitura" : mensagem.autor === "instituicao"}
                    autor={
                      mensagem.autor === "prefeitura"
                        ? "Prefeitura"
                        : buscarInstituicao(selecionado.instituicaoId).sigla
                    }
                    hora={mensagem.hora}
                    texto={mensagem.texto}
                  />
                ))}
              </div>

              <div className="border-t border-slate-100 px-5 py-4 sm:px-8">
                <p className="mb-3 flex items-center justify-center gap-2 text-sm text-slate-400">
                  <Clock3 size={15} />
                  {selecionado
                    ? statusDoAtendimento(selecionado)
                    : instituicaoEscolhida
                      ? `O relato será enviado para a ${instituicaoEscolhida.sigla}`
                      : "Selecione a instituição que vai receber o relato"}
                </p>
                {erro && <p className="mb-3 text-center text-sm text-red-600">{erro}</p>}
                <form onSubmit={enviar} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <textarea
                    value={texto}
                    onChange={(event) => setTexto(event.target.value)}
                    onKeyDown={aoTeclar}
                    rows={2}
                    placeholder={
                      prefeitura
                        ? "Descreva o que está acontecendo na sua cidade..."
                        : "Escreva a resposta para a prefeitura..."
                    }
                    className="min-h-16 flex-1 resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-tide focus:ring-2"
                  />
                  <button
                    type="submit"
                    className="h-12 shrink-0 rounded-2xl bg-gradient-to-r from-brand to-[#128eab] px-5 font-semibold text-white hover:brightness-110"
                  >
                    {prefeitura ? "Enviar relato" : "Enviar resposta"}
                  </button>
                </form>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}

function Bolha({
  minha,
  autor,
  hora,
  texto,
}: {
  minha: boolean
  autor: string
  hora: string
  texto: string
}) {
  if (minha) {
    return (
      <div className="ml-auto w-fit max-w-[85%]">
        <p className="mb-1 text-right text-xs text-slate-400">
          <span className="font-semibold text-slate-500">Você</span> {hora}
        </p>
        <div className="rounded-2xl rounded-tr-md bg-gradient-to-br from-sky-50 to-cyan-50 px-4 py-3 text-sm leading-6 text-slate-600">
          {texto}
        </div>
      </div>
    )
  }

  return (
    <div className="flex max-w-[85%] gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sky-100 text-brand">
        <UserRound size={18} />
      </span>
      <div>
        <p className="mb-1 text-xs text-slate-400">
          <span className="font-semibold text-slate-500">{autor}</span> {hora}
        </p>
        <div className="rounded-2xl rounded-tl-md border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-600 shadow-sm">
          {texto}
        </div>
      </div>
    </div>
  )
}

function CampoSelect({
  label,
  value,
  onChange,
  opcoes,
}: {
  label: string
  value: string
  onChange: (valor: string) => void
  opcoes: { valor: string; rotulo: string }[]
}) {
  return (
    <label className="flex max-w-full flex-wrap items-center gap-2 text-sm text-slate-500">
      {label}:
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 max-w-full rounded-lg border border-slate-200 bg-white px-3 font-semibold text-navy outline-none ring-tide focus:ring-2"
      >
        {opcoes.map((opcao) => (
          <option key={opcao.valor} value={opcao.valor}>
            {opcao.rotulo}
          </option>
        ))}
      </select>
    </label>
  )
}
