"use client";

import { useState } from "react";
import { generatePDF } from "@/lib/generate-pdf";

// Topic items for Page 2 - each sub-item is individually selectable
export const TOPIC_ITEMS = {
  maatwerk_elearning: [
    { id: "virtuele_tours", label: "Virtuele tours door de productie" },
    { id: "onboarding_modules", label: "Onboardingmodules voor nieuwe medewerkers (functiegericht)" },
    { id: "documentenbeheer", label: "Documentenbeheer: handleidingen en werkinstructies op één plek" },
    { id: "trainings_videos", label: "Korte trainingsvideo's & instructies voor efficiënter inwerken" },
    { id: "leerpaden", label: "Leerpaden en persoonlijke ontwikkeling per functie/branche" },
  ],
  standaard_elearning: [
    { id: "klantenportaal_compliance", label: "Klantenportaal & Compliance" },
    { id: "borging_trainingen", label: "Borging van trainingen via een gekoppeld klantenportaal" },
    { id: "structuur_kennisdeling", label: "Structuur voor terugkerende vragen en kennisdeling" },
  ],
  fysieke_trainingen: [
    { id: "opleidingstrajecten_locatie", label: "Opleidingstrajecten op locatie, volledig geïntegreerd in het LMS" },
    { id: "certificering_pasjesapp", label: "Optioneel certificeringsborging via klantenportaal en pasjesapp" },
  ],
} as const;

export type TopicItemId = typeof TOPIC_ITEMS[keyof typeof TOPIC_ITEMS][number]["id"];

// E-learning courses for Page 3
export const ELEARNING_COURSES = [
  { id: "bhv", label: "BHV", duration: "± 4 uren", nl: true, uk: true, pl: true },
  { id: "eerste_hulp_reanimatie", label: "Eerste hulp & Reanimatie", duration: "± 2 uren", nl: true, uk: true, pl: true },
  { id: "blussen_ontruimen", label: "Blussen & Ontruimen", duration: "± 2 uren", nl: true, uk: true, pl: true },
  { id: "eerste_hulp_babys_kinderen", label: "Eerste Hulp aan Baby's en Kinderen", duration: "± 4 uren", nl: true, uk: "in_dev", pl: false },
  { id: "vca_basisveiligheid", label: "VCA Basisveiligheid", duration: "± 4 uren", nl: true, uk: false, pl: false },
  { id: "ept", label: "Elektrische Pallet Truck (EPT)", duration: "± 2 uren", nl: true, uk: "in_dev", pl: false },
  { id: "heftruck", label: "Heftruck", duration: "± 4 uren", nl: true, uk: "in_dev", pl: false },
  { id: "reachtruck", label: "Reachtruck", duration: "± 4 uren", nl: true, uk: "in_dev", pl: false },
  { id: "hoogwerker", label: "Hoogwerker", duration: "± 4 uren", nl: true, uk: false, pl: false },
  { id: "veilig_hijsen", label: "Veilig Hijsen", duration: "± 4 uren", nl: true, uk: "in_dev", pl: "in_dev" },
  { id: "nen_3140_vop", label: "NEN 3140 VOP", duration: "± 4 uren", nl: true, uk: false, pl: false },
  { id: "adr_13_awareness", label: "ADR 1.3 Awareness", duration: "± 3 uren", nl: true, uk: false, pl: false },
  { id: "besloten_ruimte", label: "Besloten ruimte + gasmeten", duration: "± 2 uren", nl: true, uk: false, pl: false },
  { id: "polyurethaan", label: "Polyurethaan", duration: "± 2 uren", nl: true, uk: false, pl: false },
  { id: "atex", label: "ATEX", duration: "± 2 uren", nl: true, uk: false, pl: false },
] as const;

export type CourseId = typeof ELEARNING_COURSES[number]["id"];

export interface QuoteFormData {
  offerte_nummer: string;
  klantnaam: string;
  contactpersoon_volledig: string;
  aanhef: string;
  sector: string;
  uurtarief_maatwerk: string;
  totaalprijs_maatwerk: string;
  prijs_per_deelnemer: string;
  naam_accountmanager: string;
  datum: string;
  selected_topics: TopicItemId[];
  selected_courses: CourseId[];
}

// Get today's date in YYYY-MM-DD format for the date input default
const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

// Format date for display (Dutch format)
export const formatDateDutch = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const months = [
    "januari", "februari", "maart", "april", "mei", "juni",
    "juli", "augustus", "september", "oktober", "november", "december"
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const initialFormData: QuoteFormData = {
  offerte_nummer: "",
  klantnaam: "",
  contactpersoon_volledig: "",
  aanhef: "",
  sector: "",
  uurtarief_maatwerk: "",
  totaalprijs_maatwerk: "",
  prijs_per_deelnemer: "",
  naam_accountmanager: "",
  datum: getTodayDate(),
  selected_topics: [],
  selected_courses: [],
};

// Field labels for error messages (excludes selected_topics and selected_courses which are optional)
const fieldLabels: Record<keyof Omit<QuoteFormData, "selected_topics" | "selected_courses">, string> = {
  offerte_nummer: "Offertenummer",
  klantnaam: "Klantnaam",
  contactpersoon_volledig: "Contactpersoon (volledige naam)",
  aanhef: "Aanhef (voornaam)",
  sector: "Sector/Leerlijn",
  uurtarief_maatwerk: "Uurtarief Maatwerk",
  totaalprijs_maatwerk: "Totaalprijs Maatwerk",
  prijs_per_deelnemer: "Prijs per Deelnemer",
  naam_accountmanager: "Naam Accountmanager",
  datum: "Datum",
};

export function QuoteForm() {
  const [formData, setFormData] = useState<QuoteFormData>(initialFormData);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTopicChange = (topicId: TopicItemId) => {
    setFormData((prev) => {
      const isSelected = prev.selected_topics.includes(topicId);
      return {
        ...prev,
        selected_topics: isSelected
          ? prev.selected_topics.filter((id) => id !== topicId)
          : [...prev.selected_topics, topicId],
      };
    });
  };

  const handleCourseChange = (courseId: CourseId) => {
    setFormData((prev) => {
      const isSelected = prev.selected_courses.includes(courseId);
      return {
        ...prev,
        selected_courses: isSelected
          ? prev.selected_courses.filter((id) => id !== courseId)
          : [...prev.selected_courses, courseId],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      await generatePDF(formData);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Er is een fout opgetreden bij het genereren van de PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Check if all required fields are filled (selected_topics and selected_courses are optional)
  const isFormValid = Object.entries(formData)
    .filter(([key]) => key !== "selected_topics" && key !== "selected_courses")
    .every(([, value]) => {
      if (typeof value === "string") return value.trim() !== "";
      return true;
    });

  // Get list of missing field names for error message
  const getMissingFields = (): string[] => {
    return Object.entries(formData)
      .filter(([key, value]) => {
        if (key === "selected_topics" || key === "selected_courses") return false;
        if (typeof value === "string") return value.trim() === "";
        return false;
      })
      .map(([key]) => fieldLabels[key as keyof typeof fieldLabels]);
  };

  const missingFields = getMissingFields();

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Pagina 1 - Voorblad */}
      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="bg-blue-600 text-white text-sm px-2 py-1 rounded">Pagina 1</span>
          Voorblad
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Offertenummer */}
          <div>
            <label htmlFor="offerte_nummer" className="block text-sm font-medium text-gray-700 mb-1">
              Offertenummer
            </label>
            <input
              type="text"
              id="offerte_nummer"
              name="offerte_nummer"
              value={formData.offerte_nummer}
              onChange={handleChange}
              placeholder="Bijv. 2602051"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Datum */}
          <div>
            <label htmlFor="datum" className="block text-sm font-medium text-gray-700 mb-1">
              Datum
            </label>
            <input
              type="date"
              id="datum"
              name="datum"
              value={formData.datum}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Klantnaam */}
          <div>
            <label htmlFor="klantnaam" className="block text-sm font-medium text-gray-700 mb-1">
              Klantnaam
            </label>
            <input
              type="text"
              id="klantnaam"
              name="klantnaam"
              value={formData.klantnaam}
              onChange={handleChange}
              placeholder="Bijv. Abiant Holding"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Contactpersoon Volledig */}
          <div>
            <label htmlFor="contactpersoon_volledig" className="block text-sm font-medium text-gray-700 mb-1">
              T.a.v. Contactpersoon (volledige naam)
            </label>
            <input
              type="text"
              id="contactpersoon_volledig"
              name="contactpersoon_volledig"
              value={formData.contactpersoon_volledig}
              onChange={handleChange}
              placeholder="Bijv. Manon van Zwol"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Pagina 2 - Introductie & Onderwerpen */}
      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="bg-blue-600 text-white text-sm px-2 py-1 rounded">Pagina 2</span>
          Introductie & Onderwerpen
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Aanhef */}
          <div>
            <label htmlFor="aanhef" className="block text-sm font-medium text-gray-700 mb-1">
              Aanhef (voornaam)
            </label>
            <input
              type="text"
              id="aanhef"
              name="aanhef"
              value={formData.aanhef}
              onChange={handleChange}
              placeholder="Bijv. Manon"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Sector/Leerlijn */}
          <div>
            <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-1">
              Sector/Leerlijn
            </label>
            <select
              id="sector"
              name="sector"
              value={formData.sector}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
            >
              <option value="">Selecteer een sector...</option>
              <option value="agrarisch">Agrarisch</option>
              <option value="bouw">Bouw</option>
              <option value="groen">Groen</option>
              <option value="gww">GWW</option>
              <option value="industrie & productie">Industrie & Productie</option>
              <option value="transport & logistiek">Transport & Logistiek</option>
              <option value="zorg">Zorg</option>
              <option value="techniek">Techniek</option>
            </select>
          </div>

          {/* Uurtarief Maatwerk */}
          <div>
            <label htmlFor="uurtarief_maatwerk" className="block text-sm font-medium text-gray-700 mb-1">
              Uurtarief Maatwerk
            </label>
            <input
              type="text"
              id="uurtarief_maatwerk"
              name="uurtarief_maatwerk"
              value={formData.uurtarief_maatwerk}
              onChange={handleChange}
              placeholder="Bijv. € 69,-"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Topics Selection */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Selecteer de besproken onderwerpen
          </label>
          
          {/* Maatwerk E-learning */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">Maatwerk E-learning</h4>
            <div className="space-y-2 pl-2">
              {TOPIC_ITEMS.maatwerk_elearning.map((item) => (
                <label key={item.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.selected_topics.includes(item.id)}
                    onChange={() => handleTopicChange(item.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Standaard E-learning */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">Standaard E-learning</h4>
            <div className="space-y-2 pl-2">
              {TOPIC_ITEMS.standaard_elearning.map((item) => (
                <label key={item.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.selected_topics.includes(item.id)}
                    onChange={() => handleTopicChange(item.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Fysieke Trainingen */}
          <div className="mb-2">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">Fysieke Trainingen</h4>
            <div className="space-y-2 pl-2">
              {TOPIC_ITEMS.fysieke_trainingen.map((item) => (
                <label key={item.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.selected_topics.includes(item.id)}
                    onChange={() => handleTopicChange(item.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pagina 3 - E-learning Cursussen */}
      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="bg-blue-600 text-white text-sm px-2 py-1 rounded">Pagina 3</span>
          E-learning Cursussen
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Selecteer de e-learning cursussen die op de offerte moeten komen te staan.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {ELEARNING_COURSES.map((course) => (
            <label key={course.id} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-100">
              <input
                type="checkbox"
                checked={formData.selected_courses.includes(course.id)}
                onChange={() => handleCourseChange(course.id)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{course.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={!isFormValid || isGenerating}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${
            isFormValid && !isGenerating
              ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isGenerating ? "PDF wordt gegenereerd..." : "Download PDF"}
        </button>
        {!isFormValid && (
          <div className="text-sm text-red-600 mt-2 text-center">
            <p className="font-medium">Vul alle velden in om de PDF te genereren.</p>
            <p className="mt-1">Ontbrekende velden: {missingFields.join(", ")}</p>
          </div>
        )}
      </div>
    </form>
  );
}
