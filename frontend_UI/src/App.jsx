
import { useState } from 'react'
import './App.css'

function App() {

  const [formData, setFormData] = useState({
    brand: '',
    fuel_type: '',
    transmission: '',
    service_history: '',
    insurance_valid: '',
    color: '',
    make_year: '',
    mileage_kmpl: '',
    engine_cc: '',
    owner_count: '',
    accidents_reported: '',
  })

  const [result, setResult] = useState('')
  const [carDetails, setCarDetails] = useState(null)

  function formatDetailLabel(key) {
    return key.replaceAll('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase())
  }

  function formatDetailValue(key, value) {
    if (key === 'mileage_kmpl') return `${Number(value).toLocaleString()} km/l`
    if (key === 'engine_cc') return `${Number(value).toLocaleString()} cc`
    if (key === 'make_year') return `${value}`
    if (key === 'owner_count') return `${value} owner${Number(value) > 1 ? 's' : ''}`
    if (key === 'accidents_reported') return `${value} accident${Number(value) === 1 ? '' : 's'}`
    return value
  }

  // Handle input changes
  function handleChange(event) {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  // Submit form and call FastAPI
  async function handleSubmit(event) {
    event.preventDefault()

    try {
      const response = await fetch("https://used-car-price-estimation.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error("Prediction request failed")
      }

      const data = await response.json()

      setResult(data.predicted_price)
      setCarDetails(data)

    } catch (error) {
      alert("Prediction failed. Please check FastAPI.")
    }
  }

  return (
    <main className="app">

      {/* Background Video */}
      <video
        className="background-video"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      >
        <source
          src="https://cdn.coverr.co/videos/coverr-a-car-driving-on-a-road-1574/1080p.mp4"
          type="video/mp4"
        />
      </video>

      <div className="video-overlay"></div>

      <section className="form-card">

        <div className="card-glow"></div>

        {/* Header */}
        <div className="card-header">

          <div>
            <p className="eyebrow">
              <span className="eyebrow-dot"></span>
              AUTOVALUE / 01
            </p>

            <h1>Know what your car is worth.</h1>

            <p className="intro">
              A smarter estimate starts with the details that matter.
            </p>
          </div>

          <div className="header-badge">
            <span className="badge-icon">✦</span>

            <span>
              AI assisted
              <br />
              <strong>estimates</strong>
            </span>
          </div>

        </div>

        {/* Form Header */}
        <div className="form-divider">

          <span>Vehicle profile</span>

          <span className="step-count">
            11 fields <i></i> ready
          </span>

        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            {/* Brand */}
            <label>
              Brand

              <input
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Toyota"
                required
              />
            </label>

            {/* Fuel */}
            <label>
              Fuel type

              <select
                name="fuel_type"
                value={formData.fuel_type}
                onChange={handleChange}
                required
              >
                <option value="">Choose fuel type</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </label>

            {/* Transmission */}
            <label>
              Transmission

              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                required
              >
                <option value="">Choose transmission</option>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </label>

            {/* Service History */}
            <label>
              Service history

              <select
                name="service_history"
                value={formData.service_history}
                onChange={handleChange}
                required
              >
                <option value="">Choose an option</option>
                <option value="Full">Full</option>
                <option value="Partial">Partial</option>
                <option value="None">None</option>
              </select>
            </label>

            {/* Insurance */}
            <label>
              Insurance valid

              <select
                name="insurance_valid"
                value={formData.insurance_valid}
                onChange={handleChange}
                required
              >
                <option value="">Choose an option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>

            {/* Color */}
            <label>
              Color

              <input
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="e.g. White"
                required
              />
            </label>

            {/* Make Year */}
            <label>
              Make year

              <input
                type="number"
                name="make_year"
                value={formData.make_year}
                onChange={handleChange}
                placeholder="e.g. 2020"
                min="1980"
                max="2026"
                required
              />
            </label>

            {/* Mileage */}
            <label>
              Mileage (kmpl)

              <input
                type="number"
                name="mileage_kmpl"
                value={formData.mileage_kmpl}
                onChange={handleChange}
                placeholder="e.g. 18.5"
                step="0.1"
                min="0"
                required
              />
            </label>

            {/* Engine */}
            <label>
              Engine (cc)

              <input
                type="number"
                name="engine_cc"
                value={formData.engine_cc}
                onChange={handleChange}
                placeholder="e.g. 1498"
                min="0"
                required
              />
            </label>

            {/* Owner */}
            <label>
              Owner count

              <input
                type="number"
                name="owner_count"
                value={formData.owner_count}
                onChange={handleChange}
                placeholder="e.g. 1"
                min="1"
                required
              />
            </label>

            {/* Accidents */}
            <label>
              Accidents reported

              <input
                type="number"
                name="accidents_reported"
                value={formData.accidents_reported}
                onChange={handleChange}
                placeholder="e.g. 0"
                min="0"
                required
              />
            </label>

          </div>

          {/* Button */}
          <button type="submit">

            <span>
              Estimate my car&apos;s value
            </span>

            <span className="button-arrow">
              ↗
            </span>

          </button>

          {/* Price */}
          {result && (
            <div className="result-message">

              <span className="result-label">
                Estimated market value
              </span>

              <strong>
                ${Number(result).toLocaleString()}
              </strong>

              <span className="result-caption">
                Based on the vehicle details provided
              </span>

            </div>
          )}

          {/* Vehicle Details */}
          {carDetails && (
            <div className="details-panel">

              <div className="details-header">
                <div>
                  <p className="details-kicker">Inspection summary</p>
                  <h2>Vehicle details</h2>
                </div>

                <span className="details-pill">Live profile</span>
              </div>

              <div className="details-grid">
                {Object.entries(carDetails)
                  .filter(([key]) => key !== 'predicted_price' && key !== 'message')
                  .map(([key, value]) => (
                    <div className="detail-item" key={key}>
                      <span className="detail-label">{formatDetailLabel(key)}</span>
                      <strong>{formatDetailValue(key, value)}</strong>
                    </div>
                  ))}
              </div>

            </div>
          )}

        </form>

      </section>

    </main>
  )
}

export default App

