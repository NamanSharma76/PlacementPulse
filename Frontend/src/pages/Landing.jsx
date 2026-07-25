import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function Counter({ end, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const tick = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(ease * end));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

function FeatureCard({ icon, title, description, delay }) {
  return (
    <div className="feature-card" style={{ animationDelay: `${delay}ms` }}>
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-desc">{description}</p>
    </div>
  );
}

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:         #f8fafc;
          --surface:    #ffffff;
          --surface-2:  #f1f5f9;
          --primary:    #0284c7;
          --primary-dk: #0369a1;
          --primary-lt: rgba(14, 165, 233, 0.08);
          --accent:     #059669;
          --blue:       #0284c7;
          --blue-lt:    rgba(14, 165, 233, 0.08);
          --ink:        #0f172a;
          --ink-2:      #334155;
          --muted:      #64748b;
          --muted-lt:   #cbd5e1;
          --border:     #e2e8f0;
          --border-2:   #cbd5e1;
          --success:    #10b981;
          --tag-bg:     rgba(14, 165, 233, 0.08);
          --tag-txt:    #0369a1;
        }

        html { scroll-behavior: smooth; }
        body {
          background: var(--bg);
          color: var(--ink);
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 400;
          line-height: 1.6;
          overflow-x: hidden;
        }

        /* ── NAV ── */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 24px 48px;
          display: flex; align-items: center; justify-content: space-between;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nav.scrolled {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(15, 23, 42, 0.05);
          padding: 16px 48px;
          box-shadow: 0 4px 30px rgba(15, 23, 42, 0.03);
        }
        .nav-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none;
        }
        .nav-logo-icon {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 18px; color: white;
          box-shadow: 0 4px 12px rgba(2, 132, 199, 0.2);
        }
        .nav-logo-text {
          font-size: 19px; font-weight: 800;
          color: var(--ink); letter-spacing: -0.5px;
          background: linear-gradient(to right, var(--ink), var(--muted));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .nav-links {
          display: flex; align-items: center; gap: 32px; list-style: none;
        }
        .nav-links a {
          color: var(--muted); text-decoration: none;
          font-size: 14px; font-weight: 500;
          transition: all 0.2s ease;
        }
        .nav-links a:hover { color: var(--primary); transform: translateY(-1px); }
        .nav-cta { display: flex; gap: 12px; }
        .btn-ghost {
          padding: 10px 22px; border-radius: 10px;
          border: 1px solid var(--border);
          background: transparent; color: var(--ink-2);
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; font-weight: 500;
          cursor: pointer; text-decoration: none;
          transition: all 0.2s ease;
          display: inline-flex; align-items: center;
        }
        .btn-ghost:hover { border-color: var(--primary); color: var(--primary); background: var(--tag-bg); }
        .btn-primary {
          padding: 10px 22px; border-radius: 10px;
          background: linear-gradient(135deg, var(--primary), var(--primary-dk));
          color: white; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; font-weight: 600;
          cursor: pointer; text-decoration: none;
          border: none; transition: all 0.2s ease;
          display: inline-flex; align-items: center;
          box-shadow: 0 4px 14px rgba(2, 132, 199, 0.2);
        }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(2, 132, 199, 0.35); }

        /* ── HERO ── */
        .hero {
          min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; padding: 180px 24px 100px;
          position: relative; overflow: hidden;
          background: var(--bg);
        }
        .hero-bg {
          position: absolute; inset: 0; z-index: 0;
          background:
            radial-gradient(circle at 50% -10%, rgba(2, 132, 199, 0.1) 0%, transparent 60%),
            radial-gradient(circle at 15% 60%, rgba(16, 185, 129, 0.05) 0%, transparent 40%),
            radial-gradient(circle at 85% 85%, rgba(2, 132, 199, 0.04) 0%, transparent 40%);
        }
        .hero-dots {
          position: absolute; inset: 0; z-index: 0;
          background-image: radial-gradient(rgba(15, 23, 42, 0.03) 1.5px, transparent 1.5px);
          background-size: 32px 32px;
          mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 95%);
          -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 95%);
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 16px; border-radius: 100px;
          border: 1px solid rgba(2, 132, 199, 0.15);
          background: var(--tag-bg);
          font-size: 11px; font-weight: 700;
          color: var(--tag-txt); letter-spacing: 0.08em;
          text-transform: uppercase; margin-bottom: 24px;
          position: relative; z-index: 1;
          animation: fadeUp 0.7s ease both;
          box-shadow: 0 4px 12px rgba(2, 132, 199, 0.05);
        }
        .badge-pulse {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--success);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.7); }
        }
        .hero-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(52px, 8vw, 88px);
          font-weight: 800; line-height: 1.02;
          letter-spacing: -0.05em;
          color: var(--ink);
          position: relative; z-index: 1;
          animation: fadeUp 0.7s 0.08s ease both;
          max-width: 1000px;
        }
        .hero-title em {
          font-style: italic;
          font-family: 'Instrument Serif', serif;
          font-weight: 400;
          background: linear-gradient(135deg, var(--accent) 0%, var(--primary) 50%, var(--blue) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-sub {
          font-size: clamp(17px, 2.2vw, 20px);
          color: var(--muted); max-width: 620px;
          margin: 28px auto 0; line-height: 1.8;
          font-weight: 400;
          position: relative; z-index: 1;
          animation: fadeUp 0.7s 0.16s ease both;
        }
        .hero-actions {
          display: flex; gap: 14px; flex-wrap: wrap;
          justify-content: center; margin-top: 48px;
          position: relative; z-index: 1;
          animation: fadeUp 0.7s 0.24s ease both;
        }
        .btn-hero-primary {
          padding: 16px 38px; border-radius: 12px;
          background: linear-gradient(135deg, var(--primary), var(--primary-dk));
          color: white; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px; font-weight: 600;
          cursor: pointer; text-decoration: none;
          border: none; transition: all 0.2s ease;
          display: inline-flex; align-items: center; gap: 8px;
          box-shadow: 0 8px 24px rgba(2, 132, 199, 0.25);
        }
        .btn-hero-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(2, 132, 199, 0.4);
        }
        .btn-hero-secondary {
          padding: 16px 38px; border-radius: 12px;
          border: 1.5px solid var(--border);
          background: white; color: var(--ink);
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px; font-weight: 500;
          cursor: pointer; text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(15, 23, 42, 0.02);
        }
        .btn-hero-secondary:hover {
          border-color: var(--primary);
          background: var(--tag-bg);
          color: var(--primary);
          transform: translateY(-1px);
        }
        .hero-preview {
          position: relative; z-index: 1; margin-top: 80px;
          animation: fadeUp 0.8s 0.36s ease both;
          max-width: 1000px; width: 100%;
        }
        .hero-preview-frame {
          background: white;
          border: 1px solid rgba(15, 23, 42, 0.06);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 30px 80px rgba(15, 23, 42, 0.06), 0 0 50px rgba(2, 132, 199, 0.02);
        }
        .preview-bar {
          background: #f8fafc;
          border-bottom: 1px solid rgba(15, 23, 42, 0.06);
          padding: 14px 20px;
          display: flex; align-items: center; gap: 8px;
        }
        .preview-dot {
          width: 11px; height: 11px; border-radius: 50%;
        }
        .preview-url {
          margin-left: 16px; background: white;
          border: 1px solid rgba(15, 23, 42, 0.06); border-radius: 8px;
          padding: 6px 16px; font-size: 12px; color: var(--muted);
          flex: 1; max-width: 400px; text-align: left;
        }
        .preview-content {
          padding: 40px 32px;
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;
        }
        .preview-stat {
          background: #f8fafc;
          border: 1px solid rgba(15, 23, 42, 0.05);
          border-radius: 16px; padding: 24px 20px;
          text-align: left;
          box-shadow: 0 2px 4px rgba(15, 23, 42, 0.01);
        }
        .preview-stat-label { font-size: 12px; color: var(--muted); font-weight: 600; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; }
        .preview-stat-val { font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
        .preview-stat-val.blue { color: var(--primary); }
        .preview-stat-val.green { color: var(--success); }
        .preview-stat-val.orange { color: #f59e0b; }
        .preview-stat-val.red { color: #ef4444; }

        /* ── STATS ── */
        .stats {
          padding: 80px 48px;
          background: white;
          border-top: 1px solid rgba(15, 23, 42, 0.05);
          border-bottom: 1px solid rgba(15, 23, 42, 0.05);
        }
        .stats-inner {
          max-width: 1100px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(4, 1fr);
        }
        .stat-item {
          text-align: center; padding: 20px;
          border-right: 1px solid rgba(15, 23, 42, 0.05);
        }
        .stat-item:last-child { border-right: none; }
        .stat-number {
          font-size: 52px; font-weight: 800;
          color: var(--ink); line-height: 1;
          letter-spacing: -0.04em;
          background: linear-gradient(135deg, var(--ink), var(--muted));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .stat-label {
          font-size: 14.5px; color: var(--muted);
          margin-top: 10px; font-weight: 550;
        }

        /* ── SECTION COMMON ── */
        .section { padding: 130px 48px; }
        .section-inner { max-width: 1150px; margin: 0 auto; }
        .section-label {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--tag-txt); margin-bottom: 18px;
          background: var(--tag-bg);
          padding: 6px 14px; border-radius: 100px;
          border: 1px solid rgba(2, 132, 199, 0.15);
        }
        .section-title {
          font-size: clamp(38px, 5.5vw, 60px);
          font-weight: 800; line-height: 1.08;
          letter-spacing: -0.03em; color: var(--ink);
          max-width: 800px;
        }
        .section-title em {
          font-style: italic;
          font-family: 'Instrument Serif', serif;
          font-weight: 400;
          background: linear-gradient(to right, var(--primary), var(--accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .section-sub {
          font-size: 17.5px; color: var(--muted);
          max-width: 600px; margin-top: 20px;
          line-height: 1.8; font-weight: 400;
        }
        .centered { text-align: center; display: flex; flex-direction: column; align-items: center; }

        /* ── FEATURES ── */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px; margin-top: 64px;
        }
        .feature-card {
          background: white;
          border: 1px solid rgba(15, 23, 42, 0.05);
          border-radius: 24px; padding: 36px 32px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: fadeUp 0.6s ease both;
          position: relative; overflow: hidden;
          box-shadow: 0 10px 30px -10px rgba(15, 23, 42, 0.03);
        }
        .feature-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 4px;
          background: linear-gradient(90deg, var(--primary), var(--accent));
          opacity: 0; transition: opacity 0.3s;
        }
        .feature-card:hover {
          border-color: rgba(2, 132, 199, 0.2);
          box-shadow: 0 20px 40px -15px rgba(2, 132, 199, 0.12), 0 0 30px rgba(2, 132, 199, 0.01);
          transform: translateY(-5px);
        }
        .feature-card:hover::before { opacity: 1; }
        .feature-icon {
          font-size: 24px; margin-bottom: 24px;
          width: 52px; height: 52px;
          background: var(--tag-bg);
          border: 1px solid rgba(2, 132, 199, 0.15);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          color: var(--primary);
        }
        .feature-title {
          font-size: 18px; font-weight: 750;
          color: var(--ink); margin-bottom: 12px;
          letter-spacing: -0.3px;
        }
        .feature-desc {
          font-size: 14.5px; color: var(--muted);
          line-height: 1.75; font-weight: 400;
        }

        /* ── HOW IT WORKS ── */
        .steps {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 0; margin-top: 64px; position: relative;
        }
        .step {
          padding: 40px 36px; border-right: 1px solid rgba(15, 23, 42, 0.05);
          position: relative;
        }
        .step:last-child { border-right: none; }
        .step-num {
          width: 50px; height: 50px; border-radius: 16px;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 28px;
          font-size: 20px; font-weight: 800; color: white;
          box-shadow: 0 4px 15px rgba(2, 132, 199, 0.25);
        }
        .step-arrow {
          position: absolute; top: 60px; right: -15px;
          width: 30px; height: 30px;
          background: white;
          border: 1px solid rgba(15, 23, 42, 0.06);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; color: var(--primary);
          z-index: 2;
          box-shadow: 0 2px 4px rgba(15, 23, 42, 0.02);
        }
        .step:last-child .step-arrow { display: none; }
        .step-title {
          font-size: 19px; font-weight: 700;
          color: var(--ink); margin-bottom: 12px;
          letter-spacing: -0.3px;
        }
        .step-desc {
          font-size: 14.5px; color: var(--muted);
          line-height: 1.75; font-weight: 400;
        }

        /* ── ROLES ── */
        .roles {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 32px; margin-top: 64px;
        }
        .role-card {
          border: 1px solid rgba(15, 23, 42, 0.05);
          border-radius: 24px; padding: 48px;
          background: white;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative; overflow: hidden;
          box-shadow: 0 10px 30px -10px rgba(15, 23, 42, 0.03);
        }
        .role-card.primary-card {
          background: linear-gradient(180deg, white 0%, #f0f9ff 100%);
          border-color: rgba(2, 132, 199, 0.3);
          box-shadow: 0 15px 40px -10px rgba(2, 132, 199, 0.08);
        }
        .role-card:hover {
          box-shadow: 0 25px 60px -15px rgba(15, 23, 42, 0.08), 0 0 30px rgba(2, 132, 199, 0.02);
          transform: translateY(-5px);
          border-color: var(--primary);
        }
        .role-tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--tag-bg); color: var(--tag-txt);
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 6px 16px; border-radius: 100px;
          margin-bottom: 24px;
          border: 1px solid rgba(2, 132, 199, 0.15);
        }
        .role-title {
          font-size: 30px; font-weight: 800;
          color: var(--ink); margin-bottom: 12px;
          letter-spacing: -0.5px;
        }
        .role-sub {
          font-size: 15.5px; color: var(--muted);
          margin-bottom: 32px; line-height: 1.7; font-weight: 400;
        }
        .role-list {
          list-style: none; display: flex;
          flex-direction: column; gap: 14px;
        }
        .role-list li {
          font-size: 14.5px; color: var(--ink-2);
          display: flex; align-items: flex-start; gap: 12px;
          font-weight: 400;
        }
        .role-list li span.check {
          width: 20px; height: 20px; border-radius: 6px;
          background: var(--primary); color: white;
          font-size: 11px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 2px;
          box-shadow: 0 2px 8px rgba(2, 132, 199, 0.2);
        }
        .role-cta {
          display: inline-flex; align-items: center; gap: 8px;
          margin-top: 40px; padding: 14px 34px; border-radius: 12px;
          background: linear-gradient(135deg, var(--primary), var(--primary-dk));
          color: white; font-size: 14.5px; font-weight: 650;
          text-decoration: none; transition: all 0.2s ease; border: none;
          box-shadow: 0 4px 15px rgba(2, 132, 199, 0.25);
        }
        .role-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(2, 132, 199, 0.4);
        }
        .role-cta-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          margin-top: 40px; padding: 14px 34px; border-radius: 12px;
          border: 1.5px solid var(--border-2);
          color: var(--ink); font-size: 14.5px; font-weight: 550;
          text-decoration: none; transition: all 0.2s ease; background: white;
          box-shadow: 0 2px 4px rgba(15, 23, 42, 0.01);
        }
        .role-cta-ghost:hover { border-color: var(--primary); background: var(--tag-bg); color: var(--primary); transform: translateY(-1px); }

        /* ── TECH ── */
        .tech-grid {
          display: flex; flex-wrap: wrap; gap: 12px;
          margin-top: 52px; justify-content: center;
          max-width: 900px;
        }
        .tech-pill {
          padding: 8px 22px; border-radius: 100px;
          border: 1px solid var(--border);
          background: var(--surface);
          font-size: 14px; font-weight: 500;
          color: var(--muted); transition: all 0.25s;
        }
        .tech-pill:hover {
          border-color: var(--primary);
          color: var(--primary); background: var(--tag-bg);
          box-shadow: 0 4px 15px rgba(2, 132, 199, 0.1);
        }

        /* ── CTA SECTION ── */
        .cta-section {
          padding: 120px 48px; text-align: center;
          background: var(--bg);
          position: relative; overflow: hidden;
        }
        .cta-box {
          max-width: 850px; margin: 0 auto;
          background: linear-gradient(135deg, var(--primary), var(--primary-dk));
          border-radius: 30px; padding: 80px 48px;
          position: relative; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.15);
          box-shadow: 0 30px 60px rgba(2, 132, 199, 0.2);
        }
        .cta-box::before {
          content: '';
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 24px 24px;
        }
        .cta-title {
          font-size: clamp(36px, 5vw, 52px);
          font-weight: 800; line-height: 1.1;
          color: white; margin-bottom: 18px;
          letter-spacing: -0.03em; position: relative; z-index: 1;
        }
        .cta-sub {
          font-size: 17px; color: rgba(255,255,255,0.9);
          margin-bottom: 40px; line-height: 1.75; position: relative; z-index: 1;
          max-width: 600px; margin-left: auto; margin-right: auto;
        }
        .cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; position: relative; z-index: 1; }
        .btn-cta-white {
          padding: 14px 36px; border-radius: 10px;
          background: white; color: var(--primary-dk);
          font-size: 15px; font-weight: 750;
          text-decoration: none; transition: all 0.25s;
          display: inline-flex; align-items: center; gap: 8px;
          border: none;
          box-shadow: 0 4px 15px rgba(255,255,255,0.15);
        }
        .btn-cta-white:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(255,255,255,0.3); }
        .btn-cta-outline {
          padding: 14px 36px; border-radius: 10px;
          border: 1.5px solid rgba(255,255,255,0.4);
          color: white; font-size: 15px; font-weight: 500;
          text-decoration: none; transition: all 0.25s;
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.08);
        }
        .btn-cta-outline:hover { border-color: white; background: rgba(255,255,255,0.15); }

        /* ── FOOTER ── */
        .footer { border-top: 1px solid var(--border); padding: 80px 48px 40px; background: var(--surface); }
        .footer-inner {
          max-width: 1150px; margin: 0 auto;
          display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 80px;
        }
        .footer-brand-name {
          font-size: 20px; font-weight: 800;
          color: var(--ink); margin-bottom: 12px; letter-spacing: -0.3px;
        }
        .footer-brand-desc {
          font-size: 14.5px; color: var(--muted);
          line-height: 1.75; max-width: 320px; margin-bottom: 28px;
        }
        .footer-contact-item {
          display: flex; align-items: center; gap: 12px;
          font-size: 13.5px; color: var(--muted);
          margin-bottom: 12px; text-decoration: none; transition: color 0.2s;
        }
        .footer-contact-item:hover { color: var(--primary); }
        .footer-contact-icon {
          width: 30px; height: 30px;
          border: 1px solid var(--border); border-radius: 8px;
          background: var(--surface-2);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; flex-shrink: 0; color: var(--ink);
        }
        .footer-col-title {
          font-size: 12px; font-weight: 750;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--ink); margin-bottom: 22px;
        }
        .footer-links { list-style: none; display: flex; flex-direction: column; gap: 12px; }
        .footer-links a {
          font-size: 14.5px; color: var(--muted);
          text-decoration: none; transition: color 0.2s;
        }
        .footer-links a:hover { color: var(--primary); }
        .footer-bottom {
          max-width: 1150px; margin: 60px auto 0;
          padding-top: 28px; border-top: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 16px;
        }
        .footer-copy { font-size: 13.5px; color: #4b5563; }
        .footer-copy span { color: var(--primary); font-weight: 700; }
        .social-links { display: flex; gap: 12px; }
        .social-link {
          width: 36px; height: 36px;
          border: 1px solid var(--border); border-radius: 9px;
          background: var(--surface-2);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; text-decoration: none; color: var(--muted);
          transition: all 0.2s;
        }
        .social-link:hover { border-color: var(--primary); color: var(--primary); background: var(--tag-bg); }

        /* ── ANIMATIONS ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── HAMBURGER ── */
        .hamburger {
          display: none; flex-direction: column;
          gap: 5px; cursor: pointer; padding: 8px;
          background: none; border: none;
          z-index: 200;
        }
        .hamburger span {
          display: block; width: 24px; height: 2px;
          background: var(--ink); border-radius: 2px;
          transition: all 0.3s ease;
          transform-origin: center;
        }
        .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* ── MOBILE DRAWER ── */
        .mobile-overlay {
          display: none; position: fixed; inset: 0; z-index: 150;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(8px);
          animation: fadeIn 0.2s ease;
        }
        .mobile-drawer {
          position: absolute; top: 0; right: 0; bottom: 0;
          width: 80%; max-width: 300px;
          background: var(--surface);
          border-left: 1px solid var(--border);
          padding: 100px 28px 40px;
          display: flex; flex-direction: column;
          animation: slideIn 0.3s ease;
          box-shadow: -10px 0 50px rgba(15, 23, 42, 0.05);
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .mobile-nav-links {
          list-style: none; display: flex;
          flex-direction: column; gap: 6px; margin-bottom: 40px;
        }
        .mobile-nav-links a {
          display: block; padding: 14px 18px;
          font-size: 16px; font-weight: 600;
          color: var(--ink); text-decoration: none;
          border-radius: 12px; transition: all 0.15s;
        }
        .mobile-nav-links a:hover { background: var(--tag-bg); color: var(--primary); }
        .mobile-cta { display: flex; flex-direction: column; gap: 12px; }
        .mobile-cta a {
          display: flex; align-items: center; justify-content: center;
          padding: 14px 20px; border-radius: 10px;
          font-size: 15.5px; font-weight: 600; text-decoration: none;
          transition: all 0.2s;
        }
        .mobile-cta .m-signin {
          border: 1.5px solid var(--border-2);
          color: var(--ink); background: transparent;
        }
        .mobile-cta .m-signin:hover { border-color: var(--primary); background: var(--tag-bg); color: var(--primary); }
        .mobile-cta .m-start {
          background: var(--primary); color: white;
          box-shadow: 0 4px 15px rgba(2, 132, 199, 0.2);
        }
        .mobile-cta .m-start:hover { background: var(--primary-dk); }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .nav {
            padding: 16px 24px;
            background: rgba(255, 255, 255, 0.98);
            border-bottom: 1px solid var(--border);
            box-shadow: 0 4px 20px rgba(15, 23, 42, 0.05);
          }
          .nav.scrolled { padding: 14px 24px; }
          .nav-links { display: none; }
          .nav-cta { display: none; }
          .hamburger { display: flex; }
          .mobile-overlay { display: block; }

          .hero { padding: 140px 20px 80px; }

          .stats { padding: 48px 20px; }
          .stats-inner { grid-template-columns: repeat(2, 1fr); }
          .stat-item:nth-child(2) { border-right: none; }
          .stat-item:nth-child(3) { border-top: 1px solid var(--border); }
          .stat-item:nth-child(4) { border-top: 1px solid var(--border); border-right: none; }

          .features-grid { grid-template-columns: 1fr; }

          .steps { grid-template-columns: 1fr; }
          .step { border-right: none; border-bottom: 1px solid var(--border); }
          .step:last-child { border-bottom: none; }
          .step-arrow { display: none; }

          .roles { grid-template-columns: 1fr; }

          .footer-inner { grid-template-columns: 1fr; gap: 48px; }
          .footer-bottom { flex-direction: column; text-align: center; }

          .section { padding: 80px 20px; }
          .cta-box { padding: 60px 24px; }
          .preview-content { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 480px) {
          .stats-inner { grid-template-columns: 1fr 1fr; }
          .stat-number { font-size: 38px; }
          .preview-content { grid-template-columns: 1fr; gap: 12px; padding: 20px; }
          .preview-stat { padding: 16px 14px; }
        }
      `}</style>

      {/* ── MOBILE DRAWER ── */}
      {mobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer" onClick={e => e.stopPropagation()}>
            <ul className="mobile-nav-links">
              <li><a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a></li>
              <li><a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a></li>
              <li><a href="#roles" onClick={() => setMobileMenuOpen(false)}>For You</a></li>
              <li><a href="#tech" onClick={() => setMobileMenuOpen(false)}>Tech Stack</a></li>
            </ul>
            <div className="mobile-cta">
              <Link to="/login" className="m-signin">Sign In</Link>
              <Link to="/register" className="m-start">Get Started →</Link>
            </div>
          </div>
        </div>
      )}

      {/* ── NAV ── */}
      <nav className={`nav ${scrollY > 60 ? "scrolled" : ""}`}>
        <a href="#" className="nav-logo">
          <div className="nav-logo-icon">🎓</div>
          <span className="nav-logo-text">PlacementPortal</span>
        </a>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#how-it-works">How It Works</a></li>
          <li><a href="#roles">For You</a></li>
          <li><a href="#tech">Tech</a></li>
        </ul>
        <div className="nav-cta">
          <Link to="/login" className="btn-ghost">Sign In</Link>
          <Link to="/register" className="btn-primary">Get Started →</Link>
        </div>
        <button
          className={`hamburger ${mobileMenuOpen ? "open" : ""}`}
          onClick={() => setMobileMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-dots" />
        <div className="hero-badge">
          <div className="badge-pulse" />
          ⚡ RAG Resume Matcher Active
        </div>
        <h1 className="hero-title">
          The Intelligent Way to Manage<br />
          <em>Campus Placements</em>
        </h1>
        <p className="hero-sub">
          A production-grade college placement portal built for modern institutions — leveraging automated resume parsing, semantic matching, and unified result analytics.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn-hero-primary">
            Start for Free →
          </Link>
          <Link to="/login" className="btn-hero-secondary">
            Sign In
          </Link>
        </div>
        {/* Mini dashboard preview */}
        <div className="hero-preview">
          <div className="hero-preview-frame">
            <div className="preview-bar">
              <div className="preview-dot" style={{ background: "#ef4444" }} />
              <div className="preview-dot" style={{ background: "#f59e0b" }} />
              <div className="preview-dot" style={{ background: "#22c55e" }} />
              <div className="preview-url">placement-portal.vercel.app/dashboard</div>
            </div>
            <div className="preview-content">
              <div className="preview-stat">
                <div className="preview-stat-label">RAG Match Confidence</div>
                <div className="preview-stat-val green">94.8%</div>
              </div>
              <div className="preview-stat">
                <div className="preview-stat-label font-semibold">Active JDs Tracked</div>
                <div className="preview-stat-val blue">14</div>
              </div>
              <div className="preview-stat">
                <div className="preview-stat-label">General Placement Rate</div>
                <div className="preview-stat-val orange">84.2%</div>
              </div>
              <div className="preview-stat">
                <div className="preview-stat-label">Highest LPA Package</div>
                <div className="preview-stat-val blue">₹56 LPA</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="stats">
        <div className="stats-inner">
          <div className="stat-item">
            <div className="stat-number"><Counter end={120} suffix="+" /></div>
            <div className="stat-label">Features Implemented</div>
          </div>
          <div className="stat-item">
            <div className="stat-number"><Counter end={99} suffix="%" /></div>
            <div className="stat-label">Faster API Cache Response</div>
          </div>
          <div className="stat-item">
            <div className="stat-number"><Counter end={95} suffix="%" /></div>
            <div className="stat-label">PDF Parsing Accuracy</div>
          </div>
          <div className="stat-item">
            <div className="stat-number"><Counter end={1} suffix="s" /></div>
            <div className="stat-label">RAG Matching Latency</div>
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="section" id="features">
        <div className="section-inner">
          <div className="centered">
            <div className="section-label">✦ Production-Grade Utilities</div>
            <h2 className="section-title">Built for Complex<br /><em>Campus Workflows</em></h2>
            <p className="section-sub">
              Every interface element and logic gate is engineered around institutional security and high-speed student auditing.
            </p>
          </div>
          <div className="features-grid">
            <FeatureCard delay={0} icon="🔍" title="RAG Resume Matcher" description="Upload candidate resumes to extract key technical skills. Instantly score and rank students against complex Job Descriptions with keyword overlap and vector Cosine Similarity." />
            <FeatureCard delay={50} icon="📊" title="Auditing Dashboard" description="Full-featured admin dashboard displaying aggregate selection analytics, branch metrics, package spreads, and hiring pipelines at a glance." />
            <FeatureCard delay={100} icon="📥" title="Bulk Excel Imports" description="Onboard whole batches in one click. Excel parser automatically pre-fills academic history, sets up activation tokens, and locks profile data." />
            <FeatureCard delay={150} icon="📤" title="Excel Result Processors" description="Process company selections via Excel uploads. Detect roll numbers with fuzzy search, preview changes, and dispatch select emails automatically." />
            <FeatureCard delay={200} icon="📧" title="Student Queries Panel" description="Dedicated Student Query inbox letting students submit queries directly to the Placement Cell. Admins can track, respond, and resolve tickets instantly." />
            <FeatureCard delay={250} icon="🔒" title="Academic Profile Locking" description="Admins can toggle-lock profile fields (CGPA, marks, backlogs) to protect placement record integrity from manual student modifications." />
            <FeatureCard delay={300} icon="⚡" title="High-Speed Node Caching" description="In-memory cache logic drops database fetch overheads down to 5ms response times on repeated calls. Instant pagination built-in." />
            <FeatureCard delay={350} icon="🛡️" title="Secure Auth Steppers" description="JWT session token rotation, route guards, OTP signups, and student status gates (pending activation / active / debarred)." />
            <FeatureCard delay={400} icon="📋" title="Action Audit Logs" description="Keep full transparency with audit logs tracking every bulk Excel import, result updates, and administrative overrides." />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section" id="how-it-works" style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="section-inner">
          <div className="centered">
            <div className="section-label">✦ Automation Steppers</div>
            <h2 className="section-title">How It <em>Works</em></h2>
            <p className="section-sub">
              From onboarding students to automated RAG matching — the placement cell pipeline in three clean steps.
            </p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-num">1</div>
              <div className="step-arrow">→</div>
              <h3 className="step-title">Onboard & Parse</h3>
              <p className="step-desc">Admins import students via Excel. Students upload their PDF resumes which are parsed instantly in the backend to extract text and technical skills.</p>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <div className="step-arrow">→</div>
              <h3 className="step-title">Post & Match</h3>
              <p className="step-desc">Admins post active job vacancies. The RAG engine runs Cosine similarity vectors to rank students against requirements and logs match reports.</p>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <h3 className="step-title">Process & Track</h3>
              <p className="step-desc">Admins bulk update interview statuses or clear query tickets. Students receive instant email updates and track their round stepper status.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ROLES ── */}
      <section className="section" id="roles">
        <div className="section-inner">
          <div className="section-label">✦ Unified Dashboard Access</div>
          <h2 className="section-title">Separate Roles for <em>Students & Admins</em></h2>
          <p className="section-sub">Two distinct, high-fidelity layouts optimized for student progression and placement cell management.</p>
          <div className="roles">
            <div className="role-card primary-card">
              <div className="role-tag">👨‍🎓 For Students</div>
              <h3 className="role-title">Track Your Career Progress</h3>
              <p className="role-sub">Everything you need to apply, verify, and secure offers in one hub.</p>
              <ul className="role-list">
                {["Check resume match percentages and skill gaps for every JD", "View active job postings with eligibility warning badges", "Track application round statuses with vertical steppers", "Upload resume and photo with auto-parsing", "Direct messaging query inbox to the Placement Cell", "Change credentials and request resets securely", "Receive real-time email notifications for selections"].map(item => (
                  <li key={item}><span className="check">✓</span>{item}</li>
                ))}
              </ul>
              <Link to="/register" className="role-cta">Register as Student →</Link>
            </div>
            <div className="role-card">
              <div className="role-tag">👨‍💼 For Admins</div>
              <h3 className="role-title">Complete Control & Analytics</h3>
              <p className="role-sub">All institutional administration tasks packed inside a premium dashboard.</p>
              <ul className="role-list">
                {["Select any active Job to rank and review all student matches", "Review and resolve submitted student support tickets", "Bulk import students and process results via Excel sheets", "Audit logs tracking administrative actions", "Send announcements and notifications by branch", "Lock academic records and debar/reinstate profiles", "Export applicant profiles with resume downloads"].map(item => (
                  <li key={item}><span className="check">✓</span>{item}</li>
                ))}
              </ul>
              <Link to="/login" className="role-cta-ghost">Admin Login →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section className="section" id="tech" style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
        <div className="section-inner">
          <div className="centered">
            <div className="section-label">✦ Tech Stack</div>
            <h2 className="section-title">Built with <em>Modern Technologies</em></h2>
            <p className="section-sub">
              Production-grade ecosystem selected for scalability, execution speed, and token security.
            </p>
          </div>
          <div className="tech-grid">
            {["React.js", "Vite", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "JWT Auth", "Node-Cache", "Cloudinary", "Brevo SMTP", "Vercel", "Render", "PDF-Parse", "XLSX Parsing", "Vercel Analytics"].map(t => (
              <div key={t} className="tech-pill">{t}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-box">
          <h2 className="cta-title">Streamline Your Campus Placement Drives Today</h2>
          <p className="cta-sub">
            Onboard entire batches and match candidates to jobs in minutes. Register today to start placements.
          </p>
          <div className="cta-btns">
            <Link to="/register" className="btn-cta-white">Get Started Free →</Link>
            <Link to="/login" className="btn-cta-outline">Sign In</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div className="nav-logo-icon">🎓</div>
              <div className="footer-brand-name">PlacementPulse</div>
            </div>
            <p className="footer-brand-desc">
              A high-speed, secure college placement management platform leveraging resume semantic matching and audit automation.
            </p>
            <a href="mailto:kumarjhanitesh0@gmail.com" className="footer-contact-item">
              <div className="footer-contact-icon">✉</div>help@codenet.com
            </a>
          </div>
          <div>
            <div className="footer-col-title">Portal</div>
            <ul className="footer-links">
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/forgot-password">Forgot Password</Link></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Security & Tech</div>
            <ul className="footer-links">
              <li><a href="#tech">Tech Stack</a></li>
              <li><a href="#features">Features</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">© 2026 PlacementPulse. Built with ♥ by <span>Naman Sharma</span></p>
        </div>
      </footer>
    </>
  );
}
