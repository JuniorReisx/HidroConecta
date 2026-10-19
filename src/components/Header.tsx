import { useState } from "react"
import { NavLink } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { Logo } from "./Logo"

const links = [
  { to: "/", label: "Início", end: true },
  { to: "/educacao", label: "Educação hídrica", end: false },
  { to: "/sobre", label: "Sobre o projeto", end: false },
]

export function Header() {
  const [aberto, setAberto] = useState(false)

  return (
    <header className="sticky top-0 z-30 border-b border-sky-100/80 bg-white/80 shadow-soft backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:px-5">
        <NavLink to="/" aria-label="Ir para a tela inicial" className="min-w-0 shrink" onClick={() => setAberto(false)}>
          <Logo />
        </NavLink>
        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-xl text-navy md:hidden"
          aria-expanded={aberto}
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          onClick={() => setAberto((valor) => !valor)}
        >
          {aberto ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav className="hidden items-center gap-1 text-sm md:flex sm:text-[15px]">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                isActive
                  ? "rounded-full bg-sky-50 px-3 py-2 font-semibold text-brand"
                  : "rounded-full px-3 py-2 text-slate-500 transition hover:bg-slate-50 hover:text-navy"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
      {aberto && (
        <nav className="flex flex-col gap-1 border-t border-sky-100 px-4 py-3 md:hidden">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setAberto(false)}
              className={({ isActive }) =>
                isActive
                  ? "rounded-xl bg-sky-50 px-3 py-3 font-semibold text-brand"
                  : "rounded-xl px-3 py-3 text-slate-600"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
