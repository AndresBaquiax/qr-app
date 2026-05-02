import { notFound } from 'next/navigation';
import { InvitationService } from '@/lib/services/invitationService';
import { ConfigurationService } from '@/lib/services/configurationService';
import ClientRSVP from './ClientRSVP';
import eventData from '@/data/event_info.json';

// En Next.js 15/16 (App Router), `params` es una Promise o debe usarse con cuidado. 
export const dynamic = 'force-dynamic';

export default async function InvitationPage(props: { params: Promise<{ token: string }> }) {
  const params = await props.params;
  const token = params.token;
  
  if (!token) {
    notFound();
  }

  // Obtenemos la invitación desde el servicio en el servidor
  const invitation = await InvitationService.getInvitationByToken(token);

  if (!invitation) {
    notFound();
  }

  // Serializamos los datos para enviarlos al componente cliente (asegurando que las fechas sean string si es necesario, aunque en Server Components se serializa bien)
  const plainInvitation = {
    ...invitation,
    createdAt: invitation.createdAt.toISOString(),
    updatedAt: invitation.updatedAt.toISOString(),
  };

  // Obtenemos las configuraciones de colores si existen
  const mainColor = await ConfigurationService.getConfig('mainColor', eventData.theme.mainColor);
  const accentColor = await ConfigurationService.getConfig('accentColor', eventData.theme.accentColor);

  const customEventData = {
    ...eventData,
    theme: {
      ...eventData.theme,
      mainColor,
      accentColor
    }
  };

  return (
    <ClientRSVP 
      invitation={plainInvitation} 
      eventData={customEventData} 
    />
  );
}
