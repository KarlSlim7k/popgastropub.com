export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.popgastropub.com/api'
const API_ORIGIN = API_URL.replace(/\/api\/?$/, '')
const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])
let csrfRequest: Promise<void> | null = null

interface FetchOptions extends RequestInit {
  params?: Record<string, string>
}

const VALIDATION_FALLBACK: Record<string, Record<string, string>> = {
  es: {
    required: 'Este campo es obligatorio.',
    email: 'Verifica el formato. Ejemplo: tucorreo@dominio.com.',
    unique: 'Este valor ya está registrado. Usa otro diferente.',
    regex: 'El formato ingresado no es válido.',
    min: 'Debe tener al menos :min caracteres.',
    max: 'Debe tener máximo :max caracteres.',
    confirmed: 'La confirmación no coincide.',
    accepted: 'Debes aceptar para continuar.',
    numeric: 'Solo se permiten números.',
    'before:today': 'La fecha debe ser anterior a hoy.',
  },
}

function humanizeRuleMessage(rule: string, field: string): string {
  const map = VALIDATION_FALLBACK.es
  const [name, ...paramParts] = rule.split(':')
  const paramString = paramParts.join(':')
  const params: Record<string, string> = {}
  if (paramString) {
    for (const part of paramString.split(',')) {
      const [k, v] = part.split('=')
      if (k && v) params[k.trim()] = v.trim()
    }
  }
  let template = map[name] ?? `Verifica el campo "${field}".`
  for (const [k, v] of Object.entries(params)) {
    template = template.replace(`:${k}`, v)
  }
  return template
}

export function translateValidationMessage(message: string, field: string): string {
  if (!message.startsWith('validation.')) return message
  const rule = message.replace(/^validation\./, '')
  return humanizeRuleMessage(rule, field)
}

export class APIError extends Error {
  status: number
  errors: Record<string, string[]>

  constructor(message: string, status: number, errors: Record<string, string[]> = {}) {
    super(message)
    this.name = 'APIError'
    this.status = status
    this.errors = errors
  }

  getFieldError(field: string): string | undefined {
    const raw = this.errors[field]?.[0]
    if (!raw) return undefined
    return translateValidationMessage(raw, field)
  }

  getAllMessages(): string {
    const fieldMessages: string[] = []
    for (const [field, messages] of Object.entries(this.errors)) {
      for (const msg of messages) {
        fieldMessages.push(translateValidationMessage(msg, field))
      }
    }
    if (fieldMessages.length > 0) {
      return fieldMessages.join('. ')
    }
    return this.message
  }
}

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null

  const prefix = `${encodeURIComponent(name)}=`
  const cookie = document.cookie.split('; ').find((entry) => entry.startsWith(prefix))

  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null
}

async function ensureCsrfCookie(): Promise<void> {
  if (readCookie('XSRF-TOKEN')) return

  csrfRequest ??= fetch(`${API_ORIGIN}/sanctum/csrf-cookie`, {
    credentials: 'include',
    headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
  }).then((response) => {
    if (!response.ok && response.status !== 204) {
      throw new APIError('No fue posible iniciar la sesión segura.', response.status)
    }
  }).finally(() => {
    csrfRequest = null
  })

  await csrfRequest
}

export async function fetchWithCsrf(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const method = (init.method ?? 'GET').toUpperCase()
  const headers = new Headers(init.headers)

  if (UNSAFE_METHODS.has(method)) {
    await ensureCsrfCookie()
    const csrfToken = readCookie('XSRF-TOKEN')
    if (!csrfToken) {
      throw new APIError('No fue posible validar la sesión segura.', 419)
    }
    headers.set('X-XSRF-TOKEN', csrfToken)
  }

  headers.set('X-Requested-With', 'XMLHttpRequest')

  return fetch(input, {
    ...init,
    headers,
    credentials: 'include',
  })
}

export async function fetchAPI<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, headers: customHeaders, ...rest } = options

  const url = new URL(`${API_URL}${endpoint}`)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(customHeaders as Record<string, string> | undefined),
  }

  const response = await fetchWithCsrf(url.toString(), {
    ...rest,
    headers,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: 'Error desconocido' }))
    throw new APIError(
      body.message || `Error ${response.status}: ${response.statusText}`,
      response.status,
      body.errors ?? {}
    )
  }

  return response.json()
}

export async function fetchWithAuth<T>(
  endpoint: string,
  token: string,
  options: FetchOptions = {}
): Promise<T> {
  void token
  return fetchAPI<T>(endpoint, options)
}

export async function fetchBlobWithAuth(endpoint: string, token: string): Promise<Blob> {
  void token
  const response = await fetchWithCsrf(new URL(`${API_URL}${endpoint}`).toString(), {
    headers: {
      Accept: '*/*',
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error desconocido' }))
    throw new Error(error.message || `Error ${response.status}: ${response.statusText}`)
  }

  return response.blob()
}

export async function openAuthenticatedFile(endpoint: string, token: string): Promise<void> {
  const blob = await fetchBlobWithAuth(endpoint, token)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
}

export async function downloadAuthenticatedFile(endpoint: string, token: string, filename: string): Promise<void> {
  const blob = await fetchBlobWithAuth(endpoint, token)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
