import { cacheTag } from "next/cache";
import { getSliderGlobalTag } from "../db/cache";
import { db } from "@/drizzle/db";
import Image from "next/image";
import { CarouselItem } from "@/components/ui/carousel";
import Link from "next/link";

export async function SliderList() {
  const sliders = await getAllSliders();

  return (
    <>
      {sliders.map((slider) => (
        <CarouselItem key={slider.id}>
          <div className="relative h-[360px] rounded-3xl overflow-hidden">
            <Link href={slider.link}>
              <Image
                src={slider.imagePath}
                alt="slider image"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 flex items-end p-8"></div>
            </Link>
          </div>
        </CarouselItem>
      ))}
    </>
  );
}

async function getAllSliders() {
  "use cache";
  cacheTag(getSliderGlobalTag());
  return db.query.sliderTable.findMany({
    columns: {
      id: true,
      imagePath: true,
      link: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
