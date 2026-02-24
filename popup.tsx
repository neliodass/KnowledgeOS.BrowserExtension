import { useState } from "react"
import { useStorage } from "@plasmohq/storage/hook"
import { Settings, LogOut } from "lucide-react"

import { ServerSettings } from "~components/ServerSettings"
import { LoginForm } from "~components/LoginForm"
import { InboxAdder } from "~components/InboxAdder"
import "./style.css"

function IndexPopup() {
  const [apiUrl] = useStorage("api_url", "")
  const [token, setToken] = useStorage("jwt_token", "")

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const showSettings = isSettingsOpen || !apiUrl

  return (
    <div className="relative p-6 flex flex-col bg-tech-surface border border-tech-border min-h-[300px] justify-center">

      {!showSettings && (
        <div className="absolute top-4 right-4 flex items-center space-x-3 text-tech-muted">
          {token && (
            <button
              onClick={() => setToken("")}
              className="hover:text-tech-primary transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          )}

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="hover:text-tech-primary transition-colors"
            title="Server settings"
          >
            <Settings size={16} />
          </button>
        </div>
      )}

      {showSettings && (
        <ServerSettings onClose={() => setIsSettingsOpen(false)} />
      )}

      {!showSettings && !token && (
        <LoginForm />
      )}

      {!showSettings && token && (
        <InboxAdder />
      )}

    </div>
  )
}

export default IndexPopup