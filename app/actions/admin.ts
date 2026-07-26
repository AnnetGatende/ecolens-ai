"use server"

import { PrismaClient } from '@prisma/client'

// Safely instantiate Prisma for Next.js Server Actions
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}
const prisma = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function getAdminData() {
  try {
    const admins = await prisma.adminProfile.findMany({
      orderBy: { createdAt: "desc" }
    });
    
    return {
      count: admins.length === 0 ? 1 : admins.length,
      profiles: admins
    };
  } catch (error) {
    console.error("Failed to fetch admin data:", error);
    return { count: 1, profiles: [] };
  }
}

export async function saveAdminProfile(name: string, role: string, initials: string, role_sw: string) {
  try {
    // Prevent duplicating the counter if the same admin edits their profile
    const existingAdmin = await prisma.adminProfile.findFirst({
      where: { name }
    });

    if (!existingAdmin) {
      await prisma.adminProfile.create({
        data: { name, role, initials, role_sw }
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error("Failed to save admin profile:", error);
    return { success: false };
  }
}