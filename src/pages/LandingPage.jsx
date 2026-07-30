import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { ArrowRight, Bike, ClipboardCheck, Leaf, ShieldCheck, ShoppingBag, Sparkles, Store, Truck } from 'lucide-react'

const LandingPage = () => {
  return (
    <div className="overflow-hidden bg-[#faf8f3]">
      <section className="page-shell py-7 sm:py-10 lg:py-14">
        <div className="relative overflow-hidden rounded-[28px] border border-[#eee8dd] bg-[#f4eadb] px-6 py-10 sm:px-10 lg:px-14 lg:py-14">
          <div className="absolute -left-16 top-8 h-44 w-44 rounded-full bg-[#dfeee3] blur-3xl" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-xs font-bold text-[#2f7d4a]"><Sparkles className="h-3.5 w-3.5" /> Made for your neighbourhood</span>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.04] tracking-[-0.055em] text-[#182018] sm:text-5xl lg:text-6xl">Your neighbourhood, <span className="text-[#e86f32]">delivered.</span></h1>
              <p className="mt-5 max-w-md text-base leading-7 text-[#566056] sm:text-lg">Discover trusted local stores, everyday essentials, and fast delivery—all in one place.</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link to="/register"><Button size="lg" className="w-full rounded-xl px-6 shadow-lg shadow-[#e86f32]/20 sm:w-auto">Explore stores <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-xs font-semibold text-[#566056]"><span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-[#2f7d4a]" /> Secure checkout</span><span className="flex items-center gap-1.5"><Bike className="h-4 w-4 text-[#2f7d4a]" /> Local delivery</span><span className="flex items-center gap-1.5"><Leaf className="h-4 w-4 text-[#2f7d4a]" /> Support local</span></div>
            </div>
            <div className="relative mx-auto w-full max-w-[540px]">
              <div className="absolute -inset-5 rotate-3 rounded-[34px] bg-[#e86f32]/10" />
              <img src="/urbanhiveci.jpeg" alt="UrbanHive connects neighbourhood stores with local delivery" className="relative aspect-[4/3] w-full rounded-[26px] object-cover shadow-2xl shadow-[#352c1d]/15" />
              <div className="absolute -bottom-4 -left-3 rounded-2xl border border-white/70 bg-white/95 px-4 py-3 shadow-xl shadow-[#352c1d]/10 backdrop-blur"><p className="text-xs font-semibold text-[#697168]">Trusted by local shoppers</p><p className="mt-0.5 text-lg font-extrabold text-[#182018]">4.8 <span className="text-sm text-[#e86f32]">★</span></p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell pb-8 sm:pb-12">
        <div className="grid gap-4 md:grid-cols-3">
          {[{ icon: Store, title: 'Shop local', text: 'Discover businesses in your own neighbourhood.' }, { icon: Truck, title: 'Fast delivery', text: 'Fresh essentials brought straight to your door.' }, { icon: ClipboardCheck, title: 'Simple & secure', text: 'Track orders and pay with confidence.' }].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-[#ece6da] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#352c1d]/5"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f3ec] text-[#2f7d4a]"><Icon className="h-5 w-5" /></span><h2 className="mt-4 text-base font-extrabold text-[#182018]">{title}</h2><p className="mt-1 text-sm leading-6 text-[#697168]">{text}</p></div>
          ))}
        </div>
      </section>

      <section className="page-shell pb-12 sm:pb-16">
        <div className="rounded-[26px] bg-[#182018] px-6 py-9 text-white sm:px-10 sm:py-11"><div className="grid items-center gap-6 md:grid-cols-[1fr_auto]"><div><p className="text-sm font-bold text-[#a8d5b4]">Own a local business?</p><h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em]">Bring your store to more neighbours.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-white/70">Build your storefront, manage orders, and grow with local customers through UrbanHive.</p></div><Link to="/vendor/register"><Button size="lg" className="rounded-xl bg-[#e86f32] px-6 hover:bg-[#c95722]">Become a seller <ShoppingBag className="ml-2 h-4 w-4" /></Button></Link></div></div>
      </section>
    </div>
  )
}

export default LandingPage
