import { useState, useEffect } from "react"
import { apiFetch } from "~lib/api"

export function InboxAdder() {
  const [currentUrl, setCurrentUrl] = useState<string>("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    async function getActiveTabUrl() {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (tab?.url) {
        setCurrentUrl(tab.url)
      }
    }
    getActiveTabUrl()
  }, [])

  const handleAddToInbox = async () => {
    if (!currentUrl) return

    setStatus("loading")
    setErrorMessage("")

    try {
      await apiFetch("/api/Resources", {
        method: "POST",
        body: {
          url: currentUrl,
          addToVault: false
        }
      })

      setStatus("success")
      setTimeout(() => window.close(), 1500)

    } catch (error: any) {
      console.error(error)
      setStatus("error")
      setErrorMessage("Failed to save. Check server logs.")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-6 w-full">
      <div className="text-center w-full">
        <h2 className="text-2xl font-bold text-tech-primary tracking-wider">KnowledgeOS</h2>
        <p className="text-[10px] text-tech-muted mt-2 font-mono truncate px-2 border border-tech-border bg-tech-bg py-1">
          {currentUrl || "Retrieving URL..."}
        </p>
      </div>

      <button
        onClick={handleAddToInbox}
        disabled={status === "loading" || status === "success" || !currentUrl}
        className="w-full bg-tech-primary-dim border border-tech-primary hover:bg-tech-primary/20 text-tech-primary font-mono py-3 px-4 transition-all disabled:opacity-50"
      >
        {status === "loading" ? "> SAVING..." : status === "success" ? "> SAVED!" : "> ADD TO INBOX"}
      </button>

      {status === "error" && (
        <p className="text-red-400 text-xs text-center font-mono">{errorMessage}</p>
      )}

    </div>
  )
}