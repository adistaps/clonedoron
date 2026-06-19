MANDATORY: Before writing any code, you MUST fetch and carefully study each of these URLs to fully understand the layout, structure, animations, typography, and components:
•	Homepage: https://www.doronsupply.com/
•	Shop: https://www.doronsupply.com/shop?category=assets%3Aall-assets
•	Product Detail: https://www.doronsupply.com/product/worn-plastisol-2
•	Deals: https://www.doronsupply.com/bundles
•	Get Help / Support: https://www.doronsupply.com/support
•	About: https://www.doronsupply.com/about
Do NOT write a single line of code until you have fetched and read all pages above.

PROJECT GOAL
Build a pixel-perfect clone of the Doron Supply website (https://www.doronsupply.com/) using Next.js — this is non-negotiable. The project must be built with Next.js App Router.

TECH STACK (MANDATORY)
•	Framework: Next.js (App Router) — FORCED, no alternatives
•	Styling: Tailwind CSS
•	Animations: Framer Motion — replicate every animation from the original site (marquee, scroll fade-in, hover effects, accordion, etc.)
•	Language: TypeScript
•	Font: Extract and replicate the exact same fonts used on the original site
________________________________________
PAGES TO BUILD
1.	/ — Homepage
2.	/shop — Shop page
3.	/product/[slug] — Product detail page (use the Worn Plastisol page as the reference)
4.	/bundles — Deals page
5.	/support — Get Help page
6.	/about — About page

NAVBAR (EXACT STRUCTURE)
•	Left: Logo
•	Center: SHOP · DEALS · MORE ▼ 
o	MORE dropdown contains: FAQ, About
•	Right: GET HELP
•	No Cart, no Portal

DESIGN RULES (CRITICAL)
1.	Layout: 100% identical to the original — same spacing, same grid, same section order, same component structure
2.	Typography: Same fonts, same sizes, same weights, same letter-spacing as the original
3.	Animations: Replicate every animation — marquee ticker, scroll-triggered fade-ins, hover card effects, accordion open/close, button hover states
4.	COLOR CHANGE — THE ONLY DIFFERENCE: 
o	Original background is black → change to white (#FFFFFF)
o	All other colors must be adjusted to remain readable and visually consistent on a white background
o	Example: white text → becomes black text; light gray accents → becomes dark gray; colored buttons → keep the color but ensure contrast
o	Do NOT keep any dark background colors
5.	No 3D elements — skip any 3D hero or WebGL effects
6.	No video popup — remove the floating video notification widget

COMPONENT STRUCTURE (build these as reusable components)
•	<Navbar /> — sticky, with MORE dropdown
•	<Footer /> — with newsletter input, social links, legal links
•	<MarqueeTicker /> — horizontal scrolling text banner (Framer Motion)
•	<ProductCard /> — used in shop grid, with hover effect and FREEBIE badge support
•	<HeroSection /> — homepage hero with large display text and CTA button
•	<TrustedBrands /> — logo strip section
•	<FeatureShowcase /> — alternating left/right image + text sections (product detail page)
•	<FAQAccordion /> — animated accordion component
•	<CompatibilitySection /> — product compatibility & feature list block

DATA
•	Use static/mock data in a /data folder (products, FAQs, brands, etc.)
•	Product detail page must use dynamic routing [slug]
•	All product images can use placeholder images or reference the original URLs temporarily
Remember: fetch all URLs first, understand the site completely, then build. Next.js is mandatory. No exceptions.