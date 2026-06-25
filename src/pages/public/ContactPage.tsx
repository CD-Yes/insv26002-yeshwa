import { useState, useRef, useEffect } from 'react';
import { motion, useAnimationFrame, useSpring, useMotionValue } from 'framer-motion';
import { COLORS, REQUIREMENT_TYPES, BUDGET_RANGES } from '@/data/siteConfig';
import { useSeo } from '@/lib/seo';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { GoogleMapEmbed } from '@/components/public/GoogleMapEmbed';
import { submitEnquiry } from '@/lib/enquiry';

const FIELD: React.CSSProperties = {
  width: '100%',
  fontSize: 14,
  padding: '12px 16px',
  borderRadius: 8,
  border: '1px solid rgba(45,70,84,0.12)',
  background: '#FBF7EF',
  color: COLORS.slate,
  outline: 'none',
};

const LABEL: React.CSSProperties = { 
  display: 'block', 
  fontSize: 12, 
  fontWeight: 600, 
  color: COLORS.slate, 
  marginBottom: 6 
};

const galleryItems = [
  'kitchen - london',
  'island kitchen',
  'wardrobe - dubai',
  'bedroom storage',
  'study nook'
];

const PlaceholderCard = ({ title }: { title: string }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="relative w-full h-[280px] rounded-[24px] overflow-hidden mb-6 shrink-0 shadow-sm"
    >
      {/* Striped background */}
      <div 
        className="absolute inset-0 bg-[#EFEBE4]"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.035) 10px, rgba(0,0,0,0.035) 12px)'
        }}
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#706B62]/80 via-[#706B62]/20 to-transparent mix-blend-multiply" />
      {/* Title */}
      <div className="absolute bottom-6 left-6 font-mono text-[13px] font-semibold text-white/95 tracking-wider">
        [ {title} ]
      </div>
    </motion.div>
  );
};

function InfiniteGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const y = useMotionValue(0);
  
  // We duplicate the items to create a seamless loop
  const duplicatedItems = [...galleryItems, ...galleryItems];
  
  const targetVelocity = isHovered ? -0.2 : -1.5;
  const velocity = useSpring(targetVelocity, { stiffness: 50, damping: 20 });

  useEffect(() => {
    velocity.set(targetVelocity);
  }, [targetVelocity, velocity]);

  useAnimationFrame((t, delta) => {
    if (!containerRef.current) return;
    
    // Safety check for maximum delta to prevent large jumps if tab is inactive
    const safeDelta = Math.min(delta, 32); 
    const moveBy = velocity.get() * (safeDelta / 16);
    let currentY = y.get() + moveBy;

    const containerHeight = containerRef.current.scrollHeight;
    const halfHeight = containerHeight / 2;

    if (currentY <= -halfHeight) {
       currentY += halfHeight;
    } else if (currentY > 0) {
       currentY -= halfHeight;
    }

    y.set(currentY);
  });

  return (
    <div 
       className="overflow-hidden h-[800px] relative w-full rounded-3xl"
       style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 2%, black 98%, transparent)' }}
       onMouseEnter={() => setIsHovered(true)}
       onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div 
         ref={containerRef}
         style={{ y }}
         className="flex flex-col w-full"
      >
        {duplicatedItems.map((item, idx) => (
          <PlaceholderCard key={idx} title={item} />
        ))}
      </motion.div>
    </div>
  );
}

export function ContactPage() {
  useSeo({
    title: 'Contact & Quote',
    description: "Tell us about your project and we'll book a free consultation within one business day.",
    canonicalPath: '/contact',
  });

  const { settings } = useSiteSettings();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', phone: '', email: '', location: '',
    requirement_type: REQUIREMENT_TYPES[0] as string,
    budget_range: BUDGET_RANGES[0] as string,
    message: '',
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await submitEnquiry({ ...form, source: 'contact-page' });
    setSubmitting(false);
    if (res.ok) setSubmitted(true);
    else setError(res.error ?? 'Something went wrong. Please try again.');
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] pt-[40px] pb-24">
      <section className="max-w-[1400px] mx-auto px-6 lg:px-12">
        
        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[30fr_42fr_28fr] xl:grid-cols-[28fr_42fr_30fr] gap-10 xl:gap-14 items-start">
          
          {/* LEFT: FORM */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white border border-[#2D4654]/10 rounded-3xl p-8 lg:p-10 shadow-[0_24px_60px_-30px_rgba(34,53,63,0.15)] order-2 lg:order-1"
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-12 min-h-[500px]">
                <span className="flex items-center justify-center w-16 h-16 rounded-full bg-[#FBF7EF] text-[#D35A38] text-3xl font-serif mb-6">✓</span>
                <h2 className="font-serif text-[28px] text-[#22353F] mb-3">Thank you — we've got it.</h2>
                <p className="text-[#64748B] leading-relaxed max-w-[280px]">
                  Our design team will reach out within one business day to schedule your free consultation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-8">
                  <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#D35A38] mb-2">Request</p>
                  <h2 className="font-serif text-[34px] leading-[1.1] text-[#22353F]">Request your<br/>free quote</h2>
                </div>
                
                <p className="text-[14px] leading-relaxed text-[#64748B] mb-8">
                  Tell us about your project and our team will get back to you within one business day.
                </p>

                <motion.div 
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
                  }}
                  className="flex flex-col gap-5"
                >
                  <motion.label variants={fadeUp} className="block">
                    <span style={LABEL}>Full name</span>
                    <input required type="text" placeholder="Your name" value={form.name} onChange={set('name')} style={FIELD} />
                  </motion.label>
                  
                  <motion.label variants={fadeUp} className="block">
                    <span style={LABEL}>Email</span>
                    <input required type="email" placeholder="you@email.com" value={form.email} onChange={set('email')} style={FIELD} />
                  </motion.label>

                  <motion.label variants={fadeUp} className="block">
                    <span style={LABEL}>Phone</span>
                    <input required type="tel" placeholder="Include country code" value={form.phone} onChange={set('phone')} style={FIELD} />
                  </motion.label>

                  <motion.label variants={fadeUp} className="block">
                    <span style={LABEL}>Project type</span>
                    <select value={form.requirement_type} onChange={set('requirement_type')} style={FIELD}>
                      {REQUIREMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </motion.label>

                  <motion.label variants={fadeUp} className="block">
                    <span style={LABEL}>Approx. budget</span>
                    <select value={form.budget_range} onChange={set('budget_range')} style={FIELD}>
                      {BUDGET_RANGES.map((b) => <option key={b}>{b}</option>)}
                    </select>
                  </motion.label>

                  <motion.label variants={fadeUp} className="block mb-2">
                    <span style={LABEL}>Tell us about your space</span>
                    <textarea rows={3} placeholder="Apartment / house, city, what you're looking for…" value={form.message} onChange={set('message')} style={{ ...FIELD, resize: 'vertical' }} />
                  </motion.label>

                  {error && <p className="text-[#C0392B] text-sm mb-2">{error}</p>}

                  <motion.button 
                    variants={fadeUp}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    disabled={submitting} 
                    className="w-full border-none bg-[#D35A38] hover:bg-[#c25030] text-[#FBF7EF] text-[15px] font-semibold py-4 rounded-xl transition-colors disabled:opacity-80 disabled:cursor-wait mt-2 shadow-[0_4px_14px_0_rgba(211,90,56,0.39)]"
                  >
                    {submitting ? 'Sending…' : 'Send request'}
                  </motion.button>
                </motion.div>
              </form>
            )}
          </motion.div>

          {/* CENTER: GALLERY */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2 h-full flex items-start justify-center"
          >
            <InfiniteGallery />
          </motion.div>

          {/* RIGHT: INFO + MAP */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            className="order-3 flex flex-col gap-10 lg:pt-8"
          >
            <div>
              <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#D35A38] mb-4">Get in touch</p>
              <h1 className="font-serif font-light text-[40px] leading-[1.05] tracking-[-0.01em] mb-6 text-[#22353F]">
                Let's design your<br />space together.
              </h1>
              <p className="text-[15px] leading-[1.6] text-[#64748B] mb-10 max-w-[320px]">
                Visit our studio or reach out to us. We're here to help bring your vision to life.
              </p>

              <div className="flex flex-col gap-7">
                <ContactRow 
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  } 
                  label="Call us" 
                  value={<a href={`tel:${settings.phoneRaw}`} className="no-underline text-[15px] font-semibold text-[#22353F] hover:text-[#D35A38] transition-colors">{settings.phone}</a>} 
                />
                <ContactRow 
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  } 
                  label="Email" 
                  value={<a href={`mailto:${settings.email}`} className="no-underline text-[15px] font-semibold text-[#22353F] hover:text-[#D35A38] transition-colors">{settings.email}</a>} 
                />
                <ContactRow 
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  } 
                  label="Studios" 
                  value={<span className="text-[14px] font-semibold text-[#22353F] leading-[1.6]">{settings.studios.slice(0, 3).join(' · ')}<br />{settings.studios.slice(3).join(' · ')}</span>} 
                />
              </div>
            </div>

            <div className="rounded-[20px] overflow-hidden shadow-sm border border-[#2D4654]/10 bg-white p-2" data-hide-cursor>
              <div className="rounded-xl overflow-hidden">
                <GoogleMapEmbed height={260} />
              </div>
            </div>
            
          </motion.div>

        </div>
      </section>
    </div>
  );
}

function ContactRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-4 items-start">
      <span className="flex-none flex items-center justify-center w-12 h-12 rounded-[14px] bg-[#FDF0EB] text-[#D35A38]">
        {icon}
      </span>
      <div className="pt-1">
        <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#A57A68] mb-1">{label}</div>
        {value}
      </div>
    </div>
  );
}
