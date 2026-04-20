# Julian Giraldo - Portfolio

Welcome to Julian Giraldo's professional portfolio website built with Next.js 16.

## Features

- ⚡️ Built with Next.js 16.2.4 (with Turbopack)
- 🎨 Styled with Tailwind CSS v4
- 📊 **Vercel Speed Insights** integrated for performance monitoring
- 🔍 TypeScript for type safety
- ✨ Modern React 19 features

## Vercel Speed Insights

This project includes Vercel Speed Insights to monitor Core Web Vitals and performance metrics. The SpeedInsights component is integrated in the root layout (`app/layout.tsx`) and will automatically track:

- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)
- First Contentful Paint (FCP)
- Time to First Byte (TTFB)
- Interaction to Next Paint (INP)

To view the metrics:
1. Deploy to Vercel
2. Enable Speed Insights in your Vercel project dashboard
3. Visit the Speed Insights tab after your site receives traffic

## Getting Started

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Tech Stack

- **Framework:** Next.js 16.2.4
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4
- **Analytics:** Vercel Speed Insights
- **Runtime:** React 19.2.4

## Deployment

This project is optimized for deployment on [Vercel](https://vercel.com):

```bash
vercel deploy
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Speed Insights Documentation](https://vercel.com/docs/speed-insights)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
