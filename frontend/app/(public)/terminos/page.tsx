import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y Condiciones | POP Perote',
  description: 'Términos y Condiciones de uso de la plataforma POP Perote y del programa de lealtad POP Points.',
};

const LAST_UPDATE = '31 de mayo de 2026';

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-[#0D0D0D] pt-24 pb-32">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#F2C777]/60 mb-4 block">Legal</span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white leading-none mb-4">
            Términos y <span className="text-[#F2C777]">Condiciones</span>
          </h1>
          <p className="text-white/40 text-sm">Última actualización: {LAST_UPDATE}</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-10 text-white/70 leading-relaxed">

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">I. Aceptación</h2>
            <p>
              Al acceder y utilizar la plataforma web de <strong className="text-white">POP Perote Gastronomic Editorial</strong> (en adelante "POP Perote"), ubicado en <strong className="text-white">Justo Sierra No. 11, Col. Amado Nervo, Perote, Veracruz, C.P. 91270, México</strong>, usted acepta quedar vinculado por los presentes Términos y Condiciones, así como por nuestra <a href="/privacidad" className="text-[#F2C777] hover:underline">Política de Privacidad</a>. Si no está de acuerdo, le pedimos abstenerse de usar nuestros servicios.
            </p>
            <p className="mt-3">Estos términos se rigen por la legislación mexicana vigente, incluyendo el <em>Código de Comercio</em>, la <em>Ley Federal de Protección al Consumidor (LFPC)</em>, la <em>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</em> y el <em>Código Civil Federal</em>.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">II. Servicios Ofrecidos</h2>
            <p>A través de nuestra plataforma ofrecemos:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Información sobre el restaurante, menú, horarios y ubicación.</li>
              <li>Programa de lealtad <strong className="text-white">POP Points</strong>.</li>
              <li>Solicitud de reservaciones de mesa.</li>
              <li>Solicitud de comprobantes fiscales digitales (CFDI 4.0).</li>
              <li>Acceso a promociones y ofertas vigentes.</li>
            </ul>
            <p className="mt-3">Los pedidos de alimentos se procesan a través de la plataforma <strong className="text-white">FoodBooking</strong>, sujeta a sus propios términos y condiciones.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">III. Registro de Cuenta</h2>
            <p>Para acceder a funciones como POP Points, historial de reservaciones y facturación, deberá crear una cuenta proporcionando información veraz y actualizada. Usted es responsable de:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Mantener la confidencialidad de sus credenciales de acceso.</li>
              <li>Todas las actividades realizadas bajo su cuenta.</li>
              <li>Notificarnos de inmediato ante cualquier uso no autorizado.</li>
            </ul>
            <p className="mt-3">POP Perote se reserva el derecho de suspender o cancelar cuentas que incumplan estos términos, sin responsabilidad alguna.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">IV. Programa POP Points</h2>
            <p>El programa de lealtad POP Points está sujeto a las siguientes condiciones:</p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li>Los puntos no tienen valor monetario, no son transferibles, no son canjeables por efectivo y no constituyen un título de crédito.</li>
              <li>POP Perote se reserva el derecho de modificar, suspender o cancelar el programa en cualquier momento, notificando con al menos <strong className="text-white">15 días naturales</strong> de anticipación a través de la plataforma.</li>
              <li>Los puntos acumulados tienen una vigencia de <strong className="text-white">12 meses</strong> a partir de la última transacción activa. La inactividad por más de 12 meses resultará en la cancelación del saldo.</li>
              <li>El canje de puntos está sujeto a disponibilidad y a las condiciones específicas de cada recompensa.</li>
              <li>POP Perote se reserva el derecho de anular puntos obtenidos de forma fraudulenta o en violación de estos términos.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">V. Reservaciones</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Las reservaciones están sujetas a disponibilidad y se confirman por WhatsApp o a través de la plataforma.</li>
              <li>El restaurante permanece cerrado los <strong className="text-white">martes</strong>. Las reservaciones para ese día serán rechazadas automáticamente.</li>
              <li>Para grupos mayores a 10 personas se requiere confirmación directa vía WhatsApp al <strong className="text-white">282-825-32-43</strong>.</li>
              <li>POP Perote se reserva el derecho de cancelar reservaciones en caso de fuerza mayor, notificando al cliente con la mayor anticipación posible.</li>
              <li>La no presentación sin aviso previo de al menos <strong className="text-white">2 horas</strong> podrá resultar en la cancelación de la reservación sin responsabilidad para el restaurante.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">VI. Facturación CFDI</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Las facturas se emiten conforme al <strong className="text-white">CFDI 4.0</strong>, única versión válida desde el 1 de abril de 2023 según el SAT.</li>
              <li>La solicitud de factura debe realizarse <strong className="text-white">dentro del mes calendario</strong> en que se efectuó el consumo. No se emiten facturas de meses anteriores.</li>
              <li>El RFC y Razón Social proporcionados deben coincidir exactamente con los registros del SAT. POP Perote no se hace responsable por datos fiscales incorrectos proporcionados por el cliente.</li>
              <li>El tiempo de respuesta es de hasta <strong className="text-white">24 horas hábiles</strong>. En periodos de alta demanda (cierre de mes) puede extenderse hasta 48 horas.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">VII. Precios y Pagos</h2>
            <p>Todos los precios publicados están expresados en <strong className="text-white">pesos mexicanos (MXN)</strong> e incluyen el Impuesto al Valor Agregado (IVA) conforme a la legislación fiscal vigente. POP Perote se reserva el derecho de modificar precios sin previo aviso, siendo aplicables los precios vigentes al momento de la orden.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">VIII. Propiedad Intelectual</h2>
            <p>Todos los contenidos de esta plataforma — incluyendo logotipos, imágenes, textos, diseño y código — son propiedad de POP Perote o de sus licenciantes y están protegidos por la <em>Ley Federal del Derecho de Autor</em> y la <em>Ley de la Propiedad Industrial</em>. Queda prohibida su reproducción, distribución o uso comercial sin autorización escrita previa.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">IX. Limitación de Responsabilidad</h2>
            <p>POP Perote no será responsable por:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Interrupciones del servicio por mantenimiento, fallas técnicas o causas de fuerza mayor.</li>
              <li>Daños derivados del uso incorrecto de la plataforma por parte del usuario.</li>
              <li>Contenido de sitios web de terceros enlazados desde nuestra plataforma.</li>
              <li>Pérdida de datos por causas ajenas a nuestra voluntad.</li>
            </ul>
            <p className="mt-3">En ningún caso la responsabilidad de POP Perote excederá el monto pagado por el usuario en la transacción que originó el reclamo, conforme al artículo 1796 del Código Civil Federal.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">X. Conducta del Usuario</h2>
            <p>El usuario se compromete a no utilizar la plataforma para:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Actividades ilícitas o contrarias a la moral y buenas costumbres.</li>
              <li>Suplantar la identidad de terceros.</li>
              <li>Introducir virus, malware o cualquier código dañino.</li>
              <li>Realizar reservaciones o solicitudes de forma fraudulenta.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">XI. Modificaciones</h2>
            <p>POP Perote se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Las modificaciones entrarán en vigor a partir de su publicación en la plataforma. El uso continuado de los servicios implica la aceptación de los términos actualizados.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">XII. Jurisdicción y Ley Aplicable</h2>
            <p>Para la interpretación y cumplimiento de estos Términos y Condiciones, las partes se someten expresamente a las leyes de los <strong className="text-white">Estados Unidos Mexicanos</strong> y a la jurisdicción de los tribunales competentes de <strong className="text-white">Xalapa, Veracruz</strong>, renunciando a cualquier otro fuero que pudiera corresponderles por razón de su domicilio presente o futuro.</p>
            <p className="mt-3">Para controversias de consumo, el usuario también puede acudir a la <strong className="text-white">Procuraduría Federal del Consumidor (PROFECO)</strong>: <a href="https://www.gob.mx/profeco" target="_blank" rel="noopener noreferrer" className="text-[#F2C777] hover:underline">www.gob.mx/profeco</a> o al teléfono <strong className="text-white">800 468 8722</strong>.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">XIII. Contacto</h2>
            <p>Para cualquier duda o aclaración sobre estos términos:</p>
            <ul className="list-none space-y-1 mt-2">
              <li>📧 <a href="mailto:contacto@popgastropub.com" className="text-[#F2C777] hover:underline">contacto@popgastropub.com</a></li>
              <li>📞 <a href="tel:2828253243" className="text-[#F2C777] hover:underline">282-825-32-43</a></li>
              <li>📍 Justo Sierra No. 11, Col. Amado Nervo, Perote, Veracruz, C.P. 91270</li>
            </ul>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start gap-4">
          <p className="text-white/30 text-xs">© 2026 POP Perote Gastronomic Editorial. Perote, Veracruz, México.</p>
          <a href="/privacidad" className="text-[#F2C777] text-xs hover:underline">Ver Aviso de Privacidad →</a>
        </div>
      </div>
    </main>
  );
}
