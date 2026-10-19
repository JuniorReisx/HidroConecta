export const prefeiturasTeste = [
  {
    email: "prefeitura.salvador@hidrocidadao.ba.gov.br",
    senha: "1234",
    municipio: "Salvador",
  },
  {
    email: "prefeitura.ilheus@hidrocidadao.ba.gov.br",
    senha: "1234",
    municipio: "Ilhéus",
  },
  {
    email: "prefeitura.barreiras@hidrocidadao.ba.gov.br",
    senha: "1234",
    municipio: "Barreiras",
  },
  {
    email: "prefeitura.abaira@hidrocidadao.ba.gov.br",
    senha: "1234",
    municipio: "Abaíra",
  },
  {
    email: "prefeitura.jequie@hidrocidadao.ba.gov.br",
    senha: "1234",
    municipio: "Jequié",
  },
] as const

export function buscarPrefeitura(email: string) {
  const informado = email.trim().toLowerCase()
  return prefeiturasTeste.find((prefeitura) => prefeitura.email === informado)
}
