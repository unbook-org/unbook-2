export default function Home() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6 lg:px-8">
      <h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl">
        Bem-vindo ao <span className="text-primary">UnBook</span>
      </h1>
      <p className="text-foreground/70 max-w-xl text-lg">
        Busca de disciplinas, montagem de grade e avaliações anônimas da UnB,
        tudo em um só lugar.
      </p>
    </section>
  );
}
