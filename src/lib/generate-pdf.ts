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
  // Add date to footer
  if (data.datum) {
    doc.text(`Datum ${formatDateDutch(data.datum)}`, margin, pageHeight - 6);
  }

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
      
      // Language availability with filled green circles
      const checkX1 = margin + colWidths[0] + colWidths[1] + colWidths[2] / 2;
      const checkX2 = margin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] / 2;
      const checkX3 = margin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] / 2;
      const circleRadius = 2.5;

      // NL - filled green circle
      if (course.nl) {
        doc.setFillColor(0, 128, 0); // Green
        doc.circle(checkX1, y + 4, circleRadius, "F");
      }
      
      // UK
      if (course.uk === true) {
        doc.setFillColor(0, 128, 0); // Green
        doc.circle(checkX2, y + 4, circleRadius, "F");
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
        doc.setFillColor(0, 128, 0); // Green
        doc.circle(checkX3, y + 4, circleRadius, "F");
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

  // ==================== PAGE 4: Maatwerk E-learning ====================
  doc.addPage();
  currentPage = 4;
  
  // Blue decorative curve (top right) - same as other pages
  doc.setFillColor(...COLORS.blue);
  doc.circle(pageWidth - 30, -20, 80, "F");
  doc.circle(pageWidth - 10, -40, 60, "F");

  // Logo - 't web with icon (right side)
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.blue);
  doc.text("'t web", pageWidth - margin - 50, 25);
  
  // Logo icon
  doc.setFillColor(...COLORS.blue);
  doc.rect(pageWidth - margin - 5, 15, 8, 8, "F");

  y = 45;
  const smallLineHeight = 5;

  // Section 1: Wat biedt maatwerk e-learning?
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.darkGray);
  doc.text("Wat biedt maatwerk e-learning?", margin, y);
  y += 7;

  // Bullet points for section 1 - bold title on first line, description on next line
  doc.setFontSize(9);
  
  const section1Bullets = [
    { title: "Aanvullend op praktijktrainingen", text: "Ondersteunt en versterkt fysieke trainingen met digitale leermiddelen (blended learning)." },
    { title: "Losse trainingen en toolboxen", text: "Korte, gerichte modules voor specifieke onderwerpen of vaardigheden." },
    { title: "Duidelijke werkinstructies", text: "Stapsgewijze uitleg en toetsing voor optimale kennisborging." },
    { title: "Interactieve leerervaring", text: "Optioneel: 360-graden foto's met geïntegreerde instructies voor een realistische en visuele training." },
    { title: "Gemaakt in Articulate Rise", text: "Een gebruiksvriendelijke en responsieve e-learningomgeving, toegankelijk op desktop, tablet en mobiel." }
  ];

  section1Bullets.forEach((bullet) => {
    // Bold title with bullet
    doc.setFont("helvetica", "bold");
    doc.text("• " + bullet.title, margin, y);
    y += smallLineHeight;
    
    // Description on next line, indented
    doc.setFont("helvetica", "normal");
    const textLines = doc.splitTextToSize(bullet.text, contentWidth - 8);
    doc.text(textLines, margin + 8, y);
    y += textLines.length * smallLineHeight + 3;
  });

  y += 2;

  // Paragraph after bullets
  const para1 = "Met deze maatwerk e-learningmodules kunnen medewerkers op elk moment en in hun eigen tempo leren, waardoor kennis en vaardigheden optimaal worden ontwikkeld.";
  const para1Lines = doc.splitTextToSize(para1, contentWidth);
  doc.text(para1Lines, margin, y);
  y += para1Lines.length * smallLineHeight + 6;

  // Section 2: Ontwikkeling & maatwerk e-learning (blue header)
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.blue);
  doc.text("Ontwikkeling & maatwerk e-learning", margin, y);
  y += 7;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.darkGray);

  const para2 = "Bij de ontwikkeling van maatwerk e-learning of het omzetten van bestaande werkinstructies naar interactieve e-learningmodules, kan Abiant tijdens dit proces live meekijken en suggesties aandragen.";
  const para2Lines = doc.splitTextToSize(para2, contentWidth);
  doc.text(para2Lines, margin, y);
  y += para2Lines.length * smallLineHeight + 4;

  doc.text("Denk hierbij aan:", margin, y);
  y += smallLineHeight;

  const denkHierbijItems = [
    "Eigen look & feel",
    "Voorbeelden uit de dagelijkse praktijk",
    "Relevante (bijna) ongevallen als voorbeelden en scenario's"
  ];

  denkHierbijItems.forEach((item) => {
    doc.text("• " + item, margin + 4, y);
    y += smallLineHeight;
  });
  y += 3;

  const para3 = "In de e-learnings wordt met verschillende methodes gewerkt. Denk hierbij aan de volgende mogelijkheden:";
  const para3Lines = doc.splitTextToSize(para3, contentWidth);
  doc.text(para3Lines, margin, y);
  y += para3Lines.length * smallLineHeight + 4;

  // Main bullet: Diverse werkvormen & media
  doc.setFont("helvetica", "bold");
  doc.text("• Diverse werkvormen & media in de online omgeving:", margin, y);
  y += smallLineHeight + 1;
  doc.setFont("helvetica", "normal");

  const subBullets1 = [
    "Afbeeldingen en video's",
    "Optioneel 360-graden foto's met interactieve instructies en spelelementen",
    "Diverse vraagsoorten, zoals matching pairs en klikbare ontdekkingen (drag & drop)",
    "Animaties voor visuele ondersteuning (GIF of video)"
  ];

  subBullets1.forEach((item) => {
    const itemLines = doc.splitTextToSize(item, contentWidth - 12);
    doc.text("•", margin + 8, y);
    doc.text(itemLines, margin + 14, y);
    y += itemLines.length * smallLineHeight;
  });
  y += 3;

  // Main bullet: Talen & internationalisering
  doc.setFont("helvetica", "bold");
  doc.text("• Talen & internationalisering:", margin, y);
  y += smallLineHeight + 1;
  doc.setFont("helvetica", "normal");
  const talenText = "Het LMS en de e-learningmodules kunnen worden geleverd in meerdere talen, zoals Engels, Frans, Duits of Pools, zodat alle medewerkers in hun eigen taal kunnen leren.";
  const talenLines = doc.splitTextToSize(talenText, contentWidth - 12);
  doc.text(talenLines, margin + 8, y);
  y += talenLines.length * smallLineHeight + 3;

  // Main bullet: Doorlopende optimalisatie
  doc.setFont("helvetica", "bold");
  doc.text("• Doorlopende optimalisatie:", margin, y);
  y += smallLineHeight + 1;
  doc.setFont("helvetica", "normal");
  const optText = "Jaarlijks vindt een evaluatie en update plaats om het LMS en de e-learning up-to-date te houden met de laatste wet- en regelgeving en interne ontwikkelingen.";
  const optLines = doc.splitTextToSize(optText, contentWidth - 12);
  doc.text(optLines, margin + 8, y);
  y += optLines.length * smallLineHeight + 6;

  // Final paragraphs - full width since no diagram
  const para4 = "Anderszins kan informatie in PDF-vorm of als video gedeeld worden, zonder kennis te toetsen. Het betreft een gebruiksvriendelijk, maar toch een interactief systeem dat kennis deelt op de gewenste manier. Eventueel worden bestaande trainingen als SCORM of middels een LTI-verbinding hieraan gekoppeld. Door 't WEB ontwikkelde e-learnings worden altijd afgesloten met een toets. Zo ben je actief aan het toetsen of alle informatie begrepen is.";
  const para4Lines = doc.splitTextToSize(para4, contentWidth);
  doc.text(para4Lines, margin, y);
  y += para4Lines.length * smallLineHeight + 6;

  const para5 = "Met deze mogelijkheid beschikt Abiant over een slimme, flexibele en toekomstbestendige leeroplossing die medewerkers optimaal ondersteunt in hun ontwikkeling!";
  const para5Lines = doc.splitTextToSize(para5, contentWidth);
  doc.text(para5Lines, margin, y);

  addFooter(currentPage, totalPages);

  // Save the PDF
  doc.save(`Offerte_${data.offerte_nummer}_${data.klantnaam.replace(/\s+/g, "_")}.pdf`);
}
