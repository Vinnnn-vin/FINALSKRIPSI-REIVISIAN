// src\app\api\dashboard\lecturer\categories\route.ts
import { NextResponse } from "next/server";
import { Category } from "@/models";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const categories = await Category.findAll({
      attributes: ["category_id", "category_name"],
      order: [["category_name", "ASC"]],
    });

    const formattedCategories = categories.map((cat) => {
      const categoryData = cat.toJSON ? cat.toJSON() : cat;
      console.log("Processing category:", categoryData);

      return {
        value: String(categoryData.category_id),
        label: categoryData.category_name || "Unnamed Category",
      };
    });

    console.log("Formatted categories:", formattedCategories);

    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
