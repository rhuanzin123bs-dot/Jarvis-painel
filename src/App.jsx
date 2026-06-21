import React, { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, Send, Plus, Check, X, Cloud, Wind, Bell, ListChecks, Wallet, Brain, Volume2, VolumeX, Power, BookOpen, Clock } from "lucide-react";

function useStore(key, initial) {
  const [s, setS] = useState(() => {
    try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : initial; } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(s)); } catch {} }, [key, s]);
  return [s, setS];
}
const uid = () => Math.random().toString(36).slice(2, 9);

function Panel({ icon: Icon, title, children, actions }) {
  return (
    <div className="panel">
      <div className="phead"><div className="ptitle"><Icon size={14} /><span>{title}</span></div>{actions}</div>
      <div>{children}</div>
    </div>
  );
}

function Clock_() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  return (
    <Panel icon={Clock} title="RELÓGIO">
      <div className="ctime">{now.toLocaleTimeString("pt-BR", { hour12: false })}</div>
      <div className="cdate">{now.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}</div>
    </Panel>
  );
}

function Weather() {
  const [coords, setCoords] = useStore("jv_coords", null);
  const [city, setCity] = useStore("jv_city", null);
  const [w, setW] = useState(null);
  const [q, setQ] = useState("");

  const search = async () => {
    if (!q.trim()) return;
    const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1&language=pt`);
    const d = await r.json();
    if (d.results?.[0]) {
      const c = d.results[0];
      setCoords({ lat: c.latitude, lon: c.longitude });
      setCity(c.name);
    }
  };
  useEffect(() => {
    if (!coords) return;
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,wind_speed_10m&timezone=auto`)
      .then((r) => r.json()).then((d) => setW(d.current));
  }, [coords]);

  return (
    <Panel icon={Cloud} title="CLIMA">
      {!coords ? (
        <div className="row">
          <input className="inp" placeholder="Cidade..." value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && search()} />
          <button className="btn" onClick={search}>Definir</button>
        </div>
      ) : w ? (
        <div>
          <div className="wtemp">{Math.round(w.temperature_2m)}°C</div>
          <div className="wsub">{city} · <Wind size={11} style={{ display: "inline" }} /> {Math.round(w.wind_speed_10m)} km/h</div>
          <button className="link" onClick={() => setCoords(null)}>Trocar cidade</button>
        </div>
      ) : <div className="hint">Carregando...</div>}
    </Panel>
  );
}

function ListPanel({ icon, title, items, setItems, ph }) {
  const [t, setT] = useState("");
  const add = () => { if (!t.trim()) return; setItems([...items, { id: uid(), text: t, done: false }]); setT(""); };
  return (
    <Panel icon={icon} title={title}>
      <div className="row">
        <input className="inp" placeholder={ph} value={t} onChange={(e) => setT(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} />
        <button className="iconbtn" onClick={add}><Plus size={14} /></button>
      </div>
      <div className="list">
        {items.length === 0 && <div className="hint">Nada por aqui.</div>}
        {items.map((i) => (
          <div key={i.id} className={`item ${i.done ? "done" : ""}`}>
            <button className="chk" onClick={() => setItems(items.map((x) => x.id === i.id ? { ...x, done: !x.done } : x))}>{i.done ? <Check size={12} /> : null}</button>
            <span className="itext">{i.text}</span>
            <button className="rm" onClick={() => setItems(items.filter((x) => x.id !== i.id))}><X size={12} /></button>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function Finance() {
  const [goals, setGoals] = useStore("jv_goals", []);
  const [name, setName] = useState(""); const [target, setTarget] = useState("");
  const add = () => { if (!name || !target) return; setGoals([...goals, { id: uid(), name, target: +target, cur: 0 }]); setName(""); setTarget(""); };
  return (
    <Panel icon={Wallet} title="METAS FINANCEIRAS">
      <div className="row">
        <input className="inp" placeholder="Meta" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="inp" style={{ flex: "0 0 70px" }} type="number" placeholder="R$" value={target} onChange={(e) => setTarget(e.target.value)} />
        <button className="iconbtn" onClick={add}><Plus size={14} /></button>
      </div>
      <div className="list">
        {goals.map((g) => (
          <div key={g.id} className="goal">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <span>{g.name}</span>
              <button className="rm" onClick={() => setGoals(goals.filter((x) => x.id !== g.id))}><X size={12} /></button>
            </div>
            <div className="bar"><div className="fill" style={{ width: `${Math.min(100, g.cur / g.target * 100)}%` }} /></div>
            <div className="row" style={{ justifyContent: "space-between", fontSize: 10 }}>
              <span>R$ {g.cur} / R$ {g.target}</span>
              <button className="link" onClick={() => setGoals(goals.map((x) => x.id === g.id ? { ...x, cur: x.cur + 50 } : x))}>+50</button>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function Memory() {
  const [mem, setMem] = useStore("jv_mem", []);
  const [t, setT] = useState("");
  const add = () => { if (!t.trim()) return; setMem([{ id: uid(), text: t }, ...mem]); setT(""); };
  return (
    <Panel icon={Brain} title="MEMÓRIA">
      <div className="row">
        <input className="inp" placeholder="O que lembrar?" value={t} onChange={(e) => setT(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} />
        <button className="iconbtn" onClick={add}><Plus size={14} /></button>
      </div>
      <div className="list">{mem.map((m) => (
        <div key={m.id} className="item"><span className="itext">{m.text}</span><button className="rm" onClick={() => setMem(mem.filter((x) => x.id !== m.id))}><X size={12} /></button></div>
      ))}</div>
    </Panel>
  );
}

const QUICK = [
  { label: "YouTube", deep: "youtube://", web: "https://youtube.com", ok: true },
  { label: "WhatsApp", deep: "whatsapp://send", web: "https://web.whatsapp.com", ok: true },
  { label: "Spotify", deep: "spotify://", web: "https://open.spotify.com", ok: true },
  { label: "Gmail", deep: "googlegmail://", web: "https://mail.google.com", ok: true },
  { label: "ChatGPT", deep: "chatgpt://", web: "https://chat.openai.com", ok: false },
  { label: "Play Store", deep: "market://", web: "https://play.google.com/store", ok: false },
];
function tryOpen(deep, web) {
  let hid = false;
  const f = () => { if (document.hidden) hid = true; };
  document.addEventListener("visibilitychange", f);
  window.location.href = deep;
  setTimeout(() => { document.removeEventListener("visibilitychange", f); if (!hid) window.open(web, "_blank"); }, 900);
}

function QuickLaunch() {
  const [last, setLast] = useState(null);
  return (
    <Panel icon={Power} title="CONTROLE RÁPIDO">
      <div className="hint">Toque para abrir. ⚠ = sem garantia de link direto.</div>
      <div className="qgrid">
        {QUICK.map((q) => (
          <button key={q.label} className={`qbtn ${!q.ok ? "warn" : ""}`} onClick={() => { setLast(q.label); tryOpen(q.deep, q.web); }}>
            {q.label}{!q.ok && " ⚠"}
          </button>
        ))}
      </div>
      {last && <div className="hint" style={{ color: "#7DFFEA" }}>→ Tentando: {last}</div>}
    </Panel>
  );
}

function reply(input) {
  const l = input.toLowerCase();
  const m = QUICK.find((q) => l.includes(q.label.toLowerCase()));
  if (l.startsWith("abrir") && m) { tryOpen(m.deep, m.web); return `Tentando abrir ${m.label}.`; }
  if (l.includes("hora")) return `Agora são ${new Date().toLocaleTimeString("pt-BR", { hour12: false })}.`;
  if (l.includes("oi") || l.includes("olá")) return "Olá. Como posso ajudar?";
  if (l.includes("obrigad")) return "Disponha.";
  return "Entendido. Use os painéis ao lado para organizar tarefas, metas ou memória.";
}

function Chat() {
  const [msgs, setMsgs] = useStore("jv_chat", [{ id: uid(), role: "jarvis", text: "Sistemas inicializados. Como posso ajudar?" }]);
  const [input, setInput] = useState("");
  const [voice, setVoice] = useStore("jv_voice", true);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef(null);
  useEffect(() => { scrollRef.current?.scrollTo({ top: 9999, behavior: "smooth" }); }, [msgs]);

  const speak = (text) => {
    if (!voice || !window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(text); u.lang = "pt-BR";
    window.speechSynthesis.speak(u);
  };
  const send = (raw) => {
    const text = (raw ?? input).trim(); if (!text) return;
    setMsgs((p) => [...p, { id: uid(), role: "user", text }]);
    setInput("");
    setTimeout(() => {
      const r = reply(text);
      setMsgs((p) => [...p, { id: uid(), role: "jarvis", text: r }]);
      speak(r);
    }, 300);
  };
  const mic = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    if (listening) return;
    const rec = new SR(); rec.lang = "pt-BR";
    rec.onstart = () => setListening(true);
    rec.onresult = (e) => send(e.results[0][0].transcript);
    rec.onend = () => setListening(false);
    rec.start();
  };

  return (
    <Panel icon={Mic} title="JARVIS — CONSOLE" actions={
      <button className="ghostbtn" onClick={() => setVoice((v) => !v)}>{voice ? <Volume2 size={14} /> : <VolumeX size={14} />}</button>
    }>
      <div className="chatbox" ref={scrollRef}>
        {msgs.map((m) => <div key={m.id} className={`bubble ${m.role}`}>{m.text}</div>)}
      </div>
      <div className="row">
        <button className={`micbtn ${listening ? "on" : ""}`} onClick={mic}>{listening ? <Mic size={16} /> : <MicOff size={16} />}</button>
        <input className="inp" placeholder="Fale com o JARVIS..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
        <button className="iconbtn" onClick={() => send()}><Send size={14} /></button>
      </div>
    </Panel>
  );
}

export default function App() {
  const [tasks, setTasks] = useStore("jv_tasks", []);
  const [reminders, setReminders] = useStore("jv_reminders", []);
  const [studies, setStudies] = useStore("jv_studies", []);

  return (
    <div className="root">
      <style>{`
        * { box-sizing: border-box; }
        .root { min-height: 100vh; background: #02050A; color: #CFFAFF; font-family: -apple-system, sans-serif; padding: 16px; }
        .header { font-size: 22px; font-weight: 900; letter-spacing: 4px; color: #00E5FF; text-shadow: 0 0 14px rgba(0,229,255,.5); margin-bottom: 16px; }
        .layout { display: flex; flex-direction: column; gap: 12px; max-width: 480px; margin: 0 auto; }
        .panel { background: #061018; border: 1px solid rgba(0,229,255,.2); border-radius: 10px; padding: 12px; }
        .phead { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid rgba(0,229,255,.1); }
        .ptitle { display: flex; gap: 6px; align-items: center; font-size: 11px; letter-spacing: 1px; color: #7DFFEA; font-weight: 700; }
        .ctime { font-size: 28px; font-weight: 700; color: #00E5FF; }
        .cdate { font-size: 11px; color: #6FA8B5; text-transform: capitalize; }
        .row { display: flex; gap: 6px; margin-bottom: 6px; }
        .inp { flex: 1; background: rgba(0,229,255,.05); border: 1px solid rgba(0,229,255,.25); border-radius: 6px; padding: 8px; color: #CFFAFF; font-size: 13px; min-width: 0; }
        .btn { background: rgba(0,229,255,.15); border: 1px solid rgba(0,229,255,.4); color: #7DFFEA; border-radius: 6px; padding: 8px 12px; font-size: 12px; }
        .iconbtn { background: rgba(0,229,255,.15); border: 1px solid rgba(0,229,255,.4); color: #00E5FF; border-radius: 6px; width: 34px; flex-shrink: 0; }
        .ghostbtn { background: none; border: none; color: #4FC9D9; }
        .link { background: none; border: none; color: #4FC9D9; font-size: 10px; text-decoration: underline; }
        .hint { font-size: 11px; color: #3D6873; font-style: italic; padding: 4px 0; }
        .wtemp { font-size: 24px; font-weight: 700; }
        .wsub { font-size: 11px; color: #6FA8B5; margin: 4px 0; }
        .list { display: flex; flex-direction: column; gap: 5px; max-height: 180px; overflow-y: auto; }
        .item { display: flex; align-items: center; gap: 8px; background: rgba(0,229,255,.03); border: 1px solid rgba(0,229,255,.08); border-radius: 6px; padding: 6px 8px; }
        .item.done .itext { text-decoration: line-through; opacity: .5; }
        .chk { width: 16px; height: 16px; border: 1px solid rgba(0,229,255,.4); border-radius: 4px; background: none; color: #00E5FF; flex-shrink: 0; }
        .itext { flex: 1; font-size: 12.5px; }
        .rm { background: none; border: none; color: #4A7A85; flex-shrink: 0; }
        .goal { background: rgba(0,229,255,.03); border: 1px solid rgba(0,229,255,.08); border-radius: 6px; padding: 8px; margin-bottom: 5px; }
        .bar { height: 6px; background: rgba(0,229,255,.1); border-radius: 4px; margin: 6px 0; overflow: hidden; }
        .fill { height: 100%; background: linear-gradient(90deg,#0091FF,#00E5FF); }
        .qgrid { display: grid; grid-template-columns: repeat(3,1fr); gap: 6px; }
        .qbtn { background: rgba(0,229,255,.06); border: 1px solid rgba(0,229,255,.3); color