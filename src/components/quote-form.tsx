"use client";

import { useState } from "react";
import { generatePDF } from "@/lib/generate-pdf";

export interface QuoteFormData {
  offerte_nummer: string;
  datum: string;
  klantnaam: string;
  contactpersoon_volledig: string;
  aanhef: string;
  sector: string;
  uurtarief_maatwerk: string;
  totaalprijs_maatwerk: string;
  prijs_per_deelnemer: string;
  naam_accountmanager: string;
}

const initialFormData: QuoteFormData = {
  offerte_nummer: "",
  datum: "",
  klantnaam: "",
  contactpersoon_volledig: "",
  aanhef: "",
  sector: "",
  uurtarief_maatwerk: "",
  totaalprijs_maatwerk: "",
  prijs_per_deelnemer: "",
  naam_accountmanager: "",
};

export function QuoteForm() {
  const [formData, setFormData] = useState<QuoteFormData>(initialFormData);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const isFormValid = Object.values(formData).every((value) => value.trim() !== "");

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
      </div>

      {/* Pagina 3 - Investering & Voorwaarden */}
      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="bg-blue-600 text-white text-sm px-2 py-1 rounded">Pagina 3</span>
          Investering & Voorwaarden
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Totaalprijs Maatwerk */}
          <div>
            <label htmlFor="totaalprijs_maatwerk" className="block text-sm font-medium text-gray-700 mb-1">
              Totaalprijs Maatwerk
            </label>
            <input
              type="text"
              id="totaalprijs_maatwerk"
              name="totaalprijs_maatwerk"
              value={formData.totaalprijs_maatwerk}
              onChange={handleChange}
              placeholder="Bijv. € 4.500,-"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Prijs per Deelnemer */}
          <div>
            <label htmlFor="prijs_per_deelnemer" className="block text-sm font-medium text-gray-700 mb-1">
              Prijs per Deelnemer
            </label>
            <input
              type="text"
              id="prijs_per_deelnemer"
              name="prijs_per_deelnemer"
              value={formData.prijs_per_deelnemer}
              onChange={handleChange}
              placeholder="Bijv. € 35,-"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Pagina 4 - Afsluiting & Handtekening */}
      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="bg-blue-600 text-white text-sm px-2 py-1 rounded">Pagina 4</span>
          Afsluiting & Handtekening
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Naam Accountmanager */}
          <div>
            <label htmlFor="naam_accountmanager" className="block text-sm font-medium text-gray-700 mb-1">
              Naam Accountmanager
            </label>
            <input
              type="text"
              id="naam_accountmanager"
              name="naam_accountmanager"
              value={formData.naam_accountmanager}
              onChange={handleChange}
              placeholder="Bijv. Esther Veijer"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
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
          <p className="text-sm text-gray-500 mt-2 text-center">
            Vul alle velden in om de PDF te genereren.
          </p>
        )}
      </div>
    </form>
  );
}
