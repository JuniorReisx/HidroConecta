import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import type { InstituicaoId } from "../data/instituicoes"

export type Perfil = "instituicao" | "prefeitura"

export type Sessao = {
  email: string
  perfil: Perfil
  instituicaoId?: InstituicaoId
  municipio?: string
}

type SessaoContextValue = {
  sessao: Sessao | null
  entrar: (sessao: Sessao) => void
  sair: () => void
}

const SessaoContext = createContext<SessaoContextValue | null>(null)
const CHAVE = "hidrocidadao-sessao"

export function SessaoProvider({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<Sessao | null>(() => {
    const salvo = sessionStorage.getItem(CHAVE)
    if (!salvo) return null
    try {
      return JSON.parse(salvo) as Sessao
    } catch {
      return null
    }
  })

  const value = useMemo<SessaoContextValue>(
    () => ({
      sessao,
      entrar: (nova) => {
        sessionStorage.setItem(CHAVE, JSON.stringify(nova))
        setSessao(nova)
      },
      sair: () => {
        sessionStorage.removeItem(CHAVE)
        setSessao(null)
      },
    }),
    [sessao],
  )

  return <SessaoContext.Provider value={value}>{children}</SessaoContext.Provider>
}

export function useSessao() {
  const contexto = useContext(SessaoContext)
  if (!contexto) {
    throw new Error("useSessao deve ser usado dentro de SessaoProvider")
  }
  return contexto
}
