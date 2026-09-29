import Image from "next/image";
import { REPRESENTATIVE_PROFILE } from "@/data/representative";

export default function ProfileHero() {
  const { name, tagline, heroImage } = REPRESENTATIVE_PROFILE;
  const oneLineIntro =
    REPRESENTATIVE_PROFILE.intro.split(".")[0]?.trim() ?? REPRESENTATIVE_PROFILE.intro;

  return (
    <section className="relative flex h-[460px] items-end overflow-hidden md:h-[480px]">
      <Image
        src={heroImage.url}
        alt={heroImage.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(rgba(38,36,37,0), rgba(38,36,37,0.55))" }}
      />
      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 pb-10 text-white">
        <p className="text-[13px] font-medium text-white/80">{tagline}</p>
        <h1 className="text-[28px] font-bold leading-[1.3] md:text-[36px]">{name}</h1>
        <p className="mt-2 max-w-xl text-[16px] leading-[1.6] text-white/90">{oneLineIntro}.</p>
      </div>
    </section>
  );
}
