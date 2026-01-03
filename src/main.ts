import './style.css'

// Reveal page after CSS is loaded and parsed (prevents FOUC)
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.documentElement.classList.remove('loading')
  })
})

// ============================================
// Hero Spotlight Effect (follows mouse)
// ============================================
const heroSpotlight = document.getElementById('hero-spotlight')
const hero = document.querySelector('.hero')

if (heroSpotlight && hero) {
  hero.addEventListener('mousemove', (e: Event) => {
    const mouseEvent = e as MouseEvent
    const rect = (hero as HTMLElement).getBoundingClientRect()
    const x = mouseEvent.clientX - rect.left
    const y = mouseEvent.clientY - rect.top
    heroSpotlight.style.left = `${x}px`
    heroSpotlight.style.top = `${y}px`
    heroSpotlight.style.transform = 'translate(-50%, -50%)'
  })
}

// ============================================
// Parallax Effect for Hero Shapes
// ============================================
const parallaxShapes = document.querySelectorAll('[data-parallax]')
let lastScrollY = 0
let parallaxTicking = false

const updateParallax = () => {
  parallaxShapes.forEach((shape) => {
    const el = shape as HTMLElement
    const speed = parseFloat(el.dataset.parallax || '0')
    const yPos = lastScrollY * speed
    el.style.transform = `translateY(${yPos}px)`
  })
  parallaxTicking = false
}

window.addEventListener('scroll', () => {
  lastScrollY = window.scrollY
  if (!parallaxTicking) {
    requestAnimationFrame(updateParallax)
    parallaxTicking = true
  }
}, { passive: true })

// ============================================
// Animated Counters
// ============================================
const counters = document.querySelectorAll('.stat-number[data-count]')
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target as HTMLElement
      const target = parseInt(el.dataset.count || '0', 10)
      const suffix = el.textContent?.replace(/[\d,]/g, '') || ''
      animateCounter(el, target, suffix)
      counterObserver.unobserve(el)
    }
  })
}, { threshold: 0.5 })

counters.forEach(counter => counterObserver.observe(counter))

function animateCounter(el: HTMLElement, target: number, suffix: string) {
  const duration = 2000
  const start = performance.now()
  const startValue = 0

  el.classList.add('counting')

  const update = (currentTime: number) => {
    const elapsed = currentTime - start
    const progress = Math.min(elapsed / duration, 1)

    // Easing function (ease-out cubic)
    const eased = 1 - Math.pow(1 - progress, 3)
    const current = Math.round(startValue + (target - startValue) * eased)

    el.textContent = formatNumber(current) + suffix

    if (progress < 1) {
      requestAnimationFrame(update)
    } else {
      el.classList.remove('counting')
    }
  }

  requestAnimationFrame(update)
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(0) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K'
  return num.toString()
}

// ============================================
// Magnetic Buttons
// ============================================
const magneticButtons = document.querySelectorAll('.btn-magnetic')

magneticButtons.forEach(btn => {
  const el = btn as HTMLElement
  const btnText = el.querySelector('.btn-text') as HTMLElement

  el.addEventListener('mousemove', (e: MouseEvent) => {
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    // Subtle magnetic pull effect
    const pullStrength = 0.2
    el.style.transform = `translate(${x * pullStrength}px, ${y * pullStrength}px)`

    if (btnText) {
      btnText.style.transform = `translate(${x * pullStrength * 0.5}px, ${y * pullStrength * 0.5}px)`
    }
  })

  el.addEventListener('mouseleave', () => {
    el.style.transform = ''
    if (btnText) {
      btnText.style.transform = ''
    }
  })
})

// ============================================
// Scroll Progress Bar
// ============================================
const scrollProgress = document.getElementById('scroll-progress')
const updateScrollProgress = () => {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  const scrollPercent = (scrollTop / docHeight) * 100
  if (scrollProgress) {
    scrollProgress.style.width = `${scrollPercent}%`
  }
}

// ============================================
// Scroll Animations with Intersection Observer
// ============================================
const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .stagger-children')

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible')
    }
  })
}, { threshold: 0.1 })

requestAnimationFrame(() => {
  animatedElements.forEach(el => observer.observe(el))
})

// ============================================
// Header Scroll Effect
// ============================================
const header = document.querySelector('.header')
let scrollTicking = false

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      header?.classList.toggle('scrolled', window.scrollY > 50)
      updateScrollProgress()
      scrollTicking = false
    })
    scrollTicking = true
  }
}, { passive: true })

// ============================================
// Enhanced Card Tilt Effect
// ============================================
const cards = document.querySelectorAll('.feature-card, .detection-card, .extension-card, .demo-preview-card')

cards.forEach(card => {
  const el = card as HTMLElement

  el.addEventListener('mousemove', (e: MouseEvent) => {
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 25
    const rotateY = (centerX - x) / 25

    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
  })

  el.addEventListener('mouseleave', () => {
    el.style.transform = ''
  })
})

// ============================================
// FAQ Accordion + Smooth Scroll
// ============================================
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement

  // FAQ toggle
  const faqQuestion = target.closest('.faq-question')
  if (faqQuestion) {
    faqQuestion.parentElement?.classList.toggle('open')
    return
  }

  // Smooth scroll for anchor links
  const anchor = target.closest('a[href^="#"]')
  if (anchor) {
    const href = anchor.getAttribute('href')
    if (href && href !== '#') {
      e.preventDefault()
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
})

// ============================================
// Text Scramble Effect (optional, for headings)
// ============================================
class TextScramble {
  private el: HTMLElement
  private chars: string
  private queue: { from: string; to: string; start: number; end: number; char?: string }[]
  private frame: number
  private frameRequest: number
  private resolve: (() => void) | null

  constructor(el: HTMLElement) {
    this.el = el
    this.chars = '!<>-_\\/[]{}=+*^?#'
    this.queue = []
    this.frame = 0
    this.frameRequest = 0
    this.resolve = null
    this.update = this.update.bind(this)
  }

  setText(newText: string): Promise<void> {
    const oldText = this.el.innerText
    const length = Math.max(oldText.length, newText.length)
    this.queue = []

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ''
      const to = newText[i] || ''
      const start = Math.floor(Math.random() * 40)
      const end = start + Math.floor(Math.random() * 40)
      this.queue.push({ from, to, start, end })
    }

    cancelAnimationFrame(this.frameRequest)
    this.frame = 0

    return new Promise(resolve => {
      this.resolve = resolve
      this.update()
    })
  }

  private update() {
    let output = ''
    let complete = 0

    for (let i = 0; i < this.queue.length; i++) {
      const item = this.queue[i]

      if (this.frame >= item.end) {
        complete++
        output += item.to
      } else if (this.frame >= item.start) {
        if (!item.char || Math.random() < 0.28) {
          item.char = this.chars[Math.floor(Math.random() * this.chars.length)]
        }
        output += `<span style="color:var(--accent)">${item.char}</span>`
      } else {
        output += item.from
      }
    }

    this.el.innerHTML = output

    if (complete === this.queue.length) {
      if (this.resolve) this.resolve()
    } else {
      this.frameRequest = requestAnimationFrame(this.update)
      this.frame++
    }
  }
}

// Initialize text scramble on featured headings (optional)
const scrambleTargets = document.querySelectorAll('[data-scramble]')
scrambleTargets.forEach(el => {
  const scramble = new TextScramble(el as HTMLElement)
  const originalText = el.textContent || ''

  const scrambleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        scramble.setText(originalText)
        scrambleObserver.unobserve(entry.target)
      }
    })
  }, { threshold: 0.5 })

  scrambleObserver.observe(el)
})

// ============================================
// Mouse Trail Effect (subtle)
// ============================================
const createMouseTrail = () => {
  const trail = document.createElement('div')
  trail.style.cssText = `
    position: fixed;
    width: 8px;
    height: 8px;
    background: var(--accent);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.3s ease;
  `
  document.body.appendChild(trail)

  let mouseX = 0
  let mouseY = 0
  let trailX = 0
  let trailY = 0

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
    trail.style.opacity = '0.3'
  })

  document.addEventListener('mouseleave', () => {
    trail.style.opacity = '0'
  })

  const animate = () => {
    trailX += (mouseX - trailX) * 0.1
    trailY += (mouseY - trailY) * 0.1
    trail.style.left = `${trailX - 4}px`
    trail.style.top = `${trailY - 4}px`
    requestAnimationFrame(animate)
  }

  animate()
}

// Enable mouse trail (comment out if not wanted)
createMouseTrail()

// ============================================
// REAL INK UNIQUE: Typewriter Demo Animation
// ============================================
const typewriterTexts = [
  { text: "In today's rapidly evolving digital landscape...", isAI: true, result: "⚠️ AI Detected (87% confidence) - Formal tone, buzzwords" },
  { text: "My grandmother always said trust your gut.", isAI: false, result: "✓ Likely Human (94% confidence) - Natural voice, personal" },
  { text: "It is essential to consider the implications...", isAI: true, result: "⚠️ AI Detected (91% confidence) - Corporate speak detected" },
  { text: "Look, I don't know about you, but this is weird.", isAI: false, result: "✓ Likely Human (89% confidence) - Conversational, unique" },
]

const lineTextEl = document.querySelector('.line-text')
const typewriterResult = document.getElementById('typewriter-result')
let currentTextIndex = 0

function typeText(text: string, callback: () => void) {
  if (!lineTextEl) return

  let i = 0
  lineTextEl.textContent = ''

  const typeInterval = setInterval(() => {
    if (i < text.length) {
      lineTextEl.textContent += text[i]
      i++
    } else {
      clearInterval(typeInterval)
      setTimeout(callback, 500)
    }
  }, 50)
}

function showResult(result: string, isAI: boolean) {
  if (!typewriterResult) return

  typewriterResult.textContent = result
  typewriterResult.className = `typewriter-result visible ${isAI ? 'ai' : 'human'}`
}

function runTypewriterDemo() {
  const current = typewriterTexts[currentTextIndex]

  // Reset
  if (typewriterResult) {
    typewriterResult.className = 'typewriter-result'
  }

  typeText(current.text, () => {
    showResult(current.result, current.isAI)

    setTimeout(() => {
      currentTextIndex = (currentTextIndex + 1) % typewriterTexts.length
      runTypewriterDemo()
    }, 4000)
  })
}

// Start typewriter demo when visible
const typewriterDemo = document.querySelector('.typewriter-demo')
if (typewriterDemo) {
  const typewriterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runTypewriterDemo()
        typewriterObserver.unobserve(entry.target)
      }
    })
  }, { threshold: 0.3 })

  typewriterObserver.observe(typewriterDemo)
}

// ============================================
// REAL INK UNIQUE: Ink Trail on Mousemove
// ============================================
const inkTrailContainer = document.querySelector('.hero')
if (inkTrailContainer) {
  let inkTimeout: number | null = null

  inkTrailContainer.addEventListener('mousemove', (e: Event) => {
    const mouseEvent = e as MouseEvent

    if (inkTimeout) return

    inkTimeout = window.setTimeout(() => {
      inkTimeout = null
    }, 100)

    const ink = document.createElement('div')
    ink.style.cssText = `
      position: absolute;
      width: ${4 + Math.random() * 6}px;
      height: ${4 + Math.random() * 6}px;
      background: var(--accent);
      border-radius: 50%;
      pointer-events: none;
      left: ${mouseEvent.offsetX}px;
      top: ${mouseEvent.offsetY}px;
      opacity: 0.15;
      z-index: 1;
      animation: ink-fade 2s ease-out forwards;
    `

    inkTrailContainer.appendChild(ink)

    setTimeout(() => {
      ink.remove()
    }, 2000)
  })
}

// Add the ink-fade keyframes dynamically
const inkFadeStyle = document.createElement('style')
inkFadeStyle.textContent = `
  @keyframes ink-fade {
    0% { opacity: 0.15; transform: scale(1); }
    100% { opacity: 0; transform: scale(2); }
  }
`
document.head.appendChild(inkFadeStyle)
