import { useSyncExternalStore } from "react"
import { buscarInstituicao, type InstituicaoId } from "./instituicoes"

export type Coordenada = {
  latitude: number
  longitude: number
  precisao?: number
}

export type Mensagem = {
  id: string
  autor: "prefeitura" | "instituicao"
  texto: string
  hora: string
  foto?: string
  coordenada?: Coordenada
}

export type Atendimento = {
  id: string
  municipio: string
  instituicaoId: InstituicaoId
  prefeituraEmail: string
  mensagens: Mensagem[]
}

const CHAVE = "hidrocidadao-atendimentos"

let cache: Atendimento[] | null = null
const ouvintes = new Set<() => void>()

function ler(): Atendimento[] {
  if (cache) return cache
  if (typeof localStorage === "undefined") {
    cache = []
    return cache
  }

  const salvo = localStorage.getItem(CHAVE)
  if (!salvo) {
    cache = []
    return cache
  }

  try {
    const lista = JSON.parse(salvo) as Atendimento[]
    cache = Array.isArray(lista)
      ? lista.filter((atendimento) => atendimento.id !== "exemplo-feira-embasa")
      : []
  } catch {
    cache = []
  }
  return cache
}

function publicar(lista: Atendimento[]) {
  localStorage.setItem(CHAVE, JSON.stringify(lista))
  cache = lista
  ouvintes.forEach((ouvinte) => ouvinte())
}

function inscrever(ouvinte: () => void) {
  ouvintes.add(ouvinte)
  return () => ouvintes.delete(ouvinte)
}

export function useAtendimentos() {
  return useSyncExternalStore(inscrever, ler, ler)
}

export function statusDoAtendimento(atendimento: Atendimento) {
  const ultima = atendimento.mensagens[atendimento.mensagens.length - 1]
  if (!ultima || ultima.autor === "prefeitura") {
    return `Aguardando resposta da ${buscarInstituicao(atendimento.instituicaoId).sigla}`
  }
  return "Atendimento em acompanhamento"
}

export function criarRelato(dados: {
  municipio: string
  instituicaoId: InstituicaoId
  prefeituraEmail: string
  texto: string
  foto?: string
  coordenada?: Coordenada
}) {
  const atendimento: Atendimento = {
    id: crypto.randomUUID(),
    municipio: dados.municipio,
    instituicaoId: dados.instituicaoId,
    prefeituraEmail: dados.prefeituraEmail,
    mensagens: [novaMensagem("prefeitura", dados.texto, dados.foto, dados.coordenada)],
  }
  publicar([atendimento, ...ler()])
  return atendimento.id
}

export function enviarMensagem(
  atendimentoId: string,
  autor: Mensagem["autor"],
  texto: string,
  foto?: string,
  coordenada?: Coordenada,
) {
  publicar(
    ler().map((atendimento) =>
      atendimento.id === atendimentoId
        ? {
            ...atendimento,
            mensagens: [...atendimento.mensagens, novaMensagem(autor, texto, foto, coordenada)],
          }
        : atendimento,
    ),
  )
}

function novaMensagem(
  autor: Mensagem["autor"],
  texto: string,
  foto?: string,
  coordenada?: Coordenada,
): Mensagem {
  return {
    id: crypto.randomUUID(),
    autor,
    texto,
    hora: horaAtual(),
    ...(foto ? { foto } : {}),
    ...(foto && coordenada ? { coordenada } : {}),
  }
}

function horaAtual() {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
}
