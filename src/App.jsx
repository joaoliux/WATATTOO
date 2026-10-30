import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import { MessageCircle, MapPin, Clock, Instagram, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { site, waLink } from "./config.js";

const nav = [
  ["Home", "#home"],
  ["Trabalhos", "#trabalhos"],
  ["Como funciona", "#como-funciona"],
  ["Onde nos encontrar", "#onde"],
];

const ease = [0.22, 1, 0.36, 1];

/* ---------- Efeitos de ambiente ---------- */

// Luz que acompanha o mouse (só em dispositivos com mouse)
function CursorGlow() {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 90, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 90, damping: 22, mass: 0.6 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  return <motion.div className="cursor-glow" aria-hidden="true" style={{ x: sx, y: sy }} />;
}

// Botão com efeito magnético
function Magnetic({ className, children, ...rest }) {
  const ref = useRef(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 16 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 16 });

  const onMove = (e) => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.28);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.4);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      className={className}
      style={{ x, y }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      whileTap={{ scale: 0.96 }}
      {...rest}
    >
      {children}
    </motion.a>
  );
}

function Marquee() {
  const items = Array.from({ length: 8 });
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((g) => (
          <div className="marquee__group" key={g}>
            {items.map((_, i) => (
              <span key={i}>
                {site.name} <i>✦</i>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Seções ---------- */

function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className={`header ${solid ? "header--solid" : ""}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease, delay: 0.1 }}
    >
      <div className="header__inner">
        <a href="#home" className="logo">{site.name}</a>
        <nav className="nav" aria-label="Principal">
          {nav.map(([label, href]) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </nav>
        <a className="btn btn--small" href={waLink} target="_blank" rel="noreferrer">Agendar</a>
        <button className="burger" onClick={() => setOpen(!open)} aria-label="Abrir menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <motion.div className="pole-progress" style={{ scaleX: progress }} />
      <AnimatePresence>
        {open && (
          <motion.nav
            className="mobile-nav"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.35, ease }}
          >
            {nav.map(([label, href], i) => (
              <motion.a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 * i + 0.1, duration: 0.4, ease }}
              >
                {label}
              </motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// Halo de raios (referência às gravuras clássicas) girando atrás do título
function Halo() {
  const rays = Array.from({ length: 96 });
  return (
    <div className="halo" aria-hidden="true">
      <svg viewBox="-500 -500 1000 1000" className="halo__rays">
        {rays.map((_, i) => {
          const a = (i / rays.length) * Math.PI * 2;
          const long = i % 4 === 0;
          const r1 = 250;
          const r2 = long ? 490 : i % 2 === 0 ? 400 : 340;
          return (
            <line
              key={i}
              x1={Math.cos(a) * r1}
              y1={Math.sin(a) * r1}
              x2={Math.cos(a) * r2}
              y2={Math.sin(a) * r2}
              strokeWidth={long ? 1.6 : 0.8}
            />
          );
        })}
      </svg>
      <svg viewBox="-500 -500 1000 1000" className="halo__rings">
        <circle r="215" />
        <circle r="232" strokeDasharray="2 9" />
        <circle r="248" />
      </svg>
    </div>
  );
}

function Hero() {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 160]);
  const scale = useTransform(scrollY, [0, 800], [1.05, 1.2]);
  const contentY = useTransform(scrollY, [0, 600], [0, 90]);
  const contentOpacity = useTransform(scrollY, [0, 520], [1, 0]);
  const haloY = useTransform(scrollY, [0, 800], [0, 120]);
  const words = site.name.split(" ");
  let letterIndex = 0;

  return (
    <section id="home" className="hero" ref={ref}>
      <motion.div className="hero__bg" style={{ y, scale, backgroundImage: `url(${site.heroImage})` }} />
      <div className="hero__glow" aria-hidden="true" />
      <motion.div style={{ y: haloY }} className="hero__halo">
        <Halo />
      </motion.div>
      <div className="hero__shade" />
      <motion.div className="hero__content" style={{ y: contentY, opacity: contentOpacity }}>
        <h1 className="hero__title" aria-label={site.name}>
          {words.map((w, wi) => (
            <span className="mask" key={wi} aria-hidden="true">
              {w.split("").map((ch, ci) => {
                const d = 0 + letterIndex++ * 0.07;
                return (
                  <motion.span
                    key={ci}
                    className="letter"
                    initial={{ y: "105%", rotate: 3, opacity: 0 }}
                    animate={{ y: 0, rotate: 0, opacity: 1 }}
                    transition={{
						duration: 0.75,
						ease: [0.22, 1, 0.36, 1],
						delay: d
					}} 
                  >
                    {ch}
                  </motion.span>
                );
              })}
              {wi < words.length - 1 && <span className="letter">&nbsp;</span>}
            </span>
          ))}
        </h1>
        <motion.span
          className="hero__rule"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.0, duration: 1, ease }}
        />
        <motion.p
          className="hero__sub"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
        >
          {site.tagline}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.7, ease }}
        >
          <Magnetic className="btn" href={waLink} target="_blank" rel="noreferrer">
            <MessageCircle size={20} /> Agendar pelo WhatsApp
          </Magnetic>
        </motion.div>
      </motion.div>
      <div className="hero__stripe">
        <Marquee />
      </div>
    </section>
  );
}

function Title({ children }) {
  return (
    <h2 className="title">
      <motion.span className="mask" initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}>
        <motion.span variants={{ hidden: { y: "110%" }, show: { y: 0, transition: { duration: 0.9, ease } } }}>
          {children}
        </motion.span>
      </motion.span>
    </h2>
  );
}

function Lightbox({ photos, index, onClose, onChange }) {
  const next = () => onChange((index + 1) % photos.length);
  const prev = () => onChange((index - 1 + photos.length) % photos.length);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = before;
    };
  });

  const photo = photos[index];
  return (
    <motion.div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Foto ampliada"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.img
        key={photo.src}
        className="lightbox__img"
        src={photo.src}
        alt={photo.label || "Trabalho de tatuagem"}
        initial={{ opacity: 0, scale: 0.94, filter: "blur(6px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.4, ease }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.35}
        onDragEnd={(_, info) => {
          if (info.offset.x < -70) next();
          else if (info.offset.x > 70) prev();
        }}
        onClick={(e) => e.stopPropagation()}
        draggable={false}
      />
      <button className="lightbox__btn lightbox__close" onClick={onClose} aria-label="Fechar">
        <X size={24} />
      </button>
      {photos.length > 1 && (
        <>
          <button className="lightbox__btn lightbox__prev" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Foto anterior">
            <ChevronLeft size={26} />
          </button>
          <button className="lightbox__btn lightbox__next" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Próxima foto">
            <ChevronRight size={26} />
          </button>
          <span className="lightbox__count">{index + 1} / {photos.length}</span>
        </>
      )}
    </motion.div>
  );
}

// Cada foto: revelação em cortina + leve parallax na coluna do meio
function Work({ w, i, onOpen, progress }) {
  const shift = useTransform(progress, [0, 1], i % 3 === 1 ? [48, -48] : [0, 0]);
  return (
    <motion.div
      className="work-cell"
      style={{ y: shift }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
    >
      <motion.figure
        className="work"
        variants={{
          hidden: { clipPath: "inset(0 0 100% 0)" },
          show: { clipPath: "inset(0 0 0% 0)", transition: { duration: 1.1, ease, delay: (i % 3) * 0.14 } },
        }}
      >
        {w.src ? (
          <button type="button" className="work__btn" onClick={onOpen} aria-label={`Ampliar foto ${i + 1}`}>
            <img src={w.src} alt={w.label || "Trabalho de tatuagem"} loading="lazy" />
            <span className="work__plus" aria-hidden="true">+</span>
          </button>
        ) : (
          <div className="work__ph">Foto {i + 1}</div>
        )}
        {w.label && <figcaption>{w.label}</figcaption>}
      </motion.figure>
    </motion.div>
  );
}

function Works() {
  const [open, setOpen] = useState(null);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const photos = site.works.map((w, i) => ({ ...w, i })).filter((w) => w.src);

  return (
    <section id="trabalhos" className="section" ref={ref}>
      <div className="wrap">
        <Title>Trabalhos feitos no estúdio</Title>
        <div className="works">
          {site.works.map((w, i) => (
            <Work
              key={i}
              w={w}
              i={i}
              progress={scrollYProgress}
              onOpen={() => setOpen(photos.findIndex((p) => p.i === i))}
            />
          ))}
        </div>
      </div>
      <AnimatePresence>
        {open !== null && (
          <Lightbox photos={photos} index={open} onClose={() => setOpen(null)} onChange={setOpen} />
        )}
      </AnimatePresence>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="como-funciona" className="section section--tint">
      <div className="wrap">
        <Title>Como funciona o agendamento</Title>
        <p className="lead">Toda tatuagem começa por uma conversa. Você manda a ideia, nós cuidamos do resto pelo WhatsApp.</p>
        <ol className="steps">
          {site.steps.map((s, i) => (
            <motion.li
              key={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={{
                hidden: { opacity: 0, y: 36 },
                show: { opacity: 1, y: 0, transition: { duration: 0.9, ease, delay: i * 0.1 } },
              }}
            >
              <motion.span
                className="steps__line"
                variants={{
                  hidden: { scaleX: 0 },
                  show: { scaleX: 1, transition: { duration: 1.2, ease, delay: 0.3 + i * 0.1 } },
                }}
              />
              <span className="steps__n">{i + 1}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function CTA() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <section className="cta" ref={ref}>
      <motion.div className="cta__stripes" style={{ rotate }} />
      <motion.div
        className="cta__box"
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease }}
      >
        <h2>Sua próxima tattoo começa aqui</h2>
        <p>Mande sua ideia e receba o orçamento no WhatsApp.</p>
        <Magnetic className="btn btn--light" href={waLink} target="_blank" rel="noreferrer">
          <MessageCircle size={20} /> Chamar no WhatsApp
        </Magnetic>
      </motion.div>
    </section>
  );
}

function Where() {
  return (
    <section id="onde" className="section">
      <div className="wrap split">
        <div>
          <Title>Onde nos encontrar</Title>
          <p className="info"><MapPin size={20} /> {site.address}</p>
          <div className="info info--col">
            <Clock size={20} />
            <ul>
              {site.hours.map(([d, h]) => (
                <li key={d}><b>{d}</b> {h}</li>
              ))}
            </ul>
          </div>
          <a className="btn" href={waLink} target="_blank" rel="noreferrer">
            <MessageCircle size={20} /> Agendar pelo WhatsApp
          </a>
        </div>
        <motion.div
          className="map-frame"
          initial={{ clipPath: "inset(0 0 0 100%)", opacity: 0 }}
          whileInView={{ clipPath: "inset(0 0 0 0%)", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease }}
        >
          <iframe
            className="map"
            title="Mapa"
            loading="lazy"
            src={`https://www.google.com/maps?q=${encodeURIComponent(site.address)}&output=embed`}
          />
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span className="footer__mark" aria-hidden="true">{site.name}</span>
      <div className="wrap footer__inner">
        <div>
          <strong className="logo">{site.name}</strong>
          <p>{site.address}</p>
        </div>
        <nav aria-label="Rodapé">
          {nav.map(([label, href]) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </nav>
        <a href={site.instagram} target="_blank" rel="noreferrer" className="footer__ig">
          <Instagram size={20} /> Instagram
        </a>
      </div>
      <p className="footer__copy">© {new Date().getFullYear()} {site.name}. Todos os direitos reservados.</p>
    </footer>
  );
}

function Floating() {
  return (
    <motion.a
      className="float-wa"
      href={waLink}
      target="_blank"
      rel="noreferrer"
      aria-label="Chamar no WhatsApp"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.6, type: "spring", stiffness: 260, damping: 15 }}
      whileHover={{ scale: 1.1, rotate: -8 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageCircle size={30} />
    </motion.a>
  );
}

export default function App() {
  return (
    <>
      <div className="grain" aria-hidden="true" />
      <CursorGlow />
      <Header />
      <main>
        <Hero />
        <Works />
        <HowItWorks />
        <CTA />
        <Where />
      </main>
      <Footer />
      <Floating />
    </>
  );
}
