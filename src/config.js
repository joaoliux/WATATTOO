// STUDIO WA — Configurações do site

export const site = {
  name: "STUDIO WA",
  tagline: "Arte na pele. Identidade para a vida.",

  whatsapp: "11980138803",
  whatsappMessage: "Olá! Conheci o STUDIO WA pelo site e gostaria de conversar sobre uma tatuagem.",

  instagram: "https://www.instagram.com/wasptattoo01",

  address: "Rua 24 de Maio, 275 - República, São Paulo",

  hours: [
    ["Segunda a Sábado", "11h às 19h"],
    ["Domingo", "Fechado"],
  ],

  heroImage: "/hero.jpg",

  works: [
    { src: "/trabalho1.jpg", label: "" },
    { src: "/trabalho2.jpg", label: "" },
    { src: "/trabalho3.jpg", label: "" },
    { src: "/trabalho4.jpg", label: "" },
    { src: "/trabalho5.jpg", label: "" },
    { src: "/trabalho6.jpg", label: "" },
  ],

  steps: [
    {
      title: "Sua ideia começa aqui",
      text: "Envie sua referência, conte o que deseja tatuar e informe a região do corpo e o tamanho aproximado."
    },
    {
      title: "Orçamento personalizado",
      text: "Analisamos sua proposta e apresentamos o investimento e o tempo estimado para a sessão."
    },
    {
      title: "Seu projeto ganha forma",
      text: "Conversamos sobre os detalhes, ajustamos a proposta e alinhamos tudo antes de começar."
    },
    {
      title: "Arte na pele",
      text: "Com tudo definido, é hora de transformar sua ideia em uma tatuagem feita para você."
    }
  ],
};

export const waLink = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(site.whatsappMessage)}`;