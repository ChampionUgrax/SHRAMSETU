import React, { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { getNearbyUsers } from "../api/location"

const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY

export default function MapComponent({ workers = [], onSelect }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!GEOAPIFY_KEY) {
      console.error("[Map] VITE_GEOAPIFY_API_KEY is missing — check .env and restart the dev server")
    }

    let cancelled = false
    const map = L.map(containerRef.current).setView([26.9124, 75.7873], 12)

    L.tileLayer(
      `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_KEY}`,
      { attribution: "© OpenStreetMap contributors © Geoapify" }
    ).addTo(map)

    const addMarker = (lat, lng, html, payload) => {
      L.marker([lat, lng]).addTo(map).bindPopup(html)
        .on("click", () => onSelect && onSelect(payload))
    }

    getNearbyUsers(75.7873, 26.9124, 5000)
      .then((users) => {
        if (cancelled || !Array.isArray(users)) return
        users.forEach((u) => {
          const c = u.location?.coordinates
          if (c) addMarker(c[1], c[0], `<b>${u.name}</b><br/>${u.email}`, u)
        })
      })
      .catch((err) => console.error("[Map] nearby users failed:", err.message))

    workers.forEach((w) => {
      if (w.lat && w.lng) {
        addMarker(w.lat, w.lng, `<b>${w.name}</b><br/>${w.skill}<br/>📍 ${w.distance} km`, w)
      }
    })

    return () => {
      cancelled = true
      map.remove()
    }
  }, [workers, onSelect])

  return <div ref={containerRef} style={{ height: "400px", width: "100%" }} />
}