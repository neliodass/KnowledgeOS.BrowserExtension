import { FilePlus } from "lucide-react"
import type { PlasmoCSConfig } from "plasmo"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { useEffect } from "react"
import { apiFetch } from "~lib/api"

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"]
}

export default function YouTubeKnowledgeOS() {
  useEffect(() => {
    let activeVideoUrl = ""

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      const menuRenderer = target.closest('.yt-lockup-metadata-view-model__menu-button, button-view-model')
      if (!menuRenderer) return

      const videoContainer = menuRenderer.closest('ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, #content')

      if (videoContainer) {
        const titleLink = videoContainer.querySelector('a#video-title-link, a#video-title, a[href^="/watch"]') as HTMLAnchorElement

        if (titleLink && titleLink.href) {
          activeVideoUrl = titleLink.href.split('&')[0]
          console.log("[KnowledgeOS] Video detected:", activeVideoUrl)
          const existingBtn = document.getElementById("kos-yt-btn")
          if (existingBtn) {
            const span = existingBtn.querySelector('#kos-yt-text') as HTMLSpanElement
            const svg = existingBtn.querySelector('svg')
            if (span) span.innerText = "Add to KnowledgeOS"
            if (svg) svg.setAttribute("stroke", "#a3ffbf")
          }
        }
      }
    }

    document.addEventListener("click", handleClick, true)

    const observer = new MutationObserver(() => {
      const listbox = document.querySelector('yt-list-view-model[role="listbox"]')

      if (listbox && activeVideoUrl) {
        if (!document.getElementById("kos-yt-btn")) {
          console.log("[KnowledgeOS] Injecting button into the new menu...")

          const btn = document.createElement("yt-list-item-view-model")
          btn.className = "yt-list-item-view-model"
          btn.setAttribute("role", "menuitem")
          btn.id = "kos-yt-btn"

          btn.innerHTML = `
            <div class="yt-list-item-view-model__label yt-list-item-view-model__container yt-list-item-view-model__container--compact yt-list-item-view-model__container--tappable yt-list-item-view-model__container--in-popup" style="cursor: pointer;">
              <div aria-hidden="true" class="yt-list-item-view-model__image-container yt-list-item-view-model__leading">
                <span class="ytIconWrapperHost yt-list-item-view-model__accessory yt-list-item-view-model__image" style="display:flex; align-items:center; justify-content:center;">
                  ${renderToStaticMarkup(createElement(FilePlus, { size: 24, stroke: "#a3ffbf", strokeWidth: 2 }))}
                </span>
              </div>
              <button class="ytButtonOrAnchorHost ytButtonOrAnchorButton yt-list-item-view-model__button-or-anchor" style="pointer-events: none; padding: 0;">
                <div class="yt-list-item-view-model__text-wrapper">
                  <div class="yt-list-item-view-model__title-wrapper">
                    <span id="kos-yt-text" class="yt-core-attributed-string yt-list-item-view-model__title yt-core-attributed-string--white-space-pre-wrap" role="text">Add to KnowledgeOS</span>
                  </div>
                </div>
              </button>
            </div>
          `

          btn.onclick = async (e) => {
            e.preventDefault()
            e.stopPropagation()

            const span = btn.querySelector('#kos-yt-text') as HTMLSpanElement
            const svg = btn.querySelector('svg')!

            span.innerText = "Saving..."

            try {
              await apiFetch("/api/Resources", {
                method: "POST",
                body: { url: activeVideoUrl, addToVault: false }
              })

              span.innerText = "Saved to Inbox!"
              svg.setAttribute("stroke", "#4ade80")

              setTimeout(() => document.body.click(), 1000)
            } catch (err) {
              console.error("[KnowledgeOS] Save error:", err)
              span.innerText = "Error!"
              svg.setAttribute("stroke", "#f87171")
            }
          }

          listbox.prepend(btn)
        }
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener("click", handleClick, true)
      observer.disconnect()
    }
  }, [])

  return null
}