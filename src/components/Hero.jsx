import logoImage from '../assets/nexus-logistica-logo.png'

export function Hero() {
  return (
    <section className="mx-auto grid max-w-305 grid-cols-1 items-stretch gap-10 px-6 pt-11 pb-7 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.74fr)]">
      <div className="flex min-h-80 flex-col justify-center lg:min-h-97.5">
        <p className="theme-eyebrow mb-2.5 text-xs font-black uppercase">
          Nexus Logistica
        </p>
        <h1 className="theme-title max-w-212.5 text-[clamp(2.4rem,5vw,5.8rem)] leading-[0.94] font-black tracking-normal drop-shadow-[0_0_22px_rgba(0,229,255,0.16)]">
          Manutenção preventiva automatizada para decisões logísticas mais limpas.
        </h1>
        <p className="theme-soft mt-5 max-w-190 text-base font-medium">
          O protótipo cruza telemetria simulada, histórico de manutenção e estresse de rota
          para recomendar o caminhão mais seguro, econômico e sustentável antes da expedição.
        </p>
      </div>

      <div
        className="theme-hero-frame relative flex aspect-square min-h-80 items-center justify-center overflow-hidden rounded-[18px] border bg-black p-8 lg:min-h-97.5"
        aria-label="Logotipo Nexus Logistica"
      >
        <img
          className="h-full w-full object-contain"
          src={logoImage}
          alt="Logo Nexus Logistica"
        />
      </div>
    </section>
  )
}
