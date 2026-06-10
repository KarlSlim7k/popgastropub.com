# Cómo funciona el sistema de puntos con código QR
### POP Perote · Sistema de Lealtad Digital

---

## ¿De qué se trata?

Queremos que cada cliente que visita POP Perote pueda acumular puntos automáticamente con solo escanear el ticket de su cuenta. Esos puntos se guardan en su perfil de la app y los puede canjear por premios, descuentos y experiencias exclusivas.

---

## ¿Cómo funciona paso a paso?

### 1. El cliente pide su cuenta
El mesero cierra la cuenta normalmente en el sistema de caja del restaurante.

### 2. El ticket lleva un código QR
El ticket impreso incluye un código QR especial generado automáticamente por el sistema de caja. Ese QR contiene el monto total de la cuenta y un código único para ese ticket.

### 3. El cliente escanea el QR
El cliente apunta la cámara de su celular al QR. Se abre automáticamente la página de POP Perote en su navegador.

### 4. Se acreditan los puntos
- **Si ya tiene cuenta en POP Perote:** los puntos se agregan a su perfil en segundos.
- **Si no tiene cuenta:** la app lo invita a registrarse. Una vez que se registra, los puntos del ticket se acreditan automáticamente.

---

## ¿Cuántos puntos gana el cliente?

La regla es simple:

> **1 punto por cada $10 pesos gastados**

### Ejemplos:

| Cuenta total | Puntos ganados |
|---|---|
| $150 MXN | 15 puntos |
| $280 MXN | 28 puntos |
| $450 MXN | 45 puntos |
| $650 MXN | 65 puntos |

---

## ¿Qué puede hacer el cliente con sus puntos?

Los puntos acumulados se pueden canjear por recompensas dentro de la app:

| Recompensa | Puntos necesarios |
|---|---|
| Bebida gratis | 100 puntos |
| Orden de Wings (6 pzas) | 250 puntos |
| Roll POP clásico | 300 puntos |
| 20% de descuento en cuenta | 500 puntos |
| Roll premium gratis | 600 puntos |
| Cena VIP para 2 personas | 2,000 puntos |

Además, los clientes suben de nivel conforme acumulan más puntos:

| Nivel | Puntos | Beneficio extra |
|---|---|---|
| POP Fan | 0 – 499 | Puntos básicos |
| POP Lover | 500 – 1,499 | +10% de puntos en cada visita |
| POP VIP | 1,500 – 2,999 | +25% de puntos, roll gratis cada 5 visitas |
| POP Elite | 3,000+ | +50% de puntos, reservación prioritaria |

---

## ¿Qué necesita el restaurante para que esto funcione?

Solo una cosa: **que el sistema de caja genere el QR en el ticket.**

Para eso, el equipo técnico del sistema de caja necesita:

1. Una **clave secreta** que les proporcionamos (un código de seguridad compartido)
2. El **formato exacto** del QR (que ya está definido — se los entregamos en un documento técnico)

No se requiere ninguna otra integración ni cambio en el proceso de atención al cliente.

---

## ¿Es seguro? ¿Puede haber fraude?

Sí, el sistema tiene varias protecciones:

- **Cada QR es de un solo uso.** Si alguien intenta escanear el mismo ticket dos veces, el sistema lo rechaza.
- **Los QR expiran en 72 horas.** Un ticket de hace 3 días ya no sirve para canjear puntos.
- **Los QR están firmados digitalmente.** No se pueden falsificar ni modificar — si alguien cambia el monto, la firma no coincide y el sistema lo rechaza.

---

## ¿Qué ve el cliente en su celular?

Al escanear el QR, el cliente ve una pantalla como esta:

```
┌─────────────────────────────────┐
│  🎉 ¡Ganaste puntos POP!        │
│                                 │
│  Cuenta: $350 MXN               │
│  Puntos a ganar: 35 pts         │
│                                 │
│  [ Canjear mis puntos ]         │
│                                 │
│  ¿No tienes cuenta?             │
│  [ Regístrate gratis ]          │
└─────────────────────────────────┘
```

---

## ¿Qué beneficios tiene esto para el restaurante?

- **Más registros de clientes** — el momento de mayor motivación para registrarse es justo después de una buena experiencia
- **Clientes que regresan** — los puntos crean un incentivo real para volver
- **Base de datos de clientes** — se construye automáticamente con cada visita
- **Sin costo operativo extra** — el mesero no hace nada diferente, el proceso es el mismo

---

## Preguntas frecuentes

**¿El mesero tiene que hacer algo diferente?**
No. El proceso de atención es exactamente igual. El QR aparece automáticamente en el ticket impreso.

**¿Qué pasa si el cliente no tiene smartphone?**
No pasa nada. El ticket sigue siendo válido como siempre. El QR es opcional para el cliente.

**¿Qué pasa si el cliente pierde el ticket?**
Los puntos no se pueden reclamar sin el QR. Esto es intencional para evitar fraude.

**¿Cuándo estarían listos los QR en los tickets?**
Una vez aprobado este sistema, el equipo técnico del sistema de caja necesita aproximadamente 1-2 días para agregar el QR al ticket. La app de POP Perote estaría lista en paralelo.

---

*Documento preparado por el equipo de desarrollo de POP Perote Digital · Mayo 2026*
