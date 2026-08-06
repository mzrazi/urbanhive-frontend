import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import L from 'leaflet'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { ArrowLeft, LocateFixed, MapPin } from 'lucide-react'
import { Button } from '../components/ui/button'
import { getDeliveryLocation, saveDeliveryLocation } from '../lib/deliveryLocation'

const pin = L.divIcon({ className: 'urbanhive-store-pin', html: '<span>●</span>', iconSize: [28, 28], iconAnchor: [14, 14] })
const ClickHandler = ({ setPosition }) => { useMapEvents({ click: ({ latlng }) => setPosition([latlng.lat, latlng.lng]) }); return null }
const Recenter = ({ position }) => { const map = useMap(); map.setView(position, map.getZoom(), { animate: true }); return null }
const CustomerLocationPage = () => {
  const navigate = useNavigate()
  const saved = getDeliveryLocation()
  const initial = useMemo(() => Number.isFinite(saved.lat) && Number.isFinite(saved.lng) ? [saved.lat, saved.lng] : [22.5726, 88.3639], [])
  const [position, setPosition] = useState(initial)
  const [saving, setSaving] = useState(false)
  const currentLocation = () => { if (!navigator.geolocation) return; navigator.geolocation.getCurrentPosition(({ coords }) => setPosition([coords.latitude, coords.longitude])) }
  const save = async () => { setSaving(true); await saveDeliveryLocation(position[0], position[1]); setSaving(false); navigate('/customer') }
  return <div className="min-h-screen bg-[#faf8f3]"><div className="page-shell max-w-3xl py-7 sm:py-10"><Link to="/customer" className="inline-flex items-center gap-2 text-sm font-bold text-[#697168] hover:text-[#e86f32]"><ArrowLeft className="h-4 w-4" /> Back to home</Link><section className="mt-5 overflow-hidden rounded-[26px] border border-[#e7e4dd] bg-white"><div className="bg-[#f4eadb] p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#2f7d4a]">Delivery area</p><h1 className="mt-2 text-3xl font-extrabold">Set your delivery location</h1><p className="mt-2 text-sm text-[#697168]">Use your current location, click the map, or drag the pin to where you’d like orders delivered.</p></div><div className="p-5 sm:p-7"><div className="h-[380px] overflow-hidden rounded-2xl border border-[#e7e4dd]"><MapContainer center={position} zoom={13} className="h-full w-full"><TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><ClickHandler setPosition={setPosition} /><Recenter position={position} /><Marker position={position} icon={pin} draggable eventHandlers={{ dragend: (event) => { const { lat, lng } = event.target.getLatLng(); setPosition([lat, lng]) } }} /></MapContainer></div><div className="mt-4 flex flex-col gap-3 sm:flex-row"><Button type="button" variant="outline" onClick={currentLocation} className="rounded-xl"><LocateFixed className="mr-2 h-4 w-4" /> Use my current location</Button><Button onClick={save} disabled={saving} className="flex-1 rounded-xl"><MapPin className="mr-2 h-4 w-4" /> {saving ? 'Saving location…' : 'Save delivery location'}</Button></div><p className="mt-3 text-center text-xs text-[#697168]">Pinned at {position[0].toFixed(6)}, {position[1].toFixed(6)}</p></div></section></div></div>
}
export default CustomerLocationPage
