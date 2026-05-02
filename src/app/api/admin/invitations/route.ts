import { NextResponse } from 'next/server';
import { InvitationService } from '@/lib/services/invitationService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { familyName, maxGuests } = body;

    if (!familyName) {
      return NextResponse.json({ error: 'Falta el nombre de la familia o invitado' }, { status: 400 });
    }

    const invitation = await InvitationService.createInvitation(familyName, maxGuests || 1);
    
    return NextResponse.json(invitation, { status: 201 });
  } catch (error) {
    console.error('Error creating invitation:', error);
    return NextResponse.json({ error: 'Error al crear la invitación' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const invitations = await InvitationService.getInvitations();
    return NextResponse.json(invitations);
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json({ error: 'Error al obtener las invitaciones' }, { status: 500 });
  }
}
