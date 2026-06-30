import { useEffect, useState } from 'react'
import { site } from './data/site'
import { Grain } from './components/Grain'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
import { Work } from './components/Work'
import { BookingForm } from './components/BookingForm'
import { InstagramFeed } from './components/InstagramFeed'
import { Footer } from './components/Footer'
import { Intro } from './components/intro/Intro'

export default function App() {
  const [showIntro, setShowIntro] = useState(true)

  // Keep the page behind the intro from scrolling while the overlay is up.
  useEffect(() => {
    document.body.classList.toggle('intro-lock', showIntro)
    return () => document.body.classList.remove('intro-lock')
  }, [showIntro])

  return (
    <>
      <Grain show={site.showGrain} />

      <Navbar />

      <main id="top" style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <Marquee />
        <Work />
        <BookingForm />
        <InstagramFeed />
        <Footer />
      </main>

      {showIntro && (
        <Intro onDone={() => setShowIntro(false)} tagline={site.tagline} />
      )}
    </>
  )
}
