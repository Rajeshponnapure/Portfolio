# Rajesh Portfolio

Interactive React portfolio built as a desktop-style experience with Framer Motion, Lenis smooth scrolling, Three.js-ready dependencies, Tailwind CSS v4, and Vite.

The project presents a full-stack AI/ML, IoT, web, mobile, and agentic-systems portfolio through animated sections: boot intro, lock-screen hero, project ticker, technology rows, journey timeline, and contact browser.

## Stack

- React 19
- TypeScript 6
- Vite 8
- Framer Motion 12
- Tailwind CSS 4
- Lenis smooth scroll
- Zustand state store
- Three.js, React Three Fiber, Drei, and postprocessing packages available for 3D expansion
- ESLint 10

## Commands

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

## Project Structure

```text
rajesh-portfolio/
  public/
    audio/                  Ambient audio asset
    portraits/              Hero and profile images
    projects/               Project visuals used by the portfolio cards
  src/
    components/
      Background.tsx        Global visual background
      Boot.tsx              Animated laptop boot intro
      Cursor.tsx            Custom cursor layer
      Dock.tsx              Bottom navigation dock
      Lock.tsx              Animated lock-screen hero
      Portal.tsx            Full-screen contact transition
      RevealText.tsx        Reusable word-by-word reveal animation
      SoundToggle.tsx       Audio control
    data/
      content.ts            Profile, navigation, channels, journey, skills
      projects.ts           Portfolio project list
    lib/
      audio.ts              Audio helpers
      smoothScroll.ts       Lenis setup and smooth section navigation
      techIcons.ts          Technology icon resolution
    sections/
      About.tsx
      Arsenal.tsx
      Connect.tsx
      Journey.tsx
      Projects.tsx
    App.tsx                 Main composition and app phase handling
    index.css               Global layout, visual system, ticker animations
    main.tsx                React entry point
```

## Experience Architecture

The portfolio is structured as a single-page operating-system flow.

1. `Boot` renders a laptop intro and controls boot progress.
2. `App` keeps the page locked while the boot intro is active.
3. `Lock` renders the first interactive hero screen.
4. Login moves the user into the desktop phase and scrolls to projects.
5. `Projects`, `Arsenal`, `Journey`, and `Connect` render the portfolio body.
6. `Dock` and section navigation use Lenis for smooth scrolling.

Global phase state is handled through `src/store.ts`. This keeps animation routing simple: boot animation, lock screen, desktop content, scroll behavior, and active section state are not scattered across unrelated components.

## Framer Motion Animation System

The application uses Framer Motion for high-value interaction states and uses CSS animation for long-running ticker movement. This split is deliberate:

- Framer Motion controls stateful UI transitions, entrances, scroll reveals, hover reactions, spring values, and presence transitions.
- CSS controls repeated marquee/ticker motion where no React state is required.
- Lenis controls scroll interpolation so scroll-linked Framer transforms feel smoother.

## Animation Map

| Area | File | Framer Motion Pattern | Purpose |
| --- | --- | --- | --- |
| Boot overlay | `src/components/Boot.tsx` | `motion.div`, `exit`, `animate`, custom cubic-bezier easing | Laptop opens, boot progress runs, screen zooms away |
| App phase transition | `src/App.tsx` | `AnimatePresence` | Allows the boot overlay to animate out when removed |
| Lock-screen hero | `src/components/Lock.tsx` | `useScroll`, `useTransform`, `useMotionValue`, `useSpring` | Parallax title, portrait drift, pointer-based 3D tilt |
| Hero name reveal | `src/components/Lock.tsx` | Per-letter `motion.span` with delayed transitions | Creates a premium letter-by-letter entrance |
| Floating portrait | `src/components/Lock.tsx` | Infinite `animate` keyframes | Adds slow ambient movement without changing layout |
| Text reveal | `src/components/RevealText.tsx` | `whileInView`, clipped word wrappers | Reusable scroll-triggered heading reveal |
| Project board | `src/sections/Projects.tsx` | `whileInView`, `useMotionValue`, `useSpring`, `whileHover` | Section reveal plus interactive 3D project cards |
| Dock | `src/components/Dock.tsx` | `motion.nav` entrance | Dock slides into place after boot |
| Arsenal facets | `src/sections/Arsenal.tsx` | `whileInView` | Small stat cards fade upward as they enter viewport |
| Journey timeline | `src/sections/Journey.tsx` | Staggered `whileInView` rows | Timeline entries move in sequence |
| Contact tabs | `src/sections/Connect.tsx` | Keyed `motion.div` | Browser page content animates when tab changes |
| Contact portal | `src/components/Portal.tsx` | `clipPath`, `scale`, `blur`, `exit` | Full-screen dive transition before opening a social link |

## Core Motion Constants

The dominant easing curve is:

```ts
const EASE = [0.23, 1, 0.32, 1] as const;
```

This is a strong ease-out curve. It starts decisively, then settles slowly. It works well for portfolio interfaces because it feels responsive without looking mechanical.

Use it for:

- Hero entrances
- Text reveals
- Overlay exits
- Screen transitions
- Large visual objects

Use spring motion for pointer-driven or drag-like interactions:

```ts
const rx = useSpring(useMotionValue(0), {
  stiffness: 160,
  damping: 16,
});
```

Spring values are better than duration-based transitions for cursor tilt because the output follows continuous pointer input and needs natural physical damping.

## Detailed Animation Explanations

### 1. Boot Laptop Intro

File: `src/components/Boot.tsx`

The boot sequence is a staged interaction:

```ts
type Stage = 'off' | 'opening' | 'booting' | 'zoom';
```

Each stage maps to a visual state:

- `off`: laptop is closed and the power button is visible.
- `opening`: screen lid rotates open using `rotateX`.
- `booting`: progress bar and boot log advance on an interval.
- `zoom`: laptop scales forward and fades before the app enters lock mode.

The screen lid uses:

```tsx
<motion.div
  initial={{ rotateX: -88 }}
  animate={{ rotateX: lidOpen ? 0 : -88 }}
  transition={{ duration: 1.1, ease: EASE }}
/>
```

Why this works:

- `rotateX: -88` makes the laptop appear physically closed.
- `rotateX: 0` opens the screen into a readable front plane.
- The easing curve makes the open motion feel deliberate instead of linear.
- `onAnimationComplete` moves the sequence forward only after the lid animation finishes.

The full boot overlay exits through `AnimatePresence` in `App.tsx`, so the overlay does not disappear abruptly when phase state changes.

### 2. Lock-Screen Scroll Parallax

File: `src/components/Lock.tsx`

The lock screen uses scroll-linked transforms:

```ts
const { scrollY } = useScroll();
const titleY = useTransform(scrollY, [0, 560], [0, -95]);
const figureY = useTransform(scrollY, [0, 560], [0, 70]);
const fade = useTransform(scrollY, [0, 520], [1, 0]);
```

This maps the top 560 pixels of scroll movement into visual changes:

- The title moves upward.
- The portrait moves downward.
- Both fade out as the user leaves the hero.

This creates depth because foreground and text layers move in different directions. The transform values are applied directly to motion styles, so React does not re-render on every scroll tick.

### 3. Pointer-Based 3D Tilt

Files:

- `src/components/Lock.tsx`
- `src/sections/Projects.tsx`

The hero and project cards use motion values for 3D tilt:

```ts
const rx = useSpring(useMotionValue(0), { stiffness: 120, damping: 14 });
const ry = useSpring(useMotionValue(0), { stiffness: 120, damping: 14 });
```

Pointer movement calculates distance from the center and converts it into rotation:

```ts
ry.set(((e.clientX - cx) / cx) * 10);
rx.set((-(e.clientY - cy) / cy) * 7);
```

Why this is the correct pattern:

- `useMotionValue` updates outside React render cycles.
- `useSpring` smooths abrupt pointer changes.
- `transformPerspective` gives depth.
- Keeping rotation values small prevents motion sickness and visual distortion.

Project cards use the same principle but calculate the cursor position relative to each card. This makes every card respond independently.

### 4. Letter-by-Letter Hero Name Reveal

File: `src/components/Lock.tsx`

The display name is split by word and character. Each character gets an incremental delay:

```ts
const delay = 0.25 + gi * 0.028;
```

Each letter starts lower, transparent, and rotated:

```tsx
initial={{ opacity: 0, y: 44, rotateX: -70 }}
animate={{ opacity: 1, y: 0, rotateX: 0 }}
transition={{ delay, duration: 0.65, ease: EASE }}
```

This creates a cinematic reveal without needing a separate animation timeline library. The global character counter keeps the reveal continuous across words instead of restarting the delay for each word.

### 5. Word Reveal Component

File: `src/components/RevealText.tsx`

`RevealText` splits a heading into words and animates each word from below a clipped wrapper:

```tsx
initial={{ y: '115%', opacity: 0 }}
whileInView={{ y: 0, opacity: 1 }}
viewport={{ once: true, margin: '-8%' }}
transition={{ delay: i * 0.06, duration: 0.62, ease: [0.23, 1, 0.32, 1] }}
```

Why this is effective:

- The parent wrapper clips the word, so the word appears to slide out of a hidden baseline.
- `whileInView` avoids running all heading animations on initial page load.
- `once: true` prevents repeated animation noise while scrolling back and forth.
- A small per-word delay creates rhythm without making users wait.

Use this component for section headings where the text should feel intentional and editorial.

### 6. Project Card Tilt and Hover Lift

File: `src/sections/Projects.tsx`

Each project card combines a hover lift with pointer-based rotation:

```tsx
<motion.article
  whileHover={{ y: -10 }}
  style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
/>
```

On mouse move:

```ts
const px = (e.clientX - rect.left) / rect.width - 0.5;
const py = (e.clientY - rect.top) / rect.height - 0.5;
ry.set(px * 11);
rx.set(-py * 11);
```

The card also writes CSS variables:

```ts
e.currentTarget.style.setProperty('--card-x', `${e.clientX - rect.left}px`);
e.currentTarget.style.setProperty('--card-y', `${e.clientY - rect.top}px`);
```

Those values can drive hover lighting in CSS. This gives the card both physical motion and a cursor-reactive visual highlight.

### 7. Project Board Reveal

File: `src/sections/Projects.tsx`

The whole board enters with a shallow 3D rotation:

```tsx
initial={{ rotateX: 36, opacity: 0 }}
whileInView={{ rotateX: 0, opacity: 1 }}
viewport={{ once: true, margin: '-12%' }}
transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
style={{ transformPerspective: 1300 }}
```

This is better than a plain fade because the content appears to unfold into place. It matches the operating-system and spatial interface direction of the portfolio.

### 8. Dock Entrance and Proximity Magnification

File: `src/components/Dock.tsx`

Framer Motion handles the dock entrance:

```tsx
initial={{ y: 100, opacity: 0 }}
animate={{ y: 0, opacity: 1 }}
transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
```

The magnification itself is handled through CSS variables, not Framer Motion:

```ts
const scale = Math.max(1, 1.55 - dist / 150);
btn.style.setProperty('--mag', scale.toFixed(3));
```

This is a practical split. The dock entrance is a one-time state transition, so Framer Motion is appropriate. Proximity scaling updates many buttons on every mouse move, so direct CSS variables keep it lightweight.

### 9. Contact Browser Tab Motion

File: `src/sections/Connect.tsx`

Each browser page is keyed by the active tab:

```tsx
<motion.div
  className="b-page"
  key={tab}
  initial={{ opacity: 0, y: 14 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.35 }}
/>
```

Changing the key forces React to remount the page content, which reruns the entrance animation. This makes Gmail, GitHub, LinkedIn, and Instagram tabs feel like distinct pages inside the same browser shell.

### 10. Contact Portal Transition

File: `src/components/Portal.tsx`

The portal uses animated `clipPath`:

```tsx
initial={{ clipPath: 'circle(0% at 50% 55%)' }}
animate={{ clipPath: 'circle(150% at 50% 50%)' }}
exit={{ opacity: 0 }}
transition={{ duration: 0.62, ease: [0.7, 0, 0.3, 1] }}
```

The center icon scales and unblurs:

```tsx
initial={{ scale: 0.3, opacity: 0, filter: 'blur(10px)' }}
animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
transition={{ delay: 0.18, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
```

This creates a full-screen transition before navigating to the selected social link. It avoids an abrupt page exit and gives the contact section a memorable interaction.

## Best Framer Motion Practices Used

### Use `AnimatePresence` for removed elements

When a component should animate out before unmounting, wrap it in `AnimatePresence`.

Current usage:

```tsx
<AnimatePresence>
  {phase === 'boot' && <Boot key="boot" />}
</AnimatePresence>
```

Without `AnimatePresence`, the boot overlay would be removed immediately and its `exit` animation would never run.

### Use motion values for continuous input

For pointer, scroll, and other continuous input, use `useMotionValue`, `useSpring`, `useScroll`, and `useTransform`.

Correct use:

```ts
const x = useSpring(useMotionValue(0), {
  stiffness: 160,
  damping: 16,
});
```

Avoid putting cursor position in React state for animation. State updates cause unnecessary renders and make high-frequency motion less smooth.

### Use `whileInView` for scroll-triggered reveals

Section-level content uses:

```tsx
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, margin: '-12%' }}
```

This delays animation until the user reaches the content and prevents repeated distractions after the first reveal.

### Keep transforms GPU-friendly

The project primarily animates:

- `opacity`
- `x`
- `y`
- `scale`
- `rotateX`
- `rotateY`
- `clipPath` for one full-screen transition
- `filter` in short overlay moments

For high-frequency animation, prefer transform and opacity. Avoid animating layout properties such as width, height, margin, top, and left unless the layout change is necessary.

### Use CSS for infinite marquee movement

The project ticker and technology rows are better handled in CSS because they repeat forever and do not depend on React state. Framer Motion is reserved for interaction-specific animation.

This improves performance and keeps animation responsibilities clear.

## Recommended Framer Motion Extensions

These patterns match the current architecture and can be added without changing the project structure.

### Staggered Container Reveal

Use this when a group of cards should enter as a coordinated set.

```tsx
import * as React from 'react';
import { motion } from 'framer-motion';

const list = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.23, 1, 0.32, 1] },
  },
};

export function StaggeredGrid({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={list} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-10%' }}>
      {React.Children.map(children, (child, index) => (
        <motion.div variants={item} key={index}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
```

Best use in this project:

- About cards
- Journey groups
- Contact browser details
- Technology facets

### Shared Layout Indicator

Use this when tabs, chips, or navigation states need a fluid active indicator.

```tsx
import { motion } from 'framer-motion';

export function AnimatedTabs({
  items,
  active,
  onChange,
}: {
  items: string[];
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="tabs">
      {items.map((item) => (
        <button className="tab" key={item} onClick={() => onChange(item)}>
          {active === item && <motion.span className="tab-indicator" layoutId="active-tab" />}
          <span>{item}</span>
        </button>
      ))}
    </div>
  );
}
```

Best use in this project:

- Project category chips
- Contact browser tabs
- Dock active section indicator

`layoutId` lets Framer Motion animate one indicator between different elements instead of destroying and recreating it.

### Reduced Motion Guard

Use this if the portfolio needs accessibility support for users who prefer less motion.

```tsx
import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

export function AccessibleReveal({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

Best use in this project:

- Boot sequence fallback
- Hero floating portrait
- Project card hover tilt
- Infinite ticker sections
- Portal transition

### Scroll Progress Transform

Use this when a section needs a progress-based visual.

```tsx
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function SectionProgress() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={ref}>
      <motion.div className="section-progress" style={{ scaleX }} />
    </section>
  );
}
```

Best use in this project:

- Journey timeline progress
- Project board progress rail
- Arsenal technology universe progress

## Animation Quality Rules

Use these rules when adding new Framer Motion work:

1. Use one main animation idea per component.
2. Keep entrance duration between `0.35s` and `0.9s`.
3. Use spring motion for pointer-driven interaction.
4. Use cubic-bezier easing for deterministic entrances and exits.
5. Use `whileInView` for below-the-fold content.
6. Use `AnimatePresence` for components that leave the DOM.
7. Keep hover translation under `12px`.
8. Keep 3D rotation under `12deg`.
9. Avoid animating layout properties during scroll.
10. Add `viewport={{ once: true }}` unless repeated animation is intentional.

## Development Notes

- Edit project content in `src/data/projects.ts`.
- Edit profile, social links, journey, dock, categories, and skills in `src/data/content.ts`.
- Add project screenshots or generated visuals to `public/projects/`.
- Add portrait images to `public/portraits/`.
- Keep reusable motion components in `src/components/`.
- Keep page sections in `src/sections/`.

## Build Verification

Run:

```bash
npm run build
```

Expected result:

```text
tsc -b && vite build
```

The build must pass before deployment because TypeScript validates component props, data shape, imports, and Vite production bundling.
