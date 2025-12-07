import { cn } from "@/lib/utils";

interface KeyboardIndicatorProps {
  keys: string[];
  pressedKeys: string[];
  showAllKeys?: boolean;
}

const keyDisplayMap: Record<string, string> = {
  Ctrl: "⌃ Ctrl",
  Alt: "⌥ Alt",
  Shift: "⇧ Shift",
  Enter: "↵ Enter",
  Escape: "Esc",
  Space: "␣",
  " ": "␣",
};

const getKeyDisplay = (key: string): string => {
  return keyDisplayMap[key] || key;
};

export function KeyboardIndicator({
  keys,
  pressedKeys,
  showAllKeys = true,
}: KeyboardIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {keys.map((key, index) => {
        const isPressed = pressedKeys.includes(key);
        const shouldShow = showAllKeys || pressedKeys.length > index;

        return (
          <div key={`${key}-${index}`} className="flex items-center gap-1">
            {shouldShow ? (
              <kbd
                className={cn(
                  "min-w-[48px] h-12 px-4 flex items-center justify-center",
                  "rounded-lg border-2 font-mono text-lg font-semibold",
                  "transition-all duration-150 ease-out",
                  "shadow-[0_4px_0_0_hsl(var(--border))]",
                  isPressed
                    ? "bg-primary text-primary-foreground border-primary shadow-[0_2px_0_0_hsl(var(--primary))] translate-y-[2px]"
                    : "bg-card text-card-foreground border-border hover:bg-accent"
                )}
              >
                {getKeyDisplay(key)}
              </kbd>
            ) : (
              <div
                className={cn(
                  "min-w-[48px] h-12 px-4 flex items-center justify-center",
                  "rounded-lg border-2 border-dashed border-muted-foreground/30",
                  "text-muted-foreground text-lg"
                )}
              >
                ?
              </div>
            )}
            {index < keys.length - 1 && (
              <span className="text-muted-foreground text-xl mx-1">+</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface SingleKeyProps {
  keyName: string;
  isPressed?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "error";
}

export function SingleKey({
  keyName,
  isPressed = false,
  size = "md",
  variant = "default",
}: SingleKeyProps) {
  const sizeClasses = {
    sm: "min-w-[32px] h-8 px-2 text-sm",
    md: "min-w-[48px] h-12 px-4 text-lg",
    lg: "min-w-[64px] h-16 px-6 text-2xl",
  };

  const variantClasses = {
    default: isPressed
      ? "bg-primary text-primary-foreground border-primary"
      : "bg-card text-card-foreground border-border",
    success: "bg-green-500 text-white border-green-600",
    error: "bg-destructive text-destructive-foreground border-red-600",
  };

  return (
    <kbd
      className={cn(
        "flex items-center justify-center",
        "rounded-lg border-2 font-mono font-semibold",
        "transition-all duration-150 ease-out",
        sizeClasses[size],
        variantClasses[variant],
        isPressed && "shadow-[0_2px_0_0_hsl(var(--primary))] translate-y-[2px]",
        !isPressed && "shadow-[0_4px_0_0_hsl(var(--border))]"
      )}
    >
      {getKeyDisplay(keyName)}
    </kbd>
  );
}
