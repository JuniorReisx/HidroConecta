type LogoProps = {
  compact?: boolean
}

export function Logo({ compact = false }: LogoProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <img
        src="/logo-hidroconecta.png?v=4"
        alt=""
        className={compact ? "h-9 w-auto object-contain" : "h-10 w-auto object-contain sm:h-12"}
      />
      <span className={`font-extrabold leading-none tracking-tight ${compact ? "text-base" : "text-base sm:text-xl"}`}>
        <span className="text-[#0d3f86]">Hidro</span>
        <span className="text-[#12b8d6]">Conecta</span>
      </span>
    </span>
  )
}
