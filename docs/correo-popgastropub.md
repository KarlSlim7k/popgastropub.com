# Servicio de Correo — POP Gastropub Perote

## Cuentas de Correo

| Cuenta | Uso sugerido |
|--------|-------------|
| `admin@popgastropub.com` | Administración general |
| `facturacion@popgastropub.com` | Facturas y pagos |
| `soporte@popgastropub.com` | Atención a clientes |
| `ventas@popgastropub.com` | Ventas y cotizaciones |
| `meseros@popgastropub.com` | Comunicación interna |

> Las contraseñas se pueden cambiar desde el panel de administración de MailCow.

---

## Acceso al Webmail

| | |
|---|---|
| **URL** | https://webmail.popgastropub.com |
| **Usuario** | Correo completo (ej. `ventas@popgastropub.com`) |
| **Contraseña** | La asignada a cada cuenta |

> **Nota:** El dominio `webmail.popgastropub.com` requiere un registro DNS tipo A apuntando a `76.13.123.24` en Cloudflare. Una vez configurado, el certificado SSL se genera automáticamente.

---

## Panel de Administración MailCow

Permite crear/eliminar cuentas, cambiar contraseñas, ver logs y más.

| | |
|---|---|
| **URL** | https://76.13.123.24:8443 |
| **Usuario** | `admin` |
| **Contraseña** | `moohoo` |

---

## Configuración en Dispositivos — Datos del Servidor

Estos datos aplican para cualquier cliente de correo (Apple Mail, Outlook, Gmail, Thunderbird, etc.).

| Parámetro | Valor |
|-----------|-------|
| **Servidor de correo** | `mail.popgastropub.com` |
| **Correo de entrada (IMAP)** | Puerto `993` — SSL/TLS |
| **Correo de salida (SMTP)** | Puerto `587` — STARTTLS |
| **Usuario** | Correo completo (ej. `ventas@popgastropub.com`) |
| **Contraseña** | La de cada cuenta |

> También disponible POP3: puerto `995` con SSL/TLS (no recomendado — IMAP es preferible para sincronización en múltiples dispositivos).

---

## Configuración en iPhone / iPad (Apple Mail)

1. Abre **Ajustes** → **Mail** → **Cuentas** → **Añadir cuenta**
2. Selecciona **Otra**
3. Toca **Añadir cuenta de Mail**
4. Rellena los campos:
   - **Nombre:** Tu nombre o el del negocio
   - **Correo:** `ventas@popgastropub.com` (la cuenta que corresponda)
   - **Contraseña:** La contraseña de la cuenta
   - **Descripción:** POP Perote (o lo que prefieras)
5. Toca **Siguiente** — el sistema intentará configurar automáticamente. Si falla, ingresa los datos manualmente:

### Correo entrante (IMAP)
| Campo | Valor |
|-------|-------|
| Servidor | `mail.popgastropub.com` |
| Puerto | `993` |
| SSL | Activado |
| Usuario | Correo completo |
| Contraseña | La de la cuenta |

### Correo saliente (SMTP)
| Campo | Valor |
|-------|-------|
| Servidor | `mail.popgastropub.com` |
| Puerto | `587` |
| SSL/TLS | STARTTLS |
| Autenticación | Contraseña |
| Usuario | Correo completo |
| Contraseña | La de la cuenta |

6. Toca **Guardar**

> Si aparece una advertencia sobre el certificado SSL, acepta confiar en él (certificado válido del servidor).

---

## Configuración en Mac (Apple Mail)

1. Abre **Mail** → **Mail** (menú) → **Añadir cuenta**
2. Selecciona **Otra cuenta de Mail...**
3. Ingresa nombre, correo y contraseña → **Iniciar sesión**
4. Si la detección automática falla, ingresa:

| Campo | Valor |
|-------|-------|
| Tipo de cuenta | IMAP |
| Servidor de correo entrante | `mail.popgastropub.com` |
| Servidor de correo saliente | `mail.popgastropub.com` |

5. Completa con usuario y contraseña en ambas secciones → **Iniciar sesión**
6. Selecciona las apps que usarán la cuenta → **Listo**

---

## Configuración en Android

### Opción A — Aplicación Gmail

1. Abre **Gmail** → menú (☰) → **Ajustes** → **Añadir cuenta**
2. Selecciona **Otra**
3. Ingresa el correo → **Siguiente**
4. Selecciona **Personal (IMAP)**
5. Ingresa la contraseña → **Siguiente**
6. Configuración del servidor entrante:

| Campo | Valor |
|-------|-------|
| Nombre de usuario | Correo completo |
| Contraseña | La de la cuenta |
| Servidor IMAP | `mail.popgastropub.com` |
| Puerto | `993` |
| Tipo de seguridad | SSL/TLS |

7. Configuración del servidor saliente:

| Campo | Valor |
|-------|-------|
| Servidor SMTP | `mail.popgastropub.com` |
| Puerto | `587` |
| Tipo de seguridad | STARTTLS |
| Solicitar inicio de sesión | Sí |
| Nombre de usuario | Correo completo |
| Contraseña | La de la cuenta |

8. Ajusta las opciones de sincronización → **Siguiente** → **Listo**

### Opción B — Aplicación Samsung Email / Mail genérico

1. Abre la app → **Añadir cuenta** → **Otra cuenta**
2. Ingresa correo y contraseña
3. Selecciona **Configuración manual** → **IMAP**
4. Usa los mismos datos que en la tabla de Gmail arriba

---

## Configuración en Outlook (Windows / Mac / Móvil)

1. Abre **Outlook** → **Archivo** → **Añadir cuenta** (o en móvil: **+** → **Añadir cuenta de correo electrónico**)
2. Ingresa el correo → **Conectar**
3. Si pide configuración manual, selecciona **IMAP**
4. Servidor de entrada:

| Campo | Valor |
|-------|-------|
| Servidor | `mail.popgastropub.com` |
| Puerto | `993` |
| Cifrado | SSL/TLS |

5. Servidor de salida:

| Campo | Valor |
|-------|-------|
| Servidor | `mail.popgastropub.com` |
| Puerto | `587` |
| Cifrado | STARTTLS |

6. Ingresa usuario (correo completo) y contraseña → **Conectar**

---

## Resolución de Problemas Comunes

| Problema | Posible causa | Solución |
|----------|---------------|----------|
| No conecta al servidor | Firewall o datos incorrectos | Verifica que el servidor sea `mail.popgastropub.com` y el puerto correcto |
| Certificado no confiable | Cert autofirmado en red interna | Acepta el certificado manualmente en la primera conexión |
| No envía correos | SMTP bloqueado | Usa puerto `587` con STARTTLS, no puerto `25` |
| Correos en spam | Falta registro DMARC | Agrega `_dmarc.popgastropub.com` TXT en Cloudflare: `v=DMARC1; p=none; rua=mailto:admin@popgastropub.com` |
| No recibe correos externos | DNS mal configurado | Verifica que el registro MX y SPF estén activos en Cloudflare |
