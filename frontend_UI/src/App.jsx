import { useState, useRef, useEffect, useMemo } from "react"
import "./App.css"
import heroCar from "./assets/_hero-car.png"
import heroCarWebp from "./assets/super.jpg"
import heroCarWebp2 from "./assets/Result.jpg"
import carvideo from "./assets/_small.mp4"
// =====================================================
// ASSETS — put your files in  public/assets/
// Every stage can use its own photo. Until you add more,
// they all point to the same car. Transparent PNG/WebP
// is strongly recommended (the running light follows the
// car silhouette).
// =====================================================
const CAR_IMAGE = heroCar
const CARS = {
  discover: heroCar,                 // hero + input
  analysis: heroCarWebp,                 // e.g. "/assets/car-analysis.png"
  result: heroCarWebp2,                   // e.g. "/assets/car-result.png"
}
const VIDEO_SRC = carvideo
const HISTORY_KEY = "auto-ai-history"

const FIELD_ACCENTS = ["var(--a1)", "var(--a2)", "var(--a3)"]

// Field definitions (names / values match the existing API payload)
const FIELDS = [
  { name: "brand", label: "Brand", type: "text", placeholder: "BMW" },
  { name: "fuel_type", label: "Fuel type", type: "select", options: [["petrol", "Petrol"], ["diesel", "Diesel"]] },
  { name: "transmission", label: "Transmission", type: "select", options: [["manual", "Manual"], ["automatic", "Automatic"]] },
  { name: "service_history", label: "Service history", type: "select", options: [["full", "Full"], ["partial", "Partial"], ["none", "None"]] },
  { name: "insurance_valid", label: "Insurance", type: "select", options: [["yes", "Valid"], ["no", "Expired"]] },
  { name: "color", label: "Color", type: "text", placeholder: "White" },
  { name: "make_year", label: "Manufacturing year", type: "number", placeholder: "2020", min: "1900", max: "2026" },
  { name: "mileage_kmpl", label: "Mileage (km/l)", type: "number", placeholder: "18.5", min: "0", step: "0.1" },
  { name: "engine_cc", label: "Engine (CC)", type: "number", placeholder: "1998", min: "1" },
  { name: "owner_count", label: "Previous owners", type: "number", placeholder: "2", min: "0" },
  { name: "accidents_reported", label: "Accidents reported", type: "number", placeholder: "0", min: "0" },
]

const NAV = [
  { id: "home", section: "hero", label: "Home" },
  { id: "valuation", section: "valuation", label: "Valuation" },
  { id: "result", section: "result", label: "AI Insight" },
  { id: "history", section: "history", label: "History" },
]

const STATUS = {
  discover: "Ready",
  input: "Ready",
  analyzing: "Analyzing vehicle",
  price: "Valuation complete",
  valuation: "Writing insight",
  insight: "Insight ready",
}

// ---------- LLM text formatting (never changes the wording) ----------
const NUM_RE = /(₹\s?[\d,]+(?:\.\d+)?|[\d,]*\d(?:\.\d+)?\s?%|\b\d[\d,]{3,}\b)/g

function highlight(text, base) {
  return text.split(NUM_RE).map((part, i) =>
    i % 2 ? <mark key={`${base}-${i}`}>{part}</mark> : part
  )
}

function renderInline(text) {
  return String(text)
    .split(/(\*\*[^*]+\*\*)/g)
    .map((seg, i) =>
      /^\*\*[^*]+\*\*$/.test(seg)
        ? <strong key={i}>{highlight(seg.slice(2, -2), i)}</strong>
        : <span key={i}>{highlight(seg, i)}</span>
    )
}

// Detects headings / bullet lists / paragraphs that already exist in the response
function parseExplanation(raw) {
  const blocks = []
  let list = null
  const flushList = () => { if (list) { blocks.push({ type: "ul", items: list }); list = null } }

  String(raw).replace(/\r/g, "").split("\n").forEach((l) => {
    const line = l.trim()
    if (!line) { flushList(); return }

    const md = line.match(/^#{1,6}\s+(.+)$/)
    const bold = line.match(/^(?:\d+[.)]\s*)?\*\*([^*]+)\*\*:?$/)
    const short = line.length <= 60 && line.endsWith(":") && !/^[-*•]/.test(line)

    if (md || bold || short) {
      flushList()
      const text = (md ? md[1] : bold ? bold[1] : line).replace(/\*\*/g, "").replace(/:$/, "").trim()
      blocks.push({ type: "h", text })
      return
    }

    const bullet = line.match(/^(?:[-*•]|\d+[.)])\s+(.+)$/)
    if (bullet) { list = list || []; list.push(bullet[1]); return }

    flushList()
    blocks.push({ type: "p", text: line })
  })
  flushList()
  return blocks
}

const reduceMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

function loadHistory() {
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch { return [] }
}

// =====================================================
// CAR STAGE — real photo + running light + scan + rings
// =====================================================
function CarStage({ src, vkey, pulseKey = 0 }) {
  const [bad, setBad] = useState(false)
  const url = bad ? CAR_IMAGE : src
  if (bad && src === CAR_IMAGE) return null

  return (
    <div className="car-stage" style={{ "--car": `url(${url})` }}>
      <div className="car-spot" />
      <div className="car-reveal" key={vkey}>
        <div className="car-par">
          <div className="car-cam">
            <div className="car-glow" />
            <img className="car-img" src={url} alt="" draggable="false" onError={() => setBad(true)} />
            <div className="rl rl-body" />
            <div className="rl rl-roof" />
            <div className="rl rl-wheels" />
            <div className="rl car-scan" />
            <div className="flare" />
            <img className="car-reflection" src={url} alt="" />
            {pulseKey > 0 && <div key={pulseKey} className="car-pulse" />}
          </div>
          <div className="floor-shadow" />
          <div className="floor-light" />
          <div className="floor-ring" />
          <div className="tech-ring"><i /><i /></div>
        </div>
      </div>
    </div>
  )
}

function App() {

  const [formData, setFormData] = useState({
    brand: "",
    fuel_type: "",
    transmission: "",
    service_history: "",
    insurance_valid: "",
    color: "",
    make_year: "",
    mileage_kmpl: "",
    engine_cc: "",
    owner_count: "",
    accidents_reported: "",
  })

  const [result, setResult] = useState(null)
  const [carDetails, setCarDetails] = useState(null)
  const [explanation, setExplanation] = useState("")
  const [loading, setLoading] = useState(false)
  const [explanationLoading, setExplanationLoading] = useState(false)
  const [error, setError] = useState("")

  // ---- frontend-only UI state ----
  const [section, setSection] = useState("hero")
  const [seen, setSeen] = useState({})
  const [scrolled, setScrolled] = useState(false)
  const [focused, setFocused] = useState(false)
  const [focusKey, setFocusKey] = useState(0)
  const [celebrating, setCelebrating] = useState(false)
  const [counted, setCounted] = useState(false)
  const [shown, setShown] = useState(0)
  const [history, setHistory] = useState(loadHistory)
  const [videoOk, setVideoOk] = useState(true)
  const rootRef = useRef(null)
  const videoRef = useRef(null)
  const savedRef = useRef(false)

  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        left: Math.random() * 100,
        size: 1.5 + Math.random() * 2.5,
        dur: 24 + Math.random() * 28,
        delay: -Math.random() * 40,
        drift: (Math.random() - 0.5) * 90,
        color: `var(--a${(i % 3) + 1})`,
      })),
    []
  )

  // celebration effects (generated once; a few dozen nodes in total)
  const fx = useMemo(() => {
    const rnd = (a, b) => a + Math.random() * (b - a)
    const cracks = Array.from({ length: 12 }, (_, i) => {
      const base = (i / 12) * Math.PI * 2 + rnd(-0.12, 0.12)
      let d = "M0 0"
      let r = 0
      let ang = base
      while (r < 130) {
        r += rnd(9, 18)
        ang += rnd(-0.16, 0.16)
        d += ` L${(Math.cos(ang) * r).toFixed(1)} ${(Math.sin(ang) * r).toFixed(1)}`
        if (r > 30 && Math.random() < 0.28) {
          const b = ang + rnd(-0.7, 0.7)
          d += ` M${(Math.cos(ang) * r).toFixed(1)} ${(Math.sin(ang) * r).toFixed(1)} L${(Math.cos(b) * (r + 22)).toFixed(1)} ${(Math.sin(b) * (r + 22)).toFixed(1)} M${(Math.cos(ang) * r).toFixed(1)} ${(Math.sin(ang) * r).toFixed(1)}`
        }
      }
      return { d, delay: rnd(0, 0.25) }
    })
    const shards = Array.from({ length: 14 }, (_, i) => {
      const a = (i / 14) * Math.PI * 2 + rnd(-0.2, 0.2)
      const dist = rnd(26, 56)
      return {
        dx: Math.cos(a) * dist, dy: Math.sin(a) * dist,
        rot: rnd(-200, 200), size: rnd(3, 8), delay: rnd(0, 0.2),
        clip: `polygon(${rnd(0, 30)}% ${rnd(0, 30)}%, ${rnd(70, 100)}% ${rnd(0, 40)}%, ${rnd(30, 70)}% ${rnd(70, 100)}%)`,
        tone: i % 3,
      }
    })
    const dots = Array.from({ length: 18 }, (_, i) => {
      const a = rnd(0, Math.PI * 2)
      const dist = rnd(18, 50)
      return { dx: Math.cos(a) * dist, dy: Math.sin(a) * dist, size: rnd(2, 5), delay: rnd(0, 0.35), tone: i % 3 }
    })
    return { cracks, shards, dots }
  }, [])


  // =====================================================
  // INPUT CHANGE
  // =====================================================

  function handleChange(event) {

    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const filled = FIELDS.filter((f) => formData[f.name] !== "").length
  const progress = filled / FIELDS.length
  const complete = filled === FIELDS.length


  // =====================================================
  // UI EFFECTS (no API involvement)
  // =====================================================

  useEffect(() => {
    rootRef.current?.style.setProperty("--p", progress.toFixed(3))
  }, [progress])

  // scroll position -> CSS variable + header surface
  useEffect(() => {
    const onScroll = () => {
      rootRef.current?.style.setProperty("--sy", window.scrollY)
      setScrolled(window.scrollY > 24)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // active section + reveal-on-scroll (re-observes when the result section appears)
  const hasResult = result !== null
  useEffect(() => {
    const nodes = document.querySelectorAll("[data-section]")
    const active = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setSection(e.target.dataset.section)),
      { rootMargin: "-45% 0px -45% 0px" }
    )
    const reveal = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && setSeen((s) => ({ ...s, [e.target.dataset.section]: true }))
        ),
      { threshold: 0.12 }
    )
    nodes.forEach((n) => { active.observe(n); reveal.observe(n) })
    return () => { active.disconnect(); reveal.disconnect() }
  }, [hasResult])

  // pause video when tab hidden or reduced motion is requested
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (reduceMotion()) v.pause()
    const onVis = () => {
      if (document.hidden) v.pause()
      else if (!reduceMotion()) v.play().catch(() => {})
    }
    document.addEventListener("visibilitychange", onVis)
    return () => document.removeEventListener("visibilitychange", onVis)
  }, [videoOk])

  // the real /predict result arrived -> celebration moment
  useEffect(() => {
    if (result === null) { setCelebrating(false); return }
    setShown(0)
    setCounted(false)
    setCelebrating(true)
  }, [result])

  // lock page scroll during analysis + celebration
  const analyzing = result === null && loading
  useEffect(() => {
    const lock = analyzing || celebrating
    document.body.style.overflow = lock ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [analyzing, celebrating])

  function closeCelebration() {
    setCelebrating(false)
    setTimeout(() => {
      document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 160)
  }

  // price count-up inside the popup (always ends exactly on the API value), then auto-close
  useEffect(() => {
    if (!celebrating) return
    if (typeof result !== "number" || reduceMotion()) {
      setShown(result); setCounted(true)
      const t = setTimeout(closeCelebration, 2200)
      return () => clearTimeout(t)
    }
    let raf, start, t2
    const tick = (t) => {
      start = start ?? t
      const p = Math.min(Math.max((t - start - 1500) / 2400, 0), 1)
      setShown(result * (1 - Math.pow(1 - p, 4)))
      if (p < 1) raf = requestAnimationFrame(tick)
      else { setShown(result); setCounted(true); t2 = setTimeout(closeCelebration, 1600) }
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); clearTimeout(t2) }
  }, [celebrating, result])

  // store each real prediction (this browser only) for the history timeline
  useEffect(() => {
    if (result === null) { savedRef.current = false; return }
    if (savedRef.current || !carDetails) return
    savedRef.current = true
    setHistory((prev) => [{
      id: Date.now(),
      at: new Date().toISOString(),
      brand: carDetails.brand,
      make_year: carDetails.make_year,
      fuel_type: carDetails.fuel_type,
      transmission: carDetails.transmission,
      color: carDetails.color,
      price: result,
    }, ...prev].slice(0, 20))
  }, [result, carDetails])

  useEffect(() => {
    try { window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history)) } catch { /* storage unavailable */ }
  }, [history])

  function clearHistory() { setHistory([]) }

  function handleMouseMove(event) {
    const root = rootRef.current
    if (!root) return
    root.style.setProperty("--mx", (event.clientX / window.innerWidth - 0.5).toFixed(3))
    root.style.setProperty("--my", (event.clientY / window.innerHeight - 0.5).toFixed(3))
  }

  // magnetic buttons
  function magnet(e) {
    if (reduceMotion()) return
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty("--tx", `${((e.clientX - r.left) / r.width - 0.5) * 14}px`)
    e.currentTarget.style.setProperty("--ty", `${((e.clientY - r.top) / r.height - 0.5) * 8}px`)
  }
  function unmagnet(e) {
    e.currentTarget.style.setProperty("--tx", "0px")
    e.currentTarget.style.setProperty("--ty", "0px")
  }

  function goTo(id) {
    return (e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }) }
  }


  // =====================================================
  // PREDICTION  (API logic unchanged)
  // =====================================================

  async function handleSubmit(event) {

    event.preventDefault()

    setLoading(true)
    setError("")
    setResult(null)
    setExplanation("")
    setCarDetails(null)
    setCelebrating(false)
    setCounted(false)
    setShown(0)

    const requestData = {

      brand: formData.brand,

      fuel_type: formData.fuel_type,

      transmission: formData.transmission,

      service_history: formData.service_history,

      insurance_valid: formData.insurance_valid,

      color: formData.color,

      make_year: Number(formData.make_year),

      mileage_kmpl: Number(formData.mileage_kmpl),

      engine_cc: Number(formData.engine_cc),

      owner_count: Number(formData.owner_count),

      accidents_reported: Number(formData.accidents_reported),
    }


    try {

      // 1. ML PREDICTION

      const response = await fetch(
        "https://used-car-price-estimation-backed.onrender.com/predict",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(requestData),
        }
      )


      if (!response.ok) {

        const errorText = await response.text()

        console.error(
          "PREDICT ERROR:",
          errorText
        )

        throw new Error(
          "Prediction failed"
        )
      }


      const data = await response.json()

      setResult(data.predicted_price)

      setCarDetails(formData)


      // 2. LLM EXPLANATION

      setExplanationLoading(true)

      setExplanation(
        "AI is analyzing your vehicle..."
      )


      try {

        const explanationResponse =
          await fetch(
            "https://used-car-price-estimation-backed.onrender.com/explain",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({

                ...requestData,

                predicted_price:
                  data.predicted_price,

              }),
            }
          )


        if (!explanationResponse.ok) {

          const errorText =
            await explanationResponse.text()

          console.error(
            "EXPLANATION ERROR:",
            errorText
          )

          throw new Error(
            "Explanation failed"
          )
        }


        const explanationData =
          await explanationResponse.json()


        setExplanation(
          explanationData.explanation ||
          "No AI explanation available."
        )

      } catch (llmError) {

        console.error(
          "LLM ERROR:",
          llmError
        )

        setExplanation(
          "AI insights are temporarily unavailable."
        )

      } finally {

        setExplanationLoading(false)

      }


    } catch (error) {

      console.error(
        "PREDICTION ERROR:",
        error
      )

      setError(
        "Unable to calculate the vehicle value. Please check the entered details and try again."
      )

    } finally {

      setLoading(false)

    }

  }


  // =====================================================
  // FORMAT INR
  // =====================================================

  function formatINR(value, digits = 2) {

    if (
      value === null ||
      value === undefined
    ) {

      return "₹0"

    }

    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      }
    ).format(value)

  }


  // =====================================================
  // STATE -> VISUAL PHASE
  // =====================================================

  const celebrate = result !== null && celebrating
  const resultVisible = result !== null && !celebrating
  const explanationReady = !explanationLoading && explanation !== ""

  let phase = "discover"
  if (analyzing) phase = "analyzing"
  else if (celebrate) phase = "price"
  else if (resultVisible && section === "result") phase = explanationReady ? "insight" : "valuation"
  else if (section === "history") phase = "valuation"
  else if (section === "valuation") phase = "input"

  const carLeft = resultVisible && section === "result"
  const carKey = carLeft ? "result" : analyzing || celebrate ? "analysis" : "discover"
  const blocks = useMemo(
    () => (explanationReady ? parseExplanation(explanation) : []),
    [explanation, explanationReady]
  )
  const activeNav = NAV.find((n) => n.section === section)?.id

  const rootClass = [
    "app", `theme-${phase}`,
    carLeft ? "car-left" : "",
    section === "history" ? "car-hide" : "",
    analyzing ? "is-analyzing" : "",
    celebrate ? "is-celebrate" : "",
    phase === "valuation" || phase === "insight" ? "is-result" : "",
    focused ? "is-focus" : "",
    complete ? "is-complete" : "",
  ].join(" ")


  // =====================================================
  // UI
  // =====================================================

  return (

    <div ref={rootRef} className={rootClass} onMouseMove={handleMouseMove}>

      {/* ================= FIXED CINEMATIC SCENE ================= */}
      <div className="scene" aria-hidden="true">

        {videoOk && (
          <div className="video-wrap">
            <video
              ref={videoRef}
              src={VIDEO_SRC}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onError={() => setVideoOk(false)}
            />
          </div>
        )}
        <div className="tint" />

        <div className="clouds">
          <div className="cloud c1" />
          <div className="cloud c2" />
          <div className="cloud c3" />
        </div>
        <div className="streaks"><i /><i /><i /></div>

        <div className="particles">
          {particles.map((p, i) => (
            <span
              key={i}
              style={{
                left: `${p.left}%`,
                width: p.size, height: p.size,
                background: p.color,
                animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s`,
                "--drift": `${p.drift}px`,
              }}
            />
          ))}
        </div>

        <div className="scrim scrim-r" />
        <div className="scrim scrim-l" />

        <div className="car-layer">
          <CarStage src={CARS[carKey]} vkey={carKey} pulseKey={focusKey} />
        </div>

        <div className="vignette" />
      </div>


      {/* ================= HEADER ================= */}
      <header className={`nav ${scrolled ? "scrolled" : ""}`}>
        <a href="#home" className="logo" onClick={goTo("home")}>AUTO <span>AI</span></a>

        <nav aria-label="Primary">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={goTo(n.id)}
              className={`${activeNav === n.id ? "active" : ""} ${n.id === "result" && !hasResult ? "off" : ""}`}
              aria-current={activeNav === n.id ? "true" : undefined}
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="status"><i /> <span key={phase}>{STATUS[phase]}</span></div>
      </header>


      <main className="content">

        {/* ================= 1. HERO ================= */}
        <section id="home" data-section="hero" className="sec hero">

          <div className="hero-copy">
            <div className="meta-row">
              <span className="micro">Used car valuation</span>
              <i className="hair" />
            </div>

            <h1>
              <span className="hl hl-1"><span>Your car.</span></span>
              <span className="hl hl-2"><span><b className="sweep">Valued</b></span></span>
              <span className="hl hl-3"><span>by AI.</span></span>
            </h1>

            <p className="lede">
              A machine-learning model estimates your car's market value. An AI analyst explains why.
            </p>

            <ul className="facts">
              <li>{FIELDS.length} vehicle inputs</li>
              <li>ML price estimate</li>
              <li>AI explanation</li>
            </ul>
          </div>

          <div className="car-inline"><CarStage src={CARS.discover} vkey="hero-m" /></div>

          <div className="hero-foot">
            <a
              href="#valuation"
              className="cta"
              onClick={goTo("valuation")}
              onMouseMove={magnet}
              onMouseLeave={unmagnet}
            >
              <span className="cta-label">Start your valuation</span>
              <span className="cta-scan" />
            </a>
            <div className="scroll-hint"><span>Scroll to explore</span><i /></div>
          </div>

        </section>


        {/* ================= 2. VEHICLE INPUT ================= */}
        <section
          id="valuation"
          data-section="valuation"
          className={`sec config ${seen.valuation ? "seen" : ""}`}
        >
          <div className="col-left">
            <div className="sec-head">
              <h2>Build your vehicle profile</h2>
              <p>Tell the AI about the car you want to value.</p>
            </div>

            <form
              className="panel"
              onSubmit={handleSubmit}
              onFocus={() => { setFocused(true); setFocusKey((k) => k + 1) }}
              onBlur={() => setFocused(false)}
            >
              <div className="console-bar">
                <span>Vehicle profile</span>
                <span>{filled} of {FIELDS.length} complete</span>
                <div className="meter"><i style={{ transform: `scaleX(${progress})` }} /></div>
              </div>

              <div className="form-grid">
                {FIELDS.map((f, i) => (
                  <div
                    className={`field ${formData[f.name] !== "" ? "filled" : ""}`}
                    key={f.name}
                    style={{ "--fc": FIELD_ACCENTS[i % FIELD_ACCENTS.length], "--i": i }}
                  >
                    {f.type === "select" ? (
                      <select
                        id={f.name}
                        name={f.name}
                        value={formData[f.name]}
                        onChange={handleChange}
                        required
                      >
                        <option value="" />
                        {f.options.map(([value, text]) => (
                          <option key={value} value={value}>{text}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={f.name}
                        type={f.type}
                        name={f.name}
                        value={formData[f.name]}
                        onChange={handleChange}
                        placeholder={f.placeholder}
                        min={f.min}
                        max={f.max}
                        step={f.step}
                        required
                      />
                    )}
                    <label htmlFor={f.name}>{f.label}</label>
                    <i className="dot" />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="cta cta-block"
                disabled={loading}
                onMouseMove={magnet}
                onMouseLeave={unmagnet}
              >
                <span className="cta-label">
                  {loading ? "Analyzing vehicle..." : "Predict my car value"}
                </span>
                <span className="cta-scan" />
              </button>

              {error && <div className="error" role="alert">{error}</div>}
            </form>
          </div>

          <div className="car-inline"><CarStage src={CARS.discover} vkey="form-m" pulseKey={focusKey} /></div>
        </section>


        {/* ================= 5. RESULT ================= */}
        {hasResult && (
          <section id="result" data-section="result" className="sec result">

            <div className="car-inline"><CarStage src={CARS.result} vkey="result-m" /></div>

            {resultVisible && (
              <div className="deck-wrap">
                <article className="deck">

                  <header className="deck-head">
                    <span className="deck-label"><i /> AI vehicle valuation</span>
                    {carDetails && (
                      <span className="deck-car">{carDetails.make_year} {carDetails.brand}</span>
                    )}
                  </header>

                  <p className="kicker">Estimated market value</p>
                  <div className="price">{formatINR(result)}</div>
                  <p className="price-sub">Powered by Machine Learning</p>

                  <div className="rule" />

                  <section className="ib">
                    <div className="ib-head">
                      <h3>AI valuation insight</h3>
                      <span className={`ai-state ${explanationLoading ? "busy" : ""}`}>
                        <i /> {explanationLoading ? "Analyzing" : "Report ready"}
                      </span>
                    </div>
                    <p className="ib-sub">Why this vehicle received this valuation</p>

                    {explanationLoading ? (
                      <div className="ai-loading">
                        <div className="ai-dots"><span /><span /><span /></div>
                        <p>AI is analyzing your vehicle...</p>
                      </div>
                    ) : (
                      <div className="ib-body" key={explanation} tabIndex={0}>
                        {blocks.map((b, i) => {
                          const style = { "--i": i }
                          if (b.type === "h") return <h4 key={i} style={style}>{b.text}</h4>
                          if (b.type === "ul")
                            return (
                              <ul key={i} style={style}>
                                {b.items.map((it, j) => <li key={j}>{renderInline(it)}</li>)}
                              </ul>
                            )
                          return (
                            <p key={i} style={style} className={i === 0 ? "lead" : ""}>
                              {renderInline(b.text)}
                            </p>
                          )
                        })}
                      </div>
                    )}
                  </section>

                </article>
              </div>
            )}

          </section>
        )}


        {/* ================= 6. PREDICTION HISTORY ================= */}
        <section
          id="history"
          data-section="history"
          className={`sec history ${seen.history ? "seen" : ""}`}
        >
          <div className="hist-head">
            <div>
              <h2>Prediction history</h2>
              <p>Valuations made in this browser.</p>
            </div>
            {history.length > 0 && (
              <button type="button" className="text-btn" onClick={clearHistory}>Clear history</button>
            )}
          </div>

          {history.length === 0 ? (
            <p className="idle">No predictions yet. Your valuations will be listed here.</p>
          ) : (
            <ol className="timeline">
              {history.map((h, i) => (
                <li key={h.id} style={{ "--i": i }}>
                  <i className="node" />
                  <div className="t-main">
                    <strong>{h.brand}</strong>
                    <span>{h.make_year}</span>
                  </div>
                  <div className="t-meta">
                    {[h.fuel_type, h.transmission, h.color].filter(Boolean).join(" / ")}
                    <em>{new Date(h.at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</em>
                  </div>
                  <div className="t-price">{formatINR(h.price)}</div>
                </li>
              ))}
            </ol>
          )}
        </section>

      </main>


      {/* ================= 4. AI PROCESSING MODE ================= */}
      {analyzing && (
        <div className="ai-mode" role="status">
          <div className="ai-copy">
            <span className="deck-label"><i /> AI processing</span>
            <h2>Analyzing vehicle</h2>
            <p>Machine learning is calculating your estimated value...</p>
            <div className="bar"><span /></div>
            <div className="chips">
              {[`${formData.make_year} ${formData.brand}`, formData.fuel_type, formData.transmission]
                .filter((c) => c.trim())
                .map((c) => <span key={c}>{c}</span>)}
            </div>
          </div>
          <div className="car-inline"><CarStage src={CARS.analysis} vkey="ai-m" /></div>
        </div>
      )}


      {/* ================= 5. CELEBRATION POPUP ================= */}
      {celebrate && (
        <div className="celebrate" role="dialog" aria-label="Valuation complete" onClick={closeCelebration}>
          <div className="cb-dim" />
          <div className="cb-flash" />
          <div className="cb-ring" />
          <div className="cb-ring r2" />

          <svg className="cb-cracks" viewBox="-100 -100 200 200" preserveAspectRatio="xMidYMid slice">
            {fx.cracks.map((c, i) => (
              <path key={i} d={c.d} pathLength="1" style={{ animationDelay: `${0.8 + c.delay}s` }} />
            ))}
          </svg>

          {fx.shards.map((s, i) => (
            <span
              key={`s${i}`}
              className={`shard tone-${s.tone}`}
              style={{
                width: `${s.size}vmin`, height: `${s.size}vmin`, clipPath: s.clip,
                "--dx": `${s.dx}vmin`, "--dy": `${s.dy}vmin`, "--rot": `${s.rot}deg`,
                animationDelay: `${0.85 + s.delay}s`,
              }}
            />
          ))}
          {fx.dots.map((d, i) => (
            <span
              key={`d${i}`}
              className={`fx-dot tone-${d.tone}`}
              style={{
                width: d.size, height: d.size,
                "--dx": `${d.dx}vmin`, "--dy": `${d.dy}vmin`,
                animationDelay: `${0.8 + d.delay}s`,
              }}
            />
          ))}

          <div className="pop" onClick={(e) => e.stopPropagation()}>
            <span className="deck-label"><i /> Prediction complete</span>
            <p className="kicker">Estimated vehicle value</p>
            <div className="price" aria-live="polite">{formatINR(shown, counted ? 2 : 0)}</div>
            <p className="price-sub">Powered by Machine Learning</p>
            <button type="button" className="cta" onClick={closeCelebration}>
              <span className="cta-label">View valuation</span>
              <span className="cta-scan" />
            </button>
          </div>
        </div>
      )}

    </div>

  )

}

export default App