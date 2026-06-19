import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Intro from './components/Intro'
import Inicio from './pages/Inicio'
import Grupos from './pages/Grupos'
import Equipos from './pages/Equipos'
import Noticias from './pages/Noticias'
import NoticiaDetalle from './pages/NoticiaDetalle'
import PanelAdmin from './pages/PanelAdmin'

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
          <Route path="/"           element={<Inicio />} />
          <Route path="/grupos"     element={<Grupos />} />
          <Route path="/equipos"    element={<Equipos />} />
          <Route path="/noticias"   element={<Noticias />} />
          <Route path="/noticias/:slug" element={<NoticiaDetalle />} />
          <Route path="/admin"      element={<PanelAdmin />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
