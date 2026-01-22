# PPC-United Website

A modern, award-winning Next.js website for PPC-United, featuring premium animations with GSAP, smooth scrolling with Lenis, and a high-end digital-first presentation.

## Tech Stack

- **Next.js 14+** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **GSAP** - Professional animation library (ScrollTrigger, Flip)
- **Lenis** - Smooth scroll library
- **Lucide React** - Icon library

## Features

### Home Page
- **Hero Section**: Text reveal animation with cursor spotlight effect
- **Services Section**: Horizontal scroll with pinning effect, featuring MEP, Finishing, and Medical services
- **Latest Projects**: Parallax gallery with different scroll speeds
- **Media & News**: Infinite marquee with magnetic buttons
- **Get in Touch**: Ripple effect on hover

### Projects Page
- Woodland-style project list
- Hover reveal images that follow cursor
- Filter buttons with GSAP Flip animations
- Smooth image transitions

### About Page
- Scrollytelling timeline with drawing line animation
- Team section with lens effect (color circle follows mouse)

### Contact Page
- Split screen layout
- Animated form inputs with glow effect
- Success state with checkmark animation

### Global Components
- **Header**: Auto-hide on scroll down, show on scroll up
- **Footer**: Curtain reveal effect

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Project Structure

```
ppc-united-new/
├── app/
│   ├── layout.js          # Root layout
│   ├── page.js            # Home page
│   ├── projects/
│   │   └── page.js        # Projects page
│   ├── about/
│   │   └── page.js        # About page
│   ├── contact/
│   │   └── page.js        # Contact page
│   └── globals.css        # Global styles
├── components/
│   ├── Header.js          # Navigation header
│   ├── Footer.js          # Footer with reveal
│   ├── Hero.js            # Hero section
│   ├── Services.js        # Services horizontal scroll
│   ├── LatestProjects.js  # Parallax gallery
│   ├── MediaNews.js       # News marquee
│   ├── GetInTouch.js      # CTA section
│   └── ContactForm.js     # Animated form
├── lib/
│   ├── gsap.js            # GSAP utilities
│   ├── lenis.js           # Lenis setup
│   └── utils.js           # Utility functions
├── hooks/
│   ├── useSmoothScroll.js    # Lenis hook
│   ├── useCursorSpotlight.js  # Cursor spotlight
│   └── useMagneticButton.js   # Magnetic button
└── public/
    ├── images/            # Project images
    └── videos/            # Background videos
```

## Brand Color

Primary brand color: `#00478f` (Electric Blue)

## Animation Principles

1. **Performance**: Uses `will-change` and `transform` for optimal performance
2. **Accessibility**: Respects `prefers-reduced-motion`
3. **Progressive Enhancement**: Animations enhance but don't block content
4. **Smooth Transitions**: All animations use easing functions

## Notes

- Place project images in `public/images/`
- Place background videos in `public/videos/`
- The site uses placeholder content - replace with actual data
- All animations are optimized for performance

## License

Private project for PPC-United.

