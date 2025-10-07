import { db } from "../db";
import { headers } from "next/headers";

interface HasStoreResponse {
  hasStore: boolean;
  storeId: string | null;
}

interface StoreSettingsInput {
  templateId?: string;
  primaryColor?: string;
  secondaryColor?: string;
  bannerImageUrl?: string;
  fontFamily?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  showSearchBar?: boolean;
  showFooter?: boolean;
}

export async function createWebStore(input: StoreSettingsInput, userId: string) {
  try {
    // First, check if user has a store using the API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stores/has-store`, {
      headers: {
        'Authorization': `Bearer ${headers().get('authorization')?.split(' ')[1] || ''}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to verify store access');
    }

    const hasStoreData = await response.json() as HasStoreResponse;

    // If user already has a store, update it instead
    if (hasStoreData.hasStore !== true || !hasStoreData.storeId) {
      throw new Error('User does not have a valid store');
    }

    // Create new store settings
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const storeSettings = await db.storeSettings.create({
      data:  {
        userId,
        storeId: hasStoreData.storeId ,
        templateId: input.templateId,
        primaryColor: input.primaryColor,
        secondaryColor: input.secondaryColor,
        bannerImageUrl: input.bannerImageUrl,
        fontFamily: input.fontFamily,
        facebookUrl: input.facebookUrl,
        instagramUrl: input.instagramUrl,
        twitterUrl: input.twitterUrl,
        showSearchBar: input.showSearchBar,
        showFooter: input.showFooter,
      } ,
    });

    return storeSettings;
  } catch (error) {
    console.error('Error creating web store:', error);
    throw error;
  }
}

export async function updateWebStore( input: StoreSettingsInput) {
  try {
    // Check if store exists and user has access
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stores/has-store`, {
      headers: {
        'Authorization': `Bearer ${headers().get('authorization')?.split(' ')[1] || ''}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to verify store access');
    }

    const hasStoreData = await response.json() as HasStoreResponse;
    if (hasStoreData.hasStore !== true || !hasStoreData.storeId) {
      throw new Error('Unauthorized to update this store');
    }

    // Update store settings
    const updatedSettings = await db.storeSettings.update({
      where: {
        storeId: hasStoreData.storeId
      },
      data: {
        templateId: input.templateId,
        primaryColor: input.primaryColor,
        secondaryColor: input.secondaryColor,
        bannerImageUrl: input.bannerImageUrl,
        fontFamily: input.fontFamily,
        facebookUrl: input.facebookUrl,
        instagramUrl: input.instagramUrl,
        twitterUrl: input.twitterUrl,
        showSearchBar: input.showSearchBar,
        showFooter: input.showFooter,
      },
    });

    return updatedSettings;
  } catch (error) {
    console.error('Error updating web store:', error);
    throw error;
  }
}

export async function getWebStore(id: string) {
  try {
    // Get store settings without authorization
    const storeSettings = await db.storeSettings.findUnique({
      where: {
        id: id ,
      },
    });

    if (!storeSettings) {
      throw new Error('Store settings not found');
    }

    return storeSettings;
  } catch (error) {
    console.error('Error fetching web store:', error);
    throw error;
  }
}

export async function patchWebStore( input: Partial<StoreSettingsInput>) {
  try {
    // Check if store exists and user has access
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stores/has-store`, {
      headers: {
        'Authorization': `Bearer ${headers().get('authorization')?.split(' ')[1] || ''}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to verify store access');
    }

    const hasStoreData = await response.json() as HasStoreResponse;
    if (hasStoreData.hasStore !== true || !hasStoreData.storeId) {
      throw new Error('Unauthorized to update this store');
    }

    // Patch store settings (only update provided fields)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const patchedSettings = await db.storeSettings.update({
      where: {
        storeId: hasStoreData.storeId
      },
      data: input,
    });

    return patchedSettings;
  } catch (error) {
    console.error('Error patching web store:', error);
    throw error;
  }
}