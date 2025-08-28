
import {type NextRequest } from "next/server";
import { setDefaultAddress } from "~/server/address/server";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const address = await setDefaultAddress(params.id);
    return Response.json({ 
      success: true, 
      data: address,
      message: "Default address updated successfully"
    });
  } catch (error) {
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to set default address" 
      },
      { 
        status: error instanceof Error && 
        (error.message === "Unauthorized" || error.message === "Address not found or unauthorized") 
          ? 404 : 500 
      }
    );
  }
}