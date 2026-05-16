---
inclusion: fileMatch
fileMatchPattern: ['**/*.tsx', '**/*.ts', '**/*.jsx', '**/*.js', '**/*.css', '**/*.html', '**/*.svelte', '**/*.vue', 'apps/**', 'packages/**', 'site/**', 'web/**']
---

# Animated Website Playbook

How I build animated marketing/portfolio/product sites that feel premium without feeling overdesigned. This is opinionated; deviation requires a reason.

---

## Default stack

Pick a row based on the goal. Don't mix unless there's a real reason.

| Goal | Framework | Styling | Animation | 3D |
|---|---|---|---|---|
| Marketing site, SEO-critical | **Next.js (App Router)** + RSC | Tailwind v4 | Framer Motion + GSAP | React Three Fiber + drei (only if needed) |
| Portfolio / one-pager | **Astro** + islands | Tailwind v4 | GSAP + ScrollTrigger | Three.js direct |
| Web app with marketing surface | Next.js | Tailwind | Motion (framer-motion v11+) | React Three Fiber |
| Quick prototype / demo | Vite + React | Tailwind | Framer Motion | — |

Locked-in choices by default:
- **TypeScript strict** — no `any`.
- **pnpm** — fastest, deterministic, disk-efficient.
- **ESLint flat config + Prettier** — auto-format on save.
- **Lighthouse target: 95+ across all categories** before ship.

---

## Animation principles (non-negotiable)

### 1. Animation has a job
Every animation answers one of:
- **Orient** — show where I am (page transitions, route changes).
- **Confirm** — feedback for an action (button press, form submit).
- **Reveal** — bring meaning into view (scroll reveals, hover details).
- **Delight** — branded character moment (hero, logo).

If an animation does none of these, cut it.

### 2. Physics over duration
Use spring physics (`framer-motion`'s `type: "spring"` or `motion`'s `useSpring`) for anything interactive. Reserve `duration + ease` for orchestrated reveals.

Defaults that feel right:
- **UI feedback** — `{ stiffness: 400, damping: 30 }` (snappy)
- **Card / panel** — `{ stiffness: 200, damping: 25 }`
- **Hero reveal** — `{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }` (custom cubic-bezier; "expo-out")

### 3. Respect motion preferences
Always:
```tsx
const prefersReducedMotion = useReducedMotion();
const animate = prefersReducedMotion ? {} : { y: 0, opacity: 1 };
```
And in CSS:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 4. 60fps or it didn't happen
- Animate `transform` and `opacity` only. Avoid `top/left/width/height/box-shadow`.
- Use `will-change` sparingly — only on the animating element, removed when idle.
- Profile with DevTools → Performance. If FPS drops below 55 on a mid-tier laptop, cut.

### 5. Stagger, don't dump
When revealing multiple items, stagger by 40–80ms. Simultaneous reveals look amateur.

### 6. Anchor scroll-driven animation to the user's scroll
Use `useScroll` + `useTransform` (Framer Motion) or `ScrollTrigger` (GSAP). Don't autoplay scroll-driven sequences.

---

## The "feels cheap" checklist (avoid all)

- Bounce easing on everything (overshoot fatigue).
- Same fade-up on every section (predictable = boring).
- 1.5-second hero animation that runs every page load.
- Parallax that doesn't lock to scroll velocity.
- Loading spinners on a marketing site (use skeletons or just preload).
- Cursor-following blobs that don't add meaning.
- 3D scenes for the sake of "we have 3D."
- Auto-playing video with sound.
- Scroll-jacking that fights the user's scroll wheel.
- Animations that block readability on first paint.

---

## Performance budget (per page)

| Metric | Budget |
|---|---|
| LCP | < 2.5s on mobile 4G |
| INP | < 200ms |
| CLS | < 0.05 |
| First-load JS (Next.js) | < 170 KB gzipped |
| Total page weight (above the fold) | < 500 KB |
| Largest image | WebP/AVIF, < 200 KB, responsive `<picture>` |
| Fonts | 1-2 families max, `font-display: swap`, subset, preloaded |

Verified per build with Lighthouse CI. Drops below threshold = the build doesn't ship.

---

## Accessibility (built-in, not bolted on)

- All animations respect `prefers-reduced-motion`.
- Focus states visible — never `outline: none` without a replacement.
- Color contrast 4.5:1 minimum (3:1 for ≥18pt). Verified with `@axe-core/react` in dev.
- Keyboard navigation works for every interactive element. Tab order is intentional.
- All images have `alt`. Decorative ones get `alt=""`.
- Animated copy is not the only delivery of meaning.
- ARIA labels on icon-only buttons.

---

## File / folder structure (Next.js App Router default)

```
app/
  (marketing)/
    page.tsx             # home
    layout.tsx
    sections/            # one file per section, each composable
      hero.tsx
      features.tsx
      testimonials.tsx
      cta.tsx
  api/
components/
  ui/                    # primitives (Button, Card)
  motion/                # animation wrappers (FadeIn, Reveal, Stagger)
  three/                 # 3D scene components
lib/
  motion-presets.ts      # the spring configs above, reused
  cn.ts                  # tailwind-merge + clsx
hooks/
  use-mouse.ts
  use-scroll-progress.ts
public/
  fonts/
  images/
styles/
  globals.css
```

Sections > 200 lines get split. No section file does data fetching *and* layout *and* animation orchestration — split those.

---

## What I deliver

When asked to "build the site":

1. Brainstorm: brand, audience, sections, success metric. (Flow A from the planning charter.)
2. Spec doc with sitemap + section purpose + content tone.
3. Plan with file map + per-section tasks, TDD where it makes sense (logic, not visuals).
4. Scaffold with the chosen stack.
5. Build section-by-section, committing each. Lighthouse-check at every commit.
6. Deploy preview (Vercel/Netlify). Share URL.
7. Iterate on user feedback.

I do not build the whole site in one shot. I do not skip the spec. I do not animate before content is in place.
