import { type NextRequest } from "next/server";
import { createWebStore, updateWebStore, patchWebStore } from "~/server/store/store";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return Response.json({ error: "Authorization header required" }, { status: 401 });
    }

    const data = await req.json();
    const result = await createWebStore(data, data.userId);
    return Response.json(result);
  } catch (error) {
    console.error("Error in POST /api/store-settings:", error);
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return Response.json({ error: "Authorization header required" }, { status: 401 });
    }

    const data = await req.json();
    const { storeId, ...input } = data;
    

    const result = await updateWebStore(storeId, input);
    return Response.json(result);
  } catch (error) {
    console.error("Error in PUT /api/store-settings:", error);
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return Response.json({ error: "Authorization header required" }, { status: 401 });
    }

    const data = await req.json();
    const { storeId, ...input } = data;
    

    const result = await patchWebStore(input);
    return Response.json(result);
  } catch (error) {
    console.error("Error in PATCH /api/store-settings:", error);
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}