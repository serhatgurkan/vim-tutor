import type { VimShortcut } from "@/data/vimShortcuts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DifficultyFilterProps {
  selectedDifficulty: VimShortcut["difficulty"] | "all";
  onSelect: (difficulty: VimShortcut["difficulty"] | "all") => void;
}

const difficulties: {
  value: VimShortcut["difficulty"] | "all";
  label: string;
  icon: string;
}[] = [
  { value: "all", label: "Tümü", icon: "📚" },
  { value: "beginner", label: "Başlangıç", icon: "🌱" },
  { value: "intermediate", label: "Orta", icon: "🌿" },
  { value: "advanced", label: "İleri", icon: "🌳" },
];

export function DifficultyFilter({
  selectedDifficulty,
  onSelect,
}: DifficultyFilterProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap justify-center">
      <span className="text-sm text-muted-foreground mr-2">Zorluk:</span>
      {difficulties.map((diff) => (
        <Button
          key={diff.value}
          variant={selectedDifficulty === diff.value ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(diff.value)}
          className={cn(
            "transition-all duration-200",
            selectedDifficulty === diff.value && "shadow-md"
          )}
        >
          <span className="mr-1">{diff.icon}</span>
          {diff.label}
        </Button>
      ))}
    </div>
  );
}

interface QuickStatsProps {
  totalShortcuts: number;
  completedCount: number;
}

export function QuickStats({
  totalShortcuts,
  completedCount,
}: QuickStatsProps) {
  const percentage = Math.round((completedCount / totalShortcuts) * 100);

  return (
    <div className="flex items-center gap-4 justify-center">
      <Badge variant="outline" className="px-4 py-2">
        📊 Toplam: {totalShortcuts}
      </Badge>
      <Badge variant="secondary" className="px-4 py-2">
        ✅ Tamamlanan: {completedCount}
      </Badge>
      <Badge
        variant={percentage === 100 ? "default" : "outline"}
        className="px-4 py-2"
      >
        🎯 %{percentage}
      </Badge>
    </div>
  );
}
