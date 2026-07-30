import { useMemo, useState } from 'react'
import { Check, ChevronLeft, ChevronRight, LocateFixed, MapPin } from 'lucide-react'
import L from 'leaflet'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const categories = ['Grocery', 'Clothing', 'Sports Goods', 'Furniture', 'Electronics', 'Books', 'Beauty & Personal Care', 'Toys & Games', 'Home Appliances', 'Automotive', 'Health & Wellness', 'Jewelry', 'Pet Supplies', 'Others']
const defaultLocation = [22.5726, 88.3639]
const storePin = L.divIcon({ className: 'urbanhive-store-pin', html: '<span>●</span>', iconSize: [28, 28], iconAnchor: [14, 14] })
const FieldError = ({ message }) => message ? <p className="mt-1.5 text-xs font-medium text-[#b64437]">{message}</p> : null

const MapClickHandler = ({ onLocationChange }) => {
  useMapEvents({ click: (event) => onLocationChange(event.latlng.lat, event.latlng.lng) })
  return null
}

const MapRecenter = ({ position }) => {
  const map = useMap()
  map.setView(position, map.getZoom(), { animate: true })
  return null
}

const VendorRegistration = () => {
  const navigate = useNavigate()
  const { registerVendor } = useAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [touched, setTouched] = useState({})
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', storeName: '', storeAddress: '', category: '', latitude: '', longitude: '' })

  const getFieldErrors = (data) => {
    const errors = {}
    if (data.name && data.name.trim().length < 2) errors.name = 'Enter your full name.'
    if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) errors.email = 'Enter a valid email address.'
    if (data.phone && data.phone.replace(/\D/g, '').length !== 10) errors.phone = 'Enter a 10-digit phone number.'
    if (data.password && data.password.length < 6) errors.password = 'Use at least 6 characters.'
    if (data.confirmPassword && data.confirmPassword !== data.password) errors.confirmPassword = 'Passwords do not match.'
    if (data.storeName && data.storeName.trim().length < 2) errors.storeName = 'Enter your store name.'
    if (data.storeAddress && data.storeAddress.trim().length < 8) errors.storeAddress = 'Add a more complete address.'
    if (data.latitude && (!Number.isFinite(Number(data.latitude)) || Number(data.latitude) < -90 || Number(data.latitude) > 90)) errors.latitude = 'Enter a valid latitude.'
    if (data.longitude && (!Number.isFinite(Number(data.longitude)) || Number(data.longitude) < -180 || Number(data.longitude) > 180)) errors.longitude = 'Enter a valid longitude.'
    return errors
  }
  const fieldErrors = getFieldErrors(formData)
  const update = (event) => {
    const { name, value } = event.target
    setFormData((data) => ({ ...data, [name]: value }))
  }
  const markTouched = (event) => setTouched((fields) => ({ ...fields, [event.target.name]: true }))
  const touchFields = (fields) => setTouched((current) => ({ ...current, ...Object.fromEntries(fields.map((field) => [field, true])) }))
  const setLocation = (latitude, longitude) => {
    setError('')
    setFormData((data) => ({ ...data, latitude: Number(latitude).toFixed(6), longitude: Number(longitude).toFixed(6) }))
  }
  const mapPosition = useMemo(() => {
    const latitude = Number(formData.latitude)
    const longitude = Number(formData.longitude)
    return Number.isFinite(latitude) && Number.isFinite(longitude) ? [latitude, longitude] : defaultLocation
  }, [formData.latitude, formData.longitude])
  const validateStep = () => {
    if (step === 1) {
      touchFields(['name', 'email', 'phone', 'password', 'confirmPassword'])
      if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) return 'Please complete all account fields.'
      if (Object.keys(fieldErrors).some((field) => ['name', 'email', 'phone', 'password', 'confirmPassword'].includes(field))) return 'Please correct the highlighted fields.'
    } else {
      touchFields(['storeName', 'category', 'storeAddress', 'latitude', 'longitude'])
      if (!formData.storeName || !formData.category || !formData.storeAddress) return 'Please complete all store details.'
      if (Object.keys(fieldErrors).some((field) => ['storeName', 'storeAddress', 'latitude', 'longitude'].includes(field))) return 'Please correct the highlighted fields.'
    }
    return ''
  }
  const next = () => {
    const message = validateStep()
    if (message) return setError(message)
    setError('')
    setStep(2)
  }
  const locate = () => {
    if (!navigator.geolocation) return setError('Location is not supported by this browser. Choose the point on the map.')
    setError('')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setLocation(coords.latitude, coords.longitude),
      () => setError('We could not access your location. Choose the point on the map or enable permission.')
    )
  }
  const submit = async (event) => {
    event.preventDefault()
    const message = validateStep()
    if (message) return setError(message)
    if (!formData.latitude || !formData.longitude) return setError('Set your store location before submitting.')
    setLoading(true)
    setError('')
    const { confirmPassword, ...payload } = formData
    const success = await registerVendor(payload)
    setLoading(false)
    if (success) navigate('/vendor/login')
  }

  return <div className="min-h-screen bg-[#faf8f3] px-4 py-10 sm:py-16">
    <Card className="mx-auto w-full max-w-xl overflow-hidden rounded-[26px] border-[#e7e4dd] p-0 shadow-xl shadow-[#352c1d]/5">
      <div className="bg-[#182018] px-7 py-7 text-white"><p className="text-xs font-bold uppercase tracking-[.15em] text-[#a8d5b4]">UrbanHive for business</p><h1 className="mt-2 text-3xl font-extrabold tracking-[-.04em]">Bring your store online.</h1><p className="mt-2 text-sm text-white/65">Complete your application in two quick steps.</p></div>
      <CardContent className="p-6 sm:p-8">
        <div className="mb-7 flex items-center gap-3"><span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${step === 1 ? 'bg-[#e86f32] text-white' : 'bg-[#e8f3ec] text-[#2f7d4a]'}`}>{step === 2 ? <Check className="h-4 w-4" /> : '1'}</span><span className="h-px flex-1 bg-[#e7e4dd]" /><span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${step === 2 ? 'bg-[#e86f32] text-white' : 'bg-[#eee8dd] text-[#697168]'}`}>2</span></div>
        <div className="mb-6"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#2f7d4a]">Step {step} of 2</p><h2 className="mt-1 text-xl font-extrabold">{step === 1 ? 'About you' : 'Your store details'}</h2></div>
        {error && <p className="mb-5 rounded-xl bg-[#fff0ef] px-3 py-2 text-sm font-semibold text-[#b64437]">{error}</p>}
        <form onSubmit={submit} className="space-y-4">
          {step === 1 ? <>
            <div><Label>Owner name</Label><Input name="name" value={formData.name} onChange={update} onBlur={markTouched} className="mt-1.5 rounded-xl" placeholder="Your full name" /><FieldError message={touched.name && (!formData.name ? 'Your name is required.' : fieldErrors.name)} /></div>
            <div><Label>Business email</Label><Input type="email" name="email" value={formData.email} onChange={update} onBlur={markTouched} className="mt-1.5 rounded-xl" placeholder="you@business.com" /><FieldError message={touched.email && (!formData.email ? 'Your email is required.' : fieldErrors.email)} /></div>
            <div><Label>Phone number</Label><Input type="tel" name="phone" value={formData.phone} onChange={update} onBlur={markTouched} className="mt-1.5 rounded-xl" placeholder="9876543210" /><FieldError message={touched.phone && (!formData.phone ? 'Your phone number is required.' : fieldErrors.phone)} /></div>
            <div className="grid gap-4 sm:grid-cols-2"><div><Label>Password</Label><Input type="password" name="password" value={formData.password} onChange={update} onBlur={markTouched} className="mt-1.5 rounded-xl" placeholder="At least 6 characters" /><FieldError message={touched.password && (!formData.password ? 'A password is required.' : fieldErrors.password)} /></div><div><Label>Confirm password</Label><Input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={update} onBlur={markTouched} className="mt-1.5 rounded-xl" /><FieldError message={touched.confirmPassword && (!formData.confirmPassword ? 'Confirm your password.' : fieldErrors.confirmPassword)} /></div></div>
            <Button type="button" onClick={next} className="mt-2 w-full rounded-xl">Continue <ChevronRight className="ml-2 h-4 w-4" /></Button>
          </> : <>
            <div><Label>Store name</Label><Input name="storeName" value={formData.storeName} onChange={update} onBlur={markTouched} className="mt-1.5 rounded-xl" placeholder="Your business name" /><FieldError message={touched.storeName && (!formData.storeName ? 'Your store name is required.' : fieldErrors.storeName)} /></div>
            <div><Label>Store category</Label><select name="category" value={formData.category} onChange={update} onBlur={markTouched} className="mt-1.5 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"><option value="">Select a category</option>{categories.map((category) => <option key={category}>{category}</option>)}</select><FieldError message={touched.category && !formData.category ? 'Select your store category.' : ''} /></div>
            <div><Label>Store address</Label><textarea name="storeAddress" value={formData.storeAddress} onChange={update} onBlur={markTouched} className="mt-1.5 min-h-20 w-full rounded-xl border border-input bg-background p-3 text-sm" placeholder="Street, locality, city" /><FieldError message={touched.storeAddress && (!formData.storeAddress ? 'Your store address is required.' : fieldErrors.storeAddress)} /></div>
            <div className="rounded-2xl bg-[#e8f3ec] p-4">
              <div className="flex items-start justify-between gap-3"><div><p className="flex items-center gap-1.5 text-sm font-extrabold text-[#2f7d4a]"><MapPin className="h-4 w-4" /> Confirm store location</p><p className="mt-1 text-xs leading-5 text-[#566056]">Click the map or drag the pin to your store. You can still type coordinates if needed.</p></div><Button type="button" size="sm" onClick={locate} className="shrink-0 rounded-xl"><LocateFixed className="mr-1 h-3.5 w-3.5" /> Use location</Button></div>
              <div className="mt-3 h-56 overflow-hidden rounded-xl border border-[#cfe2d4]"><MapContainer center={mapPosition} zoom={13} scrollWheelZoom className="h-full w-full"><TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><MapClickHandler onLocationChange={setLocation} /><MapRecenter position={mapPosition} /><Marker position={mapPosition} icon={storePin} draggable eventHandlers={{ dragend: (event) => { const { lat, lng } = event.target.getLatLng(); setLocation(lat, lng) } }} /></MapContainer></div>
              <p className="mt-2 text-xs font-medium text-[#566056]">{formData.latitude && formData.longitude ? `Pinned at ${formData.latitude}, ${formData.longitude}` : 'Map starts in Kolkata. Choose your exact store point.'}</p>
              <div className="mt-3 grid grid-cols-2 gap-3"><div><Input name="latitude" value={formData.latitude} onChange={update} onBlur={markTouched} placeholder="Latitude" className="rounded-xl bg-white" /><FieldError message={touched.latitude && (!formData.latitude ? 'Choose a map location.' : fieldErrors.latitude)} /></div><div><Input name="longitude" value={formData.longitude} onChange={update} onBlur={markTouched} placeholder="Longitude" className="rounded-xl bg-white" /><FieldError message={touched.longitude && (!formData.longitude ? 'Choose a map location.' : fieldErrors.longitude)} /></div></div>
            </div>
            <div className="flex gap-3"><Button type="button" variant="outline" onClick={() => { setError(''); setStep(1) }} className="rounded-xl"><ChevronLeft className="mr-1 h-4 w-4" /> Back</Button><Button type="submit" disabled={loading} className="flex-1 rounded-xl">{loading ? 'Submitting…' : 'Submit store application'}</Button></div>
            <p className="text-center text-xs leading-5 text-[#697168]">Applications are reviewed before a store appears on UrbanHive.</p>
          </>}
        </form>
      </CardContent>
    </Card>
  </div>
}

export default VendorRegistration
