import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Intro from './components/Intro'
import Inicio from './pages/Inicio'
import Grupos from './pages/Grupos'
import Equipos from './pages/Equipos'
import Noticias from './pages/Noticias'

function App() {
  const [introVista, setIntroVista] = useState(false)

  if (!introVista) {
    return <Intro onFinish={() => setIntroVista(true)} />
  }

  return (
    <div className="app">
      <div className="bg-overlay" />
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/grupos" element={<Grupos />} />
          <Route path="/equipos" element={<Equipos />} />
          <Route path="/noticias" element={<Noticias />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
export default App