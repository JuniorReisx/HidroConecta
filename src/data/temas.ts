export type Tema = {
  slug: string
  titulo: string
  resumo: string
  destaque: boolean
  paragrafos: string[]
}

export const temas: Tema[] = [
  {
    slug: "seguranca-hidrica",
    titulo: "Segurança hídrica",
    resumo: "Água em quantidade e qualidade para as pessoas, a economia e o meio ambiente.",
    destaque: true,
    paragrafos: [
      "Segurança hídrica é a capacidade de garantir água suficiente, no momento certo e com qualidade adequada para a população, as atividades econômicas e os ecossistemas.",
      "Na Bahia, isso envolve o abastecimento das cidades, o semiárido, a agricultura, os reservatórios e a proteção de rios e nascentes. Quando a segurança hídrica falha, comunidades podem ficar sem água, a produção é afetada e o risco de conflitos aumenta.",
      "Uma plataforma de comunicação ajuda a registrar cedo a falta de água, a interrupção do abastecimento e os sinais de estiagem, para que prefeituras e instituições acompanhem a situação com mais clareza.",
    ],
  },
  {
    slug: "el-nino-la-nina",
    titulo: "El Niño e La Niña",
    resumo: "Fenômenos do Pacífico que podem alterar chuvas e temperaturas na Bahia.",
    destaque: true,
    paragrafos: [
      "El Niño e La Niña são fases de um fenômeno do oceano Pacífico equatorial. El Niño corresponde ao aquecimento anormal dessas águas. La Niña corresponde ao resfriamento.",
      "Essas mudanças alteram a circulação da atmosfera e podem modificar o regime de chuvas e as temperaturas em várias partes do Brasil. Na Bahia, o efeito não é igual em todo o estado: o semiárido, o litoral e o oeste podem sentir impactos diferentes.",
      "Em muitos episódios, o El Niño está associado a períodos mais secos em parte do Nordeste. A La Niña pode favorecer mais chuva, mas também eventos intensos. Por isso, o acompanhamento local continua necessário: o fenômeno ajuda a explicar o clima, mas cada município vive a situação de um jeito próprio.",
    ],
  },
  {
    slug: "secas-estiagens",
    titulo: "Secas e estiagens",
    resumo: "A diferença entre um período seco e uma seca que compromete o abastecimento.",
    destaque: false,
    paragrafos: [
      "Estiagem é um período prolongado com pouca ou nenhuma chuva. Seca é uma situação mais grave e persistente, quando a falta de água passa a afetar pessoas, lavouras, criação de animais e reservatórios.",
      "No semiárido baiano, estiagens fazem parte do clima, mas uma sequência longa reduz poços, barragens e a água disponível para comunidades rurais. Nas cidades, o mesmo período pode aparecer como rodízio ou interrupção do abastecimento.",
      "Relatar o município, os bairros ou comunidades atingidas e há quanto tempo a situação dura ajuda a Central a entender a gravidade do caso.",
    ],
  },
  {
    slug: "eventos-extremos",
    titulo: "Eventos extremos",
    resumo: "Enchentes, alagamentos e chuvas intensas que afetam a população e as cidades.",
    destaque: false,
    paragrafos: [
      "Eventos extremos são ocorrências fora do padrão habitual, como chuvas muito intensas em pouco tempo, enchentes, alagamentos e transbordamento de rios.",
      "Eles podem interromper ruas, danificar redes de água e esgoto, isolar comunidades e contaminar a água usada para beber. O problema hídrico, nesse caso, não é só a falta: é também o excesso no lugar e no momento errados.",
      "Um relato útil informa onde a água acumulou, se há pessoas desalojadas e se o abastecimento ou a qualidade da água foram afetados.",
    ],
  },
  {
    slug: "uso-consciente",
    titulo: "Uso consciente da água",
    resumo: "Práticas simples para reduzir desperdício e cuidar de rios e reservatórios.",
    destaque: true,
    paragrafos: [
      "Uso consciente é consumir a água necessária sem desperdício e proteger as fontes que abastecem as cidades e o campo.",
      "Isso inclui consertar vazamentos, reaproveitar água quando for seguro, evitar lavar calçadas com mangueira, preservar matas ciliares e não lançar lixo ou esgoto em rios e lagoas.",
      "Nenhuma dessas práticas substitui a responsabilidade pública pelo abastecimento. Elas complementam o cuidado coletivo e ajudam a reduzir a pressão sobre os mananciais, principalmente em períodos de estiagem.",
    ],
  },
]

export function buscarTema(slug: string) {
  return temas.find((tema) => tema.slug === slug)
}
