export const instituicoes = [
  {
    id: "sihs",
    sigla: "SIHS",
    nome: "Secretaria de Infraestrutura Hídrica e Saneamento",
    email: "sihs@hidrocidadao.ba.gov.br",
    senha: "1234",
  },
  {
    id: "embasa",
    sigla: "EMBASA",
    nome: "Empresa Baiana de Águas e Saneamento",
    email: "embasa@hidrocidadao.ba.gov.br",
    senha: "1234",
  },
  {
    id: "cerb",
    sigla: "CERB",
    nome: "Companhia de Engenharia Hídrica e de Saneamento da Bahia",
    email: "cerb@hidrocidadao.ba.gov.br",
    senha: "1234",
  },
  {
    id: "inema",
    sigla: "INEMA",
    nome: "Instituto do Meio Ambiente e Recursos Hídricos",
    email: "inema@hidrocidadao.ba.gov.br",
    senha: "1234",
  },
  {
    id: "agersa",
    sigla: "AGERSA",
    nome: "Agência Reguladora de Saneamento Básico do Estado da Bahia",
    email: "agersa@hidrocidadao.ba.gov.br",
    senha: "1234",
  },
  {
    id: "sema",
    sigla: "SEMA",
    nome: "Secretaria do Meio Ambiente",
    email: "sema@hidrocidadao.ba.gov.br",
    senha: "1234",
  },
  {
    id: "casa-civil",
    sigla: "Casa Civil",
    nome: "Casa Civil do Estado da Bahia",
    email: "casacivil@hidrocidadao.ba.gov.br",
    senha: "1234",
  },
  {
    id: "defesa-civil",
    sigla: "Defesa Civil",
    nome: "Defesa Civil do Estado da Bahia",
    email: "defesacivil@hidrocidadao.ba.gov.br",
    senha: "1234",
  },
] as const

export type InstituicaoId = (typeof instituicoes)[number]["id"]

export function buscarInstituicao(id: InstituicaoId) {
  return instituicoes.find((instituicao) => instituicao.id === id) ?? instituicoes[0]
}

export function buscarContaInstituicao(email: string) {
  const informado = email.trim().toLowerCase()
  return instituicoes.find((instituicao) => instituicao.email === informado)
}
