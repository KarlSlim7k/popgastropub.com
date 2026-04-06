const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://pop-perote.com/api'

interface FetchOptions extends RequestInit {
  params?: Record<string, string>
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

  const response = await fetch(url.toString(), {
    ...rest,
    headers,
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error desconocido' }))
    throw new Error(error.message || `Error ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

export async function fetchWithAuth<T>(
  endpoint: string,
  token: string,
  options: FetchOptions = {}
): Promise<T> {
  return fetchAPI<T>(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  })
}
