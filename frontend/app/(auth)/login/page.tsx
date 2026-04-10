"use client";

import React, { FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchAPI, fetchWithAuth } from '@/lib/api';
import { saveAuthSession } from '@/lib/auth-session';

type AuthTab = 'login' | 'register';
type SocialProvider = 'google' | 'facebook' | 'x';

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role?: string;
  points?: number;
  tier?: string;
}

interface AuthResponse {
  user: AuthUser;
  token: string;
}

interface LoginFormData {
  identifier: string;
  password: string;
}

interface RegisterFormData {
  name: string;
  phone: string;
  email: string;
  birthDate: string;
  password: string;
  passwordConfirmation: string;
  referralSource: string;
  termsAccepted: boolean;
}

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://popgastropub.com/api').replace(/\/api\/?$/, '');

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return 'No fue posible completar la solicitud. Intenta de nuevo.';
}

function providerLabel(provider: SocialProvider | string): string {
  if (provider === 'google') return 'Google';
  if (provider === 'facebook') return 'Facebook';
  if (provider === 'x') return 'X';
  return 'red social';
}

function socialButtonIcon(provider: SocialProvider) {
  if (provider === 'google') {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
    );
  }

  if (provider === 'facebook') {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#1877F2"
          d="M24 12.073c0-6.627-5.373-12-12-12S0 .072 0 6.699c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
        />
      </svg>
    );
  }

  return (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

export default function Login() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [isSubmitting, setIsSubmitting] = useState<AuthTab | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [statusSuccess, setStatusSuccess] = useState<string | null>(null);

  const [loginForm, setLoginForm] = useState<LoginFormData>({
    identifier: '',
    password: '',
  });

  const [registerForm, setRegisterForm] = useState<RegisterFormData>({
    name: '',
    phone: '',
    email: '',
    birthDate: '',
    password: '',
    passwordConfirmation: '',
    referralSource: '',
    termsAccepted: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const requestedTab = new URLSearchParams(window.location.search).get('tab');

    if (requestedTab === 'register') {
      setActiveTab('register');
      return;
    }

    if (requestedTab === 'login') {
      setActiveTab('login');
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const hashValue = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : '';

    if (!hashValue) {
      return;
    }

    const hashParams = new URLSearchParams(hashValue);
    const token = hashParams.get('token');
    const provider = hashParams.get('provider') ?? 'social';
    const callbackError = hashParams.get('error');

    window.history.replaceState({}, document.title, window.location.pathname + window.location.search);

    if (callbackError) {
      setStatusError('No fue posible completar el acceso social. Verifica permisos y vuelve a intentar.');
      return;
    }

    if (!token) {
      return;
    }

    setStatusError(null);
    setStatusSuccess('Validando sesión social...');

    fetchWithAuth<AuthUser>('/auth/me', token)
      .then((user) => {
        saveAuthSession({ token, user, provider });
        setStatusSuccess(`Acceso con ${providerLabel(provider)} completado. Redirigiendo...`);
        router.push('/puntos');
      })
      .catch(() => {
        setStatusSuccess(null);
        setStatusError('La sesión social no pudo validarse. Intenta acceder nuevamente.');
      });
  }, [router]);

  async function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusError(null);
    setStatusSuccess(null);
    setIsSubmitting('login');

    try {
      const response = await fetchAPI<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          login: loginForm.identifier.trim(),
          password: loginForm.password,
        }),
      });

      saveAuthSession({ token: response.token, user: response.user, provider: 'password' });
      setStatusSuccess('Inicio de sesión exitoso. Redirigiendo...');
      router.push('/puntos');
    } catch (error) {
      setStatusError(getErrorMessage(error));
    } finally {
      setIsSubmitting(null);
    }
  }

  async function handleRegisterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusError(null);
    setStatusSuccess(null);

    if (!registerForm.termsAccepted) {
      setStatusError('Debes aceptar términos y política de privacidad para continuar.');
      return;
    }

    if (registerForm.password !== registerForm.passwordConfirmation) {
      setStatusError('La confirmación de contraseña no coincide.');
      return;
    }

    setIsSubmitting('register');

    try {
      const response = await fetchAPI<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: registerForm.name.trim(),
          phone: registerForm.phone.trim(),
          email: registerForm.email.trim().toLowerCase(),
          birth_date: registerForm.birthDate || null,
          referral_source: registerForm.referralSource || null,
          password: registerForm.password,
          password_confirmation: registerForm.passwordConfirmation,
          terms_accepted: registerForm.termsAccepted,
        }),
      });

      saveAuthSession({ token: response.token, user: response.user, provider: 'password' });
      setStatusSuccess('Cuenta creada correctamente. Ya tienes tus puntos de bienvenida.');
      router.push('/puntos');
    } catch (error) {
      setStatusError(getErrorMessage(error));
    } finally {
      setIsSubmitting(null);
    }
  }

  function startSocialAuth(provider: SocialProvider) {
    setStatusError(null);
    setStatusSuccess(`Redirigiendo a ${providerLabel(provider)}...`);
    window.location.href = `${API_BASE_URL}/api/auth/social/${provider}/redirect`;
  }

  const socialButtons = (
    <div>
      <div className="relative flex py-8 items-center">
        <div className="flex-grow border-t border-outline-variant/20" />
        <span className="flex-shrink mx-4 text-[10px] font-headline font-bold uppercase text-on-surface/30 tracking-widest">
          O accede con
        </span>
        <div className="flex-grow border-t border-outline-variant/20" />
      </div>

      <div className="flex justify-center flex-wrap gap-4 mb-2">
        {(['google', 'facebook', 'x'] as SocialProvider[]).map((provider) => (
          <button
            key={provider}
            type="button"
            className="w-12 h-12 flex rounded-md items-center justify-center border border-outline-variant/30 hover:border-secondary hover:bg-secondary/5 transition-all duration-300 group"
            aria-label={providerLabel(provider)}
            onClick={() => startSocialAuth(provider)}
          >
            <span className="text-on-surface/60 group-hover:text-secondary">{socialButtonIcon(provider)}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-30">
        <Image
          src="/images/decoracion_pop_8.jpg"
          alt="Decoración interior de POP"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 -z-20 bg-black/60" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-[#0D0D0D]/90 via-[#0D0D0D]/75 to-[#732817]/70" />
      <div className="absolute inset-0 z-0 particle-bg opacity-25 pointer-events-none" />

      <main className="relative z-10 min-h-screen w-full px-4 py-8 md:py-16 flex items-center justify-center">
        <section className="w-full max-w-lg animate-fade-in">
          <div className="flex flex-col items-center mb-10">
            <Image
              src="/images/logopop.png"
              alt="POP Perote Logo"
              width={180}
              height={180}
              className="mb-2 object-contain"
              priority
            />
          </div>

          <div className="glass-panel p-8 md:p-10 shadow-2xl relative overflow-hidden bg-surface/85 backdrop-blur-md rounded-2xl border border-outline-variant/20">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary-container/20 blur-3xl rounded-full" />

            {statusError && (
              <div className="mb-6 rounded-md border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {statusError}
              </div>
            )}
            {statusSuccess && (
              <div className="mb-6 rounded-md border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                {statusSuccess}
              </div>
            )}

            <div className="flex space-x-8 mb-10 border-b border-outline-variant/10">
              <button
                onClick={() => {
                  setStatusError(null);
                  setStatusSuccess(null);
                  setActiveTab('login');
                }}
                className={`font-headline font-bold text-sm uppercase tracking-widest pb-3 border-b-2 transition-all duration-300 ${activeTab === 'login' ? 'border-primary-container text-primary-container' : 'border-transparent text-on-surface/50 hover:text-on-surface'}`}
                type="button"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => {
                  setStatusError(null);
                  setStatusSuccess(null);
                  setActiveTab('register');
                }}
                className={`font-headline font-bold text-sm uppercase tracking-widest pb-3 border-b-2 transition-all duration-300 ${activeTab === 'register' ? 'border-primary-container text-primary-container' : 'border-transparent text-on-surface/50 hover:text-on-surface'}`}
                type="button"
              >
                Registrarse
              </button>
            </div>

            {activeTab === 'login' ? (
              <div id="login-form-container" className="animate-fade-in">
                <form className="space-y-6" onSubmit={handleLoginSubmit}>
                  <div>
                    <label className="block font-headline text-[10px] uppercase tracking-widest text-primary mb-2">
                      Email o Teléfono
                    </label>
                    <input
                      className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 focus:border-secondary transition-colors duration-300 placeholder-on-surface/20 text-on-surface"
                      placeholder="usuario@ejemplo.com"
                      type="text"
                      required
                      autoComplete="username"
                      value={loginForm.identifier}
                      onChange={(event) =>
                        setLoginForm((current) => ({
                          ...current,
                          identifier: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block font-headline text-[10px] uppercase tracking-widest text-primary mb-2">
                      Contraseña
                    </label>
                    <input
                      className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 focus:border-secondary transition-colors duration-300 placeholder-on-surface/20 text-on-surface"
                      placeholder="••••••••"
                      type="password"
                      required
                      autoComplete="current-password"
                      minLength={8}
                      maxLength={128}
                      value={loginForm.password}
                      onChange={(event) =>
                        setLoginForm((current) => ({
                          ...current,
                          password: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <a className="text-[11px] uppercase tracking-tighter font-bold text-secondary hover:text-primary transition-colors" href="#">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>

                  <button
                    className="w-full bg-primary-container hover:bg-primary-container/80 text-on-primary-container font-headline font-extrabold py-4 px-8 rounded-md flex justify-between items-center group transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={isSubmitting !== null}
                  >
                    <span className="uppercase tracking-widest text-sm">
                      {isSubmitting === 'login' ? 'VALIDANDO...' : 'INICIAR SESIÓN'}
                    </span>
                    <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
                  </button>
                </form>

                {socialButtons}

                <div className="text-center mt-6">
                  <p className="text-xs text-on-surface/60">
                    ¿No tienes cuenta?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('register')}
                      className="font-bold text-primary hover:underline underline-offset-4 decoration-primary/30"
                    >
                      Regístrate y gana 50 pts
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              <div id="register-form-container" className="animate-fade-in">
                <form className="space-y-5" onSubmit={handleRegisterSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-headline text-[10px] uppercase tracking-widest text-primary mb-1">
                        Nombre Completo
                      </label>
                      <input
                        className="w-full bg-transparent border-0 border-b border-outline-variant py-2 px-0 focus:ring-0 focus:border-secondary transition-colors duration-300 text-on-surface"
                        type="text"
                        required
                        maxLength={100}
                        autoComplete="name"
                        pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$"
                        title="Solo se permiten letras y espacios"
                        value={registerForm.name}
                        onChange={(event) =>
                          setRegisterForm((current) => ({
                            ...current,
                            name: event.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="block font-headline text-[10px] uppercase tracking-widest text-primary mb-1">
                        Teléfono
                      </label>
                      <input
                        className="w-full bg-transparent border-0 border-b border-outline-variant py-2 px-0 focus:ring-0 focus:border-secondary transition-colors duration-300 text-on-surface"
                        type="tel"
                        required
                        autoComplete="tel"
                        inputMode="numeric"
                        pattern="^[0-9]{10}$"
                        title="Ingresa un número de teléfono válido de 10 dígitos"
                        value={registerForm.phone}
                        onChange={(event) =>
                          setRegisterForm((current) => ({
                            ...current,
                            phone: event.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-headline text-[10px] uppercase tracking-widest text-primary mb-1">Email</label>
                    <input
                      className="w-full bg-transparent border-0 border-b border-outline-variant py-2 px-0 focus:ring-0 focus:border-secondary transition-colors duration-300 text-on-surface"
                      type="email"
                      required
                      autoComplete="email"
                      maxLength={150}
                      value={registerForm.email}
                      onChange={(event) =>
                        setRegisterForm((current) => ({
                          ...current,
                          email: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-headline text-[10px] uppercase tracking-widest text-primary mb-1">
                        Fecha Nacimiento
                      </label>
                      <input
                        className="w-full bg-transparent border-0 border-b border-outline-variant py-2 px-0 focus:ring-0 focus:border-secondary transition-colors duration-300 text-on-surface"
                        type="date"
                        max={new Date().toISOString().split('T')[0]}
                        value={registerForm.birthDate}
                        onChange={(event) =>
                          setRegisterForm((current) => ({
                            ...current,
                            birthDate: event.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="block font-headline text-[10px] uppercase tracking-widest text-primary mb-1">
                        Contraseña
                      </label>
                      <input
                        className="w-full bg-transparent border-0 border-b border-outline-variant py-2 px-0 focus:ring-0 focus:border-secondary transition-colors duration-300 text-on-surface"
                        type="password"
                        required
                        autoComplete="new-password"
                        minLength={8}
                        maxLength={128}
                        value={registerForm.password}
                        onChange={(event) =>
                          setRegisterForm((current) => ({
                            ...current,
                            password: event.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-headline text-[10px] uppercase tracking-widest text-primary mb-1">
                      Confirmar Contraseña
                    </label>
                    <input
                      className="w-full bg-transparent border-0 border-b border-outline-variant py-2 px-0 focus:ring-0 focus:border-secondary transition-colors duration-300 text-on-surface"
                      type="password"
                      required
                      autoComplete="new-password"
                      minLength={8}
                      maxLength={128}
                      value={registerForm.passwordConfirmation}
                      onChange={(event) =>
                        setRegisterForm((current) => ({
                          ...current,
                          passwordConfirmation: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block font-headline text-[10px] uppercase tracking-widest text-primary mb-1">
                      ¿Cómo nos conociste?
                    </label>
                    <select
                      className="w-full bg-transparent border-0 border-b border-outline-variant py-2 px-0 focus:ring-0 focus:border-secondary transition-colors duration-300 text-on-surface/60"
                      value={registerForm.referralSource}
                      onChange={(event) =>
                        setRegisterForm((current) => ({
                          ...current,
                          referralSource: event.target.value,
                        }))
                      }
                    >
                      <option className="bg-surface text-on-surface" value="">Selecciona una opción</option>
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
                        checked={registerForm.termsAccepted}
                        onChange={(event) =>
                          setRegisterForm((current) => ({
                            ...current,
                            termsAccepted: event.target.checked,
                          }))
                        }
                      />
                    </div>
                    <label className="text-[10px] text-on-surface/60 leading-tight" htmlFor="terms">
                      Acepto los Términos y Condiciones y la Política de Privacidad de POP.
                    </label>
                  </div>

                  <button
                    className="w-full bg-primary-container hover:bg-primary-container/80 text-on-primary-container font-headline font-extrabold py-4 px-8 rounded-md flex justify-between items-center group transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={isSubmitting !== null}
                  >
                    <span className="uppercase tracking-widest text-[11px] md:text-sm">
                      {isSubmitting === 'register' ? 'CREANDO...' : 'CREAR MI CUENTA'}
                    </span>
                    <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">celebration</span>
                  </button>
                </form>

                {socialButtons}

                <div className="text-center mt-6">
                  <p className="text-xs text-on-surface/60">
                    ¿Ya tienes cuenta?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="font-bold text-primary hover:underline underline-offset-4 decoration-primary/30"
                    >
                      Inicia sesión
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 text-center flex justify-center">
            <Link href="/" className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-on-surface/40 hover:text-secondary transition-colors">
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              <span>Volver al inicio</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
