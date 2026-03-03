import { Storage } from "@plasmohq/storage"

export {}

const storage = new Storage()

const onMessage = chrome.runtime.onMessage as any
onMessage.addListener((message: any, _sender: any, sendResponse: (r: any) => void) => {
  if (message.type === "KOS_API_REQUEST") {
    const promise = handleApiRequest(message.endpoint, message.options)
      .then((data) => ({ success: true, data }))
      .catch((err) => ({ success: false, error: err.message }))

    promise.then(sendResponse)
    return true
  }
})

async function handleApiRequest(
  endpoint: string,
  options: { method?: string; body?: any } = {}
) {
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

  if (response.status === 204) return {}

  return response.json()
}
