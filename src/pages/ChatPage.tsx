import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from "react"
import { Navigate } from "react-router-dom"
import { Building2, Camera, ClipboardList, Clock3, ImagePlus, MapPin, Plus, Send, UserRound, X } from "lucide-react"
import { Header } from "../components/Header"
import { useSessao } from "../context/SessaoContext"
import {
  criarRelato,
  enviarMensagem,
  statusDoAtendimento,
  useAtendimentos,
  type Coordenada,
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
  const [foto, setFoto] = useState("")
  const [coordenada, setCoordenada] = useState<Coordenada | null>(null)
  const [buscandoLocal, setBuscandoLocal] = useState(false)
  const [erro, setErro] = useState("")
  const listaRef = useRef<HTMLDivElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)
  const galeriaRef = useRef<HTMLInputElement>(null)
  const origemRef = useRef<"camera" | "galeria">("galeria")
  const localizacaoRef = useRef<Promise<Coordenada | null> | null>(null)
  const conversaRef = useRef(selecionadoId)
  conversaRef.current = selecionadoId

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
    setFoto("")
    setCoordenada(null)
    setBuscandoLocal(false)
  }, [selecionadoId])

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
    if (buscandoLocal || (!relato && !foto) || !sessao) return

    try {
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
          foto: foto || undefined,
          coordenada: foto && coordenada ? coordenada : undefined,
        })
        setSelecionadoId(id)
        setTexto("")
        setFoto("")
        setCoordenada(null)
        setErro("")
        return
      }

      if (!selecionado) return
      enviarMensagem(
        selecionado.id,
        prefeitura ? "prefeitura" : "instituicao",
        relato,
        foto || undefined,
        foto && coordenada ? coordenada : undefined,
      )
      setTexto("")
      setFoto("")
      setCoordenada(null)
      setErro("")
    } catch {
      setErro("Essa foto ficou grande demais para o navegador. Tente outra imagem.")
    }
  }

  function abrirCamera() {
    origemRef.current = "camera"
    localizacaoRef.current = lerCoordenada()
    cameraRef.current?.click()
  }

  function abrirGaleria() {
    origemRef.current = "galeria"
    galeriaRef.current?.click()
  }

  async function aoEscolherFoto(event: ChangeEvent<HTMLInputElement>) {
    const arquivo = event.target.files?.[0]
    event.target.value = ""
    if (!arquivo) return
    if (!arquivo.type.startsWith("image/")) {
      setErro("Escolha uma foto em JPG ou PNG.")
      return
    }
    const conversa = conversaRef.current
    const pelaCamera = origemRef.current === "camera"
    const pedidoLocal = pelaCamera ? localizacaoRef.current : null
    if (pelaCamera) setBuscandoLocal(true)
    try {
      const comprimida = await comprimirFoto(arquivo)
      const local = pedidoLocal ? await pedidoLocal : null
      if (conversaRef.current !== conversa) return
      setFoto(comprimida)
      setCoordenada(local)
      if (pelaCamera && !local) {
        setErro("A foto foi anexada, mas o navegador não liberou a localização. Permita o acesso e tire a foto de novo.")
      } else {
        setErro("")
      }
    } catch {
      setErro("Não foi possível ler essa foto. Tente outra imagem em JPG ou PNG.")
    } finally {
      if (conversaRef.current === conversa) setBuscandoLocal(false)
    }
  }

  function aoTeclar(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      enviar()
    }
  }

  return (
    <div className="flex h-dvh flex-col">
      <div className="hidden md:block">
        <Header />
      </div>
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
                  setFoto("")
                  setCoordenada(null)
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
          <div className="flex items-center gap-3 border-b border-slate-100 px-3 py-2 md:hidden">
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-extrabold text-deep">
                {prefeitura ? "Relato em tempo real" : "Resposta da instituição"}
              </p>
              <p className="truncate text-xs font-medium text-slate-500">
                {prefeitura
                  ? instituicaoDoRelato
                    ? `${sessao.municipio} · ${instituicaoDoRelato.sigla}`
                    : sessao.municipio
                  : selecionado
                    ? `${selecionado.municipio} · ${instituicaoDaSessao?.sigla}`
                    : instituicaoDaSessao?.sigla}
              </p>
            </div>
            {prefeitura && (
              <button
                type="button"
                onClick={() => {
                  setSelecionadoId("novo")
                  setFoto("")
                  setCoordenada(null)
                }}
                className="shrink-0 text-xs font-semibold text-brand"
              >
                Novo
              </button>
            )}
            <button type="button" onClick={sair} className="shrink-0 text-xs font-semibold text-slate-400">
              Sair
            </button>
          </div>
          {visiveis.length > 0 && (
            <div className="flex gap-2 overflow-x-auto border-b border-slate-100 px-3 py-2 md:hidden">
              {visiveis.map((atendimento) => (
                <button
                  key={atendimento.id}
                  type="button"
                  onClick={() => setSelecionadoId(atendimento.id)}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
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
              <div className="hidden flex-wrap items-start justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-8 md:flex">
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

              {modoNovo && (
                <div className="border-b border-slate-100 px-3 py-2 md:hidden">
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
              )}

              <div ref={listaRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3 py-3 sm:space-y-5 sm:px-8 sm:py-6">
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
                    foto={mensagem.foto}
                    coordenada={mensagem.coordenada}
                  />
                ))}
              </div>

              <div className="border-t border-slate-100 px-3 py-2 sm:px-8 sm:py-4">
                <p className="mb-2 hidden items-center justify-center gap-2 text-sm text-slate-400 sm:flex">
                  <Clock3 size={15} />
                  {selecionado
                    ? statusDoAtendimento(selecionado)
                    : instituicaoEscolhida
                      ? `O relato será enviado para a ${instituicaoEscolhida.sigla}`
                      : "Selecione a instituição que vai receber o relato"}
                </p>
                {erro && <p className="mb-2 text-center text-xs text-red-600 sm:mb-3 sm:text-sm">{erro}</p>}
                <form onSubmit={enviar} className="flex flex-col gap-2">
                  {foto && (
                    <div className="w-fit">
                      <div className="relative">
                        <img src={foto} alt="Foto pronta para enviar" className="h-24 w-24 rounded-xl object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setFoto("")
                            setCoordenada(null)
                          }}
                          aria-label="Remover foto"
                          className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-navy text-white"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      {coordenada && (
                        <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-navy">
                          <MapPin size={14} />
                          {formatarCoordenada(coordenada)}
                        </p>
                      )}
                      {buscandoLocal && <p className="mt-2 text-xs text-slate-400">Lendo a localização da foto...</p>}
                    </div>
                  )}
                  <div className="flex items-end gap-1.5">
                    <button
                      type="button"
                      onClick={abrirCamera}
                      aria-label="Tirar foto"
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-slate-400"
                    >
                      <Camera size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={abrirGaleria}
                      aria-label="Escolher foto da galeria"
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-slate-400"
                    >
                      <ImagePlus size={18} />
                    </button>
                    <textarea
                      value={texto}
                      onChange={(event) => setTexto(event.target.value)}
                      onKeyDown={aoTeclar}
                      rows={1}
                      placeholder={prefeitura ? "Escreva o relato..." : "Escreva a resposta..."}
                      className="max-h-24 min-h-10 flex-1 resize-none rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-tide focus:ring-2"
                    />
                    <button
                      type="submit"
                      disabled={buscandoLocal}
                      aria-label={prefeitura ? "Enviar relato" : "Enviar resposta"}
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand text-white disabled:opacity-60"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                  <input
                    ref={cameraRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    hidden
                    onChange={aoEscolherFoto}
                  />
                  <input ref={galeriaRef} type="file" accept="image/*" hidden onChange={aoEscolherFoto} />
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
  foto,
  coordenada,
}: {
  minha: boolean
  autor: string
  hora: string
  texto: string
  foto?: string
  coordenada?: Coordenada
}) {
  const [aberta, setAberta] = useState(false)
  const conteudo = (
    <>
      {foto && (
        <button type="button" onClick={() => setAberta(true)} className="mb-2 block overflow-hidden rounded-xl">
          <img src={foto} alt="Foto enviada no atendimento" className="max-h-56 w-full object-cover" />
        </button>
      )}
      {coordenada && (
        <a
          href={linkDoMapa(coordenada)}
          target="_blank"
          rel="noreferrer"
          className="mb-2 flex items-center gap-1 font-semibold text-brand"
        >
          <MapPin size={14} />
          {formatarCoordenada(coordenada)}
        </a>
      )}
      {texto && <p>{texto}</p>}
      {aberta && foto && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 p-4"
          onClick={() => setAberta(false)}
        >
          <img src={foto} alt="Foto enviada no atendimento" className="max-h-[90vh] max-w-full rounded-xl" />
        </div>
      )}
    </>
  )

  if (minha) {
    return (
      <div className="ml-auto w-fit max-w-[85%]">
        <p className="mb-1 text-right text-xs text-slate-400">
          <span className="font-semibold text-slate-500">Você</span> {hora}
        </p>
        <div className="rounded-2xl rounded-tr-md bg-gradient-to-br from-sky-50 to-cyan-50 px-4 py-3 text-sm leading-6 text-slate-600">
          {conteudo}
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
          {conteudo}
        </div>
      </div>
    </div>
  )
}

function lerCoordenada() {
  if (!navigator.geolocation) return Promise.resolve(null)
  return new Promise<Coordenada | null>((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (posicao) => {
        resolve({
          latitude: posicao.coords.latitude,
          longitude: posicao.coords.longitude,
          precisao: Math.round(posicao.coords.accuracy),
        })
      },
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
    )
  })
}

function formatarCoordenada(coordenada: Coordenada) {
  const latitude = coordenada.latitude.toFixed(6).replace(".", ",")
  const longitude = coordenada.longitude.toFixed(6).replace(".", ",")
  const precisao = coordenada.precisao ? ` · cerca de ${coordenada.precisao} m` : ""
  return `${latitude}, ${longitude}${precisao}`
}

function linkDoMapa(coordenada: Coordenada) {
  return `https://www.google.com/maps/search/?api=1&query=${coordenada.latitude},${coordenada.longitude}`
}

function comprimirFoto(arquivo: File) {
  return new Promise<string>((resolve, reject) => {
    const url = URL.createObjectURL(arquivo)
    const imagem = new Image()
    imagem.onload = () => {
      const limite = 1280
      const escala = Math.min(1, limite / Math.max(imagem.width, imagem.height))
      const tela = document.createElement("canvas")
      tela.width = Math.max(1, Math.round(imagem.width * escala))
      tela.height = Math.max(1, Math.round(imagem.height * escala))
      const contexto = tela.getContext("2d")
      if (!contexto) {
        URL.revokeObjectURL(url)
        reject(new Error("canvas"))
        return
      }
      contexto.drawImage(imagem, 0, 0, tela.width, tela.height)
      URL.revokeObjectURL(url)
      resolve(tela.toDataURL("image/jpeg", 0.72))
    }
    imagem.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("imagem"))
    }
    imagem.src = url
  })
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
