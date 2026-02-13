import { jsPDF } from "jspdf";
import { QuoteFormData } from "@/components/quote-form";

// 't WEB brand colors
const COLORS = {
  blue: [0, 82, 147] as [number, number, number], // 't WEB blue
  darkGray: [51, 51, 51] as [number, number, number],
  lightGray: [128, 128, 128] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
};

// Footer text
const FOOTER_TEXT = "'t Web Opleidingen en Adviezen | www.tweb.nl | Tel.: +31 (0) 528 280 888 | Zeppelinstraat 7 | 7903 BR Hoogeveen";

export async function generatePDF(data: QuoteFormData): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  // Helper function to add footer to each page
  const addFooter = (pageNum: number, totalPages: number) => {
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.lightGray);
    doc.text(FOOTER_TEXT, pageWidth / 2, pageHeight - 10, { align: "center" });
    doc.text(`Pagina ${pageNum} van ${totalPages}`, pageWidth / 2, pageHeight - 6, { align: "center" });
  };

  // Helper function to add header with logo placeholder
  const addHeader = () => {
    // Logo placeholder - blue rectangle with text
    doc.setFillColor(...COLORS.blue);
    doc.rect(margin, 10, 40, 12, "F");
    doc.setTextColor(...COLORS.white);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("'t WEB", margin + 20, 18, { align: "center" });
    
    // Reset text color
    doc.setTextColor(...COLORS.darkGray);
  };

  let currentPage = 1;
  const totalPages = 4;

  // ==================== PAGE 1: Cover Page ====================
  // Blue decorative curve (top right) - using overlapping circles for curve effect
  doc.setFillColor(...COLORS.blue);
  // Main curve shape using overlapping circles
  doc.circle(pageWidth - 30, -20, 80, "F");
  doc.circle(pageWidth - 10, -40, 60, "F");

  // Logo - 't web with icon (left side)
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.blue);
  doc.text("'t web", margin, 25);
  
  // Logo icon (small square next to text)
  doc.setFillColor(...COLORS.blue);
  doc.rect(margin + 45, 15, 8, 8, "F");

  // Slogan under logo
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.lightGray);
  doc.text("Jouw partner voor veiligheid, compliancy en borging", margin, 35);

  // Beige banner with title and quote number
  const bannerY = 120;
  doc.setFillColor(245, 242, 235); // Beige color
  doc.rect(0, bannerY, pageWidth, 25, "F");
  
  // Banner text - "Maatwerk e-learning | Offerte {nummer}"
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.darkGray);
  doc.text("Maatwerk e-learning", margin, bannerY + 16);
  
  // Separator and quote number
  doc.setTextColor(...COLORS.lightGray);
  doc.text("|", margin + 95, bannerY + 16);
  doc.setTextColor(...COLORS.darkGray);
  doc.text(`Offerte ${data.offerte_nummer}`, margin + 105, bannerY + 16);

  // Recipient address block (left side, below banner)
  const recipientY = bannerY + 45;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.darkGray);
  doc.text(data.klantnaam, margin, recipientY);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`T.a.v. ${data.contactpersoon_volledig}`, margin, recipientY + 10);

  // Footer with company contact info
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.lightGray);
  doc.text(FOOTER_TEXT, pageWidth / 2, pageHeight - 10, { align: "center" });
  doc.text("Pagina 1 van 4", pageWidth / 2, pageHeight - 6, { align: "center" });

  // ==================== PAGE 2: Introduction & Topics ====================
  doc.addPage();
  currentPage = 2;
  addHeader();

  let y = 40;
  const lineHeight = 6;
  const paragraphSpacing = 4;

  // Greeting
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.darkGray);
  doc.text(`Beste ${data.aanhef},`, margin, y);
  y += lineHeight + paragraphSpacing;

  // Introduction paragraph
  const intro1 = "Tijdens onze laatste afspraak hebben we het gehad over maatwerk scholing en leerlijnen per sector: Agrarisch, bouw, groen, GWW, industrie & productie, transport & logistiek, zorg en techniek.";
  const intro1Lines = doc.splitTextToSize(intro1, contentWidth);
  doc.text(intro1Lines, margin, y);
  y += intro1Lines.length * lineHeight + paragraphSpacing;

  const intro2 = `Daarbij zou je graag met een leerlijn voor de ${data.sector} beginnen die opgenomen kan worden in jullie Studytube LMS d.m.v. LTI-koppeling.`;
  const intro2Lines = doc.splitTextToSize(intro2, contentWidth);
  doc.text(intro2Lines, margin, y);
  y += intro2Lines.length * lineHeight + paragraphSpacing * 2;

  // Topics header
  doc.setFont("helvetica", "bold");
  doc.text("Tijdens onze afspraak hebben we de volgende onderwerpen besproken:", margin, y);
  y += lineHeight + paragraphSpacing;

  // Topics list
  doc.setFont("helvetica", "normal");
  const topics = [
    { title: "Maatwerk E-learning modules", items: ["Virtuele tours door de productie", "Onboardingmodules voor nieuwe medewerkers (functiegericht)", "Documentenbeheer: handleidingen en werkinstructies op één plek (zoals veiligheidsboekje)", "Korte trainingsvideo's & instructies voor efficiënter inwerken", "Leerpaden en persoonlijke ontwikkeling per functie/ branche"] },
    { title: "Standaard e-learning", items: ["Klantenportaal & Compliance", "Borging van trainingen via een gekoppeld klantenportaal", "Structuur voor terugkerende vragen en kennisdeling"] },
    { title: "Fysieke Trainingen", items: ["Opleidingstrajecten op locatie, volledig geïntegreerd in het LMS", "Optioneel certificeringsborging via klantenportaal en pasjesapp voor medewerkers"] },
  ];

  topics.forEach((topic) => {
    doc.setFont("helvetica", "bold");
    doc.text(topic.title, margin, y);
    y += lineHeight;
    doc.setFont("helvetica", "normal");
    topic.items.forEach((item) => {
      doc.text(`• ${item}`, margin + 5, y);
      y += lineHeight;
    });
    y += paragraphSpacing;
  });

  // Closing paragraph
  const closing = `Maatwerk e-learning kunnen we opzetten, net als onboarding. Een maatwerk e-learning kan al voor ${data.uurtarief_maatwerk} per uur worden opgezet, wanneer 't WEB de content al beschikbaar heeft. Moet alles nog ontwikkeld worden, dan kunnen we een pakketprijs afspreken.`;
  const closingLines = doc.splitTextToSize(closing, contentWidth);
  doc.text(closingLines, margin, y);

  addFooter(currentPage, totalPages);

  // ==================== PAGE 3: Investment & Conditions ====================
  doc.addPage();
  currentPage = 3;
  addHeader();

  y = 40;

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("In onderstaand overzicht tref je de investering aan voor de genoemde onderwerpen.", margin, y);
  y += lineHeight * 2;

  // Investment table
  const tableData = [
    ["Omschrijving", "Investering"],
    [`Maatwerk e-learning leerlijn ${data.sector}`, `${data.totaalprijs_maatwerk} (eenmalig)`],
    ["Licentie per deelnemer", data.prijs_per_deelnemer],
    ["Examen / Toetsing", "Inbegrepen"],
  ];

  const colWidths = [contentWidth * 0.6, contentWidth * 0.4];
  const rowHeight = 10;

  // Table header
  doc.setFillColor(...COLORS.blue);
  doc.rect(margin, y, contentWidth, rowHeight, "F");
  doc.setTextColor(...COLORS.white);
  doc.setFont("helvetica", "bold");
  doc.text(tableData[0][0], margin + 3, y + 7);
  doc.text(tableData[0][1], margin + colWidths[0] + 3, y + 7);

  y += rowHeight;

  // Table rows
  doc.setTextColor(...COLORS.darkGray);
  doc.setFont("helvetica", "normal");
  for (let i = 1; i < tableData.length; i++) {
    if (i % 2 === 0) {
      doc.setFillColor(245, 245, 245);
      doc.rect(margin, y, contentWidth, rowHeight, "F");
    }
    doc.text(tableData[i][0], margin + 3, y + 7);
    doc.text(tableData[i][1], margin + colWidths[0] + 3, y + 7);
    y += rowHeight;
  }

  y += lineHeight * 2;

  // Conditions
  const conditions = [
    { title: "Toelichting bij Herkansingen:", text: "Indien een deelnemer niet slaagt voor het theorie-examen, mag deze éénmaal kosteloos herkanst worden. Indien de deelnemer de tweede keer ook niet slaagt, vervalt deze mogelijkheid en zullen beide examens opnieuw behaald moeten worden d.m.v. een nieuwe opleiding." },
    { title: "Overige afspraken:", text: "Overig: Overige regie-afspraken worden in overleg met jullie gemaakt. Hierbij wordt gedacht aan het uitnodigen van cursisten, het bewaken van de herhalingsfrequentie en diverse andere zaken." },
    { title: "Geldigheidsduur offerte:", text: "Deze offerte heeft een geldigheid tot 3 maanden na de dagtekening." },
    { title: "Privacyverklaring:", text: "Door akkoord te gaan met deze offerte ga je akkoord met het privacy beleid van 't WEB." },
    { title: "Algemene voorwaarden:", text: "Verzorging van deze opleiding vindt plaats volgens onze algemene voorwaarden." },
    { title: "Aanmelding:", text: "Deelnemers kunnen aangemeld worden middels het aanmeldingsformulier. U kunt uw bestanden via deze link beveiligd naar ons opsturen: www.tweb.nl/upload" },
    { title: "Verzekering:", text: "Wij wijzen u erop dat u als houder c.q. eigenaar van een motorvoertuig, deze dient te verzekeren (WAM + eventueel CASCO), om eventuele schade aan c.q. door een motorvoertuig gedekt te krijgen." },
  ];

  conditions.forEach((condition) => {
    doc.setFont("helvetica", "bold");
    doc.text(condition.title, margin, y);
    y += lineHeight;
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(condition.text, contentWidth);
    doc.text(lines, margin, y);
    y += lines.length * lineHeight + paragraphSpacing;
  });

  addFooter(currentPage, totalPages);

  // ==================== PAGE 4: Closing & Signature ====================
  doc.addPage();
  currentPage = 4;
  addHeader();

  y = 40;

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.darkGray);

  const closingText1 = "Wij zijn ervan overtuigd dat 't WEB een goede ondersteuning kan bieden. Graag zijn wij bereid om het voorstel mondeling toe te lichten.";
  const closingText1Lines = doc.splitTextToSize(closingText1, contentWidth);
  doc.text(closingText1Lines, margin, y);
  y += closingText1Lines.length * lineHeight + paragraphSpacing * 2;

  const closingText2 = "Indien je akkoord kunt gaan met het voorstel en onze algemene voorwaarden, verzoek ik je om een ondertekend exemplaar aan ons te retourneren.";
  const closingText2Lines = doc.splitTextToSize(closingText2, contentWidth);
  doc.text(closingText2Lines, margin, y);
  y += closingText2Lines.length * lineHeight + paragraphSpacing * 3;

  // Closing greeting
  doc.text("Met vriendelijke groet,", margin, y);
  y += lineHeight * 2;

  // Account manager signature block
  doc.setFont("helvetica", "bold");
  doc.text("Namens 't WEB Bedrijfsopleidingen B.V,", margin, y);
  y += lineHeight * 2;
  doc.text(data.naam_accountmanager, margin, y);
  y += lineHeight;
  doc.setFont("helvetica", "normal");
  doc.text("Accountmanager", margin, y);
  y += lineHeight * 4;

  // Signature line
  doc.setDrawColor(...COLORS.lightGray);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + 60, y);
  y += lineHeight;
  doc.setFontSize(10);
  doc.text("(Handtekening & Datum)", margin, y);

  // Client signature block (right side)
  const rightX = pageWidth - margin - 80;
  y = 40 + closingText1Lines.length * lineHeight + closingText2Lines.length * lineHeight + paragraphSpacing * 5 + lineHeight * 2;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Voor akkoord,", rightX, y);
  y += lineHeight * 2;
  doc.text(`Namens ${data.klantnaam},`, rightX, y);
  y += lineHeight * 4;

  // Client signature line
  doc.setDrawColor(...COLORS.lightGray);
  doc.line(rightX, y, rightX + 60, y);
  y += lineHeight;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("(Handtekening & Datum)", rightX, y);

  addFooter(currentPage, totalPages);

  // Save the PDF
  doc.save(`Offerte_${data.offerte_nummer}_${data.klantnaam.replace(/\s+/g, "_")}.pdf`);
}
