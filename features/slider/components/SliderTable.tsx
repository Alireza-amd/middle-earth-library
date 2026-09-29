import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllSliders } from "../db/slider";
import { PageHeader } from "@/components/PageHeader";
import { formatPlurals } from "@/lib/formatters";
import { SliderFormDialog } from "./SliderFormDialog";
import { ActionButton } from "@/components/ActionButton";
import { deleteSliderItem } from "../action/slider";
import { TrashIcon } from "lucide-react";
import Image from "next/image";

export async function SliderTable() {
  const sliders = await getAllSliders();

  return (
    <>
      <PageHeader
        title={formatPlurals(sliders.length, {
          plural: "Slider Items",
          singular: "Slider Item",
        })}
      >
        <SliderFormDialog />
      </PageHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Link</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead>Updated at</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sliders.map((slider: SliderTableItem) => (
            <TableRow key={slider.id}>
              <TableCell>
                <div className="aspect-video size-24 relative overflow-hidden rounded-lg bg-slate-950">
                  <Image
                    src={slider.imagePath}
                    alt="slider image"
                    fill
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell>
                <a
                  href={slider.link}
                  className="text-amber-500 hover:underline truncate block max-w-[180px]"
                >
                  {slider.link}
                </a>
              </TableCell>
              <TableCell>
                {new Date(slider.createdAt).toLocaleString()}
              </TableCell>
              <TableCell>
                {new Date(slider.updatedAt).toLocaleString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <ActionButton
                    variant="destructive"
                    action={deleteSliderItem.bind(null, slider.id)}
                    requiredAreYouSure
                    refreshOnSuccess
                  >
                    <TrashIcon size={16} />
                  </ActionButton>
                  <SliderFormDialog slider={slider} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

type SliderTableItem = {
  id: string;
  imagePath: string;
  link: string;
  createdAt: Date;
  updatedAt: Date;
};
