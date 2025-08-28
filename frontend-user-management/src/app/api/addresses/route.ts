// app/api/addresses/route.ts
import { type NextRequest } from "next/server";
import { createAddress, getCurrentUserAddresses } from "~/server/address/server";

export async function GET() {
  try {
    const addresses = await getCurrentUserAddresses();
    return Response.json({ 
      success: true, 
      data: addresses 
    });
  } catch (error) {
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to fetch addresses" 
      }, 
      { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields (no userId needed - comes from session)
    const { street, city, state, postalCode } = body;
    if (!street || !city || !state || !postalCode) {
      return Response.json(
        { 
          success: false, 
          error: "Missing required fields: street, city, state, postalCode" 
        },
        { status: 400 }
      );
    }

    const address = await createAddress({
      street,
      city,
      state,
      postalCode,
      latitude: body.latitude || null,
      longitude: body.longitude || null,
      isDefault: body.isDefault || false,
    });

    return Response.json({ 
      success: true, 
      data: address 
    }, { status: 201 });
  } catch (error) {
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to create address" 
      },
      { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}