import { FilePlus } from "lucide-react"
import type { PlasmoCSConfig } from "plasmo"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { useEffect } from "react"
import { apiFetchViaBackground } from "../lib/api"

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"]
}

export default function YouTubeWatchKnowledgeOS() {
  useEffect(() => {
    console.log("[KnowledgeOS] Content script initialized")
    let lastUrl = ""

    const observer = new MutationObserver(() => {
      if (!window.location.pathname.startsWith("/watch")){

        console.log("[KnowledgeOS] Cant find video page, skipping...")
        return}

      const currentUrl = window.location.href.split('&')[0]
      const flexContainer = document.querySelector('ytd-menu-renderer.ytd-watch-metadata #flexible-item-buttons')

      if (!flexContainer) return

      const downloadWrapper = flexContainer.querySelector('ytd-download-button-renderer') as HTMLElement

      if (downloadWrapper && downloadWrapper.style.display !== 'none') {
        downloadWrapper.style.display = 'none'
      }

      let kosBtn = document.getElementById("kos-watch-btn-wrapper")

      if (kosBtn && lastUrl !== currentUrl) {
        const span = kosBtn.querySelector('#kos-watch-text') as HTMLDivElement
        const svg = kosBtn.querySelector('svg')
        if (span) span.innerText = "KnowledgeOS"
        if (svg) svg.setAttribute("stroke", "#a3ffbf")
        lastUrl = currentUrl
      }

      if (!kosBtn) {
        lastUrl = currentUrl
        kosBtn = document.createElement("yt-button-view-model")
        kosBtn.className = "ytd-menu-renderer"
        kosBtn.id = "kos-watch-btn-wrapper"

        kosBtn.innerHTML = `
          <button-view-model class="ytSpecButtonViewModelHost style-scope ytd-menu-renderer">
            <button class="yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading yt-spec-button-shape-next--enable-backdrop-filter-experiment" title="Add to KnowledgeOS" aria-label="KnowledgeOS">
              <div aria-hidden="true" class="yt-spec-button-shape-next__icon">
                <span class="ytIconWrapperHost" style="width: 24px; height: 24px;">
                  <span class="yt-icon-shape ytSpecIconShapeHost">
                    <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; fill: currentcolor;">
                      ${renderToStaticMarkup(createElement(FilePlus, { size: 20, stroke: "#a3ffbf", strokeWidth: 2 }))}
                    </div>
                  </span>
                </span>
              </div>
              <div class="yt-spec-button-shape-next__button-text-content" id="kos-watch-text">KnowledgeOS</div>
              <yt-touch-feedback-shape aria-hidden="true" class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response">
                <div class="yt-spec-touch-feedback-shape__stroke"></div>
                <div class="yt-spec-touch-feedback-shape__fill"></div>
              </yt-touch-feedback-shape>
            </button>
          </button-view-model>
        `

        kosBtn.onclick = async (e) => {
          e.preventDefault()
          e.stopPropagation()

          const span = kosBtn!.querySelector('#kos-watch-text') as HTMLDivElement
          const svg = kosBtn!.querySelector('svg')!

          if (span.innerText === "Saved!") return
          span.innerText = "Saving..."

          try {
            await apiFetchViaBackground("/api/Resources", {
              method: "POST",
              body: { url: currentUrl, addToVault: false }
            })
            span.innerText = "Saved!"
            svg.setAttribute("stroke", "#4ade80")
          } catch (err) {
            console.error("[KnowledgeOS] Error saving video:", err)
            span.innerText = "Error!"
            svg.setAttribute("stroke", "#f87171")
          }
        }

        if (downloadWrapper) {
          flexContainer.insertBefore(kosBtn, downloadWrapper)
        } else {
          flexContainer.appendChild(kosBtn)
        }
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return null
}