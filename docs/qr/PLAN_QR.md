# Plan de Implementación — Sistema QR de Puntos POP Perote

> **Estado:** Propuesta  
> **Última actualización:** Junio 2026  
> **Responsable:** Equipo de desarrollo POP

---

## 1. Contexto y Objetivo

El sistema QR permite que los meseros generen códigos QR con puntos para los clientes tras una compra en el restaurante. El flujo actual requiere que el mesero ingrese manualmente el monto del ticket, lo cual es propenso a errores y lento.

**Objetivo:** Optimizar el flujo de generación de QR implementando:
- Verificación de autenticidad del ticket sin dependencias externas
- Cantidades predefinidas para agilizar el ingreso de montos
- Optimización de carga y rendimiento de la interfaz
- Confirmación visual clara antes de generar el QR

---

## 2. Alcance

### Incluido
- Interfaz de generación de QR en `/staff/qr`
- Validación de autenticidad del ticket basada en patrones del POS (Soft Restaurant V1)
- Botones de montos rápidos predefinidos
- Historial miniatura de QRs generados en la misma página
- Confirmación visual antes de generar el QR
- Optimización de rendimiento de la página

### No incluido (fuera de alcance)
- Integración directa con Soft Restaurant (POS local sin API)
- OCR o reconocimiento de imágenes de tickets
- Conexiones a servicios externos del restaurante
- Sincronización en tiempo real con FoodBooking

---

## 3. Flujo Actual vs. Propuesto

### Flujo Actual
1. Mesero ingresa a `/staff/qr`
2. Teclea manualmente el monto del ticket
3. Sistema genera referencia firmada (HMAC-SHA256)
4. Cliente escanea QR y canjea en `/puntos/canjear`

### Flujo Propuesto
1. Mesero ingresa a `/staff/qr`
2. Selecciona monto rápido O ingresa monto personalizado
3. Sistema valida patrón de ticket auténtico (folio + formato)
4. Pantalla de confirmación muestra monto + referencia en texto grande
5. Mesero confirma y genera QR
6. Cliente escanea QR y canjea con validación de firma y bloqueo de doble uso

---

## 4. Verificación de Autenticidad del Ticket

### Estrategia: Validación por Patrones del POS

Dado que no hay conexión externa con Soft Restaurant, el sistema verificará que el ticket sigue los patrones conocidos del POS del restaurante:

#### Patrones a validar:
- **Folio numérico:** 5-6 dígitos (ej: 48563)
- **Formato de fecha:** `DD/MM/YYYY HH:MM:SS AM/PM`
- **Dirección fija:** "JUSTO SIERRA #11 COLONIA AMADO N"
- **Teléfono:** "2828253243" o "282-825-32-43"
- **Total:** Formato `$XX.XX` con 2 decimales
- **Sistema:** "SOFT RESTAURANT V1" al final del ticket

#### Implementación:
```typescript
// Validación de patrón de ticket
function validarTicketAutentico(data: {
  folio: string;
  fecha: string;
  total: number;
  direccion?: string;
  telefono?: string;
}): boolean {
  const folioValido = /^\d{5,6}$/.test(data.folio);
  const fechaValida = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2} (AM|PM)$/.test(data.fecha);
  const totalValido = data.total > 0 && data.total <= 10000;
  
  return folioValido && fechaValida && totalValido;
}
```

#### Registro de tickets:
- Cada ticket validado se guarda en la base de datos con:
  - Folio
  - Monto total
  - Mesero que lo registró
  - Timestamp de generación
  - Hash de verificación (SHA-256 del folio + monto + fecha)

#### Prevención de duplicados:
- Un folio solo puede generar UN QR activo a la vez
- Si el mismo folio se intenta registrar nuevamente, el sistema alerta al mesero
- El historial muestra el estado del QR (pendiente/canjeado/expirado)

---

## 5. Cantidades Predefinidas

### Botones de Montos Rápidos

Basado en el análisis de tickets reales del restaurante:

| Monto | Frecuencia estimada |
|-------|---------------------|
| $50   | Baja (snacks individuales) |
| $95   | Media (boneless, crepes) |
| $150  | Alta (combos personales) |
| $200  | Alta (cenas individuales) |
| $300  | Media (cenas para 2) |
| $400  | Media (cenas para 2-3) |
| $500  | Alta (grupos pequeños) |
| $750  | Baja (grupos medianos) |
| $1000 | Baja (grupos grandes) |

### Implementación UI:
```tsx
<div className="grid grid-cols-3 gap-2 mb-4">
  {[50, 95, 150, 200, 300, 400, 500, 750, 1000].map((monto) => (
    <button
      key={monto}
      onClick={() => setMontoSeleccionado(monto)}
      className={`p-3 rounded-lg font-bold ${
        montoSeleccionado === monto
          ? 'bg-[#F2C777] text-[#0D0D0D]'
          : 'bg-[#1a1a1a] text-[#F2C777] border border-[#F2C777]'
      }`}
    >
      ${monto}
    </button>
  ))}
</div>

<input
  type="number"
  placeholder="O ingresa monto personalizado"
  value={montoPersonalizado}
  onChange={(e) => setMontoPersonalizado(Number(e.target.value))}
  className="w-full p-3 rounded-lg bg-[#1a1a1a] text-white border border-[#F2C777]"
/>
```

---

## 6. Pantalla de Confirmación Visual

### Objetivo:
Permitir al mesero cotejar el monto y la referencia con el ticket físico antes de generar el QR.

### Diseño:
```tsx
// Modal de confirmación
<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
  <div className="bg-[#0D0D0D] border-2 border-[#F2C777] rounded-xl p-8 max-w-md w-full mx-4">
    <h2 className="text-2xl font-bold text-[#F2C777] mb-6 text-center">
      Confirma el QR
    </h2>
    
    <div className="mb-6">
      <p className="text-gray-400 text-sm mb-1">Monto del ticket</p>
      <p className="text-5xl font-bold text-white text-center">
        ${montoSeleccionado.toFixed(2)}
      </p>
    </div>
    
    <div className="mb-6">
      <p className="text-gray-400 text-sm mb-1">Referencia</p>
      <p className="text-xl font-mono text-[#F2C894] text-center break-all">
        {referenciaFirmada}
      </p>
    </div>
    
    <div className="mb-6">
      <p className="text-gray-400 text-sm mb-1">Folio del ticket</p>
      <p className="text-lg text-white text-center">
        #{folioTicket}
      </p>
    </div>
    
    <div className="flex gap-3">
      <button
        onClick={onCancelar}
        className="flex-1 p-3 rounded-lg bg-gray-700 text-white font-bold"
      >
        Cancelar
      </button>
      <button
        onClick={onConfirmar}
        className="flex-1 p-3 rounded-lg bg-[#F2C777] text-[#0D0D0D] font-bold"
      >
        Generar QR
      </button>
    </div>
  </div>
</div>
```

---

## 7. Historial Miniatura en la Misma Página

### Componente:
```tsx
// Historial de QRs generados (últimos 10)
<div className="mt-8">
  <h3 className="text-lg font-bold text-[#F2C777] mb-3">
    QRs Recientes
  </h3>
  <div className="space-y-2">
    {historialQRs.map((qr) => (
      <div
        key={qr.id}
        className="flex items-center justify-between p-3 rounded-lg bg-[#1a1a1a] border border-gray-800"
      >
        <div>
          <p className="text-white font-bold">${qr.monto.toFixed(2)}</p>
          <p className="text-gray-400 text-xs">
            Folio: #{qr.folio} • {qr.timestamp}
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded text-xs font-bold ${
            qr.estado === 'canjeado'
              ? 'bg-green-900 text-green-300'
              : qr.estado === 'expirado'
              ? 'bg-red-900 text-red-300'
              : 'bg-yellow-900 text-yellow-300'
          }`}
        >
          {qr.estado.toUpperCase()}
        </span>
      </div>
    ))}
  </div>
</div>
```

### Estados del QR:
- **PENDIENTE:** QR generado, aún no escaneado
- **CANJEADO:** Cliente ya canjeó los puntos
- **EXPIRADO:** QR venció (24 horas sin canjear)

---

## 8. Optimización de Carga y Rendimiento

### Estrategias:

#### 8.1. Lazy Loading de Componentes
```tsx
// Carga diferida del generador de QR
const QRGenerator = dynamic(() => import('@/components/qr/QRGenerator'), {
  loading: () => <SkeletonQR />,
  ssr: false,
});
```

#### 8.2. Memoización de Datos
```tsx
// Memoizar cálculo de puntos
const puntosCalculados = useMemo(() => {
  return Math.floor(montoSeleccionado / 10);
}, [montoSeleccionado]);
```

#### 8.3. Debounce en Búsquedas
```tsx
// Debounce para búsqueda de folio
const debouncedBuscarFolio = useMemo(
  () => debounce((folio: string) => buscarFolio(folio), 300),
  []
);
```

#### 8.4. Optimización de Imágenes
```tsx
// Usar next/image para el logo del QR
import Image from 'next/image';

<Image
  src="/images/pop-logo.png"
  alt="POP Perote"
  width={120}
  height={120}
  priority
/>
```

#### 8.5. Caché de Historial
```tsx
// Caché del historial en localStorage (5 minutos)
const CACHE_KEY = 'qr_historial_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

function getHistorialCache() {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;
  
  const { data, timestamp } = JSON.parse(cached);
  if (Date.now() - timestamp > CACHE_TTL) {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
  
  return data;
}
```

#### 8.6. Reducción de Re-renders
```tsx
// Separar componentes para evitar re-renders innecesarios
const BotonesMontos = React.memo(({ onSelect, seleccionado }) => {
  // ...
});

const FormularioFolio = React.memo(({ valor, onChange }) => {
  // ...
});
```

#### 8.7. Prefetching de Datos
```tsx
// Prefetch del historial al cargar la página
useEffect(() => {
  router.prefetch('/staff/qr/historial');
}, [router]);
```

---

## 9. Estructura de Archivos Propuesta

```
frontend/
── app/
│   └── (staff)/
│       └── qr/
│           ├── page.tsx                    ← Página principal
│           └── loading.tsx                 ← Skeleton loader
├── components/
│   ── qr/
│       ├── QRGenerator.tsx                 ← Generador principal
│       ├── BotonesMontos.tsx               ← Montos predefinidos
│       ├── ConfirmacionModal.tsx           ← Modal de confirmación
│       ├── HistorialQRs.tsx                ← Historial miniatura
│       ├── FormularioFolio.tsx             ← Input de folio
│       └── QRCode.tsx                      ← Componente QR visual
├── lib/
│   └── qr/
│       ├── validacion.ts                   ← Validación de ticket
│       ├── firma.ts                        ← Generación HMAC
│       └── tipos.ts                        ← Tipos TypeScript
└── hooks/
    ── useQR.ts                            ← Hook personalizado
```

---

## 10. Base de Datos

### Tabla: `qr_tickets`

```sql
CREATE TABLE qr_tickets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    folio_ticket VARCHAR(10) NOT NULL,
    monto_total DECIMAL(10, 2) NOT NULL,
    puntos_generados INT NOT NULL,
    mesero_id BIGINT UNSIGNED NOT NULL,
    referencia_firmada VARCHAR(255) NOT NULL,
    hash_verificacion VARCHAR(64) NOT NULL,
    estado ENUM('pendiente', 'canjeado', 'expirado') DEFAULT 'pendiente',
    fecha_generacion DATETIME NOT NULL,
    fecha_expiracion DATETIME NOT NULL,
    fecha_canje DATETIME NULL,
    cliente_id BIGINT UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_folio (folio_ticket),
    INDEX idx_mesero (mesero_id),
    INDEX idx_estado (estado),
    INDEX idx_referencia (referencia_firmada),
    
    FOREIGN KEY (mesero_id) REFERENCES users(id),
    FOREIGN KEY (cliente_id) REFERENCES users(id)
);
```

### Índices adicionales:
- Índice compuesto: `(folio_ticket, estado)` para búsqueda rápida de folios activos
- Índice en `fecha_expiracion` para limpieza automática de QRs vencidos

---

## 11. Seguridad

### Firma HMAC-SHA256
```typescript
import { createHmac } from 'crypto';

function generarReferenciaFirmada(
  folio: string,
  monto: number,
  meseroId: number,
  timestamp: string
): string {
  const payload = `${folio}:${monto}:${meseroId}:${timestamp}`;
  const secret = process.env.QR_SECRET_KEY;
  
  return createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
}
```

### Validación de Firma
```typescript
function validarReferencia(referencia: string, payload: string): boolean {
  const secret = process.env.QR_SECRET_KEY;
  const firmaEsperada = createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return firmaEsperada === referencia;
}
```

### Prevención de Doble Uso
```typescript
async function canjearQR(referencia: string, clienteId: number) {
  const qr = await db.qr_tickets.findOne({ referencia_firmada: referencia });
  
  if (!qr) throw new Error('QR no encontrado');
  if (qr.estado === 'canjeado') throw new Error('QR ya fue canjeado');
  if (qr.estado === 'expirado') throw new Error('QR expirado');
  if (qr.fecha_expiracion < new Date()) {
    await db.qr_tickets.update(qr.id, { estado: 'expirado' });
    throw new Error('QR expirado');
  }
  
  // Marcar como canjeado
  await db.qr_tickets.update(qr.id, {
    estado: 'canjeado',
    cliente_id: clienteId,
    fecha_canje: new Date()
  });
  
  // Sumar puntos al cliente
  await sumarPuntosCliente(clienteId, qr.puntos_generados);
}
```

---

## 12. Métricas y Monitoreo

### KPIs a跟踪:
- **Tiempo promedio de generación de QR:** Objetivo < 15 segundos
- **Tasa de error en montos:** Objetivo < 5%
- **QRs canjeados vs. generados:** Objetivo > 80%
- **Tiempo promedio de canje:** Objetivo < 2 horas

### Logs importantes:
- Generación de QR (folio, monto, mesero)
- Intentos de canje (exitosos y fallidos)
- Validaciones de firma fallidas
- QRs expirados sin canjear

---

## 13. Cronograma Estimado

| Fase | Tarea | Duración |
|------|-------|----------|
| 1 | Diseño de UI/UX de `/staff/qr` | 2 días |
| 2 | Implementación de botones de montos rápidos | 1 día |
| 3 | Validación de patrones de ticket | 2 días |
| 4 | Modal de confirmación visual | 1 día |
| 5 | Historial miniatura en la misma página | 2 días |
| 6 | Optimización de rendimiento | 2 días |
| 7 | Testing y QA | 2 días |
| 8 | Deploy a producción | 1 día |

**Total estimado:** 13 días hábiles

---

## 14. Riesgos y Mitigación

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Meseros no usan montos predefinidos | Media | Bajo | Capacitación + UI intuitiva |
| Tickets con formato diferente al esperado | Baja | Alto | Validación flexible + fallback manual |
| QRs no canjeados (pérdida de confianza) | Media | Medio | Expiración clara + notificaciones |
| Lentitud en generación de QR | Baja | Alto | Optimización de carga + caché |
| Intentos de fraude con folios falsos | Baja | Alto | Validación de patrones + logging |

---

## 15. Próximos Pasos

1. **Revisión del plan** con el equipo de desarrollo
2. **Aprobación** del diseño de UI/UX
3. **Implementación** fase por fase
4. **Testing** con meseros reales en el restaurante
5. **Deploy** a producción
6. **Monitoreo** de métricas post-lanzamiento

---

## 16. Referencias

- Ticket de ejemplo: `/home/karoldelgado/Descargas/TICKET.jpeg`
- Documentación general: `docs/POP_WEB.md`
- Propuesta técnica: `docs/planteamiento-web-pop-perote.md`
- Sistema POS: Soft Restaurant V1

---

**Fin del documento**
