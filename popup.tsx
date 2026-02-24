import { useEffect, useState } from "react"
import "./style.css"
import { useStorage } from "@plasmohq/storage/hook"

function IndexPopup() {
  const [apiUrl, setApiUrl] = useStorage("api_url", "")

  const [tempUrl, setTempUrl] = useState("")

  useEffect(() => {
    if (apiUrl) setTempUrl(apiUrl)
  }, [apiUrl])

  const handleSaveServer = (e: React.FormEvent) => {
    e.preventDefault()
    const formattedUrl = tempUrl.trim().replace(/\/$/, "")
    setApiUrl(formattedUrl)
  }

  if (!apiUrl) {
    return (
      <div className="p-6 flex flex-col space-y-5 bg-tech-surface border border-tech-border">
        <h2 className="text-xl font-bold text-tech-primary font-mono text-center tracking-widest">
          SETUP
        </h2>
        <form onSubmit={handleSaveServer} className="flex flex-col space-y-4">
          <div>
            <label className="text-xs text-tech-muted mb-1 block font-mono">
              SERVER ADDRESS
            </label>
            <input
              type="url"
              placeholder="np. http://192.168.1.100:5000"
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              className="w-full bg-tech-bg border border-tech-border focus:border-tech-primary text-white px-3 py-2 text-sm focus:outline-none font-mono transition-colors placeholder:text-tech-muted/50"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-tech-primary text-tech-bg font-bold font-mono py-2 px-4 hover:bg-white transition-colors">
            SAVE SERVER
          </button>
        </form>
      </div>
    )
  }
  return (
    <div className="p-6 flex flex-col items-center justify-center bg-tech-surface border border-tech-border text-center">
      <p className="text-tech-primary font-mono mb-4">Address saved:</p>
      <p className="text-xs text-tech-muted font-mono break-all bg-tech-bg p-2 rounded">
        {apiUrl}
      </p>

      <button
        onClick={() => setApiUrl("")}
        className="mt-6 text-xs text-tech-muted hover:text-red-400 font-mono transition-colors">
        [ change server address ]
      </button>
    </div>
  )
}

export default IndexPopup
