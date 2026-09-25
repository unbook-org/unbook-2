export const siteConfig = {
  name: "UnBook",
  description:
    "Plataforma comunitária para matrícula, planejamento de semestres e avaliação transparente de disciplinas da UnB.",
  mainNav: [
    { title: "Início", href: "/" },
    { title: "Catálogo", href: "/catalog" },
    { title: "Planejador", href: "/planner" },
    { title: "Cardápio RU", href: "/menu" },
  ],
  footerNav: [
    {
      title: "UnBook",
      links: [
        { title: "Sobre o projeto", href: "/sobre" },
        { title: "Minha lista", href: "/catalog/mylist" },
        {
          title: "Repositório no GitHub",
          href: "https://github.com/unbook-org/unbook-2",
        },
      ],
    },
    {
      title: "Universidade de Brasília",
      links: [
        { title: "Portal da UnB", href: "https://www.unb.br" },
        { title: "SIGAA", href: "https://sig.unb.br" },
        { title: "Restaurante Universitário", href: "/menu" },
      ],
    },
  ],
} as const;
