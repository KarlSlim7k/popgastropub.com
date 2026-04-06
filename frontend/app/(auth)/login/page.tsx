"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Login() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <>
      {/* Custom Cursor */}
      <div className="custom-cursor"></div>
      
      {/* Background Layer with "Gold Particles" */}
      <div className="absolute inset-0 z-0 particle-bg opacity-30 pointer-events-none"></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-surface via-surface to-primary/5 pointer-events-none"></div>
      
      {/* Main Content Shell (Navigation Suppressed as per Linear/Transactional Rule) */}
      <main className="relative z-10 w-full max-w-lg px-6 py-12 md:py-24 animate-fade-in mx-auto">
        
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center mb-12">
          <Image 
            src="/images/logopop.png" 
            alt="POP Perote Logo" 
            width={180} 
            height={180} 
            className="mb-2 object-contain"
            priority
          />
        </div>

        {/* Central Card (Glassmorphism) */}
        <div className="glass-panel p-8 md:p-10 shadow-2xl relative overflow-hidden bg-surface/80 backdrop-blur-md rounded-2xl border border-outline-variant/20">
          {/* Asymmetric accent */}
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary-container/20 blur-3xl rounded-full"></div>

          {/* Tab Switcher */}
          <div className="flex space-x-8 mb-10 border-b border-outline-variant/10">
            <button 
              onClick={() => setActiveTab('login')}
              className={`font-headline font-bold text-sm uppercase tracking-widest pb-3 border-b-2 transition-all duration-300 ${activeTab === 'login' ? 'border-primary-container text-primary-container' : 'border-transparent text-on-surface/50 hover:text-on-surface'}`}
              type="button"
            >
              Iniciar Sesión
            </button>
            <button 
              onClick={() => setActiveTab('register')}
              className={`font-headline font-bold text-sm uppercase tracking-widest pb-3 border-b-2 transition-all duration-300 ${activeTab === 'register' ? 'border-primary-container text-primary-container' : 'border-transparent text-on-surface/50 hover:text-on-surface'}`}
              type="button"
            >
              Registrarse
            </button>
          </div>

          {/* Form Container */}
          {activeTab === 'login' ? (
            <div id="login-form-container" className="animate-fade-in">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block font-headline text-[10px] uppercase tracking-widest text-primary mb-2">Email o Teléfono</label>
                  <input 
                    className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 focus:border-secondary transition-colors duration-300 placeholder-on-surface/20 text-on-surface" 
                    placeholder="usuario@ejemplo.com" 
                    type="text"
                    required
                    pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$|^[0-9]{10}$"
                    title="Ingresa un email válido o un número de teléfono de 10 dígitos"
                  />
                </div>
                <div>
                  <label className="block font-headline text-[10px] uppercase tracking-widest text-primary mb-2">Contraseña</label>
                  <input 
                    className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 focus:border-secondary transition-colors duration-300 placeholder-on-surface/20 text-on-surface" 
                    placeholder="••••••••" 
                    type="password"
                    required
                    minLength={8}
                    maxLength={64}
                    pattern="^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$"
                    title="La contraseña debe tener al menos 8 caracteres y no contener caracteres inválidos"
                  />
                </div>
                
                <div className="flex justify-end pt-2">
                  <a className="text-[11px] uppercase tracking-tighter font-bold text-secondary hover:text-primary transition-colors" href="#">¿Olvidaste tu contraseña?</a>
                </div>
                
                <button className="w-full bg-primary-container hover:bg-primary-container/80 text-on-primary-container font-headline font-extrabold py-4 px-8 rounded-md flex justify-between items-center group transition-all duration-300 active:scale-95" type="submit">
                  <span className="uppercase tracking-widest text-sm">INICIAR SESIÓN</span>
                  <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
                </button>
              </form>

              {/* Social Login Divider */}
              <div className="relative flex py-8 items-center">
                <div className="flex-grow border-t border-outline-variant/20"></div>
                <span className="flex-shrink mx-4 text-[10px] font-headline font-bold uppercase text-on-surface/30 tracking-widest">O accede con</span>
                <div className="flex-grow border-t border-outline-variant/20"></div>
              </div>

              {/* Social Icons */}
              <div className="flex justify-center flex-wrap gap-4 mb-4">
                <button type="button" className="w-12 h-12 flex rounded-md items-center justify-center border border-outline-variant/30 hover:border-secondary hover:bg-secondary/5 transition-all duration-300 group" aria-label="Google">
                  <svg className="w-5 h-5 text-on-surface/60 group-hover:text-secondary fill-current" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                </button>
                <button type="button" className="w-12 h-12 flex rounded-md items-center justify-center border border-outline-variant/30 hover:border-secondary hover:bg-secondary/5 transition-all duration-300 group" aria-label="Facebook">
                  <svg className="w-5 h-5 text-on-surface/60 group-hover:text-secondary fill-current flex-shrink-0" viewBox="0 0 24 24"><path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </button>
                <button type="button" className="w-12 h-12 flex rounded-md items-center justify-center border border-outline-variant/30 hover:border-secondary hover:bg-secondary/5 transition-all duration-300 group" aria-label="X">
                   <svg className="w-5 h-5 text-on-surface/60 group-hover:text-secondary fill-current" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
                </button>
              </div>

              <div className="text-center mt-6">
                <p className="text-xs text-on-surface/60">¿No tienes cuenta? <button type="button" onClick={() => setActiveTab('register')} className="font-bold text-primary hover:underline underline-offset-4 decoration-primary/30">Regístrate y gana 50 pts</button></p>
              </div>
            </div>
          ) : (
            <div id="register-form-container" className="animate-fade-in">
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-headline text-[10px] uppercase tracking-widest text-primary mb-1">Nombre Completo</label>
                    <input 
                      className="w-full bg-transparent border-0 border-b border-outline-variant py-2 px-0 focus:ring-0 focus:border-secondary transition-colors duration-300 text-on-surface" 
                      type="text"
                      required
                      maxLength={100}
                      pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$"
                      title="Solo se permiten letras y espacios" 
                    />
                  </div>
                  <div>
                    <label className="block font-headline text-[10px] uppercase tracking-widest text-primary mb-1">Teléfono</label>
                    <input 
                      className="w-full bg-transparent border-0 border-b border-outline-variant py-2 px-0 focus:ring-0 focus:border-secondary transition-colors duration-300 text-on-surface" 
                      type="tel"
                      required
                      pattern="^[0-9]{10}$"
                      title="Ingresa un número de teléfono válido de 10 dígitos"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-headline text-[10px] uppercase tracking-widest text-primary mb-1">Email</label>
                  <input 
                    className="w-full bg-transparent border-0 border-b border-outline-variant py-2 px-0 focus:ring-0 focus:border-secondary transition-colors duration-300 text-on-surface" 
                    type="email"
                    required
                    maxLength={150}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-headline text-[10px] uppercase tracking-widest text-primary mb-1">Fecha Nacimiento</label>
                    <input 
                      className="w-full bg-transparent border-0 border-b border-outline-variant py-2 px-0 focus:ring-0 focus:border-secondary transition-colors duration-300 text-on-surface" 
                      type="date"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-headline text-[10px] uppercase tracking-widest text-primary mb-1">Contraseña</label>
                    <input 
                      className="w-full bg-transparent border-0 border-b border-outline-variant py-2 px-0 focus:ring-0 focus:border-secondary transition-colors duration-300 text-on-surface" 
                      type="password"
                      required
                      minLength={8}
                      maxLength={64}
                      pattern="^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$"
                      title="La contraseña debe tener al menos 8 caracteres"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-headline text-[10px] uppercase tracking-widest text-primary mb-1">¿Cómo nos conociste?</label>
                  <select 
                    className="w-full bg-transparent border-0 border-b border-outline-variant py-2 px-0 focus:ring-0 focus:border-secondary transition-colors duration-300 text-on-surface/60"
                    defaultValue=""
                  >
                    <option disabled value="">Selecciona una opción</option>
                    <option className="bg-surface text-on-surface" value="instagram">Instagram</option>
                    <option className="bg-surface text-on-surface" value="amigos">Amigos / Familia</option>
                    <option className="bg-surface text-on-surface" value="anuncios">Anuncios en línea</option>
                    <option className="bg-surface text-on-surface" value="evento">Evento Gastronómico</option>
                  </select>
                </div>
                <div className="flex items-start space-x-3 py-2">
                  <div className="flex items-center h-5">
                    <input 
                      className="w-4 h-4 rounded-sm border-outline-variant bg-transparent text-primary-container focus:ring-primary-container focus:ring-offset-surface" 
                      id="terms" 
                      type="checkbox"
                      required 
                    />
                  </div>
                  <label className="text-[10px] text-on-surface/60 leading-tight" htmlFor="terms">Acepto los Términos y Condiciones y la Política de Privacidad de POP PEROTE.</label>
                </div>
                <button className="w-full bg-primary-container hover:bg-primary-container/80 text-on-primary-container font-headline font-extrabold py-4 px-8 rounded-md flex justify-between items-center group transition-all duration-300 active:scale-95" type="submit">
                  <span className="uppercase tracking-widest text-[11px] md:text-sm">CREAR MI CUENTA</span>
                  <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">celebration</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Bottom Link */}
        <div className="mt-8 text-center flex justify-center">
          <Link href="/" className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-on-surface/40 hover:text-secondary transition-colors">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            <span>Volver al inicio</span>
          </Link>
        </div>
      </main>

      {/* Visual Polish: Floating Imagery */}
      <div className="absolute -left-20 top-1/2 -translate-y-1/2 opacity-20 hidden xl:block pointer-events-none">
        <img alt="Gastronomic visual anchor" className="w-64 h-96 object-cover grayscale brightness-50" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1YQBpxPJVTMUdRv978cAWi8MxRwPzrPgVabnkn9wV4lUNx-SMxBGPU_5RyBBhcNREojG0X4KOkcirbWV17s-O61wBI03hungiaxIs6ySqLiiFFyAIvJPrEha0_JN70Wq7S6z6xIz8edwduSIpt3z2e0FVlaEJhk9ovkLalVy1TAbgRpRkyxNeXc36osr8z-6ia1qMkABThkyeS8qQ2A3BRmUxPdDdMqa1GfwMrPYmw2TfarPjeypSEqejeLm5HOv1mFyjdoiJ7ssw"/>
      </div>
      <div className="absolute -right-20 bottom-0 opacity-20 hidden xl:block pointer-events-none">
        <img alt="Modern mixology anchor" className="w-80 h-80 object-cover grayscale contrast-125" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxppmb84jtpPiulWbAxo4AekjPcTtmt4uxEVkqboxAeOXznyF8ZOak2tvHBE-BZOeEb5hQTfhIUGpAnXxREBRLUJXTLvN2-1Wjry0dJnXkmNYly12pky92swFzQv3WffqSX5mh2xROuCB4iCXz4EwheGqBm6m73Nkt9XraCPjNfSBj0LLtpr1IyNIERihph8x4jlHMRa2IGolysOxwP42mLOZBCYfHPIWxnIcwfspHJDIA8VNLpQ5VQUK2AdoUnPRZ1wGb6Tnh5M5-"/>
      </div>
    </>
  );
}
