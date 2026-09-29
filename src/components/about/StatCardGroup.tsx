import { REPRESENTATIVE_PROFILE } from "@/data/representative";

export default function StatCardGroup() {
  const { stats } = REPRESENTATIVE_PROFILE;
  const items = [
    { label: "여행 횟수", value: `${stats.trips}+`, unit: "Trips" },
    { label: "방문 국가", value: `${stats.countries}+`, unit: "Countries" },
    { label: "방문 권역", value: `${stats.regions}`, unit: "Regions" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[16px] border border-[#E4E0DC] bg-white p-6 text-center"
        >
          <p className="text-[13px] text-[#78737A]">{item.label}</p>
          <p className="mt-1 text-[26px] font-bold text-[#262425]">
            {item.value}{" "}
            <span className="text-[17px] font-semibold text-[#78737A]">{item.unit}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
