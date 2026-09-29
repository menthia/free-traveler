import { REPRESENTATIVE_PROFILE } from "@/data/representative";

export default function Timeline() {
  const { timeline } = REPRESENTATIVE_PROFILE;

  return (
    <ol className="flex flex-col gap-6 border-l-2 border-[#E4E0DC] pl-6">
      {timeline.map((entry) => (
        <li key={`${entry.year}-${entry.title}`} className="relative">
          <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-[#FF6A4D]" />
          <p className="text-[13px] font-semibold text-[#FF6A4D]">{entry.year}</p>
          <p className="mt-1 text-[17px] font-semibold text-[#262425]">{entry.title}</p>
          <p className="mt-1 text-[14px] leading-[1.6] text-[#4B4749]">{entry.description}</p>
        </li>
      ))}
    </ol>
  );
}
