import { useState, useEffect } from "react"
import { useStorage } from "@plasmohq/storage/hook"

interface ServerSettingsProps {
  onClose: () => void
}

export function ServerSettings({ onClose }: ServerSettingsProps) {
  const [apiUrl, setApiUrl] = useStorage("api_url", "")
  const [tempUrl, setTempUrl] = useState("")

  useEffect(() => {
    if (apiUrl) setTempUrl(apiUrl)
  }, [apiUrl])

  const handleSaveServer = (e: React.FormEvent) => {
    e.preventDefault()
    let formattedUrl = tempUrl.trim().replace(/\/$/, "")

    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `http://${formattedUrl}`
    }

    setApiUrl(formattedUrl)
    onClose()
  }

  return (
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
            onClick={onClose}
            className="text-xs text-tech-muted hover:text-tech-primary font-mono transition-colors text-center mt-2"
          >
            [ cancel ]
          </button>
        )}
      </form>
    </div>
  )
}