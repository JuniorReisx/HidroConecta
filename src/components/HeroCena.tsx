export function HeroCena() {
  const id = "hero-cena"

  return (
    <div className="relative h-full min-h-[280px] overflow-hidden sm:min-h-[360px]">
      <svg
        viewBox="0 0 640 480"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Reservatório de água entre morros, em um dia claro"
      >
        <defs>
          <linearGradient id={`${id}-ceu`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8f6fd" />
            <stop offset="42%" stopColor="#8ecae8" />
            <stop offset="100%" stopColor="#4f9fd0" />
          </linearGradient>
          <linearGradient id={`${id}-agua`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4ea0d8" />
            <stop offset="55%" stopColor="#1f6eae" />
            <stop offset="100%" stopColor="#0d4c86" />
          </linearGradient>
        </defs>
        <rect width="640" height="480" fill={`url(#${id}-ceu)`} />
        <circle cx="470" cy="78" r="42" fill="#fff4cc" />
        <circle cx="470" cy="78" r="70" fill="#fff4cc" opacity="0.35" />
        <path d="M0 210c70-48 130-20 190-58 70-44 120 10 190-18 62-24 150 8 260-24v370H0Z" fill="#9fc4d6" />
        <path d="M0 255c90-40 150 10 230-28 78-36 130 18 210-8 54-18 120 6 200-22v283H0Z" fill="#6fa4bf" />
        <path d="M80 268c40-36 78-18 104 6 18-28 62-46 96-16 28-34 90-20 118 10 22-24 70-18 96 8v28H80Z" fill="#567f86" opacity="0.55" />
        <path d="M0 318c90-34 150 18 250-8 86-22 140 20 230-2 48-10 100 8 160-14v186H0Z" fill={`url(#${id}-agua)`} />
        <path d="M30 360h150" stroke="#fff" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" />
        <path d="M210 400h210" stroke="#fff" strokeOpacity="0.22" strokeWidth="3" strokeLinecap="round" />
        <path d="M90 430h120" stroke="#d7f3ff" strokeOpacity="0.28" strokeWidth="2" strokeLinecap="round" />
        <path d="M0 392c80 18 140-10 220 8 90 20 150-16 240 4 50 12 110-4 180 10v66H0Z" fill="#1667a8" opacity="0.35" />
      </svg>
    </div>
  )
}
