import { jsPDF } from "jspdf";
import { QuoteFormData, TOPIC_ITEMS, TopicItemId, formatDateDutch, ELEARNING_COURSES, CourseId } from "@/components/quote-form";

// 't WEB brand colors
const COLORS = {
  blue: [0, 82, 147] as [number, number, number], // 't WEB blue
  darkBlue: [15, 60, 99] as [number, number, number], // Darker blue for table
  darkGray: [51, 51, 51] as [number, number, number],
  lightGray: [128, 128, 128] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  orange: [230, 126, 34] as [number, number, number], // For pyramid label
};

// Footer text
const FOOTER_TEXT = "'t Web Opleidingen en Adviezen | www.tweb.nl | Tel.: +31 (0) 528 280 888 | Zeppelinstraat 7 | 7903 BR Hoogeveen";

// Helper to get topic label by id
const getTopicLabel = (topicId: TopicItemId): string => {
  for (const category of Object.values(TOPIC_ITEMS)) {
    const item = category.find((i) => i.id === topicId);
    if (item) return item.label;
  }
  return "";
};

// Pyramid levels data
const PYRAMID_LEVELS = [
  { text: "Luisteren", pct: "10%" },
  { text: "Lezen", pct: "20%" },
  { text: "Zien en horen", pct: "30%" },
  { text: "Zien, horen en nadoen", pct: "50%" },
  { text: "Discussiëren", pct: "60%" },
  { text: "Zelf meemaken", pct: "80%" },
  { text: "Uitleggen aan anderen", pct: "95%" },
];

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
    // Add date to footer
    if (data.datum) {
      doc.text(`Datum ${formatDateDutch(data.datum)}`, margin, pageHeight - 6);
    }
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
  const totalPages = 3;

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
  doc.text("Pagina 1 van 3", pageWidth / 2, pageHeight - 6, { align: "center" });

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

  // Group selected topics by category
  const selectedTopics = data.selected_topics;
  
  // Maatwerk E-learning items
  const maatwerkItems = TOPIC_ITEMS.maatwerk_elearning
    .filter((item) => selectedTopics.includes(item.id))
    .map((item) => item.label);
  
  // Standaard E-learning items
  const standaardItems = TOPIC_ITEMS.standaard_elearning
    .filter((item) => selectedTopics.includes(item.id))
    .map((item) => item.label);
  
  // Fysieke Trainingen items
  const fysiekItems = TOPIC_ITEMS.fysieke_trainingen
    .filter((item) => selectedTopics.includes(item.id))
    .map((item) => item.label);

  // Topics list - only show categories with selected items
  doc.setFont("helvetica", "normal");
  
  if (maatwerkItems.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.text("Maatwerk E-learning modules", margin, y);
    y += lineHeight;
    doc.setFont("helvetica", "normal");
    maatwerkItems.forEach((item) => {
      doc.text(`• ${item}`, margin + 5, y);
      y += lineHeight;
    });
    y += paragraphSpacing;
  }

  if (standaardItems.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.text("Standaard e-learning", margin, y);
    y += lineHeight;
    doc.setFont("helvetica", "normal");
    standaardItems.forEach((item) => {
      doc.text(`• ${item}`, margin + 5, y);
      y += lineHeight;
    });
    y += paragraphSpacing;
  }

  if (fysiekItems.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.text("Fysieke Trainingen", margin, y);
    y += lineHeight;
    doc.setFont("helvetica", "normal");
    fysiekItems.forEach((item) => {
      doc.text(`• ${item}`, margin + 5, y);
      y += lineHeight;
    });
    y += paragraphSpacing;
  }

  // If no topics selected, show a placeholder message
  if (selectedTopics.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.text("(Geen onderwerpen geselecteerd)", margin, y);
    y += lineHeight + paragraphSpacing;
  }

  // Closing paragraph
  const closing = `Maatwerk e-learning kunnen we opzetten, net als onboarding. Een maatwerk e-learning kan al voor ${data.uurtarief_maatwerk} per uur worden opgezet, wanneer 't WEB de content al beschikbaar heeft. Moet alles nog ontwikkeld worden, dan kunnen we een pakketprijs afspreken.`;
  const closingLines = doc.splitTextToSize(closing, contentWidth);
  doc.text(closingLines, margin, y);

  addFooter(currentPage, totalPages);

  // ==================== PAGE 3: E-learning Section ====================
  doc.addPage();
  currentPage = 3;
  
  // Blue decorative curve (top right) - same as page 1
  doc.setFillColor(...COLORS.blue);
  doc.circle(pageWidth - 30, -20, 80, "F");
  doc.circle(pageWidth - 10, -40, 60, "F");

  // Logo - 't web with icon (right side this time, matching HTML)
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.blue);
  doc.text("'t web", pageWidth - margin - 50, 25);
  
  // Logo icon
  doc.setFillColor(...COLORS.blue);
  doc.rect(pageWidth - margin - 5, 15, 8, 8, "F");

  y = 45;

  // E-learning title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.darkBlue);
  doc.text("E-learning", margin, y);
  y += 10;

  // Intro text - 5 paragraphs
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.darkGray);

  const introTexts = [
    "'t WEB ontwikkelt maatwerk e-learnings om invulling te geven aan intern beleid en kennis hieromtrent te borgen. Bijvoorbeeld een werkinstructie kan zodoende tijd- en plaats onafhankelijk & meertalig gedeeld worden.",
    "Tevens heeft 't WEB een serie standaard e-learnings beschikbaar die direct ingezet kunnen worden. Indien gewenst kunnen deze ook op maat toegespitst worden. Op basis van de juiste bronbestanden kunnen standaard e-learnings tot maatwerktraining doorontwikkeld worden.",
    "Deze digitale trainingen zorgen voor een effectieve en flexibele leerervaring, afgestemd op de specifieke behoeften van medewerkers en functies.",
    "Online trainen kan onderdeel zijn van een sterk leerbeleid. Klassikale trainingen zullen voor veel doeleinden altijd belangrijk blijven. E-learning wordt vaak toegepast t.b.v. blended learning.",
    "Zie hieronder het huidige overzicht van beschikbare e-learnings. Niet elke training wordt volledig afgerond door enkel de digitale training, vaak is het van belang om ook praktisch te trainen (blended learning)."
  ];

  // Draw intro text on the left side
  const introWidth = contentWidth * 0.55;
  let textY = y;
  
  introTexts.forEach((text, index) => {
    const lines = doc.splitTextToSize(text, introWidth);
    doc.text(lines, margin, textY);
    textY += lines.length * 5 + 4;
  });

  // Draw pyramid on the right side
  const pyramidX = margin + introWidth + 10;
  const pyramidY = y;
  const pyramidMaxWidth = contentWidth * 0.35;
  const levelHeight = 8;
  
  // Draw "e-learning" label (rotated text simulation - just horizontal for now)
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.orange);
  doc.text("e-learning", pyramidX + pyramidMaxWidth + 5, pyramidY + 40, { angle: 90 });
  
  // Draw pyramid levels
  doc.setFontSize(8);
  PYRAMID_LEVELS.forEach((level, index) => {
    const widthPercent = 0.4 + (index * 0.1); // 40% to 100%
    const levelWidth = pyramidMaxWidth * widthPercent;
    const levelX = pyramidX + (pyramidMaxWidth - levelWidth) / 2;
    const levelY = pyramidY + index * (levelHeight + 1);
    
    // Draw rectangle
    doc.setFillColor(...COLORS.darkBlue);
    doc.roundedRect(levelX, levelY, levelWidth, levelHeight, 1, 1, "F");
    
    // Draw text inside the bar
    doc.setTextColor(...COLORS.white);
    doc.setFont("helvetica", "normal");
    const textX = levelX + 3;
    doc.text(level.text, textX, levelY + 5);
    
    // Draw percentage OUTSIDE the pyramid (to the right)
    doc.setTextColor(...COLORS.darkGray);
    doc.text(level.pct, levelX + levelWidth + 3, levelY + 5);
  });

  // Move y down past the intro/pyramid section
  y = Math.max(textY, pyramidY + PYRAMID_LEVELS.length * (levelHeight + 1)) + 10;

  // Draw course table
  const selectedCourses = data.selected_courses;
  
  // Filter to show only selected courses, or all if none selected
  const coursesToShow = selectedCourses.length > 0 
    ? ELEARNING_COURSES.filter(c => selectedCourses.includes(c.id))
    : ELEARNING_COURSES;

  if (coursesToShow.length > 0) {
    // Table header
    const tableY = y;
    const colWidths = [contentWidth * 0.5, contentWidth * 0.2, contentWidth * 0.1, contentWidth * 0.1, contentWidth * 0.1];
    const rowHeight = 8;

    doc.setFillColor(...COLORS.darkBlue);
    doc.rect(margin, tableY, contentWidth, rowHeight, "F");
    doc.setTextColor(...COLORS.white);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    
    doc.text("E-learning", margin + 3, tableY + 5.5);
    doc.text("Duur", margin + colWidths[0] + 3, tableY + 5.5);
    doc.text("NL", margin + colWidths[0] + colWidths[1] + colWidths[2] / 2, tableY + 5.5, { align: "center" });
    doc.text("UK", margin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] / 2, tableY + 5.5, { align: "center" });
    doc.text("PL", margin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] / 2, tableY + 5.5, { align: "center" });

    y = tableY + rowHeight;

    // Table rows
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.darkGray);
    doc.setFontSize(9);

    coursesToShow.forEach((course, index) => {
      // Alternating row background
      if (index % 2 === 1) {
        doc.setFillColor(245, 245, 245);
        doc.rect(margin, y, contentWidth, rowHeight, "F");
      }

      // Draw border line
      doc.setDrawColor(...COLORS.blue);
      doc.setLineWidth(0.1);
      doc.line(margin, y + rowHeight, margin + contentWidth, y + rowHeight);

      // Course name
      doc.setTextColor(...COLORS.darkGray);
      doc.text(course.label, margin + 3, y + 5.5);
      
      // Duration
      doc.text(course.duration, margin + colWidths[0] + 3, y + 5.5);
      
      // Language availability with checkmarks
      const checkX1 = margin + colWidths[0] + colWidths[1] + colWidths[2] / 2;
      const checkX2 = margin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] / 2;
      const checkX3 = margin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] / 2;

      // NL - use bold checkmark symbol
      if (course.nl) {
        doc.setFontSize(10);
        doc.setTextColor(0, 128, 0); // Green color for visibility
        doc.text("✔", checkX1, y + 5.5, { align: "center" });
        doc.setFontSize(9);
        doc.setTextColor(...COLORS.darkGray);
      }
      
      // UK
      if (course.uk === true) {
        doc.setFontSize(10);
        doc.setTextColor(0, 128, 0); // Green color for visibility
        doc.text("✔", checkX2, y + 5.5, { align: "center" });
        doc.setFontSize(9);
        doc.setTextColor(...COLORS.darkGray);
      } else if (course.uk === "in_dev") {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(7);
        doc.setTextColor(...COLORS.lightGray);
        doc.text("In ontwikkeling", checkX2, y + 5.5, { align: "center" });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...COLORS.darkGray);
      }
      
      // PL
      if (course.pl === true) {
        doc.setFontSize(10);
        doc.setTextColor(0, 128, 0); // Green color for visibility
        doc.text("✔", checkX3, y + 5.5, { align: "center" });
        doc.setFontSize(9);
        doc.setTextColor(...COLORS.darkGray);
      } else if (course.pl === "in_dev") {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(7);
        doc.setTextColor(...COLORS.lightGray);
        doc.text("In ontwikkeling", checkX3, y + 5.5, { align: "center" });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...COLORS.darkGray);
      }

      y += rowHeight;
    });
  }

  addFooter(currentPage, totalPages);

  // Save the PDF
  doc.save(`Offerte_${data.offerte_nummer}_${data.klantnaam.replace(/\s+/g, "_")}.pdf`);
}
