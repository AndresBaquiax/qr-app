import { Mail, MapPin } from 'lucide-react';

export default function Footer({ mainColor, accentColor }: { mainColor: string, accentColor: string }) {
  return (
    <footer 
      className="py-12 px-6 lg:px-24 flex flex-col md:flex-row justify-between items-start md:items-center text-sm border-t border-white/10" 
      style={{ backgroundColor: mainColor, color: 'white' }}
    >
      <div className="max-w-sm mb-8 md:mb-0">
        <h3 className="text-2xl font-serif mb-4" style={{ color: accentColor }}>
          15 Años de Jimena Fernanda
        </h3>
        <p className="opacity-70 leading-relaxed font-light text-sm">
          Preservando y compartiendo la alegría de celebrar la vida. 
          Un momento único de fe, arte y cultura familiar que une a generaciones.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h4 className="font-semibold text-lg mb-2" style={{ color: accentColor }}>Contacto</h4>
        <div className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
          <MapPin size={18} style={{ color: accentColor }} />
          <span className="font-light">Quetzaltenango, Guatemala</span>
        </div>
        <div className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
          <Mail size={18} style={{ color: accentColor }} />
          <a href="mailto:baquiax.diegoandres@gmail.com" className="font-light">
            baquiax.diegoandres@gmail.com
          </a>
        </div>
      </div>
      
      {/* Copyright/Rights section at the very bottom on small screens or right side on large */}
      <div className="w-full md:w-auto mt-12 md:mt-0 md:self-end opacity-50 text-xs font-light text-center md:text-right">
        <p>© 2026 Jimena Fernanda. Todos los derechos reservados.</p>
        <p className="mt-1">Hecho con ♥ en Guatemala</p>
      </div>
    </footer>
  );
}
