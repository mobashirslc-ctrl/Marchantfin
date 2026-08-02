import { useState, useRef, useEffect } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────
type LoanType = 'cash' | 'service' | ''
type FormStep = 'form' | 'loading' | 'result-cash-denied' | 'result-service-success'
type ActiveTab = 'feature' | 'document' | 'contact'
type WhyTab = 'why' | 'faq' | 'contact' | 'brochure'

interface FormData {
  businessName: string
  contactNo: string
  address: string
  facebookPage: string
  website: string
  loanType: LoanType
  loanPurpose: string
  loanAmount: string
  nidImage: File | null
  tradeImage: File | null
}

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_FIRST_LOAN = 50000
const MAX_LOAN = 100000
const INTEREST_RATE = 10 // %
const EMI_MONTHS = 12

function calcEMI(principal: number, rate: number, months: number): number {
  const r = rate / 100 / 12
  if (r === 0) return principal / months
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ onApply }: { onApply: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    { label: 'হোম', href: '#home' },
    { label: 'কীভাবে কাজ করে?', href: '#how-it-works' },
    { label: 'সার্ভিসসমূহ', href: '#services' },
    { label: 'EMI ক্যালকুলেটর', href: '#emi-calculator' },
    { label: 'যোগাযোগ', href: '#footer' },
  ]

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        backgroundColor: scrolled ? '#ffffff' : '#ffffff',
        boxShadow: scrolled ? '0 2px 16px rgba(192,57,43,0.12)' : '0 1px 4px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, #C0392B, #E74C3C, #C0392B)' }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>
          {/* Logo */}
          <a href="#home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #C0392B, #8B0000)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22V12h6v10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#C0392B', lineHeight: 1, letterSpacing: '-0.3px' }}>MerchantFin</div>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 500, letterSpacing: '1px' }}>FINANCING HAPPINESS</div>
            </div>
          </a>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="hidden-mobile">
            {links.map(l => (
              <a key={l.label} href={l.href} style={{
                padding: '8px 14px', borderRadius: '6px',
                fontSize: '14px', fontWeight: 500, color: '#334155',
                textDecoration: 'none', transition: 'all 0.2s',
                fontFamily: 'Hind Siliguri, sans-serif',
              }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = '#C0392B'; (e.target as HTMLElement).style.backgroundColor = '#FEF2F2' }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = '#334155'; (e.target as HTMLElement).style.backgroundColor = 'transparent' }}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* CTA + Login */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              style={{
                padding: '9px 20px', borderRadius: '6px',
                border: '1.5px solid #C0392B', background: 'transparent',
                color: '#C0392B', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'Hind Siliguri, sans-serif',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget).style.background = '#FEF2F2' }}
              onMouseLeave={e => { (e.currentTarget).style.background = 'transparent' }}
            >
              কাস্টমার লগইন
            </button>
            <button
              onClick={onApply}
              style={{
                padding: '9px 20px', borderRadius: '6px',
                background: 'linear-gradient(135deg, #C0392B, #E74C3C)',
                color: '#fff', fontSize: '13px', fontWeight: 600,
                border: 'none', cursor: 'pointer',
                fontFamily: 'Hind Siliguri, sans-serif',
                boxShadow: '0 2px 8px rgba(192,57,43,0.35)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget).style.boxShadow = '0 4px 16px rgba(192,57,43,0.45)'; (e.currentTarget).style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { (e.currentTarget).style.boxShadow = '0 2px 8px rgba(192,57,43,0.35)'; (e.currentTarget).style.transform = 'none' }}
            >
              লোনের জন্য আবেদন করুন
            </button>

            {/* Hamburger */}
            <button
              className="show-mobile"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', display: 'none' }}
            >
              <div style={{ width: '22px', height: '2px', background: '#C0392B', marginBottom: '5px', transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
              <div style={{ width: '22px', height: '2px', background: '#C0392B', marginBottom: '5px', opacity: menuOpen ? 0 : 1, transition: 'all 0.2s' }} />
              <div style={{ width: '22px', height: '2px', background: '#C0392B', transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ borderTop: '1px solid #F1E8E8', paddingBottom: '16px' }}>
            {links.map(l => (
              <a key={l.label} href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{ display: 'block', padding: '10px 4px', fontSize: '14px', fontWeight: 500, color: '#334155', textDecoration: 'none', borderBottom: '1px solid #F8F8F8' }}
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
        @media (min-width: 901px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
const SLIDE_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1759334928681-dc7ad674138e?w=1200&h=500&fit=crop&auto=format', alt: 'Merchant in a clothing shop' },
  { url: 'https://images.unsplash.com/photo-1770013413878-2530e2c3d82b?w=1200&h=500&fit=crop&auto=format', alt: 'E-commerce merchant packing orders' },
  { url: 'https://images.unsplash.com/photo-1753161618037-e6a8f740fd47?w=1200&h=500&fit=crop&auto=format', alt: 'Small business owner working on laptop' },
  { url: 'https://images.unsplash.com/photo-1723450099547-b492f27f5405?w=1200&h=500&fit=crop&auto=format', alt: 'Merchant with yarn display' },
  { url: 'https://images.unsplash.com/photo-1722670448250-0e15487c5dbe?w=1200&h=500&fit=crop&auto=format', alt: 'Shop owner in front of store' },
]

function Hero({ onApply, onLearnMore }: { onApply: () => void; onLearnMore: () => void }) {
  const [slide, setSlide] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setSlide(s => (s + 1) % SLIDE_IMAGES.length)
        setFading(false)
      }, 400)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const goTo = (i: number) => {
    setFading(true)
    setTimeout(() => { setSlide(i); setFading(false) }, 300)
  }

  return (
    <section id="home" style={{ paddingTop: '71px' }}>
      {/* IDLC-style hero: red left panel + full-width image slider */}
      <div style={{ position: 'relative', background: '#C0392B', minHeight: '420px', display: 'flex' }}>

        {/* Left red panel */}
        <div style={{
          width: '260px', flexShrink: 0,
          background: 'linear-gradient(160deg, #8B0000 0%, #C0392B 100%)',
          padding: '40px 28px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          position: 'relative', zIndex: 2,
        }}>
          <h1 style={{
            fontSize: '28px', fontWeight: 800, color: '#fff',
            lineHeight: 1.2, margin: '0 0 12px',
            fontFamily: 'Hind Siliguri, sans-serif',
            textTransform: 'uppercase', letterSpacing: '0.5px',
          }}>
            Business<br/>Loan
          </h1>
          <div style={{ width: '40px', height: '3px', background: '#fff', marginBottom: '16px', opacity: 0.6 }} />
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '13px', lineHeight: 1.6, margin: '0 0 24px', fontFamily: 'Hind Siliguri, sans-serif' }}>
            ই-কমার্স মার্চেন্টদের ব্যবসায়িক গ্রোথে এক্সক্লুসিভ বিজনেস ফাইন্যান্সিং।
          </p>
          <button
            onClick={onApply}
            style={{
              padding: '11px 20px', borderRadius: '6px',
              background: '#fff', color: '#C0392B',
              fontSize: '13px', fontWeight: 700, border: 'none',
              cursor: 'pointer', fontFamily: 'Hind Siliguri, sans-serif',
              boxShadow: '0 3px 12px rgba(0,0,0,0.2)',
              marginBottom: '10px', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}
          >
            Apply For Loan
          </button>
          <button
            onClick={onLearnMore}
            style={{
              padding: '11px 20px', borderRadius: '6px',
              background: 'transparent', color: '#fff',
              fontSize: '13px', fontWeight: 600,
              border: '1.5px solid rgba(255,255,255,0.5)',
              cursor: 'pointer', fontFamily: 'Hind Siliguri, sans-serif',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            Customer Login
          </button>
        </div>

        {/* Right: image slider */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: '420px' }}>
          <img
            key={slide}
            src={SLIDE_IMAGES[slide].url}
            alt={SLIDE_IMAGES[slide].alt}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%', objectFit: 'cover',
              opacity: fading ? 0 : 1,
              transition: 'opacity 0.4s ease',
            }}
          />
          {/* Subtle red overlay on image */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(192,57,43,0.25) 0%, transparent 40%)' }} />

          {/* Slide dots */}
          <div style={{
            position: 'absolute', bottom: '16px', right: '20px',
            display: 'flex', gap: '6px', zIndex: 3,
          }}>
            {SLIDE_IMAGES.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} style={{
                width: i === slide ? '20px' : '8px', height: '8px',
                borderRadius: '4px', border: 'none', cursor: 'pointer',
                background: i === slide ? '#fff' : 'rgba(255,255,255,0.5)',
                padding: 0, transition: 'all 0.3s ease',
              }} />
            ))}
          </div>

          {/* Prev/Next arrows */}
          {[
            { dir: -1, label: '‹', side: 'left' },
            { dir: 1, label: '›', side: 'right' },
          ].map(({ dir, label, side }) => (
            <button key={side}
              onClick={() => goTo((slide + dir + SLIDE_IMAGES.length) % SLIDE_IMAGES.length)}
              style={{
                position: 'absolute', top: '50%', [side]: '12px',
                transform: 'translateY(-50%)',
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(192,57,43,0.75)', backdropFilter: 'blur(4px)',
                border: 'none', color: '#fff', fontSize: '20px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 3, transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#C0392B' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(192,57,43,0.75)' }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* SME strip below hero */}
      <div style={{ background: '#fff', textAlign: 'center', padding: '28px 24px 20px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#1A1A2E', margin: '0 0 4px', fontFamily: 'Hind Siliguri, sans-serif', letterSpacing: '1px' }}>
          SME
        </h2>
        <p style={{ fontSize: '14px', fontWeight: 700, color: '#374151', margin: '0 0 10px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
          TRANSFORMING SMEs, SPREADING HAPPINESS
        </p>
        <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '640px', margin: '0 auto', fontFamily: 'Hind Siliguri, sans-serif', lineHeight: 1.6 }}>
          আমাদের পার্টনার মার্চেন্টদের ক্যাশ ফ্লো স্মুথ রাখতে এবং ব্যবসায়িক গ্রোথ নিশ্চিত করতে আমরা দিচ্ছি এক্সক্লুসিভ বিজনেস লোন ও টেকনিক্যাল সলিউশন।
        </p>

        {/* Stats bar */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', marginTop: '24px', flexWrap: 'wrap' }}>
          {[
            { val: '৫০,০০০+', label: 'সক্রিয় মার্চেন্ট' },
            { val: '৳১,০০,০০০', label: 'সর্বোচ্চ লোন' },
            { val: '১২ মাস', label: 'সহজ কিস্তি' },
            { val: '২৪ ঘণ্টা', label: 'দ্রুত অনুমোদন' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#C0392B', fontFamily: 'Inter, sans-serif' }}>{s.val}</div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '3px', fontFamily: 'Hind Siliguri, sans-serif' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Loan Application Form ─────────────────────────────────────────────────────
function LoanForm() {
  const [formStep, setFormStep] = useState<FormStep>('form')
  const [form, setForm] = useState<FormData>({
    businessName: '', contactNo: '', address: '',
    facebookPage: '', website: '', loanType: '', loanPurpose: '',
    loanAmount: '', nidImage: null, tradeImage: null,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const nidRef = useRef<HTMLInputElement>(null)
  const tradeRef = useRef<HTMLInputElement>(null)

  // ১৬টি ক্যাটাগরি এবং প্রতিটির অধীনে লোন উদ্দেশ্যসমূহের ম্যাপিং
  const loanCategoriesData: Record<string, string[]> = {
    'ব্যবসার মূলধন ও ক্যাশ ফ্লো বৃদ্ধি': [
      'চলতি মূলধন ঘাটতি পূরণ',
      'দৈনন্দিন খরচ পরিচালনা',
      'জরুরি ক্যাশ ফ্লো সাপোর্ট'
    ],
    'অনলাইন শপ বা ই-কমার্স স্টক ও ইনভেন্টরি ক্রয়': [
      'নতুন পণ্য বা স্টক পাইকারি কেনা',
      'আমদানিকৃত পণ্যের পেমেন্ট পরিশোধ',
      'সিজনাল প্রোডাক্ট ইনভেন্টরি তৈরি'
    ],
    'ডিজিটাল মার্কেটিং ও ফেসবুক অ্যাডস বাজেট': [
      'ফেসবুক ও ইনস্টাগ্রাম পেইড ক্যাম্পেইন',
      'গুগল ও ইউটিউব বিজ্ঞাপন বাজেট',
      'ব্র্যান্ড প্রমোশন ও ইনফ্লুয়েন্সার মার্কেটিং'
    ],
    'ওয়েবসাইট বা মোবাইল অ্যাপ ডেভেলপমেন্ট': [
      'ই-কমার্স ওয়েবসাইট তৈরি ও আপগ্রেড',
      'কাস্টম মোবাইল অ্যাপ ডেভেলপমেন্ট',
      'ডোমেইন, হোস্টিং ও সফটওয়্যার লাইসেন্স'
    ],
    'দোকান বা শোরুমের আধুনিকায়ন ও ডেকোরেশন': [
      'শোরুম ইন্টেরিয়র ও ডেকোরেশন',
      'ডিসপ্লে র‍্যাক ও লাইটিংস সেটআপ',
      'সাইনবোর্ড ও ব্র্যান্ডিং কাজ'
    ],
    'পাইকারি পণ্য ক্রয়ের জন্য চলতি মূলধন': [
      'বल्क অ্যামাউন্টে পণ্য পারচেজ',
      'সাপ্লায়ারের বকেয়া পরিশোধ ডিসকাউন্ট সুবিধা পেতে',
      'নতুন সাপ্লায়ার নেটওয়ার্ক তৈরি'
    ],
    'যন্ত্রপাতি, প্রিন্টার বা অফিস সরঞ্জাম ক্রয়': [
      'উৎপাদনমুখী মেশিনারি ক্রয়',
      'অফিস ইকুইপমেন্ট ও কম্পিউটার সেটআপ',
      'প্যাকেজিং বা প্রিন্টিং মেশিন ক্রয়'
    ],
    'পণ্য ডেলিভারি ও লজিস্টিকস সম্প্রসারণ': [
      'ডেলিভারি ভ্যান বা বাইক ক্রয়/ভাড়া',
      'কুরিয়ার সার্ভিস ইন্টিগ্রেশন ও ডিপোজিট',
      'প্যাকেজিং ও শিপিং অপারেশন খরচ'
    ],
    'কাস্টমার সাপোর্ট ও কল সেন্টার সেটআপ': [
      'কাস্টমার কেয়ার ডেস্ক ও হেডসেট ক্রয়',
      'কল সেন্টার সফটওয়্যার সাবস্ক্রিপশন',
      'সাপোর্ট টিম রিক্রুটমেন্ট ও ট্রেনিং'
    ],
    'ব্যবসায়িক অ্যাকাউন্ট ও সফটওয়্যার সাবস্ক্রিপশন': [
      'ইআরপি বা অ্যাকাউন্টিং সফটওয়্যার লাইসেন্স',
      'ক্লাউড সার্ভিস ও সিকিউরিটি টুলস',
      'প্রিমিয়াম বিজনেস টুলস সাবস্ক্রিপশন'
    ],
    'প্যাকেজিং ও ব্র্যান্ডিং ম্যাটেরিয়ালস তৈরি': [
      'কাস্টমাইজড বক্স ও পলি প্রিন্টিং',
      'ব্র্যান্ড লেবেল ও টেপ তৈরি',
      'ক্যাটালগ ও প্রমোশনাল লিফলেট প্রিন্ট'
    ],
    'কর্মচারীদের বেতন ও অপারেশনাল খরচ ব্যবস্থাপনা': [
      'স্টাফদের মাসিক বেতন পরিশোধ',
      'অফিস বা গোডাউন ইউটিলিটি বিল',
      'রুটিন অপারেশনাল খরচ নির্বাহ'
    ],
    'স্টোরেজ বা গোডাউন ভাড়া ও রক্ষণাবেক্ষণ': [
      'নতুন গোডাউন বা ওয়্যারহাউস অগ্রিম ভাড়া',
      'গোডাউন রেনোভেশন ও সিকিউরিটি সেটআপ',
      'পণ্য সংরক্ষণের সেলফ ও র‍্যাকিং'
    ],
    'নতুন ব্রাঞ্চ বা আউটলেট চালুকরণ': [
      'নতুন শাখা বা শোরুমের জামানত ও অগ্রিম',
      'শাখার প্রাথমিক স্টক ও ডেকোরেশন',
      'শাখার উদ্বোধনী মার্কেটিং খরচ'
    ],
    'জরুরি ট্রেড লাইসেন্স ও ট্যাক্স কমপ্লায়েন্স ফি': [
      'ট্রেড লাইসেন্স নবায়ন ও নতুন ফি',
      'ট্যাক্স ও ভ্যাট সংক্রান্ত কমপ্লায়েন্স খরচ',
      'বিজনেস সার্টিফিকেশন ও আইনি ফি'
    ],
    'অন্যান্য বিশেষ ব্যবসায়িক সম্প্রসারণ প্রয়োজন': [
      'বিশেষ বিজনেস প্রজেক্ট বাস্তবায়ন',
      'নতুন পণ্যের ট্রায়াল লঞ্চ',
      'অন্যান্য জরুরি ব্যবসায়িক প্রয়োজন'
    ]
  };

  // ক্যাটাগরিগুলোর লিস্ট ড্রপডাউনের জন্য
  const categories = Object.keys(loanCategoriesData);

  // ক্যাটাগরি সিলেক্ট করলে তার আন্ডারে থাকা উদ্দেশ্যগুলোর লিস্ট বের করা
  const currentPurposes = form.loanType ? loanCategoriesData[form.loanType] || [] : [];

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!form.businessName.trim()) e.businessName = 'ব্যবসার নাম আবশ্যক'
    if (!form.contactNo.trim()) e.contactNo = 'যোগাযোগ নম্বর আবশ্যক'
    else if (!/^01[3-9]\d{8}$/.test(form.contactNo.replace(/\s/g, ''))) e.contactNo = 'সঠিক বাংলাদেশ মোবাইল নম্বর দিন'
    if (!form.address.trim()) e.address = 'ঠিকানা আবশ্যক'
    if (!form.facebookPage.trim()) e.facebookPage = 'ফেসবুক পেজ লিংক আবশ্যক'
    if (!form.loanType) e.loanType = 'লোনের ধরন সিলেক্ট করুন'
    if (!form.loanPurpose) e.loanPurpose = 'লোনের উদ্দেশ্য সিলেক্ট করুন'
    if (!form.loanAmount.trim()) e.loanAmount = 'লোনের পরিমাণ আবশ্যক'
    else {
      const amt = parseInt(form.loanAmount.replace(/,/g, ''), 10)
      if (isNaN(amt) || amt < 5000) e.loanAmount = 'সর্বনিম্ন ৳৫,০০০'
      else if (amt > MAX_FIRST_LOAN) e.loanAmount = `প্রথম আবেদনে সর্বোচ্চ ৳${MAX_FIRST_LOAN.toLocaleString()}`
    }
    if (!form.nidImage) e.nidImage = 'NID এর ছবি আপলোড করুন'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    setFormStep('loading')
    setTimeout(() => {
      setFormStep('result-service-success')
    }, 2200)
  }

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const val = e.target.value;
    setForm(f => {
      // যদি লোনের ধরন (category) পরিবর্তন করা হয়, তবে লোনের উদ্দেশ্য রিসেট করে দিতে হবে
      if (k === 'loanType') {
        return { ...f, loanType: val, loanPurpose: '' }
      }
      return { ...f, [k]: val }
    })
    setErrors(er => ({ ...er, [k]: '' }))
  }

  const inputStyle = (hasError?: string): React.CSSProperties => ({
    width: '100%', padding: '11px 14px', borderRadius: '8px',
    border: `1.5px solid ${hasError ? '#C0392B' : '#E2E8F0'}`,
    fontSize: '14px', color: '#1A1A2E',
    fontFamily: 'Hind Siliguri, sans-serif',
    background: '#FAFAFA',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  })

  const labelStyle: React.CSSProperties = {
    display: 'block', marginBottom: '6px',
    fontSize: '13px', fontWeight: 600, color: '#374151',
    fontFamily: 'Hind Siliguri, sans-serif',
  }

  const fieldGroup = (label: string, key: keyof FormData, type = 'text', placeholder = '', required = true) => (
    <div>
      <label style={labelStyle}>{label}{required && <span style={{ color: '#C0392B' }}>*</span>}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key] as string}
        onChange={set(key)}
        style={inputStyle(errors[key])}
        onFocus={e => { e.target.style.borderColor = '#C0392B'; e.target.style.background = '#fff' }}
        onBlur={e => { e.target.style.borderColor = errors[key] ? '#C0392B' : '#E2E8F0'; e.target.style.background = '#FAFAFA' }}
      />
      {errors[key] && <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#C0392B' }}>{errors[key]}</p>}
    </div>
  )

  return (
    <section id="apply" style={{ padding: '80px 24px', background: '#F8FAFC' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-block', background: '#FEF2F2', color: '#C0392B', padding: '4px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
            লোন আবেদন পোর্টাল
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 700, color: '#1A1A2E', margin: '0 0 12px', fontFamily: 'Hind Siliguri, sans-serif' }}>
            আবেদন ফর্ম পূরণ করুন
          </h2>
          <p style={{ color: '#64748B', fontSize: '15px', fontFamily: 'Hind Siliguri, sans-serif' }}>
            আপনার তথ্য সঠিকভাবে পূরণ করুন। আমাদের টিম ২৪ ঘণ্টার মধ্যে যোগাযোগ করবে।
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#fff', borderRadius: '16px',
          boxShadow: '0 4px 40px rgba(0,0,0,0.08)', overflow: 'hidden',
          border: '1px solid #F1E8E8',
        }}>
          {/* Card header */}
          <div style={{
            background: 'linear-gradient(135deg, #8B0000, #C0392B)',
            padding: '20px 32px', display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="white" strokeWidth="2"/>
                <path d="M8 12h8M8 8h8M8 16h5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '16px', fontFamily: 'Hind Siliguri, sans-serif' }}>বিজনেস লোন আবেদন ফর্ম</div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px' }}>Business Loan Application Form</div>
            </div>
          </div>

          <div style={{ padding: '32px' }}>
            {formStep === 'form' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Row 1 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {fieldGroup('ব্যবসার নাম', 'businessName', 'text', 'আপনার ব্যবসার সম্পূর্ণ নাম')}
                  {fieldGroup('মোবাইল নম্বর', 'contactNo', 'tel', '01XXXXXXXXX')}
                </div>

                {/* Row 3 */}
                <div>
                  <label style={labelStyle}>ঠিকানা<span style={{ color: '#C0392B' }}>*</span></label>
                  <textarea
                    placeholder="পূর্ণ ঠিকানা লিখুন..."
                    value={form.address}
                    onChange={set('address')}
                    rows={2}
                    style={{ ...inputStyle(errors.address), resize: 'vertical' }}
                    onFocus={e => { e.target.style.borderColor = '#C0392B'; e.target.style.background = '#fff' }}
                    onBlur={e => { e.target.style.borderColor = errors.address ? '#C0392B' : '#E2E8F0'; e.target.style.background = '#FAFAFA' }}
                  />
                  {errors.address && <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#C0392B' }}>{errors.address}</p>}
                </div>

                {/* Row 4 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    {fieldGroup('ফেসবুক পেজ লিংক', 'facebookPage', 'url', 'https://facebook.com/yourpage')}
                  </div>
                  <div>
                    <label style={labelStyle}>ওয়েবসাইট <span style={{ color: '#94A3B8', fontWeight: 400 }}>(ঐচ্ছিক)</span></label>
                    <input
                      type="url" placeholder="https://yourwebsite.com"
                      value={form.website} onChange={set('website')}
                      style={inputStyle()}
                      onFocus={e => { e.target.style.borderColor = '#C0392B'; e.target.style.background = '#fff' }}
                      onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = '#FAFAFA' }}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div style={{ borderTop: '1px dashed #E2E8F0', paddingTop: '20px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#C0392B', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    লোনের বিবরণ
                  </div>
                </div>

                {/* Row 5: Dependent Dropdowns */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {/* Loans Category Dropdown (16 items) */}
                  <div>
                    <label style={labelStyle}>লোনের ধরন / ক্যাটাগরি<span style={{ color: '#C0392B' }}>*</span></label>
                    <select
                      value={form.loanType}
                      onChange={set('loanType')}
                      style={{ ...inputStyle(errors.loanType), cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23C0392B' stroke-width='2' fill='none'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: '36px' }}
                      onFocus={e => { e.target.style.borderColor = '#C0392B'; e.target.style.background = '#fff' }}
                      onBlur={e => { e.target.style.borderColor = errors.loanType ? '#C0392B' : '#E2E8F0'; e.target.style.background = '#FAFAFA' }}
                    >
                      <option value="">-- ক্যাটাগরি সিলেক্ট করুন --</option>
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    {errors.loanType && <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#C0392B' }}>{errors.loanType}</p>}
                  </div>

                  {/* Loan Purpose Dropdown (Depends on selected Category) */}
                  <div>
                    <label style={labelStyle} id="loanPurpose">লোনের উদ্দেশ্য<span style={{ color: '#C0392B' }}>*</span></label>
                    <select
                      id="loanPurpose"
                      value={form.loanPurpose}
                      onChange={set('loanPurpose')}
                      disabled={!form.loanType}
                      style={{ 
                        ...inputStyle(errors.loanPurpose), 
                        cursor: form.loanType ? 'pointer' : 'not-allowed', 
                        opacity: form.loanType ? 1 : 0.6,
                        appearance: 'none', 
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23C0392B' stroke-width='2' fill='none'/%3E%3C/svg%3E")`, 
                        backgroundRepeat: 'no-repeat', 
                        backgroundPosition: 'right 14px center', 
                        paddingRight: '36px' 
                      }}
                      onFocus={e => { e.target.style.borderColor = '#C0392B'; e.target.style.background = '#fff' }}
                      onBlur={e => { e.target.style.borderColor = errors.loanPurpose ? '#C0392B' : '#E2E8F0'; e.target.style.background = '#FAFAFA' }}
                    >
                      <option value="">{form.loanType ? '-- উদ্দেশ্য সিলেক্ট করুন --' : 'আগে ক্যাটাগরি সিলেক্ট করুন'}</option>
                      {currentPurposes.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    {errors.loanPurpose && <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#C0392B' }}>{errors.loanPurpose}</p>}
                  </div>
                </div>

                {/* Loan Amount */}
                <div>
                  <label style={labelStyle}>
                    লোনের পরিমাণ (টাকা)<span style={{ color: '#C0392B' }}>*</span>
                    <span style={{ marginLeft: '8px', fontSize: '11px', color: '#94A3B8', fontWeight: 400 }}>সর্বোচ্চ ৳৫০,০০০ (প্রথম আবেদনে)</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748B', fontWeight: 600, fontSize: '14px' }}>৳</span>
                    <input
                      type="number" placeholder="5000"
                      min={5000} max={MAX_FIRST_LOAN}
                      value={form.loanAmount} onChange={set('loanAmount')}
                      style={{ ...inputStyle(errors.loanAmount), paddingLeft: '30px' }}
                      onFocus={e => { e.target.style.borderColor = '#C0392B'; e.target.style.background = '#fff' }}
                      onBlur={e => { e.target.style.borderColor = errors.loanAmount ? '#C0392B' : '#E2E8F0'; e.target.style.background = '#FAFAFA' }}
                    />
                  </div>
                  {errors.loanAmount && <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#C0392B' }}>{errors.loanAmount}</p>}

                  {/* Info bar */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                    {[5000, 10000, 25000, 50000].map(a => (
                      <button key={a}
                        onClick={() => { setForm(f => ({ ...f, loanAmount: String(a) })); setErrors(e => ({ ...e, loanAmount: '' })) }}
                        style={{
                          padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                          border: `1.5px solid ${form.loanAmount === String(a) ? '#C0392B' : '#E2E8F0'}`,
                          background: form.loanAmount === String(a) ? '#FEF2F2' : '#fff',
                          color: form.loanAmount === String(a) ? '#C0392B' : '#64748B',
                          cursor: 'pointer', transition: 'all 0.15s',
                        }}
                      >
                        ৳{a.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Document uploads */}
                <div style={{ borderTop: '1px dashed #E2E8F0', paddingTop: '20px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#C0392B', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    ডকুমেন্ট আপলোড
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {/* NID upload */}
                  <div>
                    <label style={labelStyle}>জাতীয় পরিচয়পত্র (NID)<span style={{ color: '#C0392B' }}>*</span></label>
                    <div
                      onClick={() => nidRef.current?.click()}
                      style={{
                        border: `2px dashed ${errors.nidImage ? '#C0392B' : form.nidImage ? '#059669' : '#E2E8F0'}`,
                        borderRadius: '8px', padding: '20px 16px',
                        textAlign: 'center', cursor: 'pointer',
                        background: form.nidImage ? '#F0FDF4' : '#FAFAFA',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { (e.currentTarget).style.borderColor = form.nidImage ? '#059669' : '#C0392B'; (e.currentTarget).style.background = form.nidImage ? '#F0FDF4' : '#FEF2F2' }}
                      onMouseLeave={e => { (e.currentTarget).style.borderColor = errors.nidImage ? '#C0392B' : form.nidImage ? '#059669' : '#E2E8F0'; (e.currentTarget).style.background = form.nidImage ? '#F0FDF4' : '#FAFAFA' }}
                    >
                      {form.nidImage ? (
                        <>
                          <div style={{ fontSize: '24px', marginBottom: '4px' }}>✅</div>
                          <div style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>{form.nidImage.name}</div>
                        </>
                      ) : (
                        <>
                          <div style={{ fontSize: '24px', marginBottom: '4px' }}>📄</div>
                          <div style={{ fontSize: '12px', color: '#64748B' }}>ক্লিক করে আপলোড করুন</div>
                          <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>JPG, PNG, PDF (max 5MB)</div>
                        </>
                      )}
                    </div>
                    <input ref={nidRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }}
                      onChange={e => { setForm(f => ({ ...f, nidImage: e.target.files?.[0] || null })); setErrors(er => ({ ...er, nidImage: '' })) }}
                    />
                    {errors.nidImage && <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#C0392B' }}>{errors.nidImage}</p>}
                  </div>

                  {/* Trade License upload */}
                  <div>
                    <label style={labelStyle}>ট্রেড লাইসেন্স <span style={{ color: '#94A3B8', fontWeight: 400 }}>(ঐচ্ছিক)</span></label>
                    <div
                      onClick={() => tradeRef.current?.click()}
                      style={{
                        border: `2px dashed ${form.tradeImage ? '#059669' : '#E2E8F0'}`,
                        borderRadius: '8px', padding: '20px 16px',
                        textAlign: 'center', cursor: 'pointer',
                        background: form.tradeImage ? '#F0FDF4' : '#FAFAFA',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { (e.currentTarget).style.borderColor = form.tradeImage ? '#059669' : '#C0392B'; (e.currentTarget).style.background = form.tradeImage ? '#F0FDF4' : '#FEF2F2' }}
                      onMouseLeave={e => { (e.currentTarget).style.borderColor = form.tradeImage ? '#059669' : '#E2E8F0'; (e.currentTarget).style.background = form.tradeImage ? '#F0FDF4' : '#FAFAFA' }}
                    >
                      {form.tradeImage ? (
                        <>
                          <div style={{ fontSize: '24px', marginBottom: '4px' }}>✅</div>
                          <div style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>{form.tradeImage.name}</div>
                        </>
                      ) : (
                        <>
                          <div style={{ fontSize: '24px', marginBottom: '4px' }}>🏢</div>
                          <div style={{ fontSize: '12px', color: '#64748B' }}>ক্লিক করে আপলোড করুন</div>
                          <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>JPG, PNG, PDF (max 5MB)</div>
                        </>
                      )}
                    </div>
                    <input ref={tradeRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }}
                      onChange={e => setForm(f => ({ ...f, tradeImage: e.target.files?.[0] || null }))}
                    />
                  </div>
                </div>

                {/* Requirement note */}
                <div style={{
                  background: '#FFF7ED', border: '1px solid #FED7AA',
                  borderRadius: '10px', padding: '14px 16px',
                  display: 'flex', gap: '10px', alignItems: 'flex-start',
                }}>
                  <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>ℹ️</span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#92400E', marginBottom: '4px' }}>লোন সীমা সংক্রান্ত তথ্য</div>
                    <div style={{ fontSize: '12px', color: '#78350F', lineHeight: 1.5 }}>
                      প্রথম আবেদনে সর্বোচ্চ <strong>৳৫০,০০০</strong>। সফল ১২ মাসের EMI পরিশোধের পর সর্বোচ্চ <strong>৳১,০০,০০০</strong> পর্যন্ত ক্যাশ লোনের যোগ্যতা অর্জন করবেন।
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  style={{
                    width: '100%', padding: '16px',
                    background: 'linear-gradient(135deg, #8B0000, #C0392B, #E74C3C)',
                    color: '#fff', fontSize: '16px', fontWeight: 700,
                    border: 'none', borderRadius: '10px', cursor: 'pointer',
                    fontFamily: 'Hind Siliguri, sans-serif',
                    boxShadow: '0 4px 20px rgba(192,57,43,0.4)',
                    transition: 'all 0.2s',
                    letterSpacing: '0.3px',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(192,57,43,0.5)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(192,57,43,0.4)' }}
                >
                  আবেদন সাবমিট করুন →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
            {/* Loading */}
            {formStep === 'loading' && (
              <div style={{ textAlign: 'center', padding: '60px 20px' }} className="animate-fadeInUp">
                <div style={{
                  width: '56px', height: '56px', border: '4px solid #FEE2E2',
                  borderTopColor: '#C0392B', borderRadius: '50%', margin: '0 auto 20px',
                }} className="animate-spin" />
                <h3 style={{ color: '#1A1A2E', fontSize: '18px', fontWeight: 600, marginBottom: '8px', fontFamily: 'Hind Siliguri, sans-serif' }}>
                  আবেদন প্রক্রিয়াকরণ হচ্ছে...
                </h3>
                <p style={{ color: '#64748B', fontSize: '14px', fontFamily: 'Hind Siliguri, sans-serif' }}>
                  আপনার তথ্য যাচাই করা হচ্ছে। একটু অপেক্ষা করুন।
                </p>
              </div>
            )}

            {/* Result: Cash denied */}
            {formStep === 'result-cash-denied' && (
              <div className="animate-fadeInUp">
                {/* Warning block */}
                <div style={{
                  background: '#FFF7ED', border: '1px solid #FED7AA',
                  borderRadius: '12px', padding: '20px', marginBottom: '20px',
                }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '24px', flexShrink: 0 }}>⚠️</div>
                    <div>
                      <h3 style={{ margin: '0 0 6px', fontSize: '17px', fontWeight: 700, color: '#92400E', fontFamily: 'Hind Siliguri, sans-serif' }}>
                        Notice: Cash Loan Eligibility
                      </h3>
                      <p style={{ margin: 0, fontSize: '14px', color: '#78350F', lineHeight: 1.6, fontFamily: 'Hind Siliguri, sans-serif' }}>
                        দুঃখিত! আমাদের বর্তমান পলিসি অনুযায়ী নতুন পার্টনারদের জন্য সরাসরি <strong>Cash SME Loan</strong> এপ্রুভ করা সম্ভব হচ্ছে না।
                      </p>
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '16px 20px', marginBottom: '20px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1A1A2E', marginBottom: '10px', fontFamily: 'Hind Siliguri, sans-serif' }}>
                    ক্যাশ লোন পাওয়ার রিকোয়ারমেন্ট:
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C0392B', marginTop: '7px', flexShrink: 0 }} />
                    <p style={{ margin: 0, fontSize: '14px', color: '#334155', lineHeight: 1.6, fontFamily: 'Hind Siliguri, sans-serif' }}>
                      ক্যাশ লোন পাওয়ার জন্য আমাদের প্ল্যাটফর্মে অন্তত একবার সফলভাবে কোনো সার্ভিস বা প্রজেক্ট সম্পন্ন করে <strong>১২ মাসের ইএমআই (EMI)</strong> সফলভাবে ক্লিয়ার করতে হবে। এটি আপনার একটি শক্তিশালী বিজনেস ক্রেডিট স্কোর তৈরি করবে।
                    </p>
                  </div>
                </div>

                {/* Good news */}
                <div style={{
                  background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)',
                  border: '1px solid #86EFAC',
                  borderRadius: '12px', padding: '20px', marginBottom: '20px',
                }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '24px', flexShrink: 0 }}>✨</div>
                    <div>
                      <h3 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: 700, color: '#14532D', fontFamily: 'Hind Siliguri, sans-serif' }}>
                        Good News for Your Business!
                      </h3>
                      <p style={{ margin: 0, fontSize: '14px', color: '#166534', lineHeight: 1.7, fontFamily: 'Hind Siliguri, sans-serif' }}>
                        তবে আপনার ব্যবসার তাৎক্ষণিক গ্রোথ ও ডিজিটাল প্রসারের জন্য আপনার আইডিতে একটি <strong>"Business Service Loan"</strong> অ্যাপ্রুভড রয়েছে! আপনি চাইলে আপনার বিজনেসের জন্য ওয়েবসাইট ডেভেলপমেন্ট, অ্যাপ ডিজাইন, ডিজিটাল মার্কেটিং বা কাস্টমার সাপোর্ট সেটআপের মতো দরকারি সার্ভিসগুলো এই লোনের আওতায় কোনো ক্যাশ আউটফ্লো ছাড়াই নিতে পারবেন। পরবর্তীতে খুব সহজ কিস্তিতে (<strong>১২ মাসের EMI</strong>) এর পেমেন্ট পরিশোধ করার সুযোগ থাকছে।
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={handleServiceApply}
                    style={{
                      flex: 1, minWidth: '200px', padding: '14px 20px',
                      background: 'linear-gradient(135deg, #059669, #10B981)',
                      color: '#fff', fontSize: '15px', fontWeight: 700,
                      border: 'none', borderRadius: '8px', cursor: 'pointer',
                      fontFamily: 'Hind Siliguri, sans-serif',
                      boxShadow: '0 4px 16px rgba(5,150,105,0.35)',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}
                  >
                    সার্ভিস লোনের জন্য আবেদন করুন →
                  </button>
                  <button
                    onClick={() => setFormStep('form')}
                    style={{
                      padding: '14px 20px', borderRadius: '8px',
                      border: '1.5px solid #E2E8F0', background: '#fff',
                      color: '#64748B', fontSize: '14px', fontWeight: 500,
                      cursor: 'pointer', fontFamily: 'Hind Siliguri, sans-serif',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#C0392B'; e.currentTarget.style.color = '#C0392B' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#64748B' }}
                  >
                    ← ফর্মে ফিরুন
                  </button>
                </div>
              </div>
            )}

            {/* Result: Service success */}
            {formStep === 'result-service-success' && (
              <div style={{ textAlign: 'center', padding: '20px 0' }} className="animate-fadeInUp">
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #059669, #10B981)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(5,150,105,0.35)',
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#1A1A2E', margin: '0 0 8px', fontFamily: 'Hind Siliguri, sans-serif' }}>
                  ✅ Application Submitted Successfully!
                </h3>
                <p style={{ color: '#64748B', fontSize: '15px', lineHeight: 1.6, margin: '0 0 24px', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto', fontFamily: 'Hind Siliguri, sans-serif' }}>
                  আপনার সার্ভিস লোন রিকোয়েস্টটি সফলভাবে গ্রহণ করা হয়েছে।
                </p>

                <div style={{
                  background: '#F0FDF4', border: '1px solid #86EFAC',
                  borderRadius: '12px', padding: '20px', textAlign: 'left', marginBottom: '24px',
                }}>
                  <p style={{ margin: 0, fontSize: '14px', color: '#166534', lineHeight: 1.7, fontFamily: 'Hind Siliguri, sans-serif' }}>
                    আমাদের <strong>ইনভেস্টিগেশন টিম</strong> আপনার বিজনেস প্রোফাইল এবং রিকোয়ারমেন্ট যাচাই করে পরবর্তী <strong>২৪ ঘণ্টার মধ্যে</strong> ফোন বা ইমেলের মাধ্যমে আপনার সাথে যোগাযোগ করবে এবং পরবর্তী ধাপগুলো সম্পন্ন করবে।
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
                  {[
                    { icon: '📞', label: 'কল করুন', sub: '16XXX' },
                    { icon: '📧', label: 'ইমেইল', sub: 'loan@merchantfin.com' },
                    { icon: '💬', label: 'লাইভ চ্যাট', sub: 'সকাল ৯টা - রাত ৯টা' },
                  ].map(c => (
                    <div key={c.label} style={{
                      background: '#fff', border: '1px solid #E2E8F0',
                      borderRadius: '10px', padding: '12px 16px', textAlign: 'center',
                      minWidth: '130px',
                    }}>
                      <div style={{ fontSize: '20px', marginBottom: '4px' }}>{c.icon}</div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A2E' }}>{c.label}</div>
                      <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>{c.sub}</div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => { setFormStep('form'); setForm({ businessName: '', contactNo: '', address: '', facebookPage: '', website: '', loanType: '', loanPurpose: '', loanAmount: '', nidImage: null, tradeImage: null }) }}
                  style={{
                    padding: '12px 28px', borderRadius: '8px',
                    border: '1.5px solid #C0392B', background: '#fff',
                    color: '#C0392B', fontSize: '14px', fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'Hind Siliguri, sans-serif',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
                >
                  নতুন আবেদন করুন
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      no: '০১', icon: '📋',
      title: 'লোন রিকুয়েস্ট জমা দিন',
      desc: 'মার্চেন্ট আইডি ও প্রয়োজনীয় তথ্য দিয়ে অনলাইন ফর্ম পূরণ করুন। NID এবং প্রয়োজনীয় কাগজপত্র আপলোড করুন।',
    },
    {
      no: '০২', icon: '✅',
      title: 'সার্ভিস বা ফান্ড অ্যাপ্রুভাল',
      desc: 'নতুন মার্চেন্টদের জন্য টেকনিক্যাল সার্ভিস ক্রেডিট এবং বিশ্বস্ত মার্চেন্টদের জন্য সরাসরি ক্যাশ লোন অনুমোদন।',
    },
    {
      no: '০৩', icon: '💳',
      title: '১২ মাসের সহজ কিস্তি',
      desc: 'কোনো অতিরিক্ত চাপ ছাড়াই ১২ মাসের সহজ ইএমআই-তে পেমেন্ট পরিশোধ করুন। কোনো লুকানো চার্জ নেই।',
    },
  ]

  return (
    <section id="how-it-works" style={{ padding: '80px 24px', background: '#fff' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <div style={{ display: 'inline-block', background: '#FEF2F2', color: '#C0392B', padding: '4px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
            প্রক্রিয়া
          </div>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, color: '#1A1A2E', margin: '0 0 12px', fontFamily: 'Hind Siliguri, sans-serif' }}>
            কীভাবে কাজ করে?
          </h2>
          <p style={{ color: '#64748B', fontSize: '15px', maxWidth: '520px', margin: '0 auto', fontFamily: 'Hind Siliguri, sans-serif', lineHeight: 1.6 }}>
            মাত্র তিনটি সহজ ধাপে আপনার ব্যবসার জন্য ফিন্যান্সিং নিশ্চিত করুন।
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', position: 'relative' }}>
          {/* Connector lines */}
          <div style={{ position: 'absolute', top: '52px', left: 'calc(33.33% - 10px)', width: 'calc(33.33% + 20px)', height: '2px', background: 'linear-gradient(90deg, #C0392B, #E74C3C)', zIndex: 0, opacity: 0.4 }} />
          <div style={{ position: 'absolute', top: '52px', left: 'calc(66.66% - 10px)', width: 'calc(33.33% + 10px)', height: '2px', background: 'linear-gradient(90deg, #C0392B, #E74C3C)', zIndex: 0, opacity: 0.4 }} />

          {steps.map((s, i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: '16px',
              border: '1px solid #F1E8E8',
              padding: '28px 24px',
              boxShadow: '0 2px 16px rgba(192,57,43,0.06)',
              position: 'relative', zIndex: 1,
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget).style.boxShadow = '0 8px 32px rgba(192,57,43,0.14)'; (e.currentTarget).style.transform = 'translateY(-4px)' }}
              onMouseLeave={e => { (e.currentTarget).style.boxShadow = '0 2px 16px rgba(192,57,43,0.06)'; (e.currentTarget).style.transform = 'none' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #C0392B, #E74C3C)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px', boxShadow: '0 4px 12px rgba(192,57,43,0.3)',
                }}>
                  {s.icon}
                </div>
                <div style={{
                  fontSize: '28px', fontWeight: 700, color: '#F1E8E8',
                  fontFamily: 'Inter, sans-serif', lineHeight: 1,
                }}>
                  {s.no}
                </div>
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#1A1A2E', margin: '0 0 10px', fontFamily: 'Hind Siliguri, sans-serif' }}>
                {s.title}
              </h3>
              <p style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.6, margin: 0, fontFamily: 'Hind Siliguri, sans-serif' }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #how-it-works .grid-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

// ─── Services Section ─────────────────────────────────────────────────────────
function Services() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('feature')

  const services = [
    { icon: '💻', title: 'ওয়েবসাইট ডেভেলপমেন্ট', desc: 'প্রফেশনাল ই-কমার্স ওয়েবসাইট তৈরি করুন। SEO অপ্টিমাইজড, মোবাইল রেসপন্সিভ।' },
    { icon: '📱', title: 'অ্যাপ ডেভেলপমেন্ট', desc: 'Android ও iOS অ্যাপ ডিজাইন ও ডেভেলপমেন্ট। কাস্টমার এক্সপেরিয়েন্স উন্নত করুন।' },
    { icon: '📣', title: 'ডিজিটাল মার্কেটিং', desc: 'ফেসবুক, গুগল বিজ্ঞাপন এবং কনটেন্ট মার্কেটিং দিয়ে বিক্রি বাড়ান।' },
    { icon: '🎯', title: 'কাস্টমার সাপোর্ট সেটআপ', desc: 'লাইভ চ্যাট, হেল্পডেস্ক এবং কাস্টমার ম্যানেজমেন্ট সিস্টেম।' },
    { icon: '📦', title: 'ইনভেন্টরি ম্যানেজমেন্ট', desc: 'স্মার্ট ইনভেন্টরি ট্র্যাকিং ও স্টক ম্যানেজমেন্ট সলিউশন।' },
    { icon: '🔒', title: 'সাইবার সিকিউরিটি', desc: 'আপনার ব্যবসার ডেটা ও গ্রাহকের তথ্য সুরক্ষিত রাখুন।' },
  ]

  const tabContent: Record<ActiveTab, React.ReactNode> = {
    feature: (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {services.map((s, i) => (
          <div key={i} style={{
            background: 'linear-gradient(135deg, #C0392B, #E74C3C)',
            borderRadius: '12px', padding: '20px', cursor: 'pointer',
            transition: 'all 0.2s', color: '#fff',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(192,57,43,0.35)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>{s.icon}</div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 8px', fontFamily: 'Hind Siliguri, sans-serif' }}>{s.title}</h4>
            <p style={{ fontSize: '12px', opacity: 0.85, margin: 0, lineHeight: 1.5, fontFamily: 'Hind Siliguri, sans-serif' }}>{s.desc}</p>
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
              বিস্তারিত
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                <path d="M12 8l4 4-4 4M8 12h8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        ))}
      </div>
    ),
    document: (
      <div style={{ padding: '8px 0' }}>
        {[
          { doc: 'জাতীয় পরিচয়পত্র (NID)', note: 'সামনে ও পেছনের কপি', required: true },
          { doc: 'ট্রেড লাইসেন্স', note: 'বর্তমান বছরের হালনাগাদ', required: false },
          { doc: 'ব্যাংক স্টেটমেন্ট', note: 'সর্বশেষ ৩ মাস', required: false },
          { doc: 'মার্চেন্ট প্রোফাইল', note: 'প্ল্যাটফর্মে নিবন্ধিত আইডি', required: true },
          { doc: 'ব্যবসার ঠিকানার প্রমাণ', note: 'ইউটিলিটি বিল বা লিজ', required: false },
        ].map((d, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 0', borderBottom: '1px solid #F1F5F9',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '16px' }}>📄</span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A2E', fontFamily: 'Hind Siliguri, sans-serif' }}>{d.doc}</div>
                <div style={{ fontSize: '12px', color: '#64748B', fontFamily: 'Hind Siliguri, sans-serif' }}>{d.note}</div>
              </div>
            </div>
            <span style={{
              padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
              background: d.required ? '#FEF2F2' : '#F0FDF4',
              color: d.required ? '#C0392B' : '#059669',
              border: `1px solid ${d.required ? '#FCA5A5' : '#86EFAC'}`,
            }}>
              {d.required ? 'আবশ্যক' : 'ঐচ্ছিক'}
            </span>
          </div>
        ))}
      </div>
    ),
    contact: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {[
          { icon: '📞', title: 'হটলাইন', info: '16XXX', sub: '২৪/৭ কাস্টমার সার্ভিস' },
          { icon: '📧', title: 'ইমেইল', info: 'loan@merchantfin.com', sub: 'সাধারণত ২ ঘণ্টার মধ্যে উত্তর' },
          { icon: '📍', title: 'প্রধান অফিস', info: 'ঢাকা-১২১২', sub: 'গুলশান, ঢাকা, বাংলাদেশ' },
          { icon: '⏰', title: 'অফিস সময়', info: 'সকাল ৯টা - রাত ৯টা', sub: 'শনিবার থেকে বৃহস্পতিবার' },
        ].map((c, i) => (
          <div key={i} style={{ background: '#F8FAFC', borderRadius: '12px', padding: '16px', border: '1px solid #F1E8E8' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{c.icon}</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748B', marginBottom: '4px' }}>{c.title}</div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#C0392B' }}>{c.info}</div>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>{c.sub}</div>
          </div>
        ))}
      </div>
    ),
  }

  return (
    <section id="services" style={{ padding: '80px 24px', background: '#F8FAFC' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-block', background: '#FEF2F2', color: '#C0392B', padding: '4px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
            আমাদের সার্ভিস
          </div>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, color: '#1A1A2E', margin: '0 0 12px', fontFamily: 'Hind Siliguri, sans-serif' }}>
            সার্ভিস লোনে যা পাবেন
          </h2>
          <p style={{ color: '#64748B', fontSize: '15px', maxWidth: '520px', margin: '0 auto', fontFamily: 'Hind Siliguri, sans-serif', lineHeight: 1.6 }}>
            আপনার ব্যবসার ডিজিটাল রূপান্তরে সব ধরনের সহায়তা এক ছাদের নিচে।
          </p>
        </div>

        {/* Tab bar */}
        <div style={{
          display: 'flex', borderRadius: '10px', overflow: 'hidden',
          background: '#fff', border: '1px solid #E2E8F0',
          marginBottom: '28px', width: 'fit-content',
        }}>
          {([['feature', 'সার্ভিসমূহ'], ['document', 'প্রয়োজনীয় কাগজপত্র'], ['contact', 'যোগাযোগ']] as [ActiveTab, string][]).map(([tab, label]) => (
            <button key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 24px', fontSize: '14px', fontWeight: 600,
                border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                fontFamily: 'Hind Siliguri, sans-serif',
                background: activeTab === tab ? '#C0392B' : '#fff',
                color: activeTab === tab ? '#fff' : '#64748B',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {tabContent[activeTab]}
      </div>
    </section>
  )
}

// ─── EMI Calculator ────────────────────────────────────────────────────────────
function EMICalculator() {
  const [loanAmt, setLoanAmt] = useState(50000)
  const [rate, setRate] = useState(INTEREST_RATE)

  const emi = calcEMI(loanAmt, rate, EMI_MONTHS)
  const totalPayable = emi * EMI_MONTHS
  const totalInterest = totalPayable - loanAmt
  const principalPct = Math.round((loanAmt / totalPayable) * 100)
  const interestPct = 100 - principalPct

  return (
    <section id="emi-calculator" style={{ padding: '80px 24px', background: '#fff' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-block', background: '#FEF2F2', color: '#C0392B', padding: '4px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
            EMI ক্যালকুলেটর
          </div>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, color: '#1A1A2E', margin: '0 0 12px', fontFamily: 'Hind Siliguri, sans-serif' }}>
            আপনার মাসিক কিস্তি হিসাব করুন
          </h2>
          <p style={{ color: '#64748B', fontSize: '15px', fontFamily: 'Hind Siliguri, sans-serif' }}>
            লোনের পরিমাণ ও সুদের হার দিয়ে আপনার EMI দেখুন।
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Left: inputs */}
          <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '28px', border: '1px solid #F1E8E8' }}>
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Hind Siliguri, sans-serif' }}>
                  লোনের পরিমাণ (BDT)
                </label>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#C0392B', fontFamily: 'Inter, sans-serif' }}>
                  ৳{loanAmt.toLocaleString()}
                </span>
              </div>
              <input type="range" min={5000} max={MAX_LOAN} step={1000}
                value={loanAmt} onChange={e => setLoanAmt(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#C0392B' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '11px', color: '#94A3B8', fontFamily: 'Inter, sans-serif' }}>
                <span>৳5,000</span><span>৳1,00,000</span>
              </div>
            </div>

            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Hind Siliguri, sans-serif' }}>
                  সুদের হার (%)
                </label>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#C0392B', fontFamily: 'Inter, sans-serif' }}>
                  {rate}%
                </span>
              </div>
              <input type="range" min={1} max={20} step={0.5}
                value={rate} onChange={e => setRate(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#C0392B' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '11px', color: '#94A3B8', fontFamily: 'Inter, sans-serif' }}>
                <span>1%</span><span>20%</span>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '10px', padding: '16px', border: '1px solid #F1E8E8' }}>
              <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '4px', fontFamily: 'Hind Siliguri, sans-serif' }}>মেয়াদ (স্থির)</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A2E' }}>১২ মাস</div>
            </div>
          </div>

          {/* Middle: EMI result */}
          <div style={{
            background: '#F8FAFC', borderRadius: '16px', padding: '28px 24px',
            textAlign: 'center', border: '1px solid #F1E8E8', minWidth: '200px',
          }}>
            <div style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '8px', fontFamily: 'Hind Siliguri, sans-serif' }}>
              সমান মাসিক কিস্তি
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#C0392B', fontFamily: 'Inter, sans-serif', marginBottom: '4px' }}>
              ৳{Math.round(emi).toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '24px' }}>BDT / মাস</div>

            <a href="#apply">
              <button style={{
                width: '100%', padding: '13px 20px',
                background: 'linear-gradient(135deg, #C0392B, #E74C3C)',
                color: '#fff', fontSize: '14px', fontWeight: 700,
                border: 'none', borderRadius: '8px', cursor: 'pointer',
                fontFamily: 'Hind Siliguri, sans-serif',
                boxShadow: '0 4px 16px rgba(192,57,43,0.35)',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}
              >
                এখনই আবেদন করুন
              </button>
            </a>
          </div>

          {/* Right: breakdown */}
          <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '28px', border: '1px solid #F1E8E8' }}>
            <h4 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 700, color: '#1A1A2E', fontFamily: 'Hind Siliguri, sans-serif' }}>
              মোট পেমেন্টের বিবরণ
            </h4>

            {/* Donut-style bar */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ height: '12px', borderRadius: '6px', background: '#E2E8F0', overflow: 'hidden', marginBottom: '8px' }}>
                <div style={{ height: '100%', width: `${principalPct}%`, background: '#C0392B', borderRadius: '6px', transition: 'width 0.4s ease' }} />
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#C0392B', display: 'inline-block' }} />
                  মূল আসল ({principalPct}%)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#E2E8F0', display: 'inline-block' }} />
                  সুদ ({interestPct}%)
                </span>
              </div>
            </div>

            {[
              { label: 'মূল লোন', val: `৳${loanAmt.toLocaleString()}`, color: '#C0392B', bold: true },
              { label: 'মোট সুদ', val: `৳${Math.round(totalInterest).toLocaleString()}`, color: '#64748B', bold: false },
              { label: 'মোট প্রদেয়', val: `৳${Math.round(totalPayable).toLocaleString()}`, color: '#1A1A2E', bold: true },
            ].map((r, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 0', borderBottom: i < 2 ? '1px solid #F1F5F9' : 'none',
              }}>
                <span style={{ fontSize: '14px', color: '#64748B', fontFamily: 'Hind Siliguri, sans-serif' }}>{r.label}</span>
                <span style={{ fontSize: r.bold ? '16px' : '14px', fontWeight: r.bold ? 700 : 400, color: r.color, fontFamily: 'Inter, sans-serif' }}>
                  {r.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Why Choose Us ─────────────────────────────────────────────────────────────
function WhyChooseUs() {
  const [activeTab, setActiveTab] = useState<WhyTab>('why')

  const tabs: [WhyTab, string, string][] = [
    ['why', '🏆', 'কেন আমাদের বেছে নেবেন?'],
    ['faq', '❓', 'সাধারণ প্রশ্ন'],
    ['contact', '📞', 'যোগাযোগ করুন'],
    ['brochure', '📥', 'ব্রোশার ডাউনলোড'],
  ]

  const features = [
    { icon: '🏦', title: 'বিশ্বস্ত প্রতিষ্ঠান', desc: '৫০,০০০+ সক্রিয় মার্চেন্ট পার্টনার আমাদের উপর আস্থা রাখেন।' },
    { icon: '⚡', title: 'দ্রুত অনুমোদন', desc: '২৪ ঘণ্টার মধ্যে প্রাথমিক অনুমোদন এবং ৪৮ ঘণ্টায় সম্পূর্ণ প্রক্রিয়া।' },
    { icon: '🔒', title: '১০০% নিরাপদ', desc: 'আপনার তথ্য এনক্রিপ্টেড এবং সম্পূর্ণ গোপনীয়তার সাথে সংরক্ষিত।' },
    { icon: '💎', title: 'কোনো লুকানো চার্জ নেই', desc: 'সম্পূর্ণ স্বচ্ছ ফি স্ট্রাকচার। শুরু থেকে শেষ পর্যন্ত কোনো বিস্ময় নেই।' },
  ]

  const faqs = [
    { q: 'প্রথমবার কত টাকা লোন পাওয়া যাবে?', a: 'প্রথম আবেদনে সর্বোচ্চ ৳৫০,০০০ এবং সফল ১২ মাসের EMI পরিশোধের পর সর্বোচ্চ ৳১,০০,০০০।' },
    { q: 'সার্ভিস লোন ও ক্যাশ লোনের পার্থক্য কী?', a: 'সার্ভিস লোনে সরাসরি সেবা প্রদান করা হয় (ওয়েবসাইট, মার্কেটিং ইত্যাদি) এবং ক্যাশ লোনে সরাসরি নগদ টাকা দেওয়া হয়।' },
    { q: 'EMI পরিশোধ না করলে কী হবে?', a: 'EMI বিলম্বে পরিশোধের ক্ষেত্রে নির্ধারিত বিলম্ব ফি প্রযোজ্য হবে। সমস্যায় পড়লে আগে থেকে আমাদের সাথে যোগাযোগ করুন।' },
    { q: 'ক্যাশ লোনের জন্য কতদিন অপেক্ষা করতে হবে?', a: '১২ মাসের সফল EMI পরিশোধের পর স্বয়ংক্রিয়ভাবে ক্যাশ লোনের যোগ্যতা অর্জন হয়।' },
  ]

  return (
    <section id="why-us" style={{
      padding: '80px 24px',
      background: 'linear-gradient(180deg, #F8FAFC 0%, #fff 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Red wave top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
        <svg viewBox="0 0 1440 80" style={{ width: '100%', display: 'block' }} preserveAspectRatio="none">
          <path d="M0,80 C480,0 960,80 1440,0 L1440,0 L0,0 Z" fill="#C0392B" opacity="0.05" />
        </svg>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
        {/* Tab bar (IDLC style) */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          borderRadius: '0', overflow: 'hidden', marginBottom: '40px',
          border: '1px solid #E2E8F0',
        }}>
          {tabs.map(([tab, icon, label]) => (
            <button key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '16px 12px', fontSize: '14px', fontWeight: 600,
                border: 'none', borderRight: '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer', transition: 'all 0.2s',
                fontFamily: 'Hind Siliguri, sans-serif',
                background: activeTab === tab ? '#C0392B' : '#1A1A2E',
                color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.7)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
              }}
              onMouseEnter={e => { if (activeTab !== tab) e.currentTarget.style.background = '#2D2D3A' }}
              onMouseLeave={e => { if (activeTab !== tab) e.currentTarget.style.background = '#1A1A2E' }}
            >
              <span style={{ fontSize: '18px' }}>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'why' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {features.map((f, i) => (
              <div key={i} style={{
                background: 'linear-gradient(135deg, #C0392B, #E74C3C)',
                borderRadius: '14px', padding: '24px 20px', color: '#fff',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(192,57,43,0.35)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ fontSize: '32px', marginBottom: '14px' }}>{f.icon}</div>
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '10px', marginBottom: '10px' }} />
                <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 8px', fontFamily: 'Hind Siliguri, sans-serif' }}>
                  {f.title}
                </h4>
                <p style={{ fontSize: '13px', opacity: 0.85, margin: 0, lineHeight: 1.5, fontFamily: 'Hind Siliguri, sans-serif' }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'faq' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        )}

        {activeTab === 'contact' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ background: '#F8FAFC', borderRadius: '14px', padding: '28px', border: '1px solid #F1E8E8' }}>
              <h4 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 700, color: '#1A1A2E', fontFamily: 'Hind Siliguri, sans-serif' }}>
                সরাসরি যোগাযোগ
              </h4>
              {[
                { icon: '📞', label: '16XXX' },
                { icon: '📧', label: 'loan@merchantfin.com' },
                { icon: '💬', label: 'ফেসবুক মেসেঞ্জার' },
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ fontSize: '20px' }}>{c.icon}</span>
                  <span style={{ fontSize: '15px', fontWeight: 500, color: '#C0392B' }}>{c.label}</span>
                </div>
              ))}
            </div>
            <div style={{ background: 'linear-gradient(135deg, #8B0000, #C0392B)', borderRadius: '14px', padding: '28px', color: '#fff' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 700, fontFamily: 'Hind Siliguri, sans-serif' }}>আমাদের অফিস</h4>
              <p style={{ margin: '0 0 16px', opacity: 0.85, lineHeight: 1.6, fontFamily: 'Hind Siliguri, sans-serif' }}>
                MerchantFin টাওয়ার<br/>
                গুলশান-২, ঢাকা-১২১২<br/>
                বাংলাদেশ
              </p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <span style={{ padding: '6px 14px', borderRadius: '20px', background: 'rgba(255,255,255,0.2)', fontSize: '12px', fontWeight: 600 }}>
                  সকাল ৯টা — রাত ৯টা
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'brochure' && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#1A1A2E', margin: '0 0 8px', fontFamily: 'Hind Siliguri, sans-serif' }}>
              আমাদের ব্রোশার ডাউনলোড করুন
            </h3>
            <p style={{ color: '#64748B', marginBottom: '24px', fontFamily: 'Hind Siliguri, sans-serif' }}>
              বিস্তারিত তথ্যসহ আমাদের লোন প্রোডাক্ট গাইড ডাউনলোড করুন।
            </p>
            <button style={{
              padding: '14px 32px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #C0392B, #E74C3C)',
              color: '#fff', fontSize: '15px', fontWeight: 700,
              border: 'none', cursor: 'pointer',
              fontFamily: 'Hind Siliguri, sans-serif',
              boxShadow: '0 4px 16px rgba(192,57,43,0.35)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}
            >
              📥 ব্রোশার ডাউনলোড করুন (PDF)
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #F1E8E8', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A2E', fontFamily: 'Hind Siliguri, sans-serif' }}>{q}</span>
        <span style={{ fontSize: '18px', color: '#C0392B', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}>▾</span>
      </button>
      {open && (
        <div style={{ padding: '0 20px 16px', fontSize: '14px', color: '#64748B', lineHeight: 1.6, fontFamily: 'Hind Siliguri, sans-serif' }}>
          {a}
        </div>
      )}
    </div>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer id="footer" style={{ background: '#f5f5f5', color: '#333', position: 'relative', overflow: 'hidden' }}>

      {/* Links section */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.4fr', gap: '32px', marginBottom: '32px' }}>

          {/* Our Products */}
          <div>
            <h5 style={{ fontSize: '15px', fontWeight: 700, color: '#1A1A2E', marginBottom: '16px', borderBottom: '2px solid #C0392B', paddingBottom: '8px', display: 'inline-block' }}>
              Our Products
            </h5>
            {['Home Loan', 'SME Loan', 'Corporate Loan', 'Deposit'].map(l => (
              <a key={l} href="#" style={{
                display: 'block', color: '#555', fontSize: '13px',
                textDecoration: 'none', padding: '5px 0',
                transition: 'color 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = '#C0392B' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#555' }}
              >
                {l}
              </a>
            ))}
            <div style={{ marginTop: '20px' }}>
              <h6 style={{ fontSize: '14px', fontWeight: 700, color: '#1A1A2E', marginBottom: '12px' }}>Connect With Us</h6>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { bg: '#1877F2', icon: 'f', label: 'Facebook' },
                  { bg: '#0A66C2', icon: 'in', label: 'LinkedIn' },
                  { bg: '#FF0000', icon: '▶', label: 'YouTube' },
                  { bg: '#25D366', icon: '✆', label: 'WhatsApp' },
                ].map(s => (
                  <a key={s.label} href="#" title={s.label} style={{
                    width: '34px', height: '34px', borderRadius: '50%',
                    background: s.bg, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: '#fff', fontSize: '11px',
                    fontWeight: 800, textDecoration: 'none', flexShrink: 0,
                    transition: 'transform 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.15)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* About Us */}
          <div>
            <h5 style={{ fontSize: '15px', fontWeight: 700, color: '#1A1A2E', marginBottom: '16px', borderBottom: '2px solid #C0392B', paddingBottom: '8px', display: 'inline-block' }}>
              About Us
            </h5>
            {['IDLC at a Glance', 'Our Management', 'Financial Reports', 'Promotions & Campaigns'].map(l => (
              <a key={l} href="#" style={{
                display: 'block', color: '#555', fontSize: '13px',
                textDecoration: 'none', padding: '5px 0', transition: 'color 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = '#C0392B' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#555' }}
              >
                {l}
              </a>
            ))}
          </div>

          {/* Quick Links */}
          <div>
            <h5 style={{ fontSize: '15px', fontWeight: 700, color: '#1A1A2E', marginBottom: '16px', borderBottom: '2px solid #C0392B', paddingBottom: '8px', display: 'inline-block' }}>
              Quick Links
            </h5>
            {['Download Forms', 'E-Tender', 'FAQ', 'Feedback', 'Complaint Cell', 'Apply for Loan', 'Customer Login', "Citizen's Charter"].map(l => (
              <a key={l} href="#" style={{
                display: 'block', color: '#555', fontSize: '13px',
                textDecoration: 'none', padding: '4px 0', transition: 'color 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = '#C0392B' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#555' }}
              >
                {l}
              </a>
            ))}
          </div>

          {/* Location Map */}
          <div>
            <h5 style={{ fontSize: '15px', fontWeight: 700, color: '#1A1A2E', marginBottom: '16px', borderBottom: '2px solid #C0392B', paddingBottom: '8px', display: 'inline-block' }}>
              Location Map
            </h5>
            {/* Map placeholder */}
            <div style={{
              width: '100%', height: '130px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)',
              border: '1px solid #ddd', position: 'relative',
              overflow: 'hidden', marginBottom: '12px',
            }}>
              {/* Stylized map roads */}
              <svg width="100%" height="100%" viewBox="0 0 220 130" style={{ position: 'absolute', inset: 0 }}>
                <rect width="220" height="130" fill="#e8f5e9"/>
                <line x1="0" y1="65" x2="220" y2="65" stroke="#bdbdbd" strokeWidth="6"/>
                <line x1="110" y1="0" x2="110" y2="130" stroke="#bdbdbd" strokeWidth="6"/>
                <line x1="0" y1="65" x2="220" y2="65" stroke="#fff" strokeWidth="2" strokeDasharray="8,6"/>
                <rect x="75" y="40" width="50" height="40" rx="4" fill="#ffcdd2" stroke="#e57373" strokeWidth="1"/>
                <text x="100" y="65" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#C0392B">MerchantFin</text>
                <circle cx="100" cy="55" r="6" fill="#C0392B"/>
                <polygon points="100,44 94,57 106,57" fill="#C0392B"/>
              </svg>
            </div>
            <div style={{ fontSize: '12px', color: '#555', lineHeight: 1.5 }}>
              <strong style={{ color: '#1A1A2E' }}>MerchantFin Corporate Head Office</strong><br/>
              Bay's Galleria (1st Floor),<br/>
              57 Gulshan Avenue, Dhaka 1212
            </div>
          </div>
        </div>

        {/* Bottom text bar */}
        <div style={{ borderTop: '1px solid #ddd', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <p style={{ color: '#888', fontSize: '12px', margin: 0, fontFamily: 'Hind Siliguri, sans-serif' }}>
            © ২০২৬ MerchantFin Finance Ltd. সকল স্বত্ব সংরক্ষিত।
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {['Interest Rate', 'Fees & Charges', 'EMI Schedule', 'Privacy Policy', 'Sitemap'].map(l => (
              <a key={l} href="#" style={{ color: '#888', fontSize: '11px', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#C0392B' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#888' }}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Animated Cityscape ─── */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(180deg, #f5f5f5 0%, #e8e8e8 100%)',
        height: '180px',
      }}>
        <style>{`
          @keyframes carMove {
            from { transform: translateX(-180px); }
            to   { transform: translateX(calc(100vw + 20px)); }
          }
          @keyframes cycleMove {
            from { transform: translateX(-120px); }
            to   { transform: translateX(calc(100vw + 20px)); }
          }
          @keyframes planeMove {
            from { transform: translateX(calc(100vw + 60px)) scaleX(-1); }
            to   { transform: translateX(-120px) scaleX(-1); }
          }
          @keyframes wheelSpin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
          @keyframes pedalSpin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
          .car-anim { animation: carMove 12s linear infinite; }
          .cycle-anim { animation: cycleMove 18s linear infinite 3s; }
          .plane-anim { animation: planeMove 20s linear infinite 6s; }
        `}</style>

        {/* Sky & ground */}
        <svg width="100%" height="180" viewBox="0 0 1440 180" preserveAspectRatio="xMidYMax slice" style={{ position: 'absolute', bottom: 0, left: 0 }}>
          {/* Sky */}
          <rect width="1440" height="180" fill="#f0f0f0"/>
          {/* Mountains far right */}
          <polygon points="1200,110 1280,60 1360,110" fill="#d9a5a5" opacity="0.5"/>
          <polygon points="1300,110 1380,50 1440,110" fill="#c9898989" opacity="0.5"/>
          {/* Ground */}
          <rect y="130" width="1440" height="50" fill="#e0e0e0"/>
          {/* Road */}
          <rect y="138" width="1440" height="22" fill="#9E9E9E"/>
          <line x1="0" y1="149" x2="1440" y2="149" stroke="#fff" strokeWidth="2" strokeDasharray="30,20" opacity="0.6"/>
          {/* Sidewalk */}
          <rect y="130" width="1440" height="8" fill="#BDBDBD"/>

          {/* === Buildings === */}
          {/* House left */}
          <rect x="30" y="80" width="60" height="52" fill="#E57373" rx="2"/>
          <polygon points="20,82 90,82 55,52" fill="#C0392B"/>
          <rect x="50" y="100" width="12" height="16" fill="#FFCDD2"/>
          <rect x="68" y="96" width="10" height="10" fill="#FFCDD2"/>

          {/* Shop 2 */}
          <rect x="120" y="88" width="70" height="44" fill="#EF9A9A" rx="2"/>
          <rect x="120" y="88" width="70" height="14" fill="#C0392B"/>
          <text x="155" y="99" fontSize="8" textAnchor="middle" fill="white" fontWeight="bold">Express Shop</text>
          <rect x="132" y="104" width="16" height="18" fill="#FFCDD2"/>
          <rect x="154" y="104" width="16" height="18" fill="#FFCDD2"/>

          {/* Main building (IDLC-style) */}
          <rect x="240" y="50" width="90" height="82" fill="#E57373" rx="2"/>
          <rect x="240" y="50" width="90" height="18" fill="#C0392B"/>
          <text x="285" y="63" fontSize="9" textAnchor="middle" fill="white" fontWeight="bold">MerchantFin</text>
          {[0,1,2,3,4].map(row => [0,1,2].map(col => (
            <rect key={`w-${row}-${col}`} x={250 + col * 24} y={74 + row * 11} width="14" height="8" fill="#FFCDD2" opacity="0.8" rx="1"/>
          )))}
          <rect x="271" y="110" width="18" height="22" fill="#B71C1C" rx="1"/>

          {/* Bus stop */}
          <rect x="370" y="100" width="60" height="32" fill="#BDBDBD" rx="2"/>
          <rect x="368" y="98" width="64" height="5" fill="#9E9E9E"/>
          <rect x="370" y="130" width="3" height="8" fill="#757575"/>
          <rect x="427" y="130" width="3" height="8" fill="#757575"/>

          {/* Trees */}
          {[460, 510, 560, 680, 730, 780].map(x => (
            <g key={x}>
              <rect x={x + 4} y="118" width="4" height="14" fill="#795548"/>
              <circle cx={x + 6} cy="112" r="10" fill="#66BB6A" opacity="0.85"/>
            </g>
          ))}

          {/* Packaging industry */}
          <rect x="600" y="75" width="65" height="57" fill="#EF9A9A" rx="2"/>
          <rect x="600" y="75" width="65" height="14" fill="#C0392B"/>
          <text x="632" y="86" fontSize="7" textAnchor="middle" fill="white" fontWeight="bold">Packaging</text>
          <rect x="610" y="92" width="14" height="14" fill="#FFCDD2" opacity="0.8"/>
          <rect x="630" y="92" width="14" height="14" fill="#FFCDD2" opacity="0.8"/>
          <rect x="617" y="110" width="18" height="22" fill="#D32F2F" rx="1"/>

          {/* Lamp posts */}
          {[200, 420, 580, 800].map(x => (
            <g key={`lamp-${x}`}>
              <rect x={x} y="95" width="3" height="37" fill="#757575"/>
              <rect x={x - 14} y="94" width="17" height="3" fill="#757575"/>
              <ellipse cx={x - 11} cy="97" rx="6" ry="3" fill="#FFF9C4" opacity="0.8"/>
            </g>
          ))}

          {/* Bench */}
          <rect x="840" y="122" width="28" height="3" fill="#8D6E63"/>
          <rect x="843" y="125" width="3" height="7" fill="#8D6E63"/>
          <rect x="862" y="125" width="3" height="7" fill="#8D6E63"/>
        </svg>

        {/* ─── Animated Car ─── */}
        <div className="car-anim" style={{ position: 'absolute', bottom: '16px', left: 0 }}>
          <svg width="110" height="52" viewBox="0 0 110 52">
            {/* Body */}
            <path d="M8,36 L8,24 C8,24 20,10 40,10 L72,10 C88,10 102,24 102,24 L102,36 Z" fill="#C0392B"/>
            {/* Roof */}
            <path d="M22,24 C22,24 30,12 42,12 L68,12 C80,12 88,24 88,24 Z" fill="#E57373"/>
            {/* Windows */}
            <path d="M26,23 C26,23 32,14 42,14 L52,14 L52,23 Z" fill="#B3E5FC" opacity="0.8"/>
            <path d="M56,23 L56,14 L66,14 C76,14 84,23 84,23 Z" fill="#B3E5FC" opacity="0.8"/>
            {/* Bumpers */}
            <rect x="4" y="32" width="8" height="4" rx="2" fill="#B71C1C"/>
            <rect x="98" y="32" width="8" height="4" rx="2" fill="#B71C1C"/>
            {/* Door line */}
            <line x1="54" y1="13" x2="54" y2="36" stroke="#B71C1C" strokeWidth="1.5"/>
            {/* Front wheel */}
            <circle cx="82" cy="40" r="10" fill="#333"/>
            <circle cx="82" cy="40" r="6" fill="#555"/>
            <circle cx="82" cy="40" r="2" fill="#888"/>
            {/* Rear wheel */}
            <circle cx="28" cy="40" r="10" fill="#333"/>
            <circle cx="28" cy="40" r="6" fill="#555"/>
            <circle cx="28" cy="40" r="2" fill="#888"/>
            {/* Headlight */}
            <circle cx="102" cy="28" r="3" fill="#FFF9C4"/>
          </svg>
        </div>

        {/* ─── Animated Bicycle ─── */}
        <div className="cycle-anim" style={{ position: 'absolute', bottom: '14px', left: 0 }}>
          <svg width="72" height="56" viewBox="0 0 72 56">
            {/* Rear wheel */}
            <circle cx="16" cy="40" r="13" fill="none" stroke="#555" strokeWidth="2.5"/>
            <circle cx="16" cy="40" r="3" fill="#555"/>
            {[0,60,120,180,240,300].map(a => (
              <line key={a}
                x1={16 + 3 * Math.cos(a * Math.PI / 180)}
                y1={40 + 3 * Math.sin(a * Math.PI / 180)}
                x2={16 + 12 * Math.cos(a * Math.PI / 180)}
                y2={40 + 12 * Math.sin(a * Math.PI / 180)}
                stroke="#777" strokeWidth="1.5"/>
            ))}
            {/* Front wheel */}
            <circle cx="56" cy="40" r="13" fill="none" stroke="#555" strokeWidth="2.5"/>
            <circle cx="56" cy="40" r="3" fill="#555"/>
            {[0,60,120,180,240,300].map(a => (
              <line key={a}
                x1={56 + 3 * Math.cos(a * Math.PI / 180)}
                y1={40 + 3 * Math.sin(a * Math.PI / 180)}
                x2={56 + 12 * Math.cos(a * Math.PI / 180)}
                y2={40 + 12 * Math.sin(a * Math.PI / 180)}
                stroke="#777" strokeWidth="1.5"/>
            ))}
            {/* Frame */}
            <line x1="16" y1="40" x2="36" y2="20" stroke="#C0392B" strokeWidth="2.5"/>
            <line x1="36" y1="20" x2="56" y2="40" stroke="#C0392B" strokeWidth="2.5"/>
            <line x1="36" y1="20" x2="28" y2="40" stroke="#C0392B" strokeWidth="2.5"/>
            {/* Seat post */}
            <line x1="28" y1="40" x2="30" y2="22" stroke="#555" strokeWidth="2"/>
            <rect x="26" y="20" width="10" height="3" rx="1.5" fill="#333"/>
            {/* Handlebar */}
            <line x1="56" y1="40" x2="54" y2="24" stroke="#555" strokeWidth="2"/>
            <line x1="50" y1="22" x2="58" y2="22" stroke="#333" strokeWidth="2.5"/>
            {/* Pedal crank */}
            <circle cx="28" cy="40" r="3.5" fill="#888"/>
            <line x1="28" y1="40" x2="22" y2="44" stroke="#666" strokeWidth="2"/>
            <line x1="22" y1="44" x2="20" y2="44" stroke="#333" strokeWidth="3"/>
            {/* Rider */}
            <circle cx="34" cy="12" r="6" fill="#F9A825"/>
            <path d="M30,18 C30,18 28,24 30,28 C33,30 38,28 38,28 L36,18 Z" fill="#1565C0"/>
            <line x1="34" y1="24" x2="30" y2="30" stroke="#1565C0" strokeWidth="2"/>
            <line x1="34" y1="24" x2="38" y2="30" stroke="#1565C0" strokeWidth="2"/>
            <line x1="30" y1="30" x2="26" y2="38" stroke="#F9A825" strokeWidth="2"/>
            <line x1="38" y1="30" x2="42" y2="36" stroke="#F9A825" strokeWidth="2"/>
          </svg>
        </div>

        {/* ─── Animated Plane ─── */}
        <div className="plane-anim" style={{ position: 'absolute', top: '12px', left: 0 }}>
          <svg width="60" height="24" viewBox="0 0 60 24">
            <path d="M50,12 L30,6 L8,10 L8,14 L30,18 Z" fill="#9E9E9E" opacity="0.7"/>
            <path d="M50,12 L56,8 L58,12 L56,16 Z" fill="#BDBDBD" opacity="0.7"/>
            <path d="M20,10 L24,2 L28,10 Z" fill="#BDBDBD" opacity="0.7"/>
            <path d="M14,14 L16,18 L20,14 Z" fill="#BDBDBD" opacity="0.7"/>
            <circle cx="44" cy="12" r="2" fill="#FFF9C4" opacity="0.9"/>
          </svg>
        </div>
      </div>

      {/* Floating side buttons */}
      <div style={{ position: 'fixed', right: '16px', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 999 }}>
        {[
          { icon: '💬', label: 'Chat', bg: '#C0392B' },
          { icon: '✏️', label: 'Apply', bg: '#555' },
          { icon: '📞', label: 'Call', bg: '#555' },
        ].map((b, i) => (
          <button key={i} title={b.label} style={{
            width: '42px', height: '42px', borderRadius: '6px',
            background: b.bg, border: 'none', cursor: 'pointer', fontSize: '16px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#C0392B'; e.currentTarget.style.transform = 'scale(1.1)' }}
            onMouseLeave={e => { e.currentTarget.style.background = b.bg; e.currentTarget.style.transform = 'none' }}
          >
            {b.icon}
          </button>
        ))}
      </div>
    </footer>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const applyRef = useRef<HTMLElement>(null)

  const scrollToApply = () => {
    document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToHow = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
      <Navbar onApply={scrollToApply} />
      <Hero onApply={scrollToApply} onLearnMore={scrollToHow} />
      <LoanForm />
      <HowItWorks />
      <Services />
      <EMICalculator />
      <WhyChooseUs />
      <Footer />

      <style>{`
        @media (max-width: 768px) {
          section > div > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          section > div > div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
          }
          section > div > div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: 1fr 1fr !important;
          }
          section > div > div[style*="grid-template-columns: 1fr auto 1fr"] {
            grid-template-columns: 1fr !important;
          }
          section > div > div[style*="grid-template-columns: 2fr 1fr 1fr 1fr"] {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          section > div > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          section > div > div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: 1fr !important;
          }
          section > div > div[style*="grid-template-columns: 2fr 1fr 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
