import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getCurrentUser } from "@/auth/currentUser";

export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser({
    redirectIfNotFound: false,
  });

  if (!currentUser || currentUser.role !== "admin") {
    return NextResponse.json(
      {
        error: true,
        message: "Unauthorized.",
      },
      {
        status: 401,
      },
    );
  }

  const formData = await request.formData();

  const image = formData.get("image");

  if (!image || typeof image === "string") {
    return NextResponse.json(
      {
        error: true,
        message: "Image file is required.",
      },
      {
        status: 400,
      },
    );
  }

  const file = image as File;

  const buffer = Buffer.from(await file.arrayBuffer());

  const ext = path.extname(file.name) || ".png";

  const fileName = `${crypto.randomUUID()}${ext}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads", "books");

  await fs.mkdir(uploadDir, {
    recursive: true,
  });

  await fs.writeFile(path.join(uploadDir, fileName), buffer);

  return NextResponse.json({
    error: false,
    imagePath: `/uploads/books/${fileName}`,
  });
}
