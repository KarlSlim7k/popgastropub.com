export default function RegistroPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-3xl font-bold text-pop-gold mb-6">Crear Cuenta</h1>
        <p className="text-white/80 mb-4">Regístrate y gana 50 pts de bienvenida 🎉</p>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm text-white/70 mb-1">Nombre</label>
            <input
              type="text"
              id="name"
              className="w-full bg-white/5 border border-pop-gold/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pop-gold"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm text-white/70 mb-1">Email</label>
            <input
              type="email"
              id="email"
              className="w-full bg-white/5 border border-pop-gold/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pop-gold"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-white/70 mb-1">Contraseña</label>
            <input
              type="password"
              id="password"
              className="w-full bg-white/5 border border-pop-gold/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pop-gold"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Registrarme
          </button>
        </form>
      </div>
    </main>
  )
}
