const KATEX_DELIMITERS = [
  { left: '\\(', right: '\\)', display: false },
  { left: '\\[', right: '\\]', display: true },
  { left: '$', right: '$', display: false },
  { left: '$$', right: '$$', display: true }
]

function waitForRenderMathInElement(timeoutMs = 10000) {
  if (typeof window.renderMathInElement === 'function') return Promise.resolve()
  return new Promise((resolve, reject) => {
    const start = Date.now()
    const check = () => {
      if (typeof window.renderMathInElement === 'function') {
        resolve()
        return
      }
      if (Date.now() - start >= timeoutMs) {
        reject(new Error('KaTeX auto-render load timeout'))
        return
      }
      setTimeout(check, 50)
    }
    check()
  })
}

/**
 * Run KaTeX auto-render on the element. No-op if element missing; waits for script if needed.
 * @param {Element} el
 * @returns {Promise<void>}
 */
export function renderKatex(el) {
  if (!el || typeof el.textContent === 'undefined') return Promise.resolve()
  return waitForRenderMathInElement()
    .then(() => {
      window.renderMathInElement(el, { delimiters: KATEX_DELIMITERS })
    })
    .catch(() => {})
}
