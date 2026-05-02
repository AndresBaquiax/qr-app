import { NextResponse } from 'next/server';
import { InvitationService } from '@/lib/services/invitationService';

export async function GET(request: Request, props: { params: Promise<{ token: string }> }) {
  try {
    const params = await props.params;
    const invitation = await InvitationService.getInvitationByToken(params.token);
    
    if (!invitation) {
      return NextResponse.json({ error: 'Invitación no encontrada' }, { status: 404 });
    }

    return NextResponse.json(invitation);
  } catch (error) {
    console.error('Error fetching invitation:', error);
    return NextResponse.json({ error: 'Error al obtener la invitación' }, { status: 500 });
  }
}

export async function POST(request: Request, props: { params: Promise<{ token: string }> }) {
  try {
    const params = await props.params;
    const body = await request.json();
    const { phone, isAttending } = body;

    const invitation = await InvitationService.respondToInvitation(params.token, phone, isAttending);
    
    return NextResponse.json(invitation);
  } catch (error: any) {
    console.error('Error responding to invitation:', error);
    return NextResponse.json({ error: error.message || 'Error al procesar la respuesta' }, { status: 400 });
  }
}
