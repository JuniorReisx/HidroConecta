import { Navigate, Route, Routes } from "react-router-dom"
import { InstalarApp } from "./components/InstalarApp"
import { SessaoProvider } from "./context/SessaoContext"
import { AcessoPage } from "./pages/AcessoPage"
import { CadastroPage } from "./pages/CadastroPage"
import { ChatPage } from "./pages/ChatPage"
import { EducacaoPage } from "./pages/EducacaoPage"
import { HomePage } from "./pages/HomePage"
import { SobrePage } from "./pages/SobrePage"
import { TemaPage } from "./pages/TemaPage"

export default function App() {
  return (
    <SessaoProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/educacao" element={<EducacaoPage />} />
        <Route path="/educacao/:slug" element={<TemaPage />} />
        <Route path="/sobre" element={<SobrePage />} />
        <Route path="/central" element={<AcessoPage />} />
        <Route path="/central/cadastro" element={<CadastroPage />} />
        <Route path="/central/atendimentos" element={<ChatPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <InstalarApp />
    </SessaoProvider>
  )
}
