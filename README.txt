==================================================================
PATCHES ZONE — Custom Patch Manufacturing Website
==================================================================

WHAT'S INCLUDED
----------------
A complete, production-ready static website: 20 HTML pages, 4 CSS
files, 4 JavaScript files, brand/logo/favicon assets, robots.txt and
sitemap.xml. No build step, no server-side dependencies, no database —
upload the PatchesZone/ folder as-is to any static host, IIS site, or
Apache/Nginx server and it works.

FOLDER STRUCTURE
----------------
PatchesZone/
  index.html                     Home page
  calculator.html                Live price calculator
  products.html                  Full product catalog
  embroidery-patches.html        Category page
  pvc-patches.html                Category page
  chenille-patches.html          Category page
  leather-patches.html           Category page
  woven-patches.html             Category page
  gallery.html                   Filterable gallery + lightbox
  about.html                     Company story, timeline, team
  blog.html + blog-*.html        Blog listing + 4 full articles
  faq.html                       Categorized FAQ (with schema.org markup)
  contact.html                   Contact form + map + info
  privacy.html / terms.html      Legal pages
  404.html                       Custom not-found page
  css/style.css                  Core design system (colors, layout, components)
  css/responsive.css             Breakpoint overrides (desktop/laptop/tablet/mobile)
  css/animations.css             Entrance animations, parallax, hover states
  css/calculator.css             Calculator-specific UI only (no pricing logic)
  js/app.js                      Header, mobile drawer, dark mode, cursor, back-to-top,
                                  FAQ accordion, gallery filter + lightbox
  js/animation.js                Scroll-reveal, count-up stats, parallax
  js/calculator.js               PRICE CALCULATOR LOGIC (see note below)
  js/validation.js               Contact / newsletter / quote form validation
  images/                        Logo (SVG), favicon (SVG/ICO/PNG), OG share image
  icons/ fonts/ assets/ uploads/ See README.txt inside each folder
  robots.txt / sitemap.xml       SEO crawl files (update the domain before going live)

IMPORTANT — CALCULATOR PRICING LOGIC
-------------------------------------
The math inside js/calculator.js (the qtyFactor() tiers and the calculate()
function: base price × size factor × quantity factor × backing multiplier,
plus the $50 flat shipping fee waived at 200+ pieces) is ported EXACTLY from
the client-supplied calculator. Only the surrounding HTML/CSS was redesigned.
Do not change these formulas without re-confirming pricing with the business
owner. Everything else added around it — Border/Edge style, color swatches,
special instructions, file upload, and the "Request Quote" summary modal —
is presentational/informational only and does not affect the price shown.

BEFORE GOING LIVE — REPLACE PLACEHOLDER INFO
---------------------------------------------
Search every HTML file for these placeholder values and replace with your
real details:
  - Phone:    +1 (312) 555-0187
  - Email:    orders@patcheszone.com
  - Address:  228 Garment District Ave, Suite 410, Chicago, IL 60607, USA
  - WhatsApp: 13125550187 (used in wa.me links)
  - Domain:   https://www.patcheszone.com (used in canonical/OG tags,
              schema.org JSON-LD, robots.txt and sitemap.xml)
  - Google Map embed URL in index.html and contact.html
  - Social links (Facebook/Instagram/Pinterest/LinkedIn)

FORMS ARE FRONT-END ONLY
-------------------------
This is a static build. The contact form, newsletter form and calculator's
"Request Quote" form all validate client-side (js/validation.js) and show a
simulated success message, but do not currently send data anywhere. To
receive real submissions, connect each <form> to a backend endpoint (PHP
mail script, Node/Express route, Formspree, Netlify Forms, etc.) or add a
`fetch()` call inside js/validation.js's submit handler.

TECHNOLOGY USED
----------------
HTML5, CSS3, vanilla JavaScript (no jQuery), Bootstrap-free custom grid,
Font Awesome 6 (CDN), AOS 2.3.1 scroll-animation library (CDN), Google
Fonts — Poppins & Manrope (CDN). No build tools, bundlers or frameworks
required.

BROWSER SUPPORT
-----------------
Latest two versions of Chrome, Firefox, Safari and Edge, and current
mobile Safari/Chrome. Uses CSS custom properties, backdrop-filter and
IntersectionObserver — all standard in modern browsers.

DEPLOYING TO IIS OR ANY HOST
------------------------------
Upload/copy the entire contents of the PatchesZone/ folder to your site's
web root (e.g. C:\inetpub\wwwroot\ for IIS) and set index.html as the
default document. No server modules, app pools settings, or rewrite rules
are required for the site to function. If you want clean URLs (no .html),
add standard URL Rewrite rules in IIS or your host's equivalent.

SUPPORT
--------
This project was generated as a complete custom build. For structural
changes (new pages, new sections), duplicate the pattern of an existing
page and update the navigation menu (repeated inside each page's <header>)
and footer accordingly.
