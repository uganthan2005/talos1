"use client";

import Link from "next/link";
import { CometCard } from "@/components/ui/comet-card";

type EventCometCardProps = {
  title: string;
  code: string;
  image: string;
  slug: string;
};

export function EventCometCard({
  title,
  code,
  image,
  slug,
}: EventCometCardProps) {
  return (
    <CometCard>
      <Link href={`/events/${slug}`} aria-label={`View event ${title}`}>
        <div
          className="my-10 flex w-80 cursor-pointer flex-col items-stretch rounded-[16px] border-0 bg-[#1F2121] p-2 saturate-0 md:my-20 md:p-4"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* IMAGE */}
          <div className="mx-2 flex-1">
            <div className="relative mt-2 aspect-[3/4] w-full">
              <img
                loading="lazy"
                src={image}
                alt={title}
                className="absolute inset-0 h-full w-full rounded-[16px] bg-black object-cover contrast-75"
                style={{
                  boxShadow: "rgba(0, 0, 0, 0.05) 0px 5px 6px 0px",
                }}
              />
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-2 flex items-center justify-between p-4 font-mono text-white">
            <div className="text-xs">{title}</div>
            <div className="text-xs text-gray-300 opacity-50">
              #{code}
            </div>
          </div>
        </div>
      </Link>
    </CometCard>
  );
}
