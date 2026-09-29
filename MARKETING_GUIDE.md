# Digital Marketing Guide for Veda Scholars

This document serves as a handbook for the marketing team to manage analytics, tracking, and campaign optimization.

## 1. Analytics & Tracking Infrastructure

### Google Analytics 4 (GA4) & Google Tag Manager (GTM)
We have prepared the codebase for easy integration.

**Setup Instructions:**
1.  **GTM Container**: Create a GTM container.
2.  **Integration**: Open `src/components/marketing/Analytics.tsx`.
3.  **Insert ID**: Replace `GTM-XXXXXX` with your actual GTM Container ID.
4.  **GA4**: Set up GA4 configuration tag *inside* GTM. Do not hardcode GA4 scripts directly if using GTM.

### Facebook/Meta Pixel
- Add the Pixel base code within the `Analytics.tsx` component (inside `<Script>` tags) or preferably via GTM.

## 2. Conversion Tracking (Event Tagging)

We have added stable `id` attributes to critical conversion elements. Use these IDs to set up **Triggers** in GTM.

| Element | ID Attribute | Trigger Type | Goal |
| :--- | :--- | :--- | :--- |
| **Nav "Get Started"** | `#btn-nav-cta` | Click | Lead Intent |
| **Mobile Nav "Get Started"** | `#btn-mobile-nav-cta` | Click | Lead Intent |
| **Contact Form Submit** | `#form-consultation-submit` | Form Submission | **Primary Lead** |
| **Universities "Partner"** | `#btn-partner-hero` | Click | B2B Lead |

## 3. SEO Checklist (Content Team)

- **Blog Strategy**: Create a `/blog` section (future dev) targeting "Study in UK requirements", "Scholarships for Indian students".
- **Meta Tags**: Ensure every new page has unique `metrics` export (Title/Description).
- **Alt Text**: All images must have descriptive `alt` tags (already implemented in code).

## 4. Page Speed Optimization (Core Web Vitals)

Marketing tools often slow down sites. Follow these rules:
- **Lazy Loading**: Next.js `<Image>` handles this by default. Do not simply use `<img>`.
- **Script Loading**: Use `next/script` with `strategy="afterInteractive"` for non-critical scripts (chatbots, pixels).

## 5. Landing Page Best Practices

When running Ads (Google/Meta), send traffic to specific pages, not just Home.
- **Students**: `/students` (Focus on clarity & guidance)
- **Partners**: `/universities` (Focus on ROI & quality)

*Start tracking early to build audience lists for retargeting.*
