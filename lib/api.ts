import { Storage } from "@plasmohq/storage"

const storage = new Storage()

interface ApiRequestOptions {
  method?: string
  body?: any
}

export async function apiFetch<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  const apiUrl = await storage.get<string>("api_url")
  const token = await storage.get<string>("jwt_token")

  if (!apiUrl) throw new Error("Server address not set.")

  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${apiUrl}${endpoint}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  })

  if (!response.ok) {
    if (response.status === 401) {
      await storage.remove("jwt_token")
    }
    const errorData = await response.text()
    throw new Error(errorData || `Błąd serwera HTTP ${response.status}`)
  }
  if (response.status === 204) return {} as T

  return response.json()
}