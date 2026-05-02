import Image from "next/image";
import { ConfigurationService } from "@/lib/services/configurationService";
import eventDataRaw from "@/data/event_info.json";
import { Church, GlassWater, MapPin, Gift, Map, Navigation, Shirt } from "lucide-react";
import Footer from "@/components/Footer";

export default async function HomePage() {
  const mainColor = await ConfigurationService.getConfig('mainColor', eventDataRaw.theme.mainColor);
  const accentColor = await ConfigurationService.getConfig('accentColor', eventDataRaw.theme.accentColor);

  const eventData = {
    ...eventDataRaw,
    theme: {
      ...eventDataRaw.theme,
      mainColor,
      accentColor
    }
  };

  return (
    <main className="min-h-screen font-sans selection:bg-[#D4AF37] selection:text-white" style={{ backgroundColor: mainColor, color: 'white', '--primary': mainColor, '--accent': accentColor } as any}>
      
      {/* SECTION 1: Hero with Gradient and Image */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Background Image with absolute positioning */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{ backgroundImage: "url('/images/fotoCatedral.webp')" }}
        />
        
        {/* Gradient Overlay: Dark at top -> Solid mainColor at bottom */}
        <div 
          className="absolute inset-0 z-10"
          style={{
            background: `linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 40%, ${mainColor} 100%)`
          }}
        />

        {/* Hero Content */}
        <div className="relative z-20 max-w-4xl mx-auto flex flex-col items-center gap-6 pt-20">
          <p className="text-sm md:text-base tracking-[0.3em] font-medium uppercase drop-shadow-md" style={{ color: accentColor }}>
            Celebración Especial
          </p>
          <h1 
            className="text-6xl md:text-8xl font-serif leading-tight drop-shadow-xl" 
            style={{ fontFamily: eventData.theme.fonts.heading }}
          >
            Mis XV Años<br/>
            <span style={{ color: accentColor }}>Jimena Fernanda</span>
          </h1>
          <p className="text-lg md:text-xl font-light italic opacity-90 max-w-2xl mx-auto drop-shadow-lg mt-4 mb-4">
            "El Señor te bendiga y te guarde; el Señor haga resplandecer su rostro sobre ti y te conceda su paz."
          </p>
          <a 
            href="#ubicaciones"
            className="mt-6 px-8 py-3 rounded-full border transition-all hover:scale-105 hover:bg-white/10 uppercase tracking-widest text-sm font-medium backdrop-blur-sm"
            style={{ borderColor: accentColor, color: accentColor }}
          >
            Ver ubicación
          </a>
        </div>
      </section>

      {/* SECTION 2: Central Quote & Invitation Details */}
      <section className="w-full py-24 px-6 text-center relative z-20" style={{ backgroundColor: mainColor }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-sm uppercase tracking-[0.4em] mb-12 opacity-80" style={{ color: accentColor }}>
            Agradecimiento
          </h2>
          <p className="text-2xl md:text-4xl font-serif font-light leading-relaxed mb-16 italic opacity-90">
            "{eventData.event.quote}"
          </p>
          
          <div className="border-t border-b py-10 my-10 max-w-xl mx-auto" style={{ borderColor: `${accentColor}40` }}>
            <h3 className="text-3xl md:text-5xl font-serif mb-4" style={{ fontFamily: eventData.theme.fonts.heading, color: accentColor }}>
              Jimena Fernanda
            </h3>
            <p className="text-xl md:text-2xl font-light opacity-80 font-serif">
              Baquiax Barrios
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-16 mt-16 max-w-5xl mx-auto">
            {/* Parents */}
            <div className="text-center">
              <h4 className="text-lg md:text-xl uppercase tracking-[0.3em] mb-6 opacity-80 font-medium" style={{ color: accentColor }}>Mis Papás</h4>
              <ul className="flex flex-col md:flex-row gap-4 md:gap-16 font-light text-2xl md:text-3xl opacity-90">
                {eventData.event.parents.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
            
            {/* Godparents */}
            <div className="w-full pt-10 border-t border-dashed" style={{ borderColor: `${accentColor}30` }}>
              <h4 className="text-base md:text-lg uppercase tracking-[0.3em] mb-10 opacity-70 font-medium" style={{ color: accentColor }}>Mis Padrinos</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
                {eventData.event.godparentsGroups.map((group, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <h5 className="text-sm uppercase tracking-widest mb-4 opacity-60" style={{ color: accentColor }}>{group.title}</h5>
                    <ul className="space-y-2 font-light text-xl opacity-90">
                      {group.names.map((name, i) => (
                        <li key={i}>{name}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 & 4: Details & Itinerary */}
      <section className="w-full pt-24 pb-32 px-6 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
        {/* Dress Code & Gifts */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {/* Dress Code */}
          <div className="bg-white/5 border backdrop-blur-sm p-12 rounded-3xl h-full flex flex-col justify-center items-center" style={{ borderColor: `${accentColor}30` }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
              <Shirt size={28} />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif mb-6" style={{ color: accentColor }}>
              Código de Vestimenta
            </h2>
            <p className="text-xl font-light opacity-90">
              {eventData.event.dressCode.split('(')[0]}
            </p>
            <p className="mt-4 text-sm opacity-70 italic">
              ({eventData.event.dressCode.split('(')[1]}
            </p>
          </div>
          
          {/* Lluvia de Sobres */}
          <div className="bg-white/5 border backdrop-blur-sm p-12 rounded-3xl h-full flex flex-col items-center justify-center" style={{ borderColor: `${accentColor}30` }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
              <Gift size={28} />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif mb-4" style={{ color: accentColor }}>
              {eventData.event.gifts.title}
            </h2>
            <p className="text-base font-light opacity-80 leading-relaxed">
              {eventData.event.gifts.description}
            </p>
          </div>
        </div>

        {/* Itinerary */}
        <div className="w-full text-center relative">
          <h2 className="text-4xl font-serif mb-16" style={{ color: accentColor }}>
            Itinerario del Evento
          </h2>
          
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-center gap-12 md:gap-24 relative">
            {/* Timeline Connector for Desktop */}
            <div className="hidden md:block absolute top-8 left-[20%] right-[20%] h-px bg-white/10 z-0"></div>

            {eventData.itinerary.map((item, index) => {
              const Icon = item.icon === 'church' ? Church : GlassWater;
              return (
                <div key={index} className="flex flex-col items-center relative z-10 w-full md:w-1/3">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center border-2 shadow-sm mb-6 bg-transparent backdrop-blur-sm" 
                    style={{ borderColor: accentColor, color: accentColor }}
                  >
                    <Icon size={28} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-2" style={{ color: accentColor }}>{item.time}</h3>
                  <h4 className="text-xl font-medium mb-2" style={{ color: 'white' }}>{item.title}</h4>
                  <p className="text-white/70 font-light text-center">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5: Locations & Maps */}
      <section id="ubicaciones" className="w-full py-24 px-6 text-center" style={{ backgroundColor: mainColor }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-sm uppercase tracking-[0.4em] mb-16 opacity-80" style={{ color: accentColor }}>
            Ubicaciones
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {eventData.locations.map((loc, idx) => (
              <div key={idx} className="bg-white/5 border rounded-3xl overflow-hidden flex flex-col transition-transform hover:-translate-y-1 duration-300" style={{ borderColor: `${accentColor}20` }}>
                {/* Map iframe */}
                <div className="w-full h-72 bg-slate-800 relative">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    loading="lazy" 
                    allowFullScreen 
                    src={`https://maps.google.com/maps?q=${loc.coordinates.lat},${loc.coordinates.lng}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                  ></iframe>
                </div>
                
                {/* Info */}
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center justify-center gap-3 mb-4" style={{ color: accentColor }}>
                    <MapPin size={24} />
                    <h3 className="text-2xl font-serif">{loc.type}</h3>
                  </div>
                  <p className="text-xl font-medium mb-2">{loc.name}</p>
                  <p className="text-white/60 mb-8 font-light text-sm">{loc.address}</p>
                  
                  <div className="mt-auto flex justify-center gap-4">
                    <a 
                      href={loc.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 rounded-full flex items-center justify-center transition-colors border shadow-lg"
                      style={{ backgroundColor: accentColor, color: mainColor, borderColor: accentColor }}
                      title="Abrir en Google Maps"
                    >
                      <Map size={24} />
                    </a>
                    {loc.wazeLink && (
                      <a 
                        href={loc.wazeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-14 h-14 rounded-full flex items-center justify-center transition-colors border shadow-lg hover:bg-white/10"
                        style={{ color: accentColor, borderColor: `${accentColor}50` }}
                        title="Abrir en Waze"
                      >
                        <Navigation size={24} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer mainColor="#0F0F0F" accentColor={accentColor} />
    </main>
  );
}
