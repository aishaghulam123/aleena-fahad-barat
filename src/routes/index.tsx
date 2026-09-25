import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Instagram, Volume2, VolumeX } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { ScratchReveal } from "@/components/ScratchReveal";

export const INSTAGRAM_URL = "https://www.instagram.com/digital_invites_bymili/";
export const WHATSAPP_LINK = "https://api.whatsapp.com/message/N24AWOP5IQURG1?autoload=1&app_absent=0";export const VENUE = "Montage event complex Islamabad";
export const EVENT_TIME = "Barat departyre from Faisalabad at 4:00 PM, Arrival at Islamabad at 8:00 PM";
export const VIDEO_URL = "";
export const GALLERY_IMAGES = [
  "/images/barat-ballroom.jpg",
  "/images/barat-embroidery.jpg",
  "/images/barat-table.jpg",
  "/images/barat-details.jpg",
];

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Aleena & Fahad — Barat Invitation" },
    { name: "description", content: "A luxury Barat celebration for Aleena and Fahad in Islamabad on 27 November 2026." },
    { property: "og:title", content: "Aleena & Fahad — Barat Invitation" },
    { property: "og:description", content: "We would be honoured by your presence at the Barat celebration." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Invitation,
});

function Ornament() {
  return <div className="ornament" aria-hidden="true"><span /><b>◆</b><span /></div>;
}

function Curtain({ side }: { side: "left" | "right" }) {
  return (
    <div className={`curtain curtain-${side}`}>
      <div className="curtain-fabric"><i /><i /><i /><i /><i /><i /></div>
      <div className="curtain-edge" />
    </div>
  );
}

function Invitation() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [opened, setOpened] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scope = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(".opening", { display: "none" });
        gsap.set(".invitation", { opacity: 1 });
      }
      gsap.utils.toArray<HTMLElement>(".reveal-item").forEach((item) => {
        gsap.from(item, { opacity: 0, y: reduceMotion ? 0 : 42, duration: reduceMotion ? 0 : 1.15, ease: "power3.out", scrollTrigger: { trigger: item, start: "top 86%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>(".ornament-line i").forEach((line) => {
        gsap.from(line, { scaleX: 0, transformOrigin: "center", duration: reduceMotion ? 0 : 1.3, ease: "power2.inOut", scrollTrigger: { trigger: line, start: "top 90%", once: true } });
      });
      if (!reduceMotion) {
        gsap.to(".date-number", { yPercent: -9, ease: "none", scrollTrigger: { trigger: ".date-moment", start: "top bottom", end: "bottom top", scrub: 1.2 } });
        gsap.to(".cursor-ring", { rotate: 360, duration: 8, ease: "none", repeat: -1 });
      }
    }, rootRef);
    return () => scope.revert();
  }, []);

  useEffect(() => {
    const cursor = document.querySelector<HTMLElement>(".cursor-ring");
    if (!cursor || window.matchMedia("(pointer: coarse)").matches) return;
    const move = (event: MouseEvent) => gsap.to(cursor, { x: event.clientX, y: event.clientY, duration: 0.45, ease: "power3.out" });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const unveil = () => {
    if (opened) return;
    setOpened(true);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      gsap.set(".opening", { display: "none" });
      return;
    }
    const timeline = gsap.timeline({ defaults: { ease: "power3.inOut" } });
    timeline.to(".wax-seal", { scale: 0.92, duration: 0.18, ease: "power2.out" })
      .to(".seal-wrap", { opacity: 0, scale: 0.82, duration: 0.7, ease: "power2.in" })
      .to(".opening-glow", { opacity: 1, scaleX: 1.8, duration: 1.2 }, "-=.35")
      .to(".curtain-left", { xPercent: -91, skewX: -3, duration: 2.9, ease: "power2.inOut" }, "-=.5")
      .to(".curtain-right", { xPercent: 91, skewX: 3, duration: 2.9, ease: "power2.inOut" }, "<")
      .to(".curtain-fabric", { scaleX: 0.78, duration: 2.5, ease: "sine.inOut" }, "<")
      .to(".opening", { opacity: 0, duration: 0.9, onComplete: () => gsap.set(".opening", { display: "none" }) }, "-=.7")
      .from(".hero .eyebrow, .hero-name, .hero-meta, .hero .ornament", { opacity: 0, y: 28, stagger: 0.16, duration: 1.1, ease: "power3.out" }, "-=1.1");
  };

  const instagramHref = INSTAGRAM_URL.startsWith("http") ? INSTAGRAM_URL : "https://instagram.com/";
const whatsappHref = WHATSAPP_LINK;
  return (
    <div ref={rootRef} className="invitation-site">
      <div className="cursor-ring" aria-hidden="true"><span>◆</span></div>
      <div className="opening" aria-label="Closed wedding invitation">
        <div className="opening-glow" />
        <div className="dust" aria-hidden="true">{Array.from({ length: 20 }, (_, index) => <i key={index} style={{ "--i": index } as React.CSSProperties} />)}</div>
        <Curtain side="left" /><Curtain side="right" />
        <div className="seal-wrap">
          <Button variant="seal" className="wax-seal" onClick={unveil} aria-label="Unveil Aleena and Fahad's celebration">
            <span className="seal-rim"><span className="seal-monogram">A <em>&</em> F</span><small>27 · XI · 26</small></span>
          </Button>
          <p>Tap the seal to unveil the celebration</p>
        </div>
      </div>

      <main className="invitation">
        <section className="hero" style={{ "--hero-image": `url(${GALLERY_IMAGES[0]})` } as React.CSSProperties}>
          <div className="hero-shade" />
          <div className="hero-content">
            <p className="eyebrow">The Barat Celebration</p>
            <Ornament />
            <h1 className="hero-name"><span>Aleena</span><em>&</em><span>Fahad</span></h1>
            <p className="hero-meta">27 <b>•</b> 11 <b>•</b> 2026</p>
            <p className="hero-city">Islamabad</p>
          </div>
          <div className="scroll-cue" aria-hidden="true"><span />Discover</div>
        </section>

        <section className="blessing section-pad">
          <div className="section-inner narrow reveal-item">
            <p className="eyebrow">With the blessings of their families</p>
            <h2 className="script-title">Aleena <i>&</i> Fahad</h2>
            <Ornament />
            <p className="lead-copy">Together with their families, they invite you to celebrate the beginning of a beautiful new chapter.</p>
          </div>
        </section>

        <section className="families section-pad">
          <div className="section-inner family-editorial">
            <div className="family reveal-item"><span>01</span><p className="eyebrow">Bride's Family</p><h3>Mr. &amp; Mrs.<br />Muhammad Arshad</h3></div>
            <div className="family-divider" aria-hidden="true"><i /><b>◆</b><i /></div>
            <div className="family reveal-item"><span>02</span><p className="eyebrow">Groom's Family</p><h3>Mr. &amp; Mrs.<br />Umer</h3></div>
          </div>
        </section>

        <section className="event-section section-pad">
          <div className="section-inner">
            <div className="section-heading reveal-item"><p className="eyebrow">The Celebration</p><h2>Barat</h2><div className="ornament-line" aria-hidden="true"><i /></div></div>
            <ScratchReveal date="27 November 2026" time={EVENT_TIME} venue={VENUE} city="Islamabad" />
          </div>
        </section>

        <section className="film-section reveal-item" style={{ "--film-image": `url(${GALLERY_IMAGES[2]})` } as React.CSSProperties}>
          {VIDEO_URL ? <video src={VIDEO_URL} autoPlay muted loop playsInline aria-label="Wedding celebration film" /> : <div className="film-image" />}
          <div className="film-overlay"><p>A celebration of</p><h2>love, family <i>&</i> forever.</h2></div>
          <Button variant="social" size="icon" className="sound-control" onClick={() => setMuted(!muted)} aria-label={muted ? "Sound is muted" : "Sound is on"}>{muted ? <VolumeX /> : <Volume2 />}</Button>
        </section>

        <section className="gallery-section section-pad">
          <div className="section-inner">
            <div className="section-heading reveal-item"><p className="eyebrow">Fragments of Forever</p><h2>In anticipation</h2></div>
            <div className="editorial-gallery">
              <figure className="gallery-a reveal-item"><img src={GALLERY_IMAGES[1]} alt="Crimson velvet bridal embroidery in antique gold" width={1008} height={1408} loading="lazy" /><figcaption>The colour of celebration</figcaption></figure>
              <figure className="gallery-b reveal-item"><img src={GALLERY_IMAGES[3]} alt="Traditional wedding jewellery and invitation details" width={1104} height={1104} loading="lazy" /><figcaption>Details, treasured</figcaption></figure>
              <figure className="gallery-c reveal-item"><img src={GALLERY_IMAGES[2]} alt="Candlelit luxury Barat table setting" width={1408} height={912} loading="lazy" /><figcaption>An evening in gold</figcaption></figure>
            </div>
          </div>
        </section>

        <section className="date-moment section-pad">
          <div className="date-frame reveal-item">
            <p className="eyebrow">Save the date</p>
            <div className="date-number">27</div>
            <div className="date-bottom"><span>November</span><i>◆</i><span>2026</span></div>
            <p className="date-city">Islamabad</p>
          </div>
        </section>

        <section className="closing section-pad" style={{ "--closing-image": `url(${GALLERY_IMAGES[0]})` } as React.CSSProperties}>
          <div className="closing-shade" />
          <div className="closing-content reveal-item"><p className="eyebrow">We would be honoured by your presence</p><Ornament /><h2>Aleena <i>&</i> Fahad</h2><p>27 November 2026</p></div>
        </section>
      </main>

      <footer>
        <p className="eyebrow">Invite Credits</p>
        <div className="social-links">
          <Button asChild variant="social" size="icon"><a href={instagramHref} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram /></a></Button>
          <Button asChild variant="social" size="icon"><a href={whatsappHref} target="_blank" rel="noreferrer" aria-label="WhatsApp"><span className="whatsapp-mark">W</span></a></Button>
        </div>
        <p className="footer-mark">A <i>&</i> F · 2026</p>
      </footer>
    </div>
  );
}
