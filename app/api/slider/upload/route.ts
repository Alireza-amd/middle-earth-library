import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getCurrentUser } from "@/auth/currentUser";
import { insertSlider, updateSlider } from "@/features/slider/db/slider";
import { revalidateSliderCache } from "@/features/slider/db/cache";

export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser({ redirectIfNotFound: false });
  if (!currentUser || currentUser.role !== "admin") {
    return NextResponse.json(
      { error: true, message: "Unauthorized." },
      { status: 401 },
    );
  }

  const formData = await request.formData();
  const image = formData.get("image");
  const link = formData.get("link");
  const sliderId = formData.get("sliderId");

  if (!image || typeof image === "string") {
    return NextResponse.json(
      { error: true, message: "Image file is required." },
      { status: 400 },
    );
  }

  if (!link || typeof link !== "string") {
    return NextResponse.json(
      { error: true, message: "Link is required." },
      { status: 400 },
    );
  }

  const file = image as File;
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || ".png";
  const fileName = `${crypto.randomUUID()}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "sliders");

  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, fileName), buffer);

  const imagePath = `/uploads/sliders/${fileName}`;

  if (sliderId && typeof sliderId === "string") {
    const updated = await updateSlider(sliderId, { imagePath, link });
    revalidateSliderCache(updated.id);
    return NextResponse.json({
      error: false,
      message: "Slider updated successfully.",
      data: updated,
    });
  }

  const slider = await insertSlider({ imagePath, link });
  revalidateSliderCache(slider.id);

  return NextResponse.json({
    error: false,
    message: "Slider created successfully.",
    data: slider,
  });
}
