import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aviso de Privacidad | POP Perote',
  description: 'Aviso de Privacidad de POP Perote conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.',
};

const LAST_UPDATE = '31 de mayo de 2026';

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-[#0D0D0D] pt-24 pb-32">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#F2C777]/60 mb-4 block">Legal</span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white leading-none mb-4">
            Aviso de <span className="text-[#F2C777]">Privacidad</span>
          </h1>
          <p className="text-white/40 text-sm">Última actualización: {LAST_UPDATE}</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-10 text-white/70 leading-relaxed">

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">I. Identidad y Domicilio del Responsable</h2>
            <p>
              <strong className="text-white">POP Perote Gastronomic Editorial</strong> (en adelante "POP Perote" o el "Responsable"), con domicilio en <strong className="text-white">Justo Sierra No. 11, Colonia Amado Nervo, Perote, Veracruz, C.P. 91270, México</strong>, es responsable del tratamiento de sus datos personales conforme a lo establecido en la <em>Ley Federal de Protección de Datos Personales en Posesión de los Particulares</em> (LFPDPPP) y su Reglamento.
            </p>
            <p>Contacto para asuntos de privacidad: <a href="mailto:privacidad@popgastropub.com" className="text-[#F2C777] hover:underline">privacidad@popgastropub.com</a></p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">II. Datos Personales que Recabamos</h2>
            <p>Para las finalidades descritas en este aviso, recabamos las siguientes categorías de datos personales:</p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li><strong className="text-white">Identificación:</strong> nombre completo, correo electrónico, número de teléfono.</li>
              <li><strong className="text-white">Fiscales (solo para facturación):</strong> RFC, Razón Social, Régimen Fiscal, Uso de CFDI, Código Postal.</li>
              <li><strong className="text-white">Reservaciones:</strong> nombre, teléfono, fecha, hora y número de personas.</li>
              <li><strong className="text-white">Programa de lealtad:</strong> historial de visitas, puntos acumulados, nivel de membresía.</li>
              <li><strong className="text-white">Técnicos:</strong> dirección IP, tipo de navegador, páginas visitadas (mediante cookies).</li>
            </ul>
            <p className="mt-3">No recabamos datos personales sensibles en los términos del artículo 3, fracción VI de la LFPDPPP.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">III. Finalidades del Tratamiento</h2>
            <p><strong className="text-white">Finalidades primarias (necesarias para la relación jurídica):</strong></p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Gestionar su cuenta de usuario y programa de lealtad POP Points.</li>
              <li>Procesar y confirmar reservaciones en el restaurante.</li>
              <li>Emitir comprobantes fiscales digitales (CFDI 4.0) cuando sean solicitados.</li>
              <li>Atender solicitudes, quejas y aclaraciones.</li>
            </ul>
            <p className="mt-4"><strong className="text-white">Finalidades secundarias (puede oponerse):</strong></p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Envío de promociones, ofertas y novedades del restaurante.</li>
              <li>Encuestas de satisfacción y mejora del servicio.</li>
              <li>Análisis estadístico de uso de la plataforma.</li>
            </ul>
            <p className="mt-3">Si no desea que sus datos sean tratados para las finalidades secundarias, puede manifestarlo enviando un correo a <a href="mailto:privacidad@popgastropub.com" className="text-[#F2C777] hover:underline">privacidad@popgastropub.com</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">IV. Transferencias de Datos</h2>
            <p>Sus datos personales podrán ser transferidos a:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong className="text-white">Proveedor Autorizado de Certificación (PAC):</strong> exclusivamente para la emisión de CFDI, conforme al artículo 37, fracción I de la LFPDPPP (transferencia necesaria para el cumplimiento de obligaciones legales).</li>
              <li><strong className="text-white">Autoridades competentes:</strong> cuando sea requerido por ley, resolución judicial o autoridad administrativa.</li>
            </ul>
            <p className="mt-3">No realizamos transferencias de datos a terceros con fines comerciales sin su consentimiento previo.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">V. Derechos ARCO</h2>
            <p>Usted tiene derecho a <strong className="text-white">Acceder, Rectificar, Cancelar u Oponerse</strong> al tratamiento de sus datos personales (derechos ARCO), así como a revocar el consentimiento otorgado.</p>
            <p className="mt-3">Para ejercer sus derechos, envíe una solicitud a <a href="mailto:privacidad@popgastropub.com" className="text-[#F2C777] hover:underline">privacidad@popgastropub.com</a> con:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Nombre completo y correo electrónico registrado.</li>
              <li>Descripción clara del derecho que desea ejercer.</li>
              <li>Copia de identificación oficial.</li>
            </ul>
            <p className="mt-3">Responderemos en un plazo máximo de <strong className="text-white">20 días hábiles</strong> conforme al artículo 32 de la LFPDPPP.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">VI. Uso de Cookies y Tecnologías de Rastreo</h2>
            <p>Nuestro sitio web utiliza cookies de sesión y persistentes para:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Mantener su sesión activa (cookies de autenticación).</li>
              <li>Recordar sus preferencias de navegación.</li>
              <li>Analizar el tráfico del sitio (Google Analytics 4).</li>
            </ul>
            <p className="mt-3">Puede deshabilitar las cookies desde la configuración de su navegador, aunque esto puede afectar la funcionalidad del sitio.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">VII. Seguridad de los Datos</h2>
            <p>Implementamos medidas de seguridad administrativas, técnicas y físicas para proteger sus datos personales contra daño, pérdida, alteración, destrucción o uso no autorizado, conforme al artículo 19 de la LFPDPPP. Las contraseñas se almacenan con hash bcrypt y las comunicaciones se realizan mediante HTTPS/TLS.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">VIII. Cambios al Aviso de Privacidad</h2>
            <p>Nos reservamos el derecho de modificar este aviso en cualquier momento. Los cambios serán notificados a través de nuestra plataforma web en <a href="https://popgastropub.com/privacidad" className="text-[#F2C777] hover:underline">popgastropub.com/privacidad</a>. El uso continuado de nuestros servicios implica la aceptación de las modificaciones.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">IX. INAI</h2>
            <p>Si considera que su derecho a la protección de datos personales ha sido vulnerado, puede acudir al <strong className="text-white">Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales (INAI)</strong>, con domicilio en Insurgentes Sur 3211, Col. Insurgentes Cuicuilco, Alcaldía Coyoacán, C.P. 04530, Ciudad de México. Sitio web: <a href="https://www.inai.org.mx" target="_blank" rel="noopener noreferrer" className="text-[#F2C777] hover:underline">www.inai.org.mx</a>.</p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start gap-4">
          <p className="text-white/30 text-xs">© 2026 POP Perote Gastronomic Editorial. Perote, Veracruz, México.</p>
          <a href="/terminos" className="text-[#F2C777] text-xs hover:underline">Ver Términos y Condiciones →</a>
        </div>
      </div>
    </main>
  );
}
