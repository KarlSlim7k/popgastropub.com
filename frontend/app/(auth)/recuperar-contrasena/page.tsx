"use client";

import React, { FormEvent, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchAPI, APIError } from '@/lib/api';
import PasswordInput from '@/components/ui/PasswordInput';

type Step = 'email' | 'code';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }
  return 'No fue posible completar la solicitud. Intenta de nuevo.';
}

export default function RecuperarContrasena() {
  const [step, setStep] = useState<Step>('email');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [statusSuccess, setStatusSuccess] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  async function handleSendCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusError(null);
    setStatusSuccess(null);
    setIsSubmitting(true);

    try {
      await fetchAPI('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      setStatusSuccess('Revisa tu correo. Te enviamos un código de 6 dígitos.');
      setStep('code');
    } catch (error) {
      if (error instanceof APIError) {
        setStatusError(error.message);
      } else {
        setStatusError(getErrorMessage(error));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusError(null);
    setStatusSuccess(null);

    if (password !== passwordConfirmation) {
      setStatusError('Las contraseñas no coinciden.');
      return;
    }

    setIsSubmitting(true);

    try {
      await fetchAPI('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: code.trim(),
          password,
          password_confirmation: passwordConfirmation,
        }),
      });
      setStatusSuccess('Contraseña restablecida correctamente. Redirigiendo al login...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2500);
    } catch (error) {
      if (error instanceof APIError) {
        setStatusError(error.message);
      } else {
        setStatusError(getErrorMessage(error));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCodeChange(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 6);
    setCode(digits);
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-30">
        <Image
          src="/images/decoracion_pop_8.webp"
          alt="Decoración interior de POP"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 -z-20 bg-black/60" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-[#234032]/90 via-[#234032]/75 to-[#732B1A]/70" />
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

            <div className="mb-8">
              <h1 className="font-headline font-bold text-lg uppercase tracking-widest text-primary-container mb-2">
                Recuperar Contraseña
              </h1>
              <p className="text-xs text-on-surface/60 leading-relaxed">
                {step === 'email'
                  ? 'Ingresa tu correo electrónico y te enviaremos un código para restablecer tu contraseña.'
                  : `Ingresa el código de 6 dígitos que enviamos a ${email}`}
              </p>
            </div>

            {step === 'email' ? (
              <form className="space-y-6 animate-fade-in" onSubmit={handleSendCode}>
                <div>
                  <label className="block font-headline text-[10px] uppercase tracking-widest text-primary mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 focus:border-secondary transition-colors duration-300 placeholder-on-surface/20 text-on-surface"
                    placeholder="tucorreo@ejemplo.com"
                    type="email"
                    required
                    autoComplete="email"
                    maxLength={150}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <button
                  className="w-full bg-primary-container hover:bg-primary-container/80 text-on-primary-container font-headline font-extrabold py-4 px-8 rounded-md flex justify-between items-center group transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={isSubmitting}
                >
                  <span className="uppercase tracking-widest text-sm">
                    {isSubmitting ? 'ENVIANDO...' : 'ENVIAR CÓDIGO'}
                  </span>
                  <span className="material-symbols-outlined text-white group-hover:translate-x-2 transition-transform">mail</span>
                </button>
              </form>
            ) : (
              <form className="space-y-6 animate-fade-in" onSubmit={handleResetPassword}>
                <div>
                  <label className="block font-headline text-[10px] uppercase tracking-widest text-primary mb-2">
                    Código de 6 Dígitos
                  </label>
                  <input
                    className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 focus:border-secondary transition-colors duration-300 placeholder-on-surface/20 text-on-surface text-center text-2xl tracking-[0.5em] font-mono font-bold"
                    placeholder="000000"
                    type="text"
                    inputMode="numeric"
                    required
                    maxLength={6}
                    value={code}
                    onChange={(e) => handleCodeChange(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-headline text-[10px] uppercase tracking-widest text-primary mb-2">
                    Nueva Contraseña
                  </label>
                  <PasswordInput
                    className="w-full bg-transparent border-0 border-b border-outline-variant py-3 pr-9 pl-0 focus:ring-0 focus:border-secondary transition-colors duration-300 placeholder-on-surface/20 text-on-surface"
                    placeholder="Mínimo 8 caracteres"
                    required
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={128}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-headline text-[10px] uppercase tracking-widest text-primary mb-2">
                    Confirmar Contraseña
                  </label>
                  <PasswordInput
                    className="w-full bg-transparent border-0 border-b border-outline-variant py-3 pr-9 pl-0 focus:ring-0 focus:border-secondary transition-colors duration-300 placeholder-on-surface/20 text-on-surface"
                    placeholder="Repite tu contraseña"
                    required
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={128}
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                  />
                </div>

                <button
                  className="w-full bg-primary-container hover:bg-primary-container/80 text-on-primary-container font-headline font-extrabold py-4 px-8 rounded-md flex justify-between items-center group transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={isSubmitting || code.length !== 6}
                >
                  <span className="uppercase tracking-widest text-sm">
                    {isSubmitting ? 'RESTABLECIENDO...' : 'RESTABLECER CONTRASEÑA'}
                  </span>
                  <span className="material-symbols-outlined text-white group-hover:translate-x-2 transition-transform">lock_reset</span>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    className="text-[11px] uppercase tracking-tighter font-bold text-secondary hover:text-primary transition-colors"
                    onClick={() => {
                      setStep('email');
                      setCode('');
                      setPassword('');
                      setPasswordConfirmation('');
                      setStatusError(null);
                      setStatusSuccess(null);
                    }}
                  >
                    ¿No recibiste el código? Reenviar
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="mt-8 text-center flex justify-center">
            <Link href="/login" className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-on-surface/40 hover:text-secondary transition-colors">
              <span className="material-symbols-outlined text-lg text-on-surface/40">arrow_back</span>
              <span>Volver al login</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
