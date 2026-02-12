# Active Context: 't WEB OfferteMaker

## Current State

**Application Status**: ✅ MVP Complete

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

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Main page with form | ✅ Complete |
| `src/app/layout.tsx` | Root layout | ✅ Complete |
| `src/app/globals.css` | Global styles with 't WEB branding | ✅ Complete |
| `src/components/quote-form.tsx` | Form component with validation | ✅ Complete |
| `src/lib/generate-pdf.ts` | PDF generation logic | ✅ Complete |

## Features

### Form Fields (Input)
- Offertenummer (quote number)
- Datum (date)
- Klantnaam (client name)
- Contactpersoon volledig (full contact name)
- Aanhef (salutation/first name)
- Sector/Leerlijn (dropdown with 8 sectors)
- Uurtarief Maatwerk (hourly rate)
- Totaalprijs Maatwerk (total price)
- Prijs per Deelnemer (price per participant)
- Naam Accountmanager (account manager name)

### PDF Output (4 Pages)
1. **Cover Page**: Logo, title, quote details
2. **Introduction & Topics**: Personalized greeting, discussed topics
3. **Investment & Conditions**: Pricing table, terms and conditions
4. **Closing & Signature**: Closing text, signature blocks

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

## Session History

| Date | Changes |
|------|---------|
| 2026-02-12 | Built complete OfferteMaker MVP with PDF generation |
| Initial | Template created with base setup |
