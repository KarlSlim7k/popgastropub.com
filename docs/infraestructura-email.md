# Infraestructura de Email — POP Perote

## Resumen

Servidor de email completo instalado en el VPS (`76.13.123.24`) usando **MailCow** para el dominio `popgastropub.com`.

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         VPS Hostinger                            │
│                     76.13.123.24 (Ubuntu 24.04)                │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    MailCow (Docker)                        │  │
│  │                                                            │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐   │  │
│  │  │   Postfix    │  │   Dovecot    │  │      SOGo      │   │  │
│  │  │   (SMTP)     │  │   (IMAP/POP) │  │   (Webmail)    │   │  │
│  │  │  25,465,587  │  │  143,993     │  │                │   │  │
│  │  └──────────────┘  └──────────────┘  └────────────────┘   │  │
│  │                                                            │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐   │  │
│  │  │    Rspamd    │  │    ClamAV     │  │     MySQL      │   │  │
│  │  │ (Anti-Spam)  │  │(Anti-Virus)  │  │   (Datos)      │   │  │
│  │  └──────────────┘  └──────────────┘  └────────────────┘   │  │
│  │                                                            │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐   │  │
│  │  │   Unbound    │  │    Redis     │  │   PHP-FPM      │   │  │
│  │  │ (DNS Local)  │  │   (Cache)    │  │                │   │  │
│  │  └──────────────┘  └──────────────┘  └────────────────┘   │  │
│  │                                                            │  │
│  │  ┌──────────────┐  ┌──────────────┐                       │  │
│  │  │    ACME      │  │   Watchdog    │                       │  │
│  │  │(SSL/Let's    │  │ (Monitoreo)  │                       │  │
│  │  │ Encrypt)     │  │              │                       │  │
│  │  └──────────────┘  └──────────────┘                       │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────┐      ┌─────────────────────────────┐ │
│  │    Dokploy Stack    │      │    POP_PEROTE Stack          │ │
│  │  - Traefik (80/443)│      │  - Backend (Laravel)         │ │
│  │  - PostgreSQL      │      │  - Frontend (Next.js)        │ │
│  │  - Redis           │      │  - Nginx                     │ │
│  └─────────────────────┘      └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ Puerto 25, 465, 587, 143, 993
                            ▼
                    ┌──────────────────┐
                    │   Internet       │
                    │  (Envío/Recepción│
                    │   de emails)     │
                    └──────────────────┘
```

---

## Contenedores MailCow (18 servicios)

| Contenedor | Función | Puerto |
|------------|---------|--------|
| `postfix-mailcow` | Servidor SMTP (envío) | 25, 465, 587 |
| `dovecot-mailcow` | Servidor IMAP/POP (recibo) | 143, 993, 110, 995 |
| `nginx-mailcow` | Proxy web + SSL | 8080, 8443 |
| `sogo-mailcow` | Webmail (SOGo) | - |
| `php-fpm-mailcow` | PHP para webmail | - |
| `mysql-mailcow` | Base de datos MailCow | 13306 |
| `rspamd-mailcow` | Filtro anti-spam | - |
| `clamd-mailcow` | Anti-virus | - |
| `unbound-mailcow` | Resolver DNS local | - |
| `redis-mailcow` | Cache | 7654 |
| `memcached-mailcow` | Cache de sesión | - |
| `acme-mailcow` | SSL Let's Encrypt | - |
| `netfilter-mailcow` | Firewall contenedores | - |
| `watchdog-mailcow` | Monitoreo de salud | - |
| `ofelia-mailcow` | Jobs programados | - |
| `dockerapi-mailcow` | API Docker | - |
| `olefy-mailcow` | Filtro Office docs | - |
| `postfix-tlspol-mailcow` | Políticas TLS | - |

---

## Configuración DNS (Cloudflare)

| Tipo | Host | Valor | Proxy |
|------|------|-------|-------|
| A | `mail` | `76.13.123.24` | DNS only |
| MX | `@` | `mail.popgastropub.com` (10) | - |
| TXT | `@` | `v=spf1 mx a:mail.popgastropub.com ~all` | - |

**Nota:** El registro DKIM se genera automáticamente al crear el primer dominio en MailCow.

---

## Acceso

### Panel de Administración MailCow
- **URL:** `https://76.13.123.24:8443`
- **Usuario:** `admin`
- **Contraseña:** `moohoo`

### Webmail (SOGo)
- **URL:** `https://76.13.123.24:8443/SOGo`
- **Importante:** Para acceder al webmail, primero iniciar sesión en el panel de MailCow y luego hacer clic en el buzón. El formulario directo de SOGo (`/SOGo/connect`) no funciona directamente—usar el flujo SSO desde el panel.
- **Flujo SSO:** Panel MailCow → Login con email → Redirige a SOGo automáticamente

### Servicios de Email

| Servicio | Host | Puerto | SSL |
|----------|------|--------|-----|
| SMTP | `mail.popgastropub.com` | 25 | No |
| SMTPS | `mail.popgastropub.com` | 465 | Sí |
| Submission | `mail.popgastropub.com` | 587 | STARTTLS |
| IMAP | `mail.popgastropub.com` | 143 | STARTTLS |
| IMAPS | `mail.popgastropub.com` | 993 | Sí |
| POP3 | `mail.popgastropub.com` | 110 | STARTTLS |
| POP3S | `mail.popgastropub.com` | 995 | Sí |

---

## Cuentas de Email

Todas las cuentas fueron creadas y verificadas (IMAP/SMTP auth funcional).

| Email | Propósito | Contraseña temporal |
|-------|-----------|---------------------|
| `admin@popgastropub.com` | Administración | `PopPerote2026!` |
| `facturacion@popgastropub.com` | Facturación CFDI | `PopPerote2026!` |
| `soporte@popgastropub.com` | Soporte al cliente | `PopPerote2026!` |
| `ventas@popgastropub.com` | Ventas | `PopPerote2026!` |
| `meseros@popgastropub.com` | Staff/meseros | `PopPerote2026!` |

**Nota:** Cambiar contraseñas desde MailCow → Emails → Mailboxes → Editar mailbox. Se recomienda establecer contraseñas únicas y fuertes para cada cuenta.

---

## Integración con Laravel (POP_PEROTE)

### Variables de entorno (.env)

```env
MAIL_MAILER=smtp
MAIL_HOST=mail.popgastropub.com
MAIL_PORT=587
MAIL_USERNAME=usuario@popgastropub.com
MAIL_PASSWORD=contraseña_segura
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=facturacion@popgastropub.com
MAIL_FROM_NAME="POP Perote"
```

### Prueba de conexión SMTP

```bash
# Verificar que SMTP acepta conexiones
nc -zv mail.popgastropub.com 587

# Probar envío con OpenSSL
openssl s_client -connect mail.popgastropub.com:587 -starttls smtp
```

---

## Mantenimiento

### Reiniciar MailCow
```bash
cd /opt/mailcow-dockerized
docker compose restart
```

### Ver logs
```bash
docker compose logs -f
```

### Actualizar MailCow
```bash
cd /opt/mailcow-dockerized
docker compose pull
docker compose up -d
```

### Respaldar datos
```bash
cd /opt/mailcow-dockerized
docker compose down
tar -czf mailcow_backup_$(date +%Y%m%d).tar.gz data/
docker compose up -d
```

---

## Troubleshooting

### Autenticación IMAP/SMTP falla (400 Bad Request)
Los health checks internos de MailCow generan errores 400 en `mailcowauth.php` (usuario `watchdog@invalid`). Esto es normal y no afecta la autenticación de usuarios reales.

Si la autenticación de usuarios falla:
1. Verificar que la contraseña del buzón sea correcta (resetear desde MailCow API o panel)
2. Verificar conexión Dovecot→nginx: `docker exec mailcowdockerized-dovecot-mailcow-1 wget --no-check-certificate -O- --post-data='{"username":"test@popgastropub.com","password":"PASS","real_rip":"1.2.3.4","service":"IMAP"}' --header='Content-Type: application/json' https://nginx:9082/`
3. Ver logs: `docker logs mailcowdockerized-php-fpm-mailcow-1 2>&1 | grep MAILCOWAUTH`

### Puerto 25 bloqueado para envío
Si el puerto 25 está bloqueado por el ISP, usar puerto 587 con TLS.

### Emails van a spam
1. Verificar SPF, DKIM y DMARC en DNS
2. Revisar reputación del IP en Spamhaus
3. Configurar DMARC en Cloudflare

### No recibe emails
1. Verificar registro MX en DNS
2. Revisar que Postfix esté corriendo
3. Ver logs: `docker compose logs postfix-mailcow`

---

## Ubicación en el Servidor

- **Directorio MailCow:** `/opt/mailcow-dockerized`
- **Datos:** `/opt/mailcow-dockerized/data`
- **Configuración:** `/opt/mailcow-dockerized/mailcow.conf`
- **Logs Docker:** `docker compose logs -f`

---

## Estado de Servicios

```bash
# Verificar estado de contenedores
docker ps --format 'table {{.Names}}\t{{.Status}}' | grep mailcow

# Verificar puertos escuchando
ss -tlnp | grep -E ':25|:465|:587|:993|:995|:110|:143|:4190'
```

---

---

## Flujo de Autenticación

```
Cliente Email → Dovecot (IMAP/POP3)
                    ↓
            Lua script (passwd-verify.lua)
                    ↓
            HTTPS POST → nginx:9082
                    ↓
            PHP-FPM (mailcowauth.php)
                    ↓
            MySQL (validar usuario/contraseña)
                    ↓
            {success: true/false}
```

**Nota:** Dovecot usa un script Lua (`/etc/dovecot/auth/passwd-verify.lua`) que envía credenciales via HTTPS interno al endpoint `mailcowauth.php` en el contenedor PHP-FPM. Los errores 400 en los logs son causados por health checks internos (watchdog@invalid), no por autenticaciones reales.

---

*Documento generado: Abril 2026*
