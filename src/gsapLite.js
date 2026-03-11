const RESERVED_KEYS = new Set([
  'duration',
  'delay',
  'ease',
  'repeat',
  'yoyo',
  'onComplete',
])

function applyVars(target, vars) {
  if (!target || !vars) return
  Object.entries(vars).forEach(([key, value]) => {
    if (!RESERVED_KEYS.has(key) && key in target && typeof value === 'number') {
      target[key] = value
    }
  })
}

function to(target, vars = {}) {
  const delayMs = ((vars.delay || 0) + (vars.duration || 0)) * 1000
  applyVars(target, vars)

  let timer = null
  if (typeof vars.onComplete === 'function') {
    timer = setTimeout(() => {
      vars.onComplete()
    }, delayMs)
  }

  return {
    kill() {
      if (timer) {
        clearTimeout(timer)
      }
    },
  }
}

function timeline(options = {}) {
  let totalSeconds = 0
  let doneTimer = null

  const api = {
    to(target, vars = {}) {
      const segment = (vars.delay || 0) + (vars.duration || 0)
      totalSeconds += segment
      applyVars(target, vars)
      return api
    },
    kill() {
      if (doneTimer) {
        clearTimeout(doneTimer)
      }
    },
  }

  doneTimer = setTimeout(() => {
    if (typeof options.onComplete === 'function') {
      options.onComplete()
    }
  }, totalSeconds * 1000)

  return api
}

const gsap = { to, timeline }

export default gsap
