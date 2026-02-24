import { useState } from "react"
import { useStorage } from "@plasmohq/storage/hook"
import { Settings } from "lucide-react"

import { LoginForm } from "~components/LoginForm"
import "./style.css"

function IndexPopup() {
  const [apiUrl, setApiUrl] = useStorage("api_url", "")
  const [token, setToken] = useStorage("jwt_token", "")

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [tempUrl, setTempUrl] = useState("")

  const handleSaveServer = (e: React.FormEvent) => {
    e.preventDefault()
    setApiUrl(tempUrl.trim().replace(/\/$/, ""))
    setIsSettingsOpen(false)
  }

  const showSettings = isSettingsOpen || !apiUrl

  return (
    <div className="relative p-6 flex flex-col bg-tech-surface border border-tech-border min-h-[300px] justify-center">

      {!showSettings && (
        <button
          onClick={() => {
            setTempUrl(apiUrl || "")
            setIsSettingsOpen(true)
          }}
          className="absolute top-4 right-4 text-tech-muted hover:text-tech-primary transition-colors"
          title="Server settings"
        >
          <Settings size={18} />
        </button>
      )}

      {showSettings && (
        <div className="flex flex-col space-y-5 w-full">
          <h2 className="text-xl font-bold text-tech-primary font-mono text-center tracking-widest">SETUP</h2>
          <form onSubmit={handleSaveServer} className="flex flex-col space-y-4">
            <div>
              <label className="text-xs text-tech-muted mb-1 block font-mono">SERVER ADDRESS</label>
              <input
                type="url"
                placeholder="e.g. http://localhost:7150"
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                className="w-full bg-tech-bg border border-tech-border focus:border-tech-primary text-white px-3 py-2 text-sm focus:outline-none font-mono transition-colors"
                required
              />
            </div>
            <button type="submit" className="w-full bg-tech-primary text-tech-bg font-bold font-mono py-2 px-4 hover:bg-white transition-colors">
              SAVE SERVER
            </button>
            {apiUrl && (
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="text-xs text-tech-muted hover:text-tech-primary font-mono transition-colors text-center mt-2"
              >
                [ cancel ]
              </button>
            )}
          </form>
        </div>
      )}

      {!showSettings && !token && <LoginForm />}

      {!showSettings && token && (
        <div className="flex flex-col items-center justify-center space-y-6 w-full">
          <h2 className="text-2xl font-bold text-tech-primary tracking-wider">KnowledgeOS</h2>
          <p className="text-xs text-tech-muted">Logged in successfully!</p>
          <button
            onClick={() => setToken("")}
            className="text-xs text-tech-muted hover:text-tech-primary font-mono transition-colors"
          >
            [ logout ]
          </button>
        </div>
      )}

    </div>
  )
}

export default IndexPopup