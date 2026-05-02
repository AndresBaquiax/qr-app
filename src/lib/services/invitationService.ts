import prisma from '../db';
import { randomBytes } from 'crypto';

export class InvitationService {
  static async createInvitation(familyName: string, maxGuests: number = 1) {
    // Generate a unique token
    const token = randomBytes(8).toString('hex');
    
    const invitation = await prisma.invitation.create({
      data: {
        token,
        familyName,
        maxGuests,
      },
    });
    
    return invitation;
  }

  static async getInvitations() {
    return await prisma.invitation.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getInvitationByToken(token: string) {
    return await prisma.invitation.findUnique({
      where: { token },
    });
  }

  static async respondToInvitation(token: string, phone: string, isAttending: boolean) {
    const invitation = await this.getInvitationByToken(token);
    
    if (!invitation) {
      throw new Error('Invitación no encontrada');
    }
    
    if (invitation.hasResponded) {
      throw new Error('Esta invitación ya fue respondida anteriormente');
    }

    return await prisma.invitation.update({
      where: { token },
      data: {
        phone,
        isAttending,
        hasResponded: true,
      },
    });
  }
}
