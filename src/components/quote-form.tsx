"use client";

/**
 * =============================================================================
 * QUOTE FORM COMPONENT
 * =============================================================================
 *
 * Client component that renders the quote input form. All types, constants,
 * and reference data are imported from @/types (the single source of truth).
 *
 * AI BREADCRUMB: This component manages form state via useState and calls
 * generatePDF(formData) on submit. The form is grouped into 3 sections
 * matching PDF pages: Pagina 1 (cover), Pagina 2 (topics), Pagina 3 (courses).
 * =============================================================================
 */

import { useState } from "react";
import { generatePDF } from "@/lib/generate-pdf";
import type { QuoteFormData, TopicItemId, CourseId } from "@/types";
import {
  TOPIC_ITEMS,
  ELEARNING_COURSES,
  SECTOR_OPTIONS,
  INITIAL_FORM_DATA,
  FIELD_LABELS,
} from "@/types";

export function QuoteForm() {
  const [formData, setFormData] = useState<QuoteFormData>({ ...INITIAL_FORM_DATA });
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

  // Check if all required fields are filled (selected_topics, selected_courses, text_optional, text_exclusions are optional)
  const OPTIONAL_FIELDS = ["selected_topics", "selected_courses", "text_optional", "text_exclusions"];
  const isFormValid = Object.entries(formData)
    .filter(([key]) => !OPTIONAL_FIELDS.includes(key))
    .every(([, value]) => {
      if (typeof value === "string") return value.trim() !== "";
      if (typeof value === "number") return value >= 0;
      return true;
    });

  // Get list of missing field names for error message
  const getMissingFields = (): string[] => {
    return Object.entries(formData)
      .filter(([key, value]) => {
        if (OPTIONAL_FIELDS.includes(key)) return false;
        if (typeof value === "string") return value.trim() === "";
        return false;
      })
      .map(([key]) => FIELD_LABELS[key as keyof typeof FIELD_LABELS]);
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
              {SECTOR_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
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

      {/* Pagina 10 - Investering */}
      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="bg-blue-600 text-white text-sm px-2 py-1 rounded">Pagina 10</span>
          Investering
        </h2>
        
        {/* Investment Lines - Numeric Inputs */}
        <div className="space-y-4 mb-6">
          <h4 className="text-sm font-semibold text-gray-800">Investering regels</h4>
          
          {/* Module leerlijn bouw */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price_module_bouw" className="block text-sm font-medium text-gray-700 mb-1">
                Prijs Module leerlijn bouw (€)
              </label>
              <input
                type="number"
                id="price_module_bouw"
                name="price_module_bouw"
                value={formData.price_module_bouw}
                onChange={handleChange}
                min="0"
                step="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex items-end">
              <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-lg w-full">
                = € {formData.price_module_bouw.toLocaleString("nl-NL")},-
              </div>
            </div>
          </div>

          {/* Custom work calculation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="hours_custom_estimated" className="block text-sm font-medium text-gray-700 mb-1">
                Geschatte uren maatwerk
              </label>
              <input
                type="number"
                id="hours_custom_estimated"
                name="hours_custom_estimated"
                value={formData.hours_custom_estimated}
                onChange={handleChange}
                min="0"
                step="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="price_custom_hourly" className="block text-sm font-medium text-gray-700 mb-1">
                Uurtarief maatwerk (€)
              </label>
              <input
                type="number"
                id="price_custom_hourly"
                name="price_custom_hourly"
                value={formData.price_custom_hourly}
                onChange={handleChange}
                min="0"
                step="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex items-end">
              <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-lg w-full">
                = € {(formData.hours_custom_estimated * formData.price_custom_hourly).toLocaleString("nl-NL")},-
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-800">Totaal investering:</span>
              <span className="text-lg font-bold text-blue-600">
                € {(formData.price_module_bouw + formData.hours_custom_estimated * formData.price_custom_hourly).toLocaleString("nl-NL")},-
              </span>
            </div>
          </div>
        </div>

        {/* Optional Items */}
        <div className="mb-6">
          <label htmlFor="text_optional" className="block text-sm font-medium text-gray-700 mb-1">
            Optioneel
          </label>
          <textarea
            id="text_optional"
            name="text_optional"
            value={formData.text_optional}
            onChange={(e) => setFormData((prev) => ({ ...prev, text_optional: e.target.value }))}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">Vrije tekst voor optionele items. Gebruik • voor bullet points.</p>
        </div>

        {/* Exclusions */}
        <div>
          <label htmlFor="text_exclusions" className="block text-sm font-medium text-gray-700 mb-1">
            Exclusief
          </label>
          <textarea
            id="text_exclusions"
            name="text_exclusions"
            value={formData.text_exclusions}
            onChange={(e) => setFormData((prev) => ({ ...prev, text_exclusions: e.target.value }))}
            rows={8}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">Vrije tekst voor &quot;Deze prijs is exclusief&quot; sectie. Gebruik • voor bullet points en o voor sub-items.</p>
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
