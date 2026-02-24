import "~/style.css"

import { useState } from "react"

function IndexPopup() {
  const [data, setData] = useState("")

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">
        Welcome to your{" "}
        <a href="https://www.plasmo.com" target="_blank" className="text-blue-600 underline">
          Plasmo
        </a>{" "}
        Extension!
      </h2>
      <input
        className="border border-gray-300 rounded px-2 py-1 mb-2 w-full"
        onChange={(e) => setData(e.target.value)}
        value={data}
      />
      <a href="https://docs.plasmo.com" target="_blank" className="text-blue-600 underline">
        View Docs
      </a>
    </div>
  )
}

export default IndexPopup
