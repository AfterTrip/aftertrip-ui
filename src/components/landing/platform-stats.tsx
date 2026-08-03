import { Globe2, HeartHandshake, Star, UsersRound } from "lucide-react";

const stats = [
  { value: "50K+", label: "Trips Shared", icon: UsersRound },
  { value: "120+", label: "Countries", icon: Globe2 },
  { value: "2M+", label: "Travelers", icon: HeartHandshake },
  { value: "4.9/5", label: "Community Rating", icon: Star }
] as const;

export function PlatformStats() {
  return (
    <div className="platform-stats" aria-label="AfterTrip platform statistics">
      {stats.map(({ value, label, icon: Icon }) => (
        <div className="stat-item" key={label}>
          <Icon aria-hidden="true" size={24} />
          <div>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
