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
  fontFamily?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  showSearchBar?: boolean;
  showFooter?: boolean;
}

// Helper function to get auth token safely
function getAuthToken(): string {
  const authHeader = headers().get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.slice(7) 
    : authHeader;
  return token;
}

// Helper function to verify store access via API Gateway
async function verifyStoreAccess(): Promise<HasStoreResponse> {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('No authentication token provided');
    }

    // ✅ Use Kubernetes DNS for internal service calls
    const apiUrl = `http://api-gateway-service/api/stores/has-store`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(2000), // 2 second timeout
    });

    if (!response.ok) {
      console.error(`API returned status ${response.status}`);
      throw new Error('Failed to verify store access');
    }

    const data = await response.json() as HasStoreResponse;
    return data;
  } catch (error) {
    console.error('Error verifying store access:', error);
    throw error;
  }
}

export async function createWebStore(input: StoreSettingsInput, userId: string) {
  try {
    // Verify user has a store
    const hasStoreData = await verifyStoreAccess();

    if (hasStoreData.hasStore !== true || !hasStoreData.storeId) {
      throw new Error('User does not have a valid store');
    }

    // Create new store settings
    const storeSettings = await db.storeSettings.create({
      data: {
        userId,
        storeId: hasStoreData.storeId,
        templateId: input.templateId,
        primaryColor: input.primaryColor,
        secondaryColor: input.secondaryColor,
        fontFamily: input.fontFamily,
        facebookUrl: input.facebookUrl,
        instagramUrl: input.instagramUrl,
        twitterUrl: input.twitterUrl,
        showSearchBar: input.showSearchBar,
        showFooter: input.showFooter,
      },
    });

    return storeSettings;
  } catch (error) {
    console.error('Error creating web store:', error);
    throw error;
  }
}

export async function updateWebStore(input: StoreSettingsInput) {
  try {
    // Check if store exists and user has access
    const hasStoreData = await verifyStoreAccess();

    if (hasStoreData.hasStore !== true || !hasStoreData.storeId) {
      throw new Error('Unauthorized to update this store');
    }

    // Update store settings
    const updatedSettings = await db.storeSettings.update({
      where: {
        storeId: hasStoreData.storeId,
      },
      data: {
        templateId: input.templateId,
        primaryColor: input.primaryColor,
        secondaryColor: input.secondaryColor,
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
        storeId: id,
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

export async function patchWebStore(input: Partial<StoreSettingsInput>) {
  try {
    // Check if store exists and user has access
    const hasStoreData = await verifyStoreAccess();

    if (hasStoreData.hasStore !== true || !hasStoreData.storeId) {
      throw new Error('Unauthorized to update this store');
    }

    // Patch store settings (only update provided fields)
    const patchedSettings = await db.storeSettings.update({
      where: {
        storeId: hasStoreData.storeId,
      },
      data: input,
    });

    return patchedSettings;
  } catch (error) {
    console.error('Error patching web store:', error);
    throw error;
  }
}

export async function getEStoreByToken() {
  try {
    const hasStoreData = await verifyStoreAccess();

    if (hasStoreData.hasStore !== true || !hasStoreData.storeId) {
      return { hasEStore: false };
    }

    // Get store settings without authorization
    const storeSettings = await db.storeSettings.findUnique({
      where: {
        storeId: hasStoreData.storeId,
      },
    });

    if (!storeSettings) {
      return { hasEStore: false };
    }

    return {
      ...storeSettings,
      hasEStore: true,
    };
  } catch (error) {
    console.error('Error fetching web store:', error);
    return { hasEStore: false };
  }
}