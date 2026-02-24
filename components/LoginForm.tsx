import { useState } from "react"
import { useStorage } from "@plasmohq/storage/hook"
import { apiFetch } from "~lib/api"

export function LoginForm() {
  const [token, setToken] = useStorage("jwt_token", "")
  const [apiUrl] = useStorage("api_url", "")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const data = await apiFetch<{ token: string }>("/api/Auth/login", {
        method: "POST",
        body: { email, password }
      })

      setToken(data.token)
    } catch (err: any) {
      console.error(err)
      setError("Invalid credentials or server error.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col space-y-5 w-full">
      <div className="text-center">
        <h2 className="text-xl font-bold text-tech-primary font-mono tracking-widest">LOGIN</h2>
        <p className="text-[10px] text-tech-muted font-mono mt-1 truncate" title={apiUrl}>
          {apiUrl}
        </p>
      </div>
      <form onSubmit={handleLogin} className="flex flex-col space-y-4">
        <input
          type="email"
          placeholder="EMAIL"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-tech-bg border border-tech-border focus:border-tech-primary text-white px-3 py-2 text-sm focus:outline-none font-mono transition-colors placeholder:text-tech-muted"
          required
        />
        <input
          type="password"
          placeholder="PASSWORD"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-tech-bg border border-tech-border focus:border-tech-primary text-white px-3 py-2 text-sm focus:outline-none font-mono transition-colors placeholder:text-tech-muted"
          required
        />
        {error && <p className="text-red-400 text-xs font-mono text-center">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-tech-primary text-tech-bg font-bold font-mono py-2 px-4 hover:bg-white transition-colors disabled:opacity-50 mt-2"
        >
          {isLoading ? "CONNECTING..." : "ENTER"}
        </button>
      </form>
    </div>
  )
}