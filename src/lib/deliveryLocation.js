import { useEffect, useState } from 'react'

const storageKey = 'urbanhive_delivery_location'
const fallbackLocation = { label: 'Delivering to Kolkata', lat: null, lng: null }

export const getDeliveryLocation = () => {
  try { return JSON.parse(localStorage.getItem(storageKey)) || fallbackLocation } catch { return fallbackLocation }
}

export const saveDeliveryLocation = async (lat, lng) => {
  let label = 'Delivering to your selected location'
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
    const data = await response.json()
    const area = data.address?.suburb || data.address?.city || data.address?.town || data.address?.village
    if (area) label = `Delivering to ${area}`
  } catch { /* Coordinates remain useful even if reverse geocoding is unavailable. */ }
  const nextLocation = { label, lat: Number(lat), lng: Number(lng) }
  localStorage.setItem(storageKey, JSON.stringify(nextLocation))
  window.dispatchEvent(new Event('urbanhive:locationchange'))
  return nextLocation
}

export const useDeliveryLocation = () => {
  const [location, setLocation] = useState(getDeliveryLocation)
  useEffect(() => {
    const sync = () => setLocation(getDeliveryLocation())
    window.addEventListener('urbanhive:locationchange', sync)
    return () => window.removeEventListener('urbanhive:locationchange', sync)
  }, [])
  const requestLocation = () => new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('Location is not supported by this browser.'))
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const nextLocation = await saveDeliveryLocation(coords.latitude, coords.longitude)
      setLocation(nextLocation)
      resolve(nextLocation)
    }, () => reject(new Error('Allow location permission to update your delivery area.')), { enableHighAccuracy: true, timeout: 10000 })
  })
  return { location, requestLocation }
}
