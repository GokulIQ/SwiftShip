# SwiftShip Courier & Parcel Booking Service

Static HTML5, CSS3, Bootstrap 5, and ES6+ front-end for a local courier and parcel booking service.

## Pages

- Public: home, about, services, service details, pricing, coverage, blog, blog details, contact, and 404.
- Customer dashboard: login, register, dashboard home, book pickup, track parcel, shipment history.
- Admin panel: `admin/index.html` with operations overview, booking management, shipment dispatch, customers, drivers, invoices, support, services/pricing, coverage zones, content, reports, roles, settings, and audit log.

## Features

- CSS variable theme with dark/light toggle.
- RTL support through `assets/css/rtl.css`.
- Form validation for public and dashboard forms.
- Dashboard skeleton loaders, booking wizard, working tracking search, tracking timeline, invoice modal, and history filters.
- SEO meta tags on public pages, JSON-LD on the home page, and noindex on dashboard pages.
- Static integration placeholders for Formspree, Mailchimp, Google Maps, Stripe, and PayPal.

Open `pages/index.html` to begin.

## Recent Updates
The following UI/UX fixes and enhancements were recently implemented based on testing results:
- **Global Styling:** Improved typography with bold headings (font-weight 600) and standard body text. Center-aligned all hero content globally.
- **Authentication Pages:** Removed the global header and showcase columns from login and register pages. Centered the login form and integrated Google and Apple social sign-in options.
- **Dark Mode Enhancements:** Enhanced dark mode contrast by adding borders to the header and footer, fixing form input visibility with lighter borders, and correcting invisible text in sidebar/mobile navigation.
- **Page Specific Fixes:** 
  - Adjusted team image cropping (`object-position`) on the About page.
  - Added two new service containers (International, Express Direct) to balance the Services layout.
  - Centered the pricing table heading on the Pricing page.
  - Removed the sidebar heading in the Blog page for a cleaner look.
- **Navigation:** Replaced the RTL toggle icon with `fa-align-right`. Dashboard navigation link remains fully integrated, and dead "Home 2" links were removed.
