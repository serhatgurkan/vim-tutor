import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface HintComponentProps {
  hint: string | undefined;
  isVisible: boolean;
  onToggle: () => void;
}

export function HintComponent({
  hint,
  isVisible,
  onToggle,
}: HintComponentProps) {
  if (!hint) return null;

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={onToggle}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full",
          "text-sm font-medium transition-all duration-200",
          "hover:bg-accent",
          isVisible
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground"
        )}
      >
        <Lightbulb className="w-4 h-4" />
        {isVisible ? "İpucu gizle" : "İpucu göster"}
      </button>

      {isVisible && (
        <div
          className={cn(
            "px-6 py-3 rounded-xl",
            "bg-primary/5 border border-primary/20",
            "text-primary text-center font-medium",
            "animate-in fade-in-0 zoom-in-95 duration-200"
          )}
        >
          💡 {hint}
        </div>
      )}
    </div>
  );
}
