import Image from "next/image";
import { REPRESENTATIVE_PROFILE } from "@/data/representative";

export default function Gallery() {
  const { gallery } = REPRESENTATIVE_PROFILE;

  return (
    <div>
      <h2 className="mb-4 text-[20px] font-semibold text-[#262425]">여행 Gallery</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible">
        {gallery.map((image) => (
          <div
            key={image.url}
            className="relative h-40 w-40 shrink-0 overflow-hidden rounded-[16px] md:h-32 md:w-full"
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="(min-width: 768px) 25vw, 160px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
