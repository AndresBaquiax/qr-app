"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Stars } from 'lucide-react';
import clsx from 'clsx';

type Invitation = {
  id: string;
  token: string;
  familyName: string;
  maxGuests: number;
  phone: string | null;
  hasResponded: boolean;
  isAttending: boolean;
};

type EventData = {
  theme: {
    title: string;
    mainColor: string;
    accentColor: string;
    fonts: {
      heading: string;
      body: string;
    };
  };
  event: {
    date: string;
    name: string;
  };
};

export default function ClientRSVP({ invitation, eventData }: { invitation: Invitation; eventData: EventData }) {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [isAttending, setIsAttending] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(invitation.hasResponded);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push('/');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAttending === null) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/invitations/${invitation.token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, isAttending }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        alert('Hubo un error al enviar tu confirmación. Intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error submitting form', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main 
      className="min-h-screen relative flex items-center justify-center p-4 selection:bg-[#D4AF37] selection:text-white" 
      style={{ '--primary': eventData.theme.mainColor, '--accent': eventData.theme.accentColor } as any}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-[url('/images/fotoCatedral.webp')] bg-cover bg-center bg-no-repeat"
      />
      {/* Gradients Top and Bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/80" />

      {/* RSVP Section */}
      <section className="relative z-10 w-full max-w-xl mx-auto">
        <div className="bg-white/95 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-2xl border border-white/20 text-center relative overflow-hidden">
          {/* Decoración esquina */}
          <div className="absolute -top-10 -right-10 opacity-20 pointer-events-none">
            <Stars size={140} style={{ color: 'var(--accent)' }} />
          </div>

          <h2 className="text-4xl font-serif mb-6" style={{ color: 'var(--primary)' }}>Confirmación de Asistencia</h2>
          
          {success ? (
            <div className="animate-fade-in py-8">
              <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg transition-transform hover:scale-105" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
                <CheckCircle size={48} />
              </div>
              <h3 className="text-3xl font-serif mb-4" style={{ color: 'var(--primary)' }}>¡Gracias por confirmar!</h3>
              <p className="text-slate-600 mb-6 text-lg">
                Tu respuesta ha sido registrada exitosamente. Nos vemos en la celebración.
              </p>
              <div className="inline-block px-6 py-2 rounded-full bg-slate-100 text-sm font-medium animate-pulse" style={{ color: 'var(--accent)' }}>
                Redirigiendo a los detalles del evento...
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 text-left relative z-10">
              <p className="text-center text-slate-600 mb-8 text-lg font-light">
                Por favor, confirma tu asistencia antes del 17 de Mayo.
              </p>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider">
                  Teléfono de Contacto <span className="text-slate-400 font-normal lowercase">(opcional)</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 text-slate-900 bg-white/80 placeholder-slate-400 focus:ring-2 focus:ring-opacity-50 focus:outline-none transition-shadow"
                  style={{ '--tw-ring-color': 'var(--primary)' } as any}
                  placeholder="+502 1234 5678"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4 text-center">
                  ¿Asistirás al evento?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setIsAttending(true)}
                    className={clsx(
                      "py-4 px-6 rounded-xl font-medium transition-all duration-300 border-2 shadow-sm flex items-center justify-center gap-2",
                      isAttending === true 
                        ? "border-[color:var(--primary)] text-white bg-[color:var(--primary)] shadow-md transform scale-[1.02]" 
                        : "border-slate-200 text-slate-600 bg-white hover:border-[color:var(--primary)] hover:text-[color:var(--primary)]"
                    )}
                  >
                    <CheckCircle size={20} className={isAttending === true ? "opacity-100" : "opacity-0 hidden"} />
                    Sí, asistiré
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAttending(false)}
                    className={clsx(
                      "py-4 px-6 rounded-xl font-medium transition-all duration-300 border-2 shadow-sm",
                      isAttending === false 
                        ? "border-rose-500 text-white bg-rose-500 shadow-md transform scale-[1.02]" 
                        : "border-slate-200 text-slate-600 bg-white hover:border-rose-400 hover:text-rose-500"
                    )}
                  >
                    No podré asistir
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || isAttending === null}
                  suppressHydrationWarning
                  className="w-full py-4 rounded-xl text-white font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:opacity-90 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed disabled:hover:shadow-none shadow-md"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  {loading ? 'Enviando...' : 'Confirmar Asistencia'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

// Minimal icon wrapper since check circle isn't in my initial list
function CheckCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || "24"}
      height={props.size || "24"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
