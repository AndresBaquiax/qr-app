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
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#D4AF37] selection:text-white flex items-center justify-center p-4" style={{ '--primary': eventData.theme.mainColor, '--accent': eventData.theme.accentColor } as any}>
      {/* RSVP Section */}
      <section className="py-20 px-4">
        <div className="max-w-xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 text-center relative overflow-hidden">
          {/* Decoración esquina */}
          <div className="absolute -top-10 -right-10 opacity-10">
            <Stars size={120} style={{ color: 'var(--accent)' }} />
          </div>

          <h2 className="text-3xl font-serif mb-8" style={{ color: 'var(--primary)' }}>RSVP</h2>
          
          {success ? (
            <div className="animate-fade-in">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
                <CheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-serif mb-4" style={{ color: 'var(--primary)' }}>¡Gracias por confirmar!</h3>
              <p className="text-slate-600 mb-4">
                Tu respuesta ha sido registrada exitosamente. Nos vemos en la celebración.
              </p>
              <p className="text-sm font-medium" style={{ color: 'var(--accent)' }}>Redirigiendo a los detalles del evento...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <p className="text-center text-slate-600 mb-8">
                Por favor, confirma tu asistencia antes del 1 de Agosto.
              </p>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Teléfono de Contacto (Opcional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 bg-white placeholder-gray-400 focus:ring-2 focus:outline-none"
                  style={{ '--tw-ring-color': 'var(--primary)' } as any}
                  placeholder="Escribe tu número de teléfono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">¿Asistirás al evento?</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setIsAttending(true)}
                    className={clsx(
                      "py-4 rounded-xl font-medium transition-all border-2",
                      isAttending === true 
                        ? "border-[color:var(--primary)] text-[color:var(--primary)] bg-[color:var(--primary)] bg-opacity-5" 
                        : "border-slate-100 text-slate-500 hover:border-slate-300"
                    )}
                  >
                    Sí, asistiré
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAttending(false)}
                    className={clsx(
                      "py-4 rounded-xl font-medium transition-all border-2",
                      isAttending === false 
                        ? "border-red-500 text-red-500 bg-red-50" 
                        : "border-slate-100 text-slate-500 hover:border-slate-300"
                    )}
                  >
                    No podré asistir
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || isAttending === null}
                className="w-full py-4 mt-4 rounded-xl text-white font-medium transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed shadow-lg"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                {loading ? 'Enviando...' : 'Confirmar Asistencia'}
              </button>
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
      width="24"
      height="24"
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
