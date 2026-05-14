import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring, useMotionValueEvent } from "framer-motion";
import { Search, ShoppingBag, Wind, Heart, Waves, Camera, PlayCircle, Send, Menu, X, ArrowRight } from "lucide-react";
import React, { useState, useRef, useEffect, ReactNode, Suspense } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, ContactShadows, PresentationControls, Stage, Center, Html } from "@react-three/drei";
import * as THREE from "three";

const IMAGES = {
  hero: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_jijnUGwBmc55BIC4RY3qz92OtXevsfJDI_CUMZ8PwHPAIVfAmkM58IxmP2F-JZx6N_Obk99fugu13m4Sf5HLh4JMfiPpoWCvm0iyJtPuGQIo3i6TQLO5PUCMdgIK3lDboKpqxhOUC_RqFtcZANMc8iJ5SV5CTVdIDOxceJUIsJVhmvxur3OtHniha8Gmq5ruhq6fYA29MPFtVLUjkIVMQuH__v6pJqQwRHApTXMkoutotsK62sIOejr7GlqfAGS-SWflXBKIXg",
  lumiere: "https://lh3.googleusercontent.com/aida-public/AB6AXuCp5PYfaFtcXAlqruYykiQdnxNpUeUmHEOc8XUyhm8fclcJ01IybrY73h8xqc5MdgINCgWeUTlDNdDgdDp1ygbqtbm2XcjDA2w2XCgBB33M3Mln7gWNrnl7FI-XEDS7sV-GZxDZoN5ztXWTMRSCXmGH2WnQjT-L3LypR7zpk9kRWPnb0cn4LIamMEJAGDTuM8ZXc2xW7OPnMNStxwIWPNFDWn2EtBJWftk9aA-pfGtJwhxAl2h8icTnGzN_0m2KSyBHD-YE9KrjIA",
  bleu: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFpGDZMywPR30IJltyIDuSmE2tJLyUNHg9j7JJOImJcp0t3HqSSP_h6QWhl9R4cxFzYjXtrqrM2CCh-AAAkh3PFqbbJ4UkS3O1kCEWwLEFu4L_ihbBx-C0m4lGA7_QGRTe28HKg4mL00Bxcg8xTQQ8Hv4cjR6AHCFVzVLZJ9bYdW8VeMFJDKCTj3GrYH9NNwR9KuINq-YHhPqbVnazR5_E_Id5r5lcbOhPD34IuV4Kno8CA-yv9Xhe7REwmC-p9LqFwmz83aL4pw",
  rose: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2V4cEcvUeOFi73rcoDEL7jTaPm1vlnqcCWNUSC0HdG3o-XuAF8lTuMo-5CJAYTlRP7odtVSkmSfOfO5WfbKgzvRplapAUALFtwMea5_x-ip9LDNWZcOUF9Rpyi4vt_cPa16JktN6mv-gahLLkivaAuEnf-J1KRpe4tKwtBM6hG6xgPbfdmDthQuGGQYxvr9Enx333hPKcFuTciLb0ocZlVliPOTLzgVHou0hjkt7m5-eCmgmYAUne9CZQlVhqr81nDTsGskK9qg",
  craft: "https://lh3.googleusercontent.com/aida-public/AB6AXuBW-vlbYoCuYU-GPFdGRw3oRL0R3Fnl8UHECoENWsxfhNV4Yk4uuQ4Tw32sXMeuakzv_6T3A-JjdY3IM7CrCbGBNpGCNM1au-r83K82riYijf-X-X4BX_ucY3YLC2vTAsTDpaz0pzE7d06xTSzSmSoMrR38ioPmf7eKteuujiE2A90mbAoyZGvQYqfqU9vDl6oi0InsfZ0lwOl-gg4UKlZ6p5c5DxE4b9FvrtmigkxdmCWfSqDAYJgRuW_uLfhSO9EsVcZbaThCXA"
};

const Reveal = ({ children, delay = 0, width = "fit-content", direction = "up" }: { children: ReactNode, delay?: number, width?: string, direction?: "up" | "down" | "left" | "right" }) => {
  const variants = {
    hidden: { 
      opacity: 0, 
      y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
      x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
      filter: "blur(10px)",
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      x: 0, 
      filter: "blur(0px)",
      scale: 1
    }
  };

  return (
    <div style={{ position: "relative", width, overflow: "visible" }}>
      <motion.div
        variants={variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        transition={{ 
          duration: 1.2, 
          delay, 
          ease: [0.22, 1, 0.36, 1] 
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync scroll to top on path change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-1000 px-8 py-6 lg:px-12 ${
        isScrolled 
          ? "bg-surface/80 backdrop-blur-2xl border-b border-white/5 py-4 shadow-2xl" 
          : "bg-transparent py-8"
      }`}
    >
      <div className="max-w-[1920px] mx-auto flex justify-between items-center">
        {/* Left Side Links */}
        <div className="hidden lg:flex flex-1 gap-12">
          <Link 
            to="/" 
            className={`text-[10px] font-sans font-bold tracking-[0.4em] uppercase transition-all duration-500 relative group ${pathname === '/' ? 'text-white' : 'text-on-surface/40 hover:text-white'}`}
          >
            Collection
            <span className={`absolute -bottom-1 left-0 h-[1px] bg-white transition-all duration-500 group-hover:w-full ${pathname === '/' ? 'w-full' : 'w-0'}`} />
          </Link>
          <Link 
            to="/about" 
            className={`text-[10px] font-sans font-bold tracking-[0.4em] uppercase transition-all duration-500 relative group ${pathname === '/about' ? 'text-white' : 'text-on-surface/40 hover:text-white'}`}
          >
            About Us
            <span className={`absolute -bottom-1 left-0 h-[1px] bg-white transition-all duration-500 group-hover:w-full ${pathname === '/about' ? 'w-full' : 'w-0'}`} />
          </Link>
          <Link 
            to="/contact" 
            className={`text-[10px] font-sans font-bold tracking-[0.4em] uppercase transition-all duration-500 relative group ${pathname === '/contact' ? 'text-white' : 'text-on-surface/40 hover:text-white'}`}
          >
            Contact Us
            <span className={`absolute -bottom-1 left-0 h-[1px] bg-white transition-all duration-500 group-hover:w-full ${pathname === '/contact' ? 'w-full' : 'w-0'}`} />
          </Link>
          <Link 
            to="/experience" 
            className={`text-[10px] font-sans font-bold tracking-[0.4em] uppercase transition-all duration-500 relative group ${pathname === '/experience' ? 'text-white' : 'text-on-surface/40 hover:text-white'}`}
          >
            Experience
            <span className={`absolute -bottom-1 left-0 h-[1px] bg-white transition-all duration-500 group-hover:w-full ${pathname === '/experience' ? 'w-full' : 'w-0'}`} />
          </Link>
          <Link 
            to="/showcase" 
            className={`text-[10px] font-sans font-bold tracking-[0.4em] uppercase transition-all duration-500 relative group ${pathname === '/showcase' ? 'text-white' : 'text-on-surface/40 hover:text-white'}`}
          >
            Showcase
            <span className={`absolute -bottom-1 left-0 h-[1px] bg-white transition-all duration-500 group-hover:w-full ${pathname === '/showcase' ? 'w-full' : 'w-0'}`} />
          </Link>
        </div>

        {/* Logo */}
        <Link 
          to="/"
          className="flex-shrink-0"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="text-3xl lg:text-4xl font-light tracking-[0.6em] uppercase text-on-surface font-serif">
              Koori
            </span>
          </motion.div>
        </Link>

        {/* Right Side Links & Icons */}
        <div className="flex-1 flex justify-end gap-12 items-center">
          <div className="hidden lg:flex gap-12 items-center">
            {["Heritage", "Boutiques"].map((item, idx) => (
              <motion.a 
                key={item} 
                href="#" 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (idx + 2) * 0.1 }}
                className="text-[10px] font-sans font-bold tracking-[0.4em] uppercase text-on-surface/40 hover:text-white transition-all duration-500 relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-500 group-hover:w-full" />
              </motion.a>
            ))}
          </div>
          
          <div className="flex gap-6 items-center">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Search size={18} className="text-on-surface/60 cursor-pointer hover:text-white transition-colors" />
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <ShoppingBag size={18} className="text-on-surface/60 cursor-pointer hover:text-white transition-colors" />
            </motion.div>
            <button className="lg:hidden" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={20} className="text-on-surface" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-surface z-[60] flex flex-col items-center justify-center p-8 backdrop-blur-2xl"
          >
            <motion.button 
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              className="absolute top-8 right-8" 
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={32} className="text-primary" />
            </motion.button>
            <div className="flex flex-col items-center gap-10">
              <Link 
                to="/" 
                className="text-3xl font-serif font-light tracking-[0.1em] text-on-surface"
                onClick={() => setMobileMenuOpen(false)}
              >
                Collection
              </Link>
              <Link 
                to="/about" 
                className="text-3xl font-serif font-light tracking-[0.1em] text-on-surface"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                to="/contact" 
                className="text-3xl font-serif font-light tracking-[0.1em] text-on-surface"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
              <Link 
                to="/experience" 
                className="text-3xl font-serif font-light tracking-[0.1em] text-on-surface"
                onClick={() => setMobileMenuOpen(false)}
              >
                Experience
              </Link>
              <Link 
                to="/showcase" 
                className="text-3xl font-serif font-light tracking-[0.1em] text-on-surface"
                onClick={() => setMobileMenuOpen(false)}
              >
                Showcase
              </Link>
              {["Heritage", "Boutiques"].map((item, idx) => (
                <motion.a 
                  key={item} 
                  href="#" 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (idx + 2) * 0.1 }}
                  className="text-3xl font-serif font-light tracking-[0.1em] text-on-surface"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section ref={targetRef} className="relative h-[120vh] flex items-center justify-center overflow-hidden hero-gradient">
      <motion.div 
        style={{ scale, y }}
        className="absolute inset-0 z-0"
      >
        <img 
          src={IMAGES.hero} 
          alt="Ethereal Essence Perfume" 
          className="w-full h-full object-cover mix-blend-overlay brightness-[0.4] contrast-[1.2]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface" />
      </motion.div>
      
      <motion.div style={{ opacity }} className="relative z-10 text-center max-w-5xl px-8 mt-[-10vh]">
        <Reveal width="100%">
          <span className="text-[11px] font-sans font-bold tracking-[1em] text-on-surface/30 mb-8 block uppercase">
            Midnight Collection
          </span>
        </Reveal>
        
        <Reveal width="100%" delay={0.2}>
          <h1 className="text-6xl lg:text-[10rem] font-serif font-light text-on-surface mb-10 tracking-[-0.04em] leading-[0.9]">
            Shadow <br /> Essence
          </h1>
        </Reveal>
        
        <Reveal width="100%" delay={0.4}>
          <p className="text-[1.5rem] lg:text-[2rem] font-serif italic text-on-surface-variant mb-16 max-w-2xl mx-auto leading-relaxed opacity-60">
            A dialogue between charcoal <br /> and the weightless.
          </p>
        </Reveal>
        
        <Reveal width="100%" delay={0.6}>
          <div className="flex justify-center">
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "#eeeeee", color: "#393e46" }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border border-on-surface/20 text-on-surface px-12 py-5 text-[10px] font-bold tracking-[0.4em] uppercase transition-all shadow-2xl group flex items-center gap-4"
            >
              Explore 
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-2" />
            </motion.button>
          </div>
        </Reveal>
      </motion.div>

      {/* Floating Elements (Atmospheric) */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -60, 0],
              x: [0, 30, 0],
              opacity: [0.05, 0.15, 0.05]
            }}
            transition={{ 
              duration: 12 + i * 3, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: i * 2 
            }}
            className="absolute bg-on-surface/10 blur-[80px] rounded-full"
            style={{
              width: 300 + i * 150,
              height: 300 + i * 150,
              top: `${10 + i * 20}%`,
              left: `${-10 + i * 25}%`,
            }}
          />
        ))}
      </div>
    </section>
  );
};

const ProductShowcase = () => {
  return (
    <section className="py-32 lg:py-[180px] px-8 lg:px-20 max-w-[1600px] mx-auto bg-surface relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        {/* Large Featured Item */}
        <motion.div 
          className="col-span-1 lg:col-span-12 xl:col-span-7"
        >
          <Reveal width="100%" direction="up">
            <div className="bg-surface-dim p-8 lg:p-20 flex flex-col justify-between min-h-[700px] lg:h-[900px] group border border-white/5 relative overflow-hidden glow-card">
               <motion.div 
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex-grow flex items-center justify-center p-8 z-10 relative"
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-10 transition-opacity duration-1000">
                  <div className="w-[80%] h-[80%] bg-on-surface blur-[100px] rounded-full" />
                </div>
                <img 
                  src={IMAGES.lumiere} 
                  alt="Lumière d'Or" 
                  className="w-full h-full object-contain max-h-[550px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] brightness-[0.8] contrast-[1.2]"
                />
              </motion.div>
              <div className="mt-8 z-10">
                <span className="text-[10px] font-sans font-bold tracking-[0.5em] text-on-surface/30 mb-4 block uppercase leading-none">The Onyx Icon</span>
                <h2 className="text-5xl lg:text-7xl font-serif mb-8 font-extralight tracking-tight text-on-surface">Lumière d&apos;Or</h2>
                <p className="text-xl text-on-surface-variant max-w-md leading-relaxed font-sans font-light">
                  A nocturnal interpretation of moonlight over deep water. Volcanic sea salt meets black musk.
                </p>
                <motion.a 
                  href="#" 
                  whileHover={{ x: 10 }}
                  className="mt-12 inline-flex items-center gap-4 text-[10px] font-sans font-bold border-b border-white/10 pb-2 text-on-surface/60 hover:text-white transition-all tracking-[0.4em] uppercase"
                >
                  Discover the Nocturnal Notes
                  <ArrowRight size={14} />
                </motion.a>
              </div>
            </div>
          </Reveal>
        </motion.div>

        {/* Side Items */}
        <div className="col-span-1 lg:col-span-12 xl:col-span-5 flex flex-col gap-12 lg:gap-20 justify-center">
          {/* Item 2 */}
          <Reveal width="100%" direction="up" delay={0.2}>
            <motion.div 
              whileHover={{ y: -15 }}
              className="bg-surface-dim p-12 lg:p-20 flex flex-col items-center justify-center text-center border border-white/5 group transition-all duration-1000 glow-card"
            >
              <div className="w-full h-72 mb-12 overflow-hidden flex items-center justify-center relative">
                 <motion.img 
                  whileHover={{ scale: 1.1, rotate: -3 }}
                  transition={{ duration: 0.8 }}
                  src={IMAGES.bleu} 
                  alt="Bleu Infini" 
                  className="w-full h-full object-contain max-h-[250px] brightness-[0.8]"
                />
              </div>
              <h3 className="text-4xl font-serif mb-4 font-light">Bleu Noir</h3>
              <div className="h-[1px] w-12 bg-white/10 mb-6" />
              <span className="text-[10px] font-sans font-bold tracking-[0.3em] text-on-surface/20 uppercase">Storm • Sea Wood • Smoke</span>
            </motion.div>
          </Reveal>

          {/* Item 3 */}
          <Reveal width="100%" direction="up" delay={0.4}>
            <motion.div 
              whileHover={{ y: -15 }}
              className="bg-surface-dim p-12 lg:p-20 flex flex-col items-center justify-center text-center border border-white/5 group relative overflow-hidden glow-card"
            >
              <div className="w-full h-72 mb-12 overflow-hidden flex items-center justify-center">
                <motion.img 
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  transition={{ duration: 0.8 }}
                  src={IMAGES.rose} 
                  alt="Rose de Verre" 
                  className="w-full h-full object-contain max-h-[250px] brightness-[0.8]"
                />
              </div>
              <h3 className="text-4xl font-serif mb-4 font-light">Rose Ombre</h3>
              <div className="h-[1px] w-12 bg-white/10 mb-6" />
              <span className="text-[10px] font-sans font-bold tracking-[0.3em] text-on-surface/20 uppercase">Oud • Dried Rose • Embers</span>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

const CraftSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.1, 0.95]);
  const textY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={containerRef} className="bg-surface-container py-32 lg:py-[220px] overflow-hidden relative">
      <div className="max-w-[1600px] mx-auto px-8 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-32 items-center">
        <div className="lg:col-span-6 relative">
          <Reveal width="100%" direction="left">
            <div className="aspect-[4/5] bg-white shadow-[0_50px_100px_rgba(0,0,0,0.06)] overflow-hidden">
              <motion.img 
                style={{ scale: imageScale }}
                src={IMAGES.craft} 
                alt="The Perfumer&apos;s Studio" 
                className="w-full h-full object-cover brightness-[1.02]" 
              />
            </div>
          </Reveal>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 1 }}
            className="absolute -bottom-16 -right-16 w-80 lg:w-96 p-14 glass-panel border border-white/50 hidden md:block shadow-2xl"
          >
            <p className="font-serif italic text-2xl lg:text-3xl text-on-surface-variant leading-relaxed tracking-tight">
              &quot;Scent is the most intimate form of memory.&quot;
            </p>
            <div className="mt-8 flex items-center gap-4">
              <div className="h-[1px] w-8 bg-primary/30" />
              <span className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase opacity-40">Director of Olfaction</span>
            </div>
          </motion.div>
        </div>

        <motion.div 
          style={{ y: textY }}
          className="lg:col-span-6 max-w-xl"
        >
          <Reveal width="100%" direction="right">
            <span className="text-[10px] font-sans font-bold tracking-[0.5em] text-primary/60 mb-10 block uppercase">Laboratory of Light</span>
          </Reveal>
          
          <Reveal width="100%" direction="right" delay={0.2}>
            <h2 className="text-5xl lg:text-8xl font-serif font-extralight mb-12 leading-[1] tracking-tighter">The Architecture of Air</h2>
          </Reveal>

          <Reveal width="100%" direction="right" delay={0.4}>
            <p className="text-xl lg:text-2xl text-on-surface-variant mb-16 leading-relaxed font-sans font-light opacity-80">
              Each Koori formulation is a study in suspension. We don&apos;t just blend essences; we curate moments of crystalline clarity. Our master perfumers in Grasse work with ingredients as if they were threads of light.
            </p>
          </Reveal>

          <Reveal width="100%" direction="right" delay={0.6}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-white px-16 py-6 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-on-surface transition-all duration-700 shadow-xl shadow-primary/20"
            >
              Our Heritage
            </motion.button>
          </Reveal>
        </motion.div>
      </div>
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 text-[15rem] font-serif font-extralight opacity-[0.02] select-none pointer-events-none transform -translate-x-1/2 translate-y-1/2">
        HERITAGE
      </div>
    </section>
  );
};

const OlfactoryPyramid = () => {
  const steps = [
    { num: "01", title: "Top Notes: The First Breath", notes: "Volcanic Citrus, Storm Mist", icon: <Wind size={32} /> },
    { num: "02", title: "Heart Notes: The Soul", notes: "Night Blooming Jasmine, Charcoal Iris", icon: <Heart size={32} /> },
    { num: "03", title: "Base Notes: The Echo", notes: "Burnt Sandalwood, Deep Amber, Onyx Musk", icon: <Waves size={32} /> }
  ];

  return (
    <section className="py-32 lg:py-[220px] px-8 lg:px-20 max-w-[1440px] mx-auto bg-surface relative overflow-hidden">
      <div className="text-center mb-32">
        <Reveal width="100%">
          <h2 className="text-5xl lg:text-7xl font-serif font-extralight mb-8 tracking-tight text-on-surface">
            The Nocturnal Soul
          </h2>
        </Reveal>
        <Reveal width="100%" delay={0.2}>
          <p className="text-on-surface-variant italic font-serif text-xl opacity-50">An olfactory architecture of shadows.</p>
        </Reveal>
      </div>

      <div className="flex flex-col gap-8 max-w-5xl mx-auto items-center">
        {steps.map((step, idx) => (
          <motion.div 
            key={step.num}
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ 
              delay: idx * 0.15, 
              duration: 0.8, 
              ease: [0.19, 1, 0.22, 1] 
            }}
            whileHover={{ scale: 1.02, x: 20, backgroundColor: "#393e46" }}
            className="w-full glass-panel p-12 lg:p-16 border border-white/5 flex group transition-all duration-1000 items-center justify-between shadow-2xl"
          >
            <div className="flex items-center gap-12 lg:gap-20">
              <span className="text-4xl lg:text-6xl font-serif font-thin text-white/5 group-hover:text-white/40 transition-colors duration-1000">
                {step.num}
              </span>
              <div>
                <h4 className="text-2xl lg:text-3xl font-serif font-light mb-4 group-hover:text-white transition-all duration-700">{step.title}</h4>
                <div className="flex items-center gap-6">
                   <div className="h-[1px] w-6 bg-white/10 group-hover:w-12 transition-all duration-700" />
                   <p className="text-on-surface-variant font-sans text-xs lg:text-sm font-bold tracking-[0.3em] uppercase opacity-40 group-hover:opacity-100">
                    {step.notes}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-white/5 group-hover:text-white/60 transition-all duration-1000 transform group-hover:rotate-12">
              {step.icon}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Newsletter = () => {
  return (
    <section className="py-40 bg-surface-dim text-on-surface overflow-hidden relative border-t border-white/5">
      <div className="max-w-[800px] mx-auto px-8 text-center flex flex-col items-center relative z-10">
        <Reveal width="100%">
          <span className="text-[10px] font-sans font-bold tracking-[0.6em] text-on-surface/20 mb-12 uppercase">
            Join the Nocturnal Journey
          </span>
        </Reveal>
        
        <Reveal width="100%" delay={0.2}>
          <h2 className="text-5xl lg:text-7xl font-serif font-extralight leading-[1.1] mb-20 tracking-tighter">
            Receive updates on our <br /> shadow-cast collection.
          </h2>
        </Reveal>
        
        <form className="w-full max-w-lg">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="relative group flex items-center border-b border-white/10 hover:border-white transition-all duration-1000 pb-6"
          >
            <input 
              type="email" 
              placeholder="YOUR EMAIL FOR THE SHADOWS" 
              className="w-full bg-transparent border-none focus:ring-0 text-[11px] font-sans font-bold tracking-[0.3em] placeholder:text-white/10 px-0 text-white"
            />
            <button className="text-[10px] font-sans font-bold tracking-[0.4em] uppercase text-white/40 hover:text-white transition-all ml-8 group-hover:translate-x-2 duration-500">
              Subscribe
            </button>
          </motion.div>
        </form>
      </div>

      {/* Background Decor */}
      <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 text-[20rem] font-serif font-extralight text-white opacity-[0.01] select-none pointer-events-none">
        SHRED
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-24 lg:py-40 px-8 lg:px-20 bg-surface flex flex-col items-center justify-center gap-20 border-t border-outline-variant/10 text-center">
      <div className="flex flex-wrap justify-center gap-10 lg:gap-20">
        {["Privacy", "Terms", "Contact", "Press"].map((item, i) => (
          <motion.a 
            key={item} 
            href="#" 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="text-[10px] font-serif italic tracking-[0.4em] text-on-surface/40 hover:text-primary transition-all duration-500 uppercase"
          >
            {item}
          </motion.a>
        ))}
      </div>

      <div className="flex flex-col items-center gap-8">
        <motion.span 
          whileHover={{ scale: 1.05, letterSpacing: "0.8em" }}
          className="text-3xl lg:text-4xl font-serif font-light tracking-[0.6em] uppercase text-primary/70 transition-all duration-1000 cursor-default"
        >
          Koori Parfums
        </motion.span>
        <p className="text-[10px] font-serif italic tracking-[0.3em] opacity-40 uppercase">
          &copy; 2024 Koori Parfums. Crafted in Grasse.
        </p>
      </div>

      <div className="flex gap-10">
        {[Camera, PlayCircle, Send].map((Icon, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ y: -5, color: "#6a5b5e" }}
          >
            <Icon size={20} className="text-primary/30 cursor-pointer transition-all duration-500" />
          </motion.div>
        ))}
      </div>
    </footer>
  );
};

const TiltCard = ({ children }: { children: ReactNode }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className="relative w-full h-full"
    >
      <div
        style={{
          transform: "translateZ(50px)",
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full"
      >
        {children}
      </div>
    </motion.div>
  );
};

const InfiniteMarquee = ({ children, speed = 30 }: { children: ReactNode, speed?: number }) => {
  return (
    <div className="overflow-hidden whitespace-nowrap flex py-6 border-y border-white/5 bg-on-surface/5">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        className="flex"
      >
        <div className="flex gap-20 pr-20 items-center">
          {children}
        </div>
        <div className="flex gap-20 pr-20 items-center">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

const ArcGallery = ({ items }: { items: any[] }) => {
  const [activeIndex, setActiveIndex] = useState(2);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [items.length]);

  return (
    <div className="relative h-[750px] w-full flex items-center justify-center perspective-2000 overflow-visible py-20 bg-surface">
      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="absolute inset-y-0 left-0 w-[20%] bg-gradient-to-r from-surface to-transparent" />
        <div className="absolute inset-y-0 right-0 w-[20%] bg-gradient-to-l from-surface to-transparent" />
      </div>
      
      {items.map((item, index) => {
        const offset = index - activeIndex;
        // Handle wrap-around for infinite feel
        let displayOffset = offset;
        if (offset > items.length / 2) displayOffset -= items.length;
        if (offset < -items.length / 2) displayOffset += items.length;

        const absOffset = Math.abs(displayOffset);
        const isSelected = index === activeIndex;
        
        const xPos = displayOffset * 340;
        const rotationY = displayOffset * -35;
        const zPos = isSelected ? 300 : -absOffset * 200;
        const opacity = Math.max(0, 1 - absOffset * 0.4);
        const blur = absOffset * 6;

        return (
          <motion.div
            key={item.id}
            initial={false}
            animate={{
              x: xPos,
              z: zPos,
              rotateY: rotationY,
              opacity: opacity,
              filter: `blur(${blur}px)`,
              scale: isSelected ? 1 : 0.8,
            }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 25,
            }}
            onClick={() => setActiveIndex(index)}
            className="absolute w-[420px] h-[550px] cursor-pointer"
            style={{ 
              zIndex: items.length - absOffset,
              transformStyle: "preserve-3d"
            }}
          >
            <TiltCard>
              <div className={`relative w-full h-full p-10 transition-all duration-1000 bg-surface-dim border ${isSelected ? "border-accent/40 shadow-[0_0_80px_rgba(240,227,202,0.1)]" : "border-white/5"} glow-card overflow-hidden group`}>
                <div className="absolute top-8 left-8 text-[9px] font-sans font-bold tracking-[0.5em] text-white/5 uppercase">
                  Edition {item.id < 10 ? `0${item.id}` : item.id}
                </div>
                
                <div className="h-[65%] w-full flex items-center justify-center mt-6">
                  <motion.img 
                    animate={{ 
                      y: isSelected ? [0, -15, 0] : 0,
                      rotateY: isSelected ? [-5, 5, -5] : 0
                    }}
                    transition={{ 
                      duration: 6, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                    src={item.img} 
                    alt={item.name}
                    className={`w-full h-full object-contain transition-all duration-1000 ${isSelected ? "brightness-100 drop-shadow-[0_40px_100px_rgba(0,0,0,0.8)]" : "brightness-[0.4] grayscale"}`}
                  />
                </div>

                <div className={`mt-10 text-center transition-all duration-1000 ${isSelected ? "opacity-100 translate-y-0" : "opacity-20 translate-y-8"}`}>
                  <h3 className="text-3xl lg:text-4xl font-serif font-light text-white mb-3 tracking-wide">{item.name}</h3>
                  <div className="flex items-center justify-center gap-4">
                    <div className="h-[1px] w-4 bg-accent/30" />
                    <p className="text-[10px] font-sans font-bold tracking-[0.3em] text-accent/60 uppercase">
                      {item.notes}
                    </p>
                    <div className="h-[1px] w-4 bg-accent/30" />
                  </div>
                </div>

                <AnimatePresence>
                  {isSelected && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute top-8 right-8"
                    >
                      <div className="flex items-center gap-2 bg-accent/10 px-3 py-1 border border-accent/20 rounded-full">
                        <div className="w-1 h-1 bg-accent rounded-full animate-pulse" />
                        <span className="text-[8px] font-sans font-bold text-accent tracking-tighter">$210</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </TiltCard>
          </motion.div>
        );
      })}

      {/* Dynamic Navigation Indicators */}
      <div className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 flex gap-6 z-30">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className="group py-4 px-2"
          >
            <div className={`h-[1px] transition-all duration-700 ${idx === activeIndex ? "w-16 bg-accent" : "w-8 bg-white/5 group-hover:bg-white/20 group-hover:w-12"}`} />
          </button>
        ))}
      </div>
    </div>
  );
};

const Catalog = () => {
  const products = [
    { id: 1, name: "Lumière d'Or", notes: "Bergamot • White Musk • Sunrise", img: IMAGES.lumiere },
    { id: 2, name: "Bleu Noir", notes: "Mineral • Sea Salt • Iris", img: IMAGES.bleu },
    { id: 3, name: "Rose Ombre", notes: "Oud • Dried Rose • Embers", img: IMAGES.rose },
    { id: 4, name: "Ether Musk", notes: "White Tea • Ether • Cotton", img: IMAGES.lumiere },
    { id: 5, name: "Onyx Wood", notes: "Sandalwood • Ash • Smoke", img: IMAGES.bleu },
    { id: 6, name: "Crystal Iris", notes: "Morning Mist • Iris • Glass", img: IMAGES.rose },
  ];

  return (
    <section className="py-32 lg:py-[180px] bg-surface relative z-10 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-8 lg:px-20 mb-16 text-center overflow-visible">
        <Reveal width="100%" direction="up">
          <span className="text-[10px] font-sans font-bold tracking-[0.6em] text-on-surface/20 mb-6 block uppercase">The Anthologies</span>
        </Reveal>
        <Reveal width="100%" direction="up" delay={0.2}>
          <h2 className="text-5xl lg:text-[10rem] font-serif font-light tracking-tighter text-on-surface leading-[1]">Infinite <br /> Series</h2>
        </Reveal>
      </div>

      <div className="relative mb-20">
        <ArcGallery items={products} />
      </div>

      <InfiniteMarquee speed={40}>
        {products.map((p) => (
          <div key={p.id} className="flex items-center gap-10">
            <span className="text-4xl lg:text-6xl font-serif font-light text-on-surface/10 hover:text-accent transition-colors cursor-default whitespace-nowrap uppercase">
              {p.name}
            </span>
            <div className="w-4 h-4 bg-accent/20 rotate-45" />
          </div>
        ))}
      </InfiniteMarquee>
    </section>
  );
};

const AboutPage = () => {
  return (
    <div className="bg-surface min-h-screen pt-40 pb-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-8 lg:px-20">
        <Reveal width="100%">
          <span className="text-[11px] font-sans font-bold tracking-[1em] text-on-surface/20 mb-8 block uppercase">The Philosophy</span>
        </Reveal>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-start">
          <div>
            <Reveal width="100%" delay={0.2}>
              <h1 className="text-6xl lg:text-[10rem] font-serif font-light text-on-surface mb-16 tracking-[-0.04em] leading-[0.9]">
                Koori <br /> Artistry
              </h1>
            </Reveal>
            
            <Reveal width="100%" delay={0.4}>
              <p className="text-2xl lg:text-3xl font-serif italic text-on-surface/60 mb-12 leading-relaxed">
                We believe that scent is more than a fragrance—it is a connection between the physical and the infinite.
              </p>
            </Reveal>

            <div className="space-y-12">
              {[
                { title: "The Source", text: "Our ingredients are harvested at the witching hour, when the potency of the botanical soul is at its peak." },
                { title: "The Vessel", text: "Each glass flacon is hand-blown to capture shadows, ensuring the preservation of the volatile essences within." },
                { title: "The Legacy", text: "Born in the heart of Grasse, Koori carries three centuries of tradition into the contemporary void." }
              ].map((item, idx) => (
                <div key={item.title}>
                  <Reveal width="100%" delay={0.6 + idx * 0.1}>
                    <div className="group border-l border-white/5 pl-8 hover:border-accent transition-colors duration-1000">
                      <h4 className="text-[10px] font-sans font-bold tracking-[0.4em] uppercase text-accent mb-4">{item.title}</h4>
                      <p className="text-base text-on-surface/40 leading-relaxed font-sans font-light">
                        {item.text}
                      </p>
                    </div>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-20 lg:mt-0">
             <Reveal width="100%" direction="left" delay={0.4}>
              <div className="aspect-[3/4] bg-surface-dim overflow-hidden border border-white/5 relative">
                <img 
                  src={IMAGES.craft} 
                  alt="Studio" 
                  className="w-full h-full object-cover grayscale opacity-50 contrast-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
              </div>
            </Reveal>
            
            <motion.div 
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 1.5, ease: [0.33, 1, 0.68, 1] }}
              className="absolute -bottom-10 -left-10 lg:-left-20 bg-surface-dim p-10 lg:p-16 border border-white/10 backdrop-blur-3xl z-10 max-w-sm"
            >
              <div className="text-5xl font-serif font-extralight mb-6 text-accent">3</div>
              <p className="text-[9px] font-sans font-bold tracking-[0.3em] uppercase text-white/40 leading-relaxed">
                Generations of selective olfaction in the Mediterranean shadows.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Connect Link Theme Section */}
        <div className="mt-40 lg:mt-60 py-40 border-t border-white/5 flex flex-col items-center text-center">
          <Reveal width="100%">
            <span className="text-[10px] font-sans font-bold tracking-[0.8em] text-on-surface/10 mb-12 uppercase">Join our Story</span>
          </Reveal>
          <Reveal width="100%" delay={0.2}>
            <Link 
              to="/" 
              className="group flex items-center gap-8"
            >
              <span className="text-5xl lg:text-9xl font-serif font-light text-on-surface hover:text-accent transition-all duration-1000 tracking-tighter">
                Explore Collection
              </span>
              <motion.div 
                whileHover={{ rotate: 45, scale: 1.2 }}
                className="w-16 h-16 lg:w-24 lg:h-24 border border-accent/30 rounded-full flex items-center justify-center text-accent"
              >
                <ArrowRight size={32} />
              </motion.div>
            </Link>
          </Reveal>
        </div>
      </div>
    </div>
  );
};

const ShowcaseModel = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <torusKnotGeometry args={[1, 0.3, 256, 64]} />
      <meshPhysicalMaterial 
        color="#083344"
        roughness={0}
        metalness={0.1}
        transmission={0.9}
        ior={1.5}
        thickness={0.5}
        envMapIntensity={2}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </mesh>
  );
};

const ShowcasePage = () => {
  return (
    <div className="bg-surface min-h-screen pt-32 pb-20 overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-8 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 h-full min-h-[80vh]">
        
        {/* Left Side: Info */}
        <div className="lg:col-span-4 flex flex-col justify-center gap-12 z-10">
          <Reveal width="100%">
            <span className="text-[10px] font-sans font-bold tracking-[1em] text-on-surface/20 block uppercase">Experimental Vault</span>
          </Reveal>
          
          <Reveal width="100%" delay={0.2}>
            <h1 className="text-6xl lg:text-[7rem] font-serif font-light text-on-surface tracking-tighter leading-[0.9]">
              Teal <br /> Essence
            </h1>
          </Reveal>
          
          <Reveal width="100%" delay={0.4}>
            <p className="text-xl lg:text-2xl font-serif italic text-on-surface/40 leading-relaxed max-w-sm">
              Exploring the physical manifestation of scent through infinite algorithmic structures.
            </p>
          </Reveal>
          
          <Reveal width="100%" delay={0.6}>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <span className="text-[9px] font-sans font-bold tracking-[0.3em] text-accent uppercase">Material</span>
                <p className="text-on-surface/60 font-light text-sm">Crystalline Form</p>
              </div>
              <div className="space-y-2">
                <span className="text-[9px] font-sans font-bold tracking-[0.3em] text-accent uppercase">Vibe</span>
                <p className="text-on-surface/60 font-light text-sm">Cold Clarity</p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Center: 3D View */}
        <div className="lg:col-span-8 min-h-[500px] lg:min-h-[80vh] relative">
          <div className="absolute inset-0 z-0">
            <Canvas shadows camera={{ position: [0, 0, 6], fov: 45 }}>
              <color attach="background" args={["#161517"]} />
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
              <Suspense fallback={
                <Html center>
                  <div className="text-on-surface/40 font-serif italic text-xl tracking-widest whitespace-nowrap">
                    Forming Geometry...
                  </div>
                </Html>
              }>
                <Environment preset="city" />
                <PresentationControls
                  global
                  speed={1.5}
                  rotation={[0, 0.3, 0]}
                  polar={[-Math.PI / 3, Math.PI / 3]}
                  azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
                >
                  <Center>
                    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                      <ShowcaseModel />
                    </Float>
                  </Center>
                </PresentationControls>
                <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={20} blur={2} far={4} />
              </Suspense>
            </Canvas>
          </div>
          
          {/* Controls Hint */}
          <div className="absolute bottom-12 right-12 flex items-center gap-6 opacity-30">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-sans font-bold tracking-[0.4em] uppercase">Interaction</span>
              <p className="text-[11px] font-serif italic">Drag to rotate infinite form</p>
            </div>
            <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center animate-pulse">
              <div className="w-1 h-1 bg-white rounded-full" />
            </div>
          </div>
        </div>

      </div>
      
      {/* Footer Decoration */}
      <div className="mt-20 border-t border-white/5 py-12 flex justify-center opacity-10">
        <span className="text-[12rem] font-serif font-light tracking-[-0.05em] select-none pointer-events-none">ASCEND</span>
      </div>
    </div>
  );
};

const InquiryPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Fallback static site email handler using mailto protocol (Client-side)
    const { name, email, subject, message } = formData;
    const mailtoLink = `mailto:contact@koori.com?subject=${encodeURIComponent(subject || 'General Inquiry')}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    
    window.location.href = mailtoLink;
    
    setStatus("success");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="bg-surface min-h-screen pt-40 pb-20">
      <div className="max-w-[1200px] mx-auto px-8 lg:px-20">
        <Reveal width="100%">
          <span className="text-[10px] font-sans font-bold tracking-[1em] text-on-surface/20 mb-8 block uppercase">The Dialogue</span>
        </Reveal>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div>
            <Reveal width="100%" delay={0.2}>
              <h1 className="text-6xl lg:text-8xl font-serif font-light text-on-surface mb-12 tracking-tight">
                Inquiry <br /> & Essence
              </h1>
            </Reveal>
            <Reveal width="100%" delay={0.4}>
              <p className="text-xl font-serif italic text-on-surface/50 mb-12 leading-relaxed">
                Whether you seek a bespoke formulation or wish to partner in our olfactory vision, we are listening.
              </p>
            </Reveal>
            
            <Reveal width="100%" delay={0.6}>
              <div className="space-y-8">
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-sans font-bold tracking-[0.3em] text-accent uppercase">Maison d&apos;Essence</span>
                  <p className="text-on-surface/40 font-light">12 Rue de la Paix, Paris, France</p>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-sans font-bold tracking-[0.3em] text-accent uppercase">Direct Line</span>
                  <p className="text-on-surface/40 font-light">+33 1 23 45 67 89</p>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="bg-surface-dim p-10 lg:p-16 border border-white/5 relative glow-card">
            <Reveal width="100%" delay={0.4}>
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-2 group">
                  <label className="text-[9px] font-sans font-bold tracking-[0.4em] text-on-surface/30 group-focus-within:text-accent transition-colors uppercase">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 py-4 focus:border-accent outline-none text-on-surface font-light transition-all"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div className="space-y-2 group">
                  <label className="text-[9px] font-sans font-bold tracking-[0.4em] text-on-surface/30 group-focus-within:text-accent transition-colors uppercase">Email Address</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 py-4 focus:border-accent outline-none text-on-surface font-light transition-all"
                    placeholder="email@example.com"
                  />
                </div>

                <div className="space-y-2 group">
                  <label className="text-[9px] font-sans font-bold tracking-[0.4em] text-on-surface/30 group-focus-within:text-accent transition-colors uppercase">Subject</label>
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 py-4 focus:border-accent outline-none text-on-surface font-light transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-surface">Select a subject</option>
                    <option value="General Inquiry" className="bg-surface">General Inquiry</option>
                    <option value="Bespoke Scent" className="bg-surface">Bespoke Scent</option>
                    <option value="Wholesale" className="bg-surface">Wholesale</option>
                    <option value="Press" className="bg-surface">Press</option>
                  </select>
                </div>

                <div className="space-y-2 group">
                  <label className="text-[9px] font-sans font-bold tracking-[0.4em] text-on-surface/30 group-focus-within:text-accent transition-colors uppercase">Message</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 py-4 focus:border-accent outline-none text-on-surface font-light transition-all resize-none"
                    placeholder="Tell us what you seek..."
                  />
                </div>

                <div className="pt-6">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={status === "sending"}
                    className={`w-full py-6 text-[10px] font-sans font-bold tracking-[0.5em] uppercase transition-all duration-700 shadow-xl ${
                      status === "success" 
                        ? "bg-green-500/20 text-green-500 border border-green-500" 
                        : "bg-accent text-surface hover:bg-white"
                    }`}
                  >
                    {status === "sending" ? "Dispatching..." : status === "success" ? "Inquiry Received" : "Send Inquiry"}
                  </motion.button>
                  
                  {status === "error" && (
                    <p className="mt-4 text-[10px] text-red-400 font-sans tracking-widest uppercase text-center">{errorMessage}</p>
                  )}
                  {status === "success" && (
                    <p className="mt-4 text-[10px] text-green-400 font-sans tracking-widest uppercase text-center">Your message has drifted to our sanctuary.</p>
                  )}
                </div>
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  return (
    <>
      <Hero />
      <Catalog />
      <ProductShowcase />
      <CraftSection />
      <OlfactoryPyramid />
      <Newsletter />
    </>
  );
};

const VideoExperiencePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (videoRef.current) {
      if (videoRef.current.readyState >= 1) {
        setDuration(videoRef.current.duration);
      } else {
        const handleLoadedMetadata = () => {
          if (videoRef.current) setDuration(videoRef.current.duration);
        };
        videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
        return () => videoRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }
    }
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (videoRef.current && Number.isFinite(duration) && duration > 0) {
      // Use requestAnimationFrame to ensure smooth playback
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = latest * duration;
        }
      });
    }
  });

  return (
    <div className="bg-surface relative w-full pt-20">
      <div 
        ref={containerRef} 
        className="h-[400vh] relative w-full"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center items-center">
          <video 
            ref={videoRef}
            src="/scene01.mp4" 
            preload="auto"
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          />
          <div className="absolute inset-0 bg-surface/30 z-10" />
          
          <motion.div 
            style={{ opacity: useTransform(scrollYProgress, [0, 0.1, 0.8, 1], [1, 0, 0, 1]) }}
            className="z-20 relative text-center max-w-4xl px-8"
          >
            <h1 className="text-6xl lg:text-9xl font-serif text-white font-light tracking-tighter mb-4 drop-shadow-2xl">
              The Flow of <br /> Time
            </h1>
            <p className="text-white/80 font-sans italic tracking-[0.2em] uppercase text-xs mt-8">
              Scroll downwards to traverse the frame
            </p>
          </motion.div>

          <motion.div 
            style={{ 
              opacity: useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 1, 0]),
              y: useTransform(scrollYProgress, [0.3, 0.5, 0.7], [50, 0, -50])
            }}
            className="absolute z-20 text-center max-w-2xl px-8"
          >
             <h2 className="text-4xl lg:text-6xl font-serif text-white font-light mb-6 drop-shadow-xl">
               Captured Stillness
             </h2>
             <p className="text-white/80 font-sans font-light tracking-widest leading-loose">
               Every second is a suspended note in this olfactory architecture. Uncover the underlying notes that structure our reality.
             </p>
          </motion.div>
        </div>
      </div>
      
      {/* Continuing Content */}
      <div className="py-40 max-w-[1200px] mx-auto px-8 lg:px-20 relative z-10 bg-surface text-center">
        <Reveal width="100%">
          <span className="text-[10px] font-sans font-bold tracking-[1em] text-on-surface/20 mb-8 block uppercase">Beyond Motion</span>
        </Reveal>
        <Reveal width="100%" delay={0.2}>
          <h2 className="text-5xl lg:text-7xl font-serif font-light text-on-surface mb-12 tracking-tight">
            The Stillness <br /> Remains
          </h2>
        </Reveal>
        <Reveal width="100%" delay={0.4}>
          <p className="text-xl font-serif italic text-on-surface/50 leading-relaxed max-w-2xl mx-auto">
            When the flow of time ceases, the essence is what lingers on the skin. Discover works shaped by silence and suspended motion.
          </p>
        </Reveal>
      </div>
    </div>
  );
};

export default function App() {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      console.error("Runtime error caught:", e.error);
      setHasError(true);
    };
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-20 text-center">
        <div className="max-w-md">
          <h1 className="text-4xl font-serif text-accent mb-6">A Drift in the Essence</h1>
          <p className="text-on-surface/40 font-sans tracking-widest uppercase text-xs leading-loose">
            The olfactory journey has encountered an unexpected void. Please refresh to return to the sanctuary.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-12 px-8 py-4 border border-white/10 text-[10px] font-sans font-bold tracking-[0.4em] uppercase hover:bg-white hover:text-surface transition-all"
          >
            Reconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen selection:bg-primary-container selection:text-on-primary-container overflow-x-clip bg-surface">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<InquiryPage />} />
        <Route path="/experience" element={<VideoExperiencePage />} />
        <Route path="/showcase" element={<ShowcasePage />} />
      </Routes>
      <Footer />
    </div>
  );
}
