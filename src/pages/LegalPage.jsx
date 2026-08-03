import { Link, useLocation } from 'react-router-dom'

const LegalPage = () => {
  const { pathname } = useLocation()
  const privacy = pathname === '/privacy'
  const title = privacy ? 'Privacy Policy' : 'Terms of Service'
  return <div className="min-h-screen bg-[#faf8f3]"><main className="page-shell max-w-3xl py-12 sm:py-16"><Link to="/" className="text-sm font-bold text-[#e86f32]">← UrbanHive home</Link><article className="mt-5 rounded-[26px] border border-[#e7e4dd] bg-white p-6 sm:p-9"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#2f7d4a]">UrbanHive</p><h1 className="mt-2 text-3xl font-extrabold tracking-[-.04em]">{title}</h1>{privacy ? <div className="mt-6 space-y-4 text-sm leading-7 text-[#566056]"><p>UrbanHive stores the account information needed to provide shopping, order, and delivery services. Payment processing is handled by Razorpay; UrbanHive does not store card details.</p><p>Location is requested only when you choose to share it, so delivery charges and nearby-store results can be calculated. You can decline location permission and continue using the app.</p><p>For this portfolio project, contact the project owner to request account-data changes or deletion.</p></div> : <div className="mt-6 space-y-4 text-sm leading-7 text-[#566056]"><p>By using UrbanHive, you agree to provide accurate account and order information. Product availability, delivery times, and store information are supplied by participating vendors.</p><p>Orders are subject to payment verification. Customers may only place an order with items from one store at a time.</p><p>UrbanHive is currently a portfolio project and these terms will be expanded before a production launch.</p></div>}</article></main></div>
}

export default LegalPage
