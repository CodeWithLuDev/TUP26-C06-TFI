import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)

  useEffect(() => {
    const guardado = localStorage.getItem('usuario')
    if (guardado) setUsuario(JSON.parse(guardado))
  }, [])

  function registrarse(nombre, apellido, correo, contrasena) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
    const existe = usuarios.find(u => u.correo === correo)
    if (existe) return { error: 'El correo ya está registrado' }

    const nuevo = {
      id: Date.now(),
      nombre,
      apellido,
      correo,
      contrasena,
      rol: correo === 'admin@mundial.com' ? 'admin' : 'usuario'
    }

    usuarios.push(nuevo)
    localStorage.setItem('usuarios', JSON.stringify(usuarios))
    const { contrasena: _, ...sinContrasena } = nuevo
    setUsuario(sinContrasena)
    localStorage.setItem('usuario', JSON.stringify(sinContrasena))
    return { ok: true }
  }

  function iniciarSesion(correo, contrasena) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
    const encontrado = usuarios.find(u => u.correo === correo && u.contrasena === contrasena)
    if (!encontrado) return { error: 'Correo o contraseña incorrectos' }

    const { contrasena: _, ...sinContrasena } = encontrado
    setUsuario(sinContrasena)
    localStorage.setItem('usuario', JSON.stringify(sinContrasena))
    return { ok: true }
  }

  function cerrarSesion() {
    setUsuario(null)
    localStorage.removeItem('usuario')
  }

  return (
    <AuthContext.Provider value={{ usuario, registrarse, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}