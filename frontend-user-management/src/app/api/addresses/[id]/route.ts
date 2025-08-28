
import {type NextRequest } from "next/server";
import { getAddress, updateAddress, deleteAddress } from "~/server/address/server";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const address = await getAddress(params.id);
    return Response.json({ 
      success: true, 
      data: address 
    });
  } catch (error) {
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to fetch address" 
      },
      { 
        status: error instanceof Error && 
        (error.message === "Unauthorized" || error.message === "Address not found or unauthorized") 
          ? 404 : 500 
      }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    
    // Remove fields that shouldn't be updated (including userId)
    const { id, userId, createdAt, updatedAt, ...updateData } = body;
    
    const address = await updateAddress(params.id, updateData);
    return Response.json({ 
      success: true, 
      data: address 
    });
  } catch (error) {
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to update address" 
      },
      { 
        status: error instanceof Error && 
        (error.message === "Unauthorized" || error.message === "Address not found or unauthorized") 
          ? 404 : 500 
      }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await deleteAddress(params.id);
    return Response.json({ 
      success: true, 
      message: "Address deleted successfully" 
    });
  } catch (error) {
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to delete address" 
      },
      { 
        status: error instanceof Error && 
        (error.message === "Unauthorized" || error.message === "Address not found or unauthorized") 
          ? 404 : 500 
      }
    );
  }
}