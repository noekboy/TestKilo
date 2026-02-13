# Active Context: 't WEB OfferteMaker

## Current State

**Application Status**: 🔄 In Development - Page 1 Layout Updated

The application is a PDF quote generator for 't WEB account managers. Users fill in a form with variable data, and a standardized PDF quote is generated with fixed text and branding.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] jsPDF library for PDF generation
- [x] QuoteForm component with all required input fields
- [x] PDF generation with 4-page layout matching template
- [x] 't WEB branding (blue #005293, gray, white)
- [x] Dutch language interface
- [x] Page 1 cover page layout redesign with blue curve, logo, beige banner
- [x] Form fields grouped by PDF page (Pagina 1-4 sections)

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Main page with form | ✅ Complete |
| `src/app/layout.tsx` | Root layout | ✅ Complete |
| `src/app/globals.css` | Global styles with 't WEB branding | ✅ Complete |
| `src/components/quote-form.tsx` | Form component with page-grouped fields | ✅ Updated |
| `src/lib/generate-pdf.ts` | PDF generation logic with new Page 1 layout | ✅ Updated |

## Features

### Form Fields (Input) - Grouped by PDF Page
**Pagina 1 - Voorblad:**
- Offertenummer (quote number)
- Klantnaam (client name)
- Contactpersoon volledig (full contact name)

**Pagina 2 - Introductie & Onderwerpen:**
- Aanhef (salutation/first name)
- Sector/Leerlijn (dropdown with 8 sectors)
- Uurtarief Maatwerk (hourly rate)

**Pagina 3 - Investering & Voorwaarden:**
- Totaalprijs Maatwerk (total price)
- Prijs per Deelnemer (price per participant)

**Pagina 4 - Afsluiting & Handtekening:**
- Naam Accountmanager (account manager name)

### PDF Output (4 Pages)
1. **Cover Page**: Blue decorative curve (top right), 't web logo with slogan, beige banner with "Maatwerk e-learning | Offerte {nummer}", recipient address block
2. **Introduction & Topics**: Personalized greeting, discussed topics
3. **Investment & Conditions**: Pricing table, terms and conditions
4. **Closing & Signature**: Closing text, signature blocks

### Page 1 Design Elements
- Blue decorative curve (top right corner) - FIXED
- Logo: "'t web" with icon - FIXED
- Slogan: "Jouw partner voor veiligheid, compliancy en borging" - FIXED
- Beige banner with "Maatwerk e-learning" - FIXED
- Quote number in banner - VARIABLE
- Recipient name and "T.a.v. {contact}" - VARIABLE
- Footer with company contact info - FIXED

## Technology Stack

| Technology | Purpose |
|------------|---------|
| Next.js 16 | React framework with App Router |
| React 19 | UI library |
| TypeScript | Type safety |
| Tailwind CSS 4 | Styling |
| jsPDF | PDF generation |
| Bun | Package manager |

## Brand Colors

- **Primary Blue**: #005293
- **Dark Gray**: #333333
- **Light Gray**: #808080
- **White**: #FFFFFF
- **Beige**: #F5F2EB (banner background)

## Session History

| Date | Changes |
|------|---------|
| 2026-02-13 | Redesigned Page 1 cover page layout with blue curve, logo, beige banner; grouped form fields by PDF page |
| 2026-02-12 | Built complete OfferteMaker MVP with PDF generation |
| Initial | Template created with base setup |
