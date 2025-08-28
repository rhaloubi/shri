import { db } from "~/server/db";
import { auth } from "~/lib/auth";
import { type Address } from "@prisma/client";
import { headers } from "next/headers";

// Helper function to validate session and get user
async function validateUserSession() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }
  
  return session;
}

// Create address
export async function createAddress(
  data: Omit<Address, "id" | "userId" | "createdAt" | "updatedAt">
) {
  const session = await validateUserSession();

  return db.address.create({
    data: {
      ...data,
      userId: session.user.id,
    },
  });
}

// Get all addresses for a user
export async function getUserAddresses() {
  const session = await validateUserSession();

  return db.address.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });
}

// Get single address
export async function getAddress(addressId: string) {
  const session = await validateUserSession();

  const address = await db.address.findUnique({
    where: { id: addressId },
  });

  if (!address || address.userId !== session.user.id) {
    throw new Error("Address not found or unauthorized");
  }

  return address;
}

// Update address
export async function updateAddress(
  addressId: string, 
  data: Partial<Omit<Address, "id" | "userId" | "createdAt" | "updatedAt">>
) {
  const session = await validateUserSession();

  const address = await db.address.findUnique({
    where: { id: addressId },
  });

  if (!address || address.userId !== session.user.id) {
    throw new Error("Address not found or unauthorized");
  }

  return db.address.update({
    where: { id: addressId },
    data,
  });
}

// Delete address
export async function deleteAddress(addressId: string) {
  const session = await validateUserSession();

  const address = await db.address.findUnique({
    where: { id: addressId },
  });

  if (!address || address.userId !== session.user.id) {
    throw new Error("Address not found or unauthorized");
  }

  return db.address.delete({
    where: { id: addressId },
  });
}

// Get current user's addresses (convenience function)
export async function getCurrentUserAddresses() {
  return getUserAddresses();
}

// Set default address
export async function setDefaultAddress(addressId: string) {
  const session = await validateUserSession();

  // First, verify the address belongs to the user
  const address = await getAddress(addressId);
  
  // Remove default from all other addresses for this user
  await db.address.updateMany({
    where: { 
      userId: session.user.id,
      isDefault: true 
    },
    data: { isDefault: false }
  });

  // Set the new default address
  return db.address.update({
    where: { id: addressId },
    data: { isDefault: true }
  });
}