import { type NextRequest } from "next/server";
import { getWebStore } from "~/server/store/store";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return Response.json({ error: "Store ID is required" }, { status: 400 });
    }

    const result = await getWebStore(id) ;
    return Response.json(result);
  } catch (error) {
    console.error("Error in GET /api/store-settings/[id]:", error);
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}