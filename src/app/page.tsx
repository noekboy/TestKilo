import { QuoteForm } from "@/components/quote-form";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#005293] text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="bg-white text-[#005293] px-4 py-2 rounded-lg font-bold text-xl">
              &apos;t WEB
            </div>
            <div>
              <h1 className="text-2xl font-bold">OfferteMaker</h1>
              <p className="text-blue-100 text-sm">Simpele tool voor gestandaardiseerde offertes</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Introduction Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Welkom bij de OfferteMaker
          </h2>
          <p className="text-gray-600">
            Vul alle velden in om een gestandaardiseerde offerte te genereren in de huisstijl van &apos;t WEB. 
            De PDF wordt automatisch gegenereerd met alle vaste teksten en voorwaarden.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">
            Offerte Gegevens
          </h2>
          <QuoteForm />
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>&apos;t Web Opleidingen en Adviezen</p>
          <p>Zeppelinstraat 7 | 7903 BR Hoogeveen</p>
          <p>Tel.: +31 (0) 528 280 888 | www.tweb.nl</p>
        </div>
      </div>
    </main>
  );
}
