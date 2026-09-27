import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHANNELS, PROFILE } from '../data/content';
import type { Channel } from '../data/content';
import { PROJECTS } from '../data/projects';
import { BrandIcon } from '../components/Icons';
import { Portal } from '../components/Portal';
import { RevealText } from '../components/RevealText';

const AVATAR = '/portraits/Hero.png';
const REPOS = PROJECTS.slice(0, 5);

export function Connect() {
  const [tab, setTab] = useState(0);
  const [portal, setPortal] = useState<Channel | null>(null);
  const active = CHANNELS[tab];

  const dive = (e: React.MouseEvent, c: Channel) => {
    e.preventDefault();
    setPortal(c);
  };

  const onPortalDone = () => {
    const c = portal;
    if (c) {
      if (c.href.startsWith('http')) {
        const w = window.open(c.href, '_blank', 'noopener,noreferrer');
        if (!w) window.location.href = c.href;
      } else {
        window.location.href = c.href;
      }
    }
    window.setTimeout(() => setPortal(null), 320);
  };

  return (
    <section className="section" id="connect">
      <div className="section-head">
        <span className="eyebrow">App · Browser</span>
        <h2><RevealText text="Let's connect." /></h2>
        <p>Each tab opens the real profile — no fake metrics, just direct links.</p>
      </div>

      <div className="browser">
        <div className="browser-tabs">
          {CHANNELS.map((c, i) => (
            <button key={c.id} className={`b-tab ${tab === i ? 'on' : ''}`} onClick={() => setTab(i)}>
              <BrandIcon name={c.icon} className="ico" />
              <span>{c.label}</span>
            </button>
          ))}
        </div>
        <div className="b-addr">
          <span className="b-dots"><i /><i /><i /></span>
          <span className="lock-ico">🔒</span>
          <span className="url mono">https://{active.domain}/</span>
        </div>

        <motion.div className="b-page" key={tab} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            {active.icon === 'gmail' && (
              <div className="ui-mail">
                <div className="ui-mail-head">New message</div>
                <div className="ui-field"><span>To</span><b>{PROFILE.email}</b></div>
                <div className="ui-field"><span>From</span><b>you@somewhere.com</b></div>
                <div className="ui-field"><span>Subject</span><b>Let&apos;s build something together</b></div>
                <div className="ui-mail-body">Hi Rajesh — I came across your portfolio and would love to talk about a project / role…</div>
                <button className="ui-cta send" onClick={(e) => dive(e, active)}>
                  <span>Send email</span> ➤
                </button>
              </div>
            )}

            {active.icon === 'github' && (
              <div className="ui-gh">
                <div className="ui-gh-head">
                  <img src={AVATAR} alt="" className="ui-avatar" />
                  <div>
                    <b>Gnana Rajeswara Reddy</b>
                    <span>@Rajeshponnapure</span>
                  </div>
                  <button className="ui-cta gh" onClick={(e) => dive(e, active)}>Open GitHub</button>
                </div>
                <div className="ui-gh-stats">
                  <span><b>AI</b> · agents · tools</span>
                  <span><b>★</b> open source</span>
                  <span><b>Full-stack</b> · React · Node · Python</span>
                </div>
                <div className="ui-gh-repos">
                  {REPOS.map((r) => (
                    <div className="ui-repo" key={r.id}>
                      <b>{r.name.toLowerCase().replace(/\s+/g, '-')}</b>
                      <span>{r.obj}</span>
                      <em>{r.stack[0]}</em>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {active.icon === 'linkedin' && (
              <div className="ui-li">
                <div className="ui-li-cover" />
                <img src={AVATAR} alt="" className="ui-li-avatar" />
                <div className="ui-li-body">
                  <b>Gnana Rajeswara Reddy</b>
                  <span>Full-stack AI builder · Agentic systems · IoT & automation</span>
                  <small>Hyderabad, India</small>
                  <div className="ui-li-actions">
                    <button className="ui-cta li" onClick={(e) => dive(e, active)}>Open LinkedIn</button>
                    <button className="ui-ghost" onClick={(e) => dive(e, active)}>Message</button>
                  </div>
                </div>
              </div>
            )}

            {active.icon === 'instagram' && (
              <div className="ui-ig">
                <div className="ui-ig-head">
                  <img src={AVATAR} alt="" className="ui-ig-avatar" />
                  <div className="ui-ig-meta">
                    <div className="ui-ig-top">
                      <b>_rajeshponnapureddy_</b>
                      <button className="ui-cta ig" onClick={(e) => dive(e, active)}>Open Instagram</button>
                    </div>
                    <small>Story writer × systems builder. Frames from the creator side.</small>
                  </div>
                </div>
              </div>
            )}
        </motion.div>
      </div>

      <AnimatePresence>{portal && <Portal channel={portal} onDone={onPortalDone} />}</AnimatePresence>
    </section>
  );
}