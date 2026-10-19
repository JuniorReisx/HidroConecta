import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { Download, X } from "lucide-react"

interface ConviteInstalacao extends Event {
  prompt: () => Promise<void>
}

const CHAVE = "hidroconecta-instalacao-adiada"

export function InstalarApp() {
  const { pathname } = useLocation()
  const [convite, setConvite] = useState<ConviteInstalacao | null>(null)
  const [ios, setIos] = useState(false)
  const [fechado, setFechado] = useState(false)

  useEffect(() => {
    const instalado =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
    if (instalado || sessionStorage.getItem(CHAVE)) return

    const aparelhoIos = /iphone|ipad|ipod/i.test(navigator.userAgent)
    if (aparelhoIos) setIos(true)

    function guardar(evento: Event) {
      evento.preventDefault()
      setConvite(evento as ConviteInstalacao)
    }

    window.addEventListener("beforeinstallprompt", guardar)
    return () => window.removeEventListener("beforeinstallprompt", guardar)
  }, [])

  if (fechado || pathname.startsWith("/central/atendimentos") || (!convite && !ios)) return null

  function adiar() {
    sessionStorage.setItem(CHAVE, "1")
    setFechado(true)
  }

  async function instalar() {
    if (!convite) return
    await convite.prompt()
    setConvite(null)
    setFechado(true)
  }

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-md items-start gap-3 rounded-2xl border border-sky-100 bg-white p-3 shadow-card">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-deep">Instalar o HidroConecta</p>
        <p className="mt-1 text-sm leading-snug text-slate-500">
          {convite
            ? "Adicione o site à tela inicial e abra como um aplicativo."
            : "No Safari, toque em Compartilhar e depois em Adicionar à Tela de Início."}
        </p>
        {convite && (
          <button
            type="button"
            onClick={instalar}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white"
          >
            <Download size={16} />
            Instalar
          </button>
        )}
      </div>
      <button type="button" onClick={adiar} aria-label="Fechar aviso de instalação" className="text-slate-400">
        <X size={18} />
      </button>
    </div>
  )
}
