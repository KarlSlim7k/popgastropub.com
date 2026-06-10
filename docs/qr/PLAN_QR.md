# Plan de Implementación — Sistema QR de Puntos POP Perote

> **Estado:** Propuesta — **Modelo B (independiente de Soft Restaurant)**
> **Última actualización:** Junio 2026
> **Responsable:** Equipo de desarrollo POP

---

## 1. Contexto y Objetivo

El sistema QR permite que los meseros generen códigos QR con puntos para los clientes tras una compra en el restaurante. El flujo actual requiere que el mesero ingrese manualmente el monto del ticket, lo cual es propenso a errores y lento.

**Objetivo:** Optimizar el flujo de generación de QR implementando:
- Verificación de autenticidad del ticket **100% dentro de la plataforma Laravel** (sin conexiones a Soft Restaurant ni servicios externos)
- Cantidades predefinidas para agilizar el ingreso de montos
- Optimización de carga y rendimiento de la interfaz
- Confirmación visual clara antes de generar el QR
- Registro de canje con asignación automática de puntos al mesero (POP Bar Stars) y al cliente (POP Points)

---

## 2. Alcance

### Incluido
- Interfaz de generación de QR en `/staff/qr`
- Validación de autenticidad del ticket basada en **patrones del POS + hash de integridad** (Soft Restaurant V1)
- Botones de montos rápidos predefinidos
- Historial miniatura de QRs generados en la misma página
- Confirmación visual antes de generar el QR
- Optimización de rendimiento de la página
- **Asignación de puntos POP Bar Stars al mesero** cuando el QR es canjeado
- **Asignación de puntos POP Points al cliente** cuando canjea el QR
- Registro de auditoría (foto del ticket + hash) para evitar fraude

### No incluido (fuera de alcance)
- **Integración directa con Soft Restaurant** (se mantiene 100% desacoplado para evitar fallos operativos en el restaurante)
- OCR o reconocimiento de imágenes de tickets (se valida por captura manual de folio + monto)
- Conexiones a servicios externos del restaurante
- Sincronización en tiempo real con FoodBooking

---

## 3. Arquitectura — Modelo B (Independiente)

### Principio fundamental
**Soft Restaurant es solo el sistema que imprime el ticket. La plataforma POP Perote es la fuente de verdad para la asignación de puntos.** Esto significa que:

- Soft Restaurant **NO se acopla** al frontend ni al backend de POP
- Si Soft Restaurant falla o está en mantenimiento, el sistema de puntos sigue funcionando
- La validación de autenticidad se hace por **evidencia visual (foto del ticket) + hash de integridad + unicidad de folio + ventana de tiempo**

### Diagrama de flujo

```
┌─────────────────────┐
│   Soft Restaurant   │  (POS del restaurante — INDEPENDIENTE)
│   Imprime ticket    │
│   con folio + total │
└──────────┬──────────┘
           │ (papel)
           ▼
┌─────────────────────┐
│   Mesero en mesa    │
│   Cobra al cliente  │
└──────────┬──────────┘
           │ (1) Toma foto del ticket
           │ (2) Captura folio + monto en la app
           ▼
┌─────────────────────────────────────────┐
│  Frontend /staff/qr (Next.js)          │
│  - Input de folio (5-6 dígitos)         │
│  - Botones de monto rápido              │
│  - Subida de foto del ticket            │
│  - Modal de confirmación                │
└──────────┬──────────────────────────────┘
           │ POST /staff/qr/validar
           ▼
┌─────────────────────────────────────────┐
│  Backend Laravel (API)                  │
│  - Valida patrón de folio              │
│  - Genera hash de integridad            │
│  - Verifica unicidad (no duplicado)     │
│  - Verifica ventana de tiempo (<24h)    │
│  - Genera referencia firmada HMAC      │
└──────────┬──────────────────────────────┘
           │ 201 Created
           ▼
┌─────────────────────────────────────────┐
│  Frontend muestra QR                   │
│  - Referencia firmada                  │
│  - Folio del ticket                    │
│  - Monto y puntos a generar            │
└──────────┬──────────────────────────────┘
           │ (cliente escanea)
           ▼
┌─────────────────────────────────────────┐
│  Cliente canjea en /puntos/canjear      │
│  POST /puntos/canjear                   │
│  - Valida firma HMAC                    │
│  - Marca QR como canjeado               │
│  - Suma puntos al cliente (POP Points)  │
│  - Suma puntos al mesero (POP Bar Stars)│
└─────────────────────────────────────────┘
```

---

## 4. Flujo Actual vs. Propuesto

### Flujo Actual
1. Mesero ingresa a `/staff/qr`
2. Teclea manualmente el monto del ticket
3. Sistema genera referencia firmada (HMAC-SHA256)
4. Cliente escanea QR y canjea en `/puntos/canjear`

### Flujo Propuesto (Modelo B)
1. Mesero ingresa a `/staff/qr`
2. **Captura el folio del ticket** (5-6 dígitos) — input numérico con teclado
3. **Toma foto del ticket** (evidencia visual, opcional pero recomendado)
4. **Selecciona monto rápido** O ingresa monto personalizado
5. Sistema valida:
   - Patrón de folio (5-6 dígitos)
   - Folio no registrado previamente (unicidad)
   - Monto dentro de rango válido ($1 - $10,000 MXN)
   - Ventana de tiempo (<24 hrs desde emisión)
6. **Pantalla de confirmación** muestra: monto + folio + referencia en texto grande
7. Mesero confirma y genera QR
8. Cliente escanea QR y canjea con validación de firma y bloqueo de doble uso
9. **Al canjear**: se asignan puntos al cliente (POP Points) Y al mesero (POP Bar Stars)

**Tiempo objetivo del flujo: 20-40 segundos** (captura de folio + selección de monto + confirmación + generación de QR)

---

## 5. Verificación de Autenticidad del Ticket

### Estrategia: Validación por Patrones + Hash de Integridad + Unicidad

Dado que no hay conexión externa con Soft Restaurant, el sistema verificará que el ticket es auténtico mediante **4 capas de validación independientes**:

#### Capa 1: Patrón del folio
- **Folio numérico:** 5-6 dígitos (ej: 48563)
- Validado con regex `/^\d{5,6}$/`

#### Capa 2: Validación matemática del IVA
- El ticket de Soft Restaurant incluye desglose: SUBTOTAL + IVA
- **Regla:** `IVA = SUBTOTAL × 0.16` (tolerancia ±$0.01 por redondeo)
- Esto detecta tickets alterados donde alguien cambió el total

#### Capa 3: Hash de integridad
- Se genera un hash SHA-256 con: `folio + monto_total + subtotal + iva + fecha_registro`
- Este hash se almacena en la BD al momento del registro
- Si alguien intenta modificar el folio después, el hash no coincidirá

#### Capa 4: Unicidad y ventana de tiempo
- Un folio solo puede registrarse **UNA vez** en la plataforma
- Si el mismo folio se intenta registrar nuevamente, el sistema lo rechaza
- Solo se aceptan tickets con antigüedad menor a **24 horas**

#### Patrones adicionales validados (opcionales, para mayor robustez):
- **Dirección fija:** "JUSTO SIERRA #11 COLONIA AMADO N"
- **Teléfono:** "2828253243" o "282-825-32-43"
- **Sistema:** "SOFT RESTAURANT V1" al final del ticket

#### Implementación backend (Laravel):
```php
// app/Services/TicketValidator.php
class TicketValidator
{
    public function validar(array $data): array
    {
        $errores = [];
        
        // Capa 1: Patrón de folio
        if (!preg_match('/^\d{5,6}$/', $data['folio'])) {
            $errores[] = 'Folio inválido (debe ser 5-6 dígitos)';
        }
        
        // Capa 2: Validación matemática del IVA
        $ivaEsperado = round($data['subtotal'] * 0.16, 2);
        if (abs($ivaEsperado - $data['iva']) > 0.01) {
            $errores[] = 'Desglose de IVA no coincide con el subtotal';
        }
        
        // Capa 3: Verificar unicidad
        $existe = QrTicket::where('folio_ticket', $data['folio'])->exists();
        if ($existe) {
            $errores[] = 'Este folio ya fue registrado anteriormente';
        }
        
        // Capa 4: Ventana de tiempo
        $fechaEmision = Carbon::parse($data['fecha_emision']);
        if ($fechaEmision->diffInHours(now()) > 24) {
            $errores[] = 'El ticket tiene más de 24 horas de antigüedad';
        }
        
        // Validar monto
        if ($data['monto_total'] <= 0 || $data['monto_total'] > 10000) {
            $errores[] = 'Monto fuera de rango válido';
        }
        
        return $errores;
    }
    
    public function generarHash(array $data): string
    {
        $payload = implode('|', [
            $data['folio'],
            $data['monto_total'],
            $data['subtotal'],
            $data['iva'],
            now()->toDateTimeString()
        ]);
        
        return hash('sha256', $payload);
    }
}
```

#### Registro de tickets:
Cada ticket validado se guarda en la tabla `qr_tickets` con:
- Folio
- Monto total, subtotal, IVA
- Mesero que lo registró
- Timestamp de generación
- **Hash de verificación** (SHA-256 del folio + monto + subtotal + IVA + fecha)
- **Ruta de la foto del ticket** (evidencia visual)
- Estado del QR (pendiente/canjeado/expirado)

#### Prevención de fraude:
- **Un folio solo puede generar UN QR activo a la vez**
- Si el mismo folio se intenta registrar nuevamente, el sistema lo rechaza
- El historial muestra el estado del QR (pendiente/canjeado/expirado)
- La foto del ticket queda como evidencia para auditoría del admin

---

## 6. Cantidades Predefinidas

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

## 7. Pantalla de Confirmación Visual

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

## 8. Historial Miniatura en la Misma Página

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

## 9. Optimización de Carga y Rendimiento

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

## 10. Estructura de Archivos Propuesta

```
frontend/
── app/
│   └── (staff)/
│       └── qr/
│           ├── page.tsx                    ← Página principal
│           ├── loading.tsx                 ← Skeleton loader
│           └── historial/
│               └── page.tsx                ← Historial completo
├── components/
│   ── qr/
│       ├── QRGenerator.tsx                 ← Generador principal
│       ├── BotonesMontos.tsx               ← Montos predefinidos
│       ├── ConfirmacionModal.tsx           ← Modal de confirmación
│       ├── HistorialQRs.tsx                ← Historial miniatura
│       ├── FormularioFolio.tsx             ← Input de folio
│       ├── CapturaFoto.tsx                 ← Componente de cámara
│       ├── DesgloseIVA.tsx                 ← Input subtotal + IVA
│       └── QRCode.tsx                      ← Componente QR visual
├── lib/
│   ── qr/
│       ├── validacion.ts                   ← Validación de ticket (frontend)
│       ├── firma.ts                        ← Generación HMAC
│       ├── tipos.ts                        ← Tipos TypeScript
│       └── api.ts                          ← Llamadas al backend
└── hooks/
    ── useQR.ts                            ← Hook personalizado

backend/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── Staff/
│   │           └── QrController.php        ← NUEVO: Validar, generar, historial
│   ├── Services/
│   │   ├── TicketValidator.php            ← NUEVO: Validación 4 capas
│   │   ├── QrSignatureService.php         ← NUEVO: HMAC-SHA256
│   │   └── PuntosService.php               ← Asignación dual de puntos
│   └── Models/
│       └── QrTicket.php                    ← NUEVO: Modelo del ticket
├── database/
│   ├── migrations/
│   │   └── ..._create_qr_tickets_table.php ← NUEVO
│   └── seeders/
│       └── QrTicketSeeder.php              ← Datos de prueba
└── storage/
    └── app/
        └── public/
            └── tickets/                    ← Fotos de tickets
```

---

## 11. Base de Datos

### Tabla: `qr_tickets`

```sql
CREATE TABLE qr_tickets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    folio_ticket VARCHAR(10) NOT NULL,
    monto_total DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    iva DECIMAL(10, 2) NOT NULL,
    puntos_generados INT NOT NULL,
    mesero_id BIGINT UNSIGNED NOT NULL,
    referencia_firmada VARCHAR(255) NOT NULL,
    hash_verificacion VARCHAR(64) NOT NULL,
    foto_ticket_path VARCHAR(255) NULL,
    estado ENUM('pendiente', 'canjeado', 'expirado', 'rechazado') DEFAULT 'pendiente',
    fecha_emision_ticket DATETIME NOT NULL,
    fecha_generacion DATETIME NOT NULL,
    fecha_expiracion DATETIME NOT NULL,
    fecha_canje DATETIME NULL,
    cliente_id BIGINT UNSIGNED NULL,
    ip_generacion VARCHAR(45) NULL,
    user_agent VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE INDEX uniq_folio (folio_ticket),
    INDEX idx_mesero (mesero_id),
    INDEX idx_estado (estado),
    INDEX idx_referencia (referencia_firmada),
    INDEX idx_fecha_expiracion (fecha_expiracion),
    INDEX idx_mesero_estado (mesero_id, estado),
    
    FOREIGN KEY (mesero_id) REFERENCES users(id),
    FOREIGN KEY (cliente_id) REFERENCES users(id)
);
```

### Campos nuevos respecto al plan original:
- **`subtotal` e `iva`**: Para validación matemática de autenticidad (Capa 2)
- **`foto_ticket_path`**: Ruta de la foto del ticket como evidencia visual
- **`fecha_emision_ticket`**: Fecha impresa en el ticket (para validar ventana de 24h)
- **`ip_generacion` y `user_agent`**: Para auditoría y detección de fraude
- **`UNIQUE INDEX uniq_folio`**: Garantiza que un folio solo se registre una vez a nivel de BD
- **`estado = 'rechazado'`**: Para tickets que fallaron validación

### Índices adicionales:
- Índice compuesto: `(folio_ticket, estado)` para búsqueda rápida de folios activos
- Índice en `fecha_expiracion` para limpieza automática de QRs vencidos
- Índice `(mesero_id, estado)` para consultas de ranking y dashboard del mesero

---

## 12. Seguridad

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

## 13. Asignación de Puntos al Canjear

### Flujo de puntos (dual)

Cuando el cliente canjea el QR, se ejecutan **dos operaciones atómicas** dentro de una transacción Laravel:

#### 1. Puntos al cliente (POP Points)
```php
// En PuntosController.php -> canjear()
$cliente = User::find($clienteId);
$cliente->puntos_fidelidad += $qr->puntos_generados;
$cliente->save();

// Registrar en historial
HistorialPunto::create([
    'user_id' => $clienteId,
    'puntos' => $qr->puntos_generados,
    'origen' => 'qr_canje',
    'referencia_id' => $qr->id,
    'descripcion' => "Canje de QR por ticket #{$qr->folio_ticket}"
]);
```

#### 2. Puntos al mesero (POP Bar Stars)
```php
// Asignar puntos al mesero según reglas POP Bar Stars
$reglas = [
    'cocktail_points' => 10,      // Cóctel/margarita
    'premium_points' => 15,        // Bebida premium
    'pitcher_points' => 25,        // Jarra/compartido
    'bottle_points' => 50,         // Botella completa
    'combo_points' => 20,          // Combo comida+bebida
];

// Por defecto, el ticket genera puntos base de "venta de bebida"
$mesero = Mesero::where('user_id', $qr->mesero_id)->first();
$mesero->puntos += $qr->puntos_generados; // Mismos puntos que el cliente
$mesero->save();

HistorialPuntoMesero::create([
    'mesero_id' => $mesero->id,
    'qr_ticket_id' => $qr->id,
    'puntos' => $qr->puntos_generados,
    'categoria' => 'ticket_bebida',
    'descripcion' => "Venta registrada por ticket #{$qr->folio_ticket}"
]);
```

### Cálculo de puntos generados
```php
// Regla: 1 punto por cada $10 MXN gastados
$puntosGenerados = (int) floor($qr->monto_total / 10);
```

### Transacción atómica
```php
DB::transaction(function () use ($qr, $clienteId) {
    // Validar estado
    if ($qr->estado !== 'pendiente') {
        throw new \Exception('QR ya fue canjeado o expiró');
    }
    
    // Marcar como canjeado
    $qr->update([
        'estado' => 'canjeado',
        'cliente_id' => $clienteId,
        'fecha_canje' => now()
    ]);
    
    // Sumar puntos al cliente
    $cliente = User::find($clienteId);
    $cliente->increment('puntos_fidelidad', $qr->puntos_generados);
    
    // Sumar puntos al mesero
    $mesero = Mesero::where('user_id', $qr->mesero_id)->first();
    $mesero->increment('puntos', $qr->puntos_generados);
    
    // Registrar en historiales
    HistorialPunto::create([...]);
    HistorialPuntoMesero::create([...]);
});
```

---

## 14. Endpoints del Backend

### Nuevos endpoints a crear

```php
// backend/routes/api.php (agregar al grupo de staff)
Route::middleware(['auth:sanctum', 'role:mesero'])->prefix('staff')->group(function () {
    // Validar ticket antes de generar QR
    Route::post('/qr/validar', [QrController::class, 'validar']);
    
    // Generar QR después de validación
    Route::post('/qr/generar', [QrController::class, 'generar']);
    
    // Historial de QRs del mesero
    Route::get('/qr/historial', [QrController::class, 'historial']);
    
    // Detalle de un QR específico
    Route::get('/qr/{id}', [QrController::class, 'show']);
});

// Endpoint público para cliente (canjear)
Route::post('/puntos/canjear', [PuntosController::class, 'canjear']);
```

### Estructura de request/response

#### POST /staff/qr/validar
**Request:**
```json
{
  "folio": "48563",
  "monto_total": 95.00,
  "subtotal": 81.90,
  "iva": 13.10,
  "fecha_emision": "2026-06-05T21:31:36",
  "foto_ticket": "<base64 o multipart>"
}
```

**Response 200 (válido):**
```json
{
  "valido": true,
  "puntos_a_generar": 9,
  "hash_preview": "a3f5b8c9...",
  "referencia_preview": "QR-48563-X7K9"
}
```

**Response 422 (inválido):**
```json
{
  "valido": false,
  "errores": [
    "Este folio ya fue registrado anteriormente",
    "El desglose de IVA no coincide con el subtotal"
  ]
}
```

#### POST /staff/qr/generar
**Request:**
```json
{
  "folio": "48563",
  "monto_total": 95.00,
  "subtotal": 81.90,
  "iva": 13.10,
  "fecha_emision": "2026-06-05T21:31:36",
  "hash_validacion": "a3f5b8c9..."
}
```

**Response 201:**
```json
{
  "id": 123,
  "folio": "48563",
  "referencia_firmada": "7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c...",
  "qr_payload": "popperote://canjear?ref=7f8a9b0c...",
  "puntos_generados": 9,
  "fecha_expiracion": "2026-06-06T21:31:36",
  "estado": "pendiente"
}
```

#### POST /puntos/canjear
**Request:**
```json
{
  "referencia_firmada": "7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c..."
}
```

**Response 200:**
```json
{
  "exito": true,
  "puntos_sumar": 9,
  "nuevo_saldo": 487,
  "mesero_asignado": "Fernando",
  "ticket": {
    "folio": "48563",
    "monto": 95.00
  }
}
```

---

## 15. Métricas y Monitoreo

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

## 16. Cronograma Estimado

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

## 17. Riesgos y Mitigación

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Meseros no usan montos predefinidos | Media | Bajo | Capacitación + UI intuitiva |
| Tickets con formato diferente al esperado | Baja | Alto | Validación flexible + fallback manual |
| QRs no canjeados (pérdida de confianza) | Media | Medio | Expiración clara + notificaciones |
| Lentitud en generación de QR | Baja | Alto | Optimización de carga + caché |
| Intentos de fraude con folios falsos | Baja | Alto | Validación de patrones + logging |

---

## 18. Próximos Pasos

1. **Revisión del plan** con el equipo de desarrollo
2. **Aprobación** del diseño de UI/UX
3. **Implementación** fase por fase
4. **Testing** con meseros reales en el restaurante
5. **Deploy** a producción
6. **Monitoreo** de métricas post-lanzamiento

---

## 19. Referencias

- Ticket de ejemplo: `/home/karoldelgado/Descargas/TICKET.jpeg`
- Documentación general: `docs/POP_WEB.md`
- Propuesta técnica: `docs/planteamiento-web-pop-perote.md`
- Sistema POS: Soft Restaurant V1

---

**Fin del documento**
