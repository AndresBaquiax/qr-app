"use client";

import { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Plus, Download, Users, CheckCircle, XCircle, Copy, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';

type Invitation = {
  id: string;
  token: string;
  familyName: string;
  maxGuests: number;
  phone: string | null;
  hasResponded: boolean;
  isAttending: boolean;
  createdAt: string;
};

export default function AdminPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [familyName, setFamilyName] = useState('');
  const [maxGuests, setMaxGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Definimos la URL base para el QR
    setBaseUrl(window.location.origin);
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const res = await fetch('/api/admin/invitations');
      if (res.ok) {
        const data = await res.json();
        setInvitations(data);
      }
    } catch (error) {
      console.error('Error fetching invitations', error);
    }
  };

  const createInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyName) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/admin/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ familyName, maxGuests }),
      });
      
      if (res.ok) {
        setFamilyName('');
        setMaxGuests(1);
        fetchInvitations();
      }
    } catch (error) {
      console.error('Error creating invitation', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = (token: string, name: string) => {
    const svg = document.getElementById(`qr-${token}`);
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      // Configuramos el tamaño del canvas
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      
      if (ctx) {
        // Fondo blanco
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Dibujar QR
        ctx.drawImage(img, 20, 20);
        
        // Exportar a PNG
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `QR_${name.replace(/\s+/g, '_')}.png`;
        downloadLink.href = `${pngFile}`;
        downloadLink.click();
      }
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  // Filtrado y Paginación
  const filteredInvitations = invitations.filter((inv) => {
    // Filtro por búsqueda
    const matchesSearch = inv.familyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por estado
    let matchesStatus = true;
    if (statusFilter === 'pending') {
      matchesStatus = !inv.hasResponded;
    } else if (statusFilter === 'attending') {
      matchesStatus = inv.hasResponded && inv.isAttending;
    } else if (statusFilter === 'not_attending') {
      matchesStatus = inv.hasResponded && !inv.isAttending;
    }

    return matchesSearch && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvitations = filteredInvitations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInvitations.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">Panel de Administración - Invitaciones</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 text-slate-800">Nueva Invitación</h2>
              <form onSubmit={createInvitation} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre (Ej: Familia Perez)</label>
                  <input
                    type="text"
                    required
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Familia Perez"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad de Personas</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={maxGuests}
                    onChange={(e) => setMaxGuests(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  <Plus size={18} />
                  {loading ? 'Generando...' : 'Generar Invitación y QR'}
                </button>
              </form>
            </div>
            
            {/* Resumen */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
              <h2 className="text-xl font-semibold mb-4 text-slate-800">Resumen</h2>
              <div className="space-y-3">
                {/* Globales */}
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-900 font-medium">Total Invitaciones</span>
                  <span className="text-xl font-bold text-blue-900">{invitations.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-100/50 rounded-lg">
                  <span className="text-blue-900 font-medium">Total Personas</span>
                  <span className="text-xl font-bold text-blue-900">
                    {invitations.reduce((acc, i) => acc + i.maxGuests, 0)}
                  </span>
                </div>

                <hr className="border-gray-100 my-2" />
                
                {/* Confirmados */}
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-green-900 font-medium">Familias Confirmadas</span>
                  <span className="text-xl font-bold text-green-900">
                    {invitations.filter(i => i.hasResponded && i.isAttending).length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-100/50 rounded-lg">
                  <span className="text-green-900 font-medium">Personas Confirmadas</span>
                  <span className="text-xl font-bold text-green-900">
                    {invitations.filter(i => i.hasResponded && i.isAttending).reduce((acc, i) => acc + i.maxGuests, 0)}
                  </span>
                </div>

                <hr className="border-gray-100 my-2" />

                {/* Rechazados */}
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-red-900 font-medium">Familias Rechazadas</span>
                  <span className="text-xl font-bold text-red-900">
                    {invitations.filter(i => i.hasResponded && !i.isAttending).length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-100/50 rounded-lg">
                  <span className="text-red-900 font-medium">Personas Rechazadas</span>
                  <span className="text-xl font-bold text-red-900">
                    {invitations.filter(i => i.hasResponded && !i.isAttending).reduce((acc, i) => acc + i.maxGuests, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Invitaciones */}
          <div className="col-span-1 md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-slate-800">Lista de Invitados</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Buscar invitado..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full sm:w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 bg-white"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Filter size={16} className="text-gray-400" />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm w-full sm:w-auto appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-slate-900"
                    >
                      <option value="all">Todos los estados</option>
                      <option value="pending">Pendiente</option>
                      <option value="attending">Asistirá</option>
                      <option value="not_attending">No Asistirá</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-sm">
                      <th className="p-4 font-medium">Invitado</th>
                      <th className="p-4 font-medium">Personas</th>
                      <th className="p-4 font-medium">Estado</th>
                      <th className="p-4 font-medium">Código QR</th>
                      <th className="p-4 font-medium">Enlace</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentInvitations.map((inv) => {
                      const qrUrl = `${baseUrl}/invitacion/${inv.token}`;
                      return (
                        <tr key={inv.id} className="hover:bg-gray-50/50">
                          <td className="p-4">
                            <p className="font-medium text-slate-900">{inv.familyName}</p>
                            {inv.phone && <p className="text-sm text-gray-500">{inv.phone}</p>}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1 text-gray-600">
                              <Users size={16} />
                              <span>{inv.maxGuests}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            {!inv.hasResponded ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Pendiente
                              </span>
                            ) : inv.isAttending ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle size={14} /> Asistirá
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <XCircle size={14} /> No Asistirá
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-4">
                              <div className="hidden">
                                <QRCodeSVG
                                  id={`qr-${inv.token}`}
                                  value={qrUrl}
                                  size={1024}
                                  level="H"
                                  includeMargin={true}
                                />
                              </div>
                              <a href={qrUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity cursor-pointer" title="Haz clic para probar el enlace">
                                <QRCodeSVG
                                  value={qrUrl}
                                  size={48}
                                  level="M"
                                />
                              </a>
                              <button
                                onClick={() => downloadQR(inv.token, inv.familyName)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Descargar QR en PNG"
                              >
                                <Download size={20} />
                              </button>
                            </div>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(qrUrl);
                                setCopiedId(inv.id);
                                setTimeout(() => setCopiedId(null), 2000);
                              }}
                              className={`flex items-center gap-2 font-medium transition-colors ${
                                copiedId === inv.id ? 'text-green-600' : 'text-blue-600 hover:text-blue-800'
                              }`}
                            >
                              <Copy size={16} />
                              <span>{copiedId === inv.id ? '¡Copiado!' : 'Copiar link'}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredInvitations.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-500">
                          {invitations.length === 0 
                            ? 'No hay invitaciones creadas todavía.' 
                            : 'No se encontraron invitaciones con los filtros actuales.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Controles de Paginación */}
              {filteredInvitations.length > 0 && (
                <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Mostrar</span>
                    <select 
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1); // Reset to first page
                      }}
                      className="border border-gray-300 rounded-md text-sm px-2 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-slate-900"
                    >
                      {[5, 10, 15, 20, 25].map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <span className="text-sm text-gray-600">por página</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors bg-white"
                      title="Página Anterior"
                    >
                      <ChevronLeft size={20} className="text-gray-600" />
                    </button>
                    <span className="text-sm text-gray-600 font-medium px-2">
                      Página {currentPage} de {totalPages || 1}
                    </span>
                    <button 
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="p-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors bg-white"
                      title="Página Siguiente"
                    >
                      <ChevronRight size={20} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
