/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, FormEvent } from 'react';

export default function Ubicacion() {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [personas, setPersonas] = useState(2);
  const [notas, setNotas] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const mensaje = `Hola POP Perote, quiero hacer una reservación para ${personas} personas el ${fecha} a las ${hora}.\nNombre: ${nombre}\nTeléfono: ${telefono}\nNotas: ${notas || 'Ninguna'}`;

    window.open(
      `https://wa.me/522828253243?text=${encodeURIComponent(mensaje)}`,
      '_blank',
      'noopener,noreferrer'
    );

    setNombre('');
    setTelefono('');
    setFecha('');
    setHora('');
    setPersonas(2);
    setNotas('');
  };

  const decrementPersonas = () => {
    setPersonas((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const incrementPersonas = () => {
    setPersonas((prev) => prev + 1);
  };

  return (
    <>

      {/*  TopNavBar (Large)  */}

      <main className="editorial-gradient pt-20">
        {/*  Hero Section  */}
        <section className="relative h-[716px] w-full overflow-hidden">
          <img alt="Restaurant Exterior" className="w-full h-full object-cover grayscale-[20%] brightness-50" data-alt="Cinematic wide shot of a modern restaurant exterior with warm golden window lighting at night, architectural sharp lines against a dark sky." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4Fx1qpkKZ8VNcQeI_KypGcSo2duMkadMEe_Qu-Tjl0kHTJ8TQc8NYTCrCh24iOhwk1saa-q3FBLyXB08jgxKrA3cGOWJvmNS67VfN-mEcYU68CrT1xJiaC7h8CkqTfj7i51cLT0FMT0YJlrQqTBL7tA6PS0LQR1rC6rY0PcPutyvFRchC2dAcfp2WrzwbZdUg4eifE1u-giKY7u2GWbrk2XtQfVpL1ADFkoy_llkHA9m-sy-adYySqXUC7c2vCVJBaB3rqxImJDSw"/>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="font-headline text-5xl md:text-8xl font-black text-secondary tracking-tighter mb-4">
              ENCUÉNTRANOS 📍
            </h1>
            <p className="font-body text-lg md:text-xl text-on-surface/80 max-w-2xl font-light uppercase tracking-[0.2em]">
              Gastronomía de Autor en el Corazón de Perote
            </p>
          </div>
        </section>
        {/*  Location & Contact Grid  */}
        <section className="max-w-7xl mx-auto px-6 -mt-32 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/*  Custom Styled Map Placeholder  */}
          <div className="lg:col-span-8 h-[600px] bg-surface-container-low rounded-lg overflow-hidden relative group">
            <div className="absolute inset-0 bg-[#131313] opacity-40 mix-blend-color"></div>
            <iframe allowFullScreen className="w-full h-full grayscale invert brightness-90 contrast-125" data-location="POP Perote" loading="lazy" src="https://maps.google.com/maps?q=POP+Perote,+Justo+Sierra+No.+11,+Col.+Amado+Nervo,+Perote,+Veracruz&t=&z=16&ie=UTF8&iwloc=&output=embed"></iframe>
            <div className="absolute bottom-6 left-6 glass-panel p-6 max-w-sm rounded-lg border-l-4 border-primary">
              <span className="inline-block bg-green-900/30 text-green-400 text-[10px] font-black px-2 py-1 rounded mb-3 tracking-widest uppercase">ABIERTO AHORA</span>
              <h3 className="font-headline text-xl font-bold text-on-surface mb-2">Justo Sierra No. 11</h3>
              <p className="text-on-surface/60 text-sm leading-relaxed">Col. Amado Nervo, Perote, Veracruz.<br/>C.P. 91270</p>
            </div>
          </div>
          {/*  Contact Detail Card  */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="glass-panel p-8 rounded-lg flex flex-col h-full border-t-2 border-secondary/20">
              <div className="mb-10">
                <span className="text-secondary font-headline text-xs font-black tracking-widest uppercase mb-4 block">Contacto Directo</span>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface/40 uppercase font-bold tracking-tighter">Teléfono</p>
                    <p className="text-xl font-headline font-bold text-on-surface tabular-nums">282-825-32-43</p>
                  </div>
                </div>
              </div>
              <div>
                <span className="text-secondary font-headline text-xs font-black tracking-widest uppercase mb-6 block">Horarios de Servicio</span>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-on-surface/5 pb-2">
                    <span className="text-sm font-medium text-on-surface/80">Lun - Jue</span>
                    <span className="text-sm font-bold text-on-surface tabular-nums">14:00 - 21:30</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-on-surface/5 pb-2">
                    <span className="text-sm font-medium text-on-surface/80">Vie - Sab</span>
                    <span className="text-sm font-bold text-primary tabular-nums">14:00 - 22:00</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-on-surface/5 pb-2">
                    <span className="text-sm font-medium text-on-surface/80">Domingo</span>
                    <span className="text-sm font-bold text-on-surface tabular-nums">14:00 - 21:00</span>
                  </div>
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-sm font-medium text-on-surface/80">Martes</span>
                    <span className="text-sm font-bold text-error tabular-nums">Cerrado</span>
                  </div>
                </div>
              </div>
              <div className="mt-auto pt-10">
                <p className="text-[10px] text-on-surface/30 uppercase leading-relaxed font-bold">
                  * Los horarios pueden variar en días festivos. Recomendamos reservar con antelación para grupos mayores a 6 personas.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/*  Quick Actions Grid  */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a className="group relative overflow-hidden bg-primary p-8 flex flex-col justify-between h-48 transition-all duration-500 hover:-translate-y-2" href="https://www.google.com/maps/dir/?api=1&destination=POP+Perote,+Justo+Sierra+No.+11,+Col.+Amado+Nervo,+Perote,+Veracruz" target="_blank" rel="noopener noreferrer">
              <span className="material-symbols-outlined text-4xl text-on-primary">explore</span>
              <div>
                <h4 className="font-headline text-2xl font-black text-on-primary tracking-tight">CÓMO LLEGAR</h4>
                <p className="text-on-primary/70 text-sm font-bold uppercase tracking-widest mt-1">Abrir Maps</p>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-[120px] text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
              </div>
            </a>
            <a className="group relative overflow-hidden bg-surface-container-high p-8 flex flex-col justify-between h-48 transition-all duration-500 hover:-translate-y-2 border border-secondary/10" href="https://wa.me/522828253243" target="_blank" rel="noopener noreferrer">
              <span className="material-symbols-outlined text-4xl text-secondary">chat_bubble</span>
              <div>
                <h4 className="font-headline text-2xl font-black text-on-surface tracking-tight">WHATSAPP</h4>
                <p className="text-secondary text-sm font-bold uppercase tracking-widest mt-1">Chat Directo</p>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-[120px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
              </div>
            </a>
            <a className="group relative overflow-hidden bg-surface-container-low p-8 flex flex-col justify-between h-48 transition-all duration-500 hover:-translate-y-2 border border-on-surface/5" href="tel:2828253243">
              <span className="material-symbols-outlined text-4xl text-on-surface">call</span>
              <div>
                <h4 className="font-headline text-2xl font-black text-on-surface tracking-tight">LLAMAR</h4>
                <p className="text-on-surface/50 text-sm font-bold uppercase tracking-widest mt-1">Iniciar Llamada</p>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-[120px] text-on-surface" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
              </div>
            </a>
          </div>
        </section>
        {/*  Reservation & Gallery Split  */}
        <section className="bg-surface-container-lowest py-24">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            {/*  Reservation Form  */}
            <div>
              <h2 className="font-headline text-4xl font-black text-secondary tracking-tighter mb-4 uppercase">SOLICITAR RESERVACIÓN</h2>
              <p className="text-on-surface/60 mb-12 max-w-md">Vive la experiencia POP PEROTE. Asegura tu mesa para una velada inolvidable de sabores y juegos.</p>
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative">
                    <input className="w-full bg-transparent border-0 border-b border-outline-variant py-4 focus:ring-0 focus:border-secondary transition-all text-on-surface placeholder:text-on-surface/30" placeholder="Nombre Completo" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                  </div>
                  <div className="relative">
                    <input className="w-full bg-transparent border-0 border-b border-outline-variant py-4 focus:ring-0 focus:border-secondary transition-all text-on-surface placeholder:text-on-surface/30" placeholder="Teléfono" type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="relative">
                    <input className="w-full bg-transparent border-0 border-b border-outline-variant py-4 focus:ring-0 focus:border-secondary transition-all text-on-surface" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
                  </div>
                  <div className="relative">
                    <input className="w-full bg-transparent border-0 border-b border-outline-variant py-4 focus:ring-0 focus:border-secondary transition-all text-on-surface" type="time" value={hora} onChange={(e) => setHora(e.target.value)} required />
                  </div>
                  <div className="relative flex items-center justify-between border-b border-outline-variant py-2">
                    <span className="text-on-surface/50 text-sm uppercase font-bold">Personas</span>
                    <div className="flex items-center gap-4">
                      <button className="text-secondary" type="button" onClick={decrementPersonas}><span className="material-symbols-outlined">remove_circle</span></button>
                      <span className="font-headline font-bold text-xl tabular-nums">{personas}</span>
                      <button className="text-secondary" type="button" onClick={incrementPersonas}><span className="material-symbols-outlined">add_circle</span></button>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <textarea className="w-full bg-transparent border-0 border-b border-outline-variant py-4 focus:ring-0 focus:border-secondary transition-all text-on-surface placeholder:text-on-surface/30 resize-none" placeholder="Notas especiales (Alergias, cumpleaños...)" rows={3} value={notas} onChange={(e) => setNotas(e.target.value)}></textarea>
                </div>
                <button className="w-full bg-primary-container text-on-primary-container font-headline font-black py-6 tracking-widest uppercase transition-all duration-500 hover:brightness-110 hover:tracking-[0.2em] transform active:scale-95" type="submit">
                  SOLICITAR RESERVACIÓN
                </button>
              </form>
            </div>
            {/*  Gallery Grid  */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-64 overflow-hidden rounded-lg">
                  <img alt="Family vibe interior" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" data-alt="Interior of a cozy restaurant with wooden furniture, warm lighting, and a group of friends laughing and sharing food." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgulHwpNpQkM6OnaDTmJ7uOD2uBSoiTPIA5RnEsQhzsuM_sVjO4y1hAXCv27po4WnRNu9aUaBZu9zaFKwZ8VERS5xK3YOv6Q1UDwUhz-JrOw0kZQbYkK_rXiEBis1w52pJssxuwpVGBXtDnn-Mgq141f1GADfPYoP2NXUWOghSAGbVP3paXUvbWEEelQvgYt0e0zaAOkshIUZchgII2KowXWcDRkPHwemkvmYlNsjaAHoWmb7q_1BpSb2rytHJ5X7A5my4uOq1jbXO" onError={(e) => { e.currentTarget.src = '/images/logopop.png'; }} />
                </div>
                <div className="h-80 overflow-hidden rounded-lg">
                  <img alt="Board games section" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" data-alt="Close-up of vintage wooden board games stacked on a shelf in a luxury restaurant lounge with soft ambient lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjYReTY_dG03oI-w4S_upSAZX-VJDHdFdcq0iXelLTyO-gfdvw6_ph3AAduvtYQ6EyynBJ9w5Q-55qLRsAlrFEh4_vvffBfAhQe-ymlNy-NtLblFkv0cwIbrSkOPmcfzwlGCUsVoE1fx1OQBzaryHw1m-2beu9XwtnloWoP7IIoCSmw2hMmXowkWdQWnE8wFKjGoJZdBMfXv-wCdd76wiJz-8ITLl7075IUW1a9T3U9b1FKJQTaHnNT6rf8uywOLw5xirpQ96ymsyy" onError={(e) => { e.currentTarget.src = '/images/logopop.png'; }} />
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="h-80 overflow-hidden rounded-lg">
                  <img alt="Artisan kitchen view" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" data-alt="Open kitchen view with a chef preparing artisanal dishes under warm spotlights, cinematic high contrast food photography." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_mBl-Cy_WYoabSLruiGwT4Cgug4-B-zI_dSHz1-1ryfMqA4S7C12GaLLf3DZpAq6pTxd-CJxep_5lHLiY7MEWLYgGwLw-aABKkVcUjkRhznJHdSly9D73nHkoaQjCniNa4iPCdmUITaCZ71UKZTPPA84hLhNmFnANVFBNGfVtVgkiThvuDnFWYWYG9i76KU6f6a8rcF5WReIQEFofIexTj60j0433jdnj43Bpp2GniMRRIg3NGEZANsod6xqV7GPwRLFTvrBH2Men" onError={(e) => { e.currentTarget.src = '/images/logopop.png'; }} />
                </div>
                <div className="h-64 overflow-hidden rounded-lg">
                  <img alt="Cozy corner" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" data-alt="A cozy corner of a restaurant with velvet armchairs, a marble table, and a single cocktail reflecting golden light." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYPD5iJQhSg4KOhyKFFDjnnfzAjq3pb8ZvAxNwCsph4FmMzC55OYb-QVbKh-hB0VP3KWRxsj3rN6sFkZkHzf2NZGvRKrreL8mnw_kdH9B1_AwXqUIqvQ36JED1hIPVUSCQYDN8iBWC7L-nkvxlcOfDhik-w9o6zAimBizcoyJfRZn_0nrrnA4WzFekWtNOJlUz-Nht1urr9ECDgfbwHGnrff5dsivkclQRZq3pF_4mEQWsBufSaImqyaWAK5XwMaA_kTrFT64Dz19J" onError={(e) => { e.currentTarget.src = '/images/logopop.png'; }} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/*  Footer  */}

      {/*  BottomNavBar (Mobile)  */}


    </>
  );
}
