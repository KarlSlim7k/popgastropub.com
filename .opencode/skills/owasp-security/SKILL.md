---
name: owasp-security
description: Use when reviewing code for security vulnerabilities, implementing authentication/authorization, handling user input, or discussing web application security. Covers OWASP Top 10:2025, ASVS 5.0, and Agentic AI security (2026). Especially relevant for the Next.js backend, JWT auth, and the PAC (facturación CFDI) integration.
license: MIT — https://github.com/agamm/claude-code-owasp
---

# OWASP Security Best Practices — POP Perote

Apply these security standards when writing or reviewing code for the POP Perote platform.

## Quick Reference: OWASP Top 10:2025

| # | Vulnerability | Key Prevention |
|---|---------------|----------------|
| A01 | Broken Access Control | Deny by default, enforce server-side, verify ownership |
| A02 | Security Misconfiguration | Harden configs, disable defaults, minimize features |
| A03 | Supply Chain Failures | Lock versions, verify integrity, audit dependencies |
| A04 | Cryptographic Failures | TLS 1.2+, AES-256-GCM, bcrypt/Argon2 for passwords |
| A05 | Injection | Parameterized queries, input validation, safe APIs |
| A06 | Insecure Design | Threat model, rate limit, design security controls |
| A07 | Auth Failures | MFA, check breached passwords, secure sessions |
| A08 | Integrity Failures | Sign packages, SRI for CDN, safe serialization |
| A09 | Logging Failures | Log security events, structured format, alerting |
| A10 | Exception Handling | Fail-closed, hide internals, log with context |

## Security Code Review Checklist

### Input Handling
- [ ] All user input validated server-side (Zod schemas)
- [ ] Using parameterized queries (Prisma/Drizzle, no raw SQL)
- [ ] Input length limits enforced
- [ ] Allowlist validation preferred over denylist

### Authentication & Sessions
- [ ] Passwords hashed with bcrypt/Argon2 (not MD5/SHA1)
- [ ] Session tokens have sufficient entropy (128+ bits)
- [ ] Sessions invalidated on logout
- [ ] JWT expiration set (access: 15min, refresh: 7d)

### Access Control
- [ ] Authorization checked on every request
- [ ] Using object references user cannot manipulate
- [ ] Deny by default policy
- [ ] Privilege escalation paths reviewed

### Data Protection
- [ ] Sensitive data encrypted at rest
- [ ] TLS for all data in transit
- [ ] No sensitive data in URLs/logs
- [ ] Secrets in environment variables (not code)

### Error Handling
- [ ] No stack traces exposed to users
- [ ] Fail-closed on errors (deny, not allow)
- [ ] All exceptions logged with context
- [ ] Consistent error responses (no enumeration)

## Secure Code Patterns

### SQL Injection Prevention (Prisma)
```typescript
// UNSAFE — raw SQL with concatenation
const user = await db.$queryRaw`SELECT * FROM usuarios WHERE email = '${email}'`

// SAFE — Prisma ORM
const user = await db.usuario.findUnique({ where: { email } })

// SAFE — parameterized raw query
const user = await db.$queryRaw`SELECT * FROM usuarios WHERE email = ${email}`
```

### Password Storage (Next.js)
```typescript
import bcrypt from 'bcryptjs'

// UNSAFE
const hash = crypto.createHash('md5').update(password).digest('hex')

// SAFE — bcrypt cost 12
const hash = await bcrypt.hash(password, 12)
const isValid = await bcrypt.compare(password, hash)
```

### Access Control (Next.js API)
```typescript
// UNSAFE — no authorization check
export async function GET(request: NextRequest) {
  const factura = await db.factura.findUnique({ where: { id: params.id } })
  return Response.json(factura)
}

// SAFE — authorization enforced
export async function GET(request: NextRequest) {
  const auth = await getAuth(request)
  const factura = await db.factura.findUnique({ where: { id: params.id } })
  
  if (!factura) {
    return Response.error('Factura no encontrada', 404)
  }
  
  if (factura.usuarioId !== auth.userId && auth.rol !== 'admin') {
    return Response.error('No autorizado', 403)
  }
  
  return Response.json({ success: true, data: factura })
}
```

### Error Handling (Next.js)
```typescript
// UNSAFE — exposes internals
} catch (error: any) {
  return Response.json({ error: error.message }, 500)
}

// SAFE — fail-closed, log context
} catch (error) {
  console.error('Error en FacturacionController:', error)
  return Response.error('Error interno del servidor', 500)
}
```

### Fail-Closed Pattern
```typescript
// UNSAFE — fail-open
async function verificarPermiso(userId: string, recursoId: string): Promise<boolean> {
  try {
    return await checkPermission(userId, recursoId)
  } catch (e) {
    return true // PELIGROSO
  }
}

// SAFE — fail-closed
async function verificarPermiso(userId: string, recursoId: string): Promise<boolean> {
  try {
    return await checkPermission(userId, recursoId)
  } catch (e) {
    console.error("Auth check failed:", e)
    return false // Denegar en caso de error
  }
}
```

## Security for Facturación CFDI Module

| Risk | Description | Mitigation |
|------|-------------|------------|
| RFC Injection | Malformed RFC in CFDI | Validar RFC contra formato SAT antes de enviar al PAC |
| PAC API Key Exposure | Key leaked to client | PAC credentials SOLO en server-side env vars |
| Ticket Photo Upload | Malicious file upload | Validar MIME type, size limit 10MB, scan for malware |
| CFDI Data Tampering | Modified invoice data | Firmar datos antes de enviar al PAC, verificar UUID recibido |
| Rate Limiting | Abuse of factura generation | Rate limit: max 5 facturas/hora por usuario |

## Environment Variables Security

```env
# .env.local — NUNCA commitear
DATABASE_URL="postgresql://..."
JWT_SECRET="<32+ caracteres aleatorios>"
NEXTAUTH_SECRET="<32+ caracteres aleatorios>"
PAC_API_KEY="<clave del PAC>"
PAC_API_URL="<URL del PAC>"
WHATSAPP_API_KEY="<clave WhatsApp Business>"
SENDGRID_API_KEY="<clave SendGrid>"

# .env.example — commitear sin valores reales
DATABASE_URL="postgresql://user:pass@host:5432/db"
JWT_SECRET="change-me"
NEXTAUTH_SECRET="change-me"
PAC_API_KEY=""
PAC_API_URL=""
WHATSAPP_API_KEY=""
SENDGRID_API_KEY=""
```

## Headers de Seguridad (Next.js middleware)

```typescript
// middleware.ts
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)')
  response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com;")
  
  return response
}
```
