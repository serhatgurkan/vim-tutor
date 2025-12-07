import { useState, useEffect, useCallback, useMemo } from "react";
import type { VimLevel } from "@/data/levels";

interface VimEditorProps {
  level: VimLevel;
  isAnimating: boolean;
  showAfter: boolean;
}

export function VimEditor({ level, isAnimating, showAfter }: VimEditorProps) {
  const [animationProgress, setAnimationProgress] = useState(0);

  // Compute derived state from animation progress
  const { cursorPosition, text, highlight } = useMemo(() => {
    if (!showAfter || animationProgress === 0) {
      return {
        cursorPosition: level.cursorBefore,
        text: level.beforeText,
        highlight: level.highlightBefore || null,
      };
    }

    const eased = 1 - Math.pow(1 - animationProgress, 3);
    const cursor = Math.round(
      level.cursorBefore + (level.cursorAfter - level.cursorBefore) * eased
    );

    return {
      cursorPosition: cursor,
      text: animationProgress >= 0.5 ? level.afterText : level.beforeText,
      highlight:
        animationProgress >= 1
          ? level.highlightAfter || null
          : level.highlightBefore || null,
    };
  }, [level, showAfter, animationProgress]);

  // Reset animation when level changes
  useEffect(() => {
    setAnimationProgress(0);
  }, [level.id]);

  // Run animation when showAfter becomes true
  useEffect(() => {
    if (!showAfter) {
      setAnimationProgress(0);
      return;
    }

    const duration = 800; // Slower animation to see the change
    const startTime = Date.now();
    let animationFrame: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setAnimationProgress(progress);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [showAfter]);

  const renderText = useCallback(() => {
    const lines = text.split("\n");
    let charIndex = 0;

    return lines.map((line, lineIndex) => {
      const lineStart = charIndex;
      const chars = line.split("").map((char, i) => {
        const globalIndex = charIndex + i;
        const isCursor = globalIndex === cursorPosition;
        const isHighlighted =
          highlight &&
          globalIndex >= highlight[0] &&
          globalIndex < highlight[1];

        return (
          <span
            key={globalIndex}
            className={`
              relative inline-block
              ${isCursor ? "bg-green-500 text-black" : ""}
              ${isHighlighted && !isCursor ? "bg-yellow-500/30" : ""}
              ${isAnimating && isCursor ? "animate-pulse" : ""}
            `}
            style={{
              transition: "background-color 0.15s ease",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      });

      // Add cursor at end of line if needed
      if (
        cursorPosition === lineStart + line.length &&
        lineIndex === lines.length - 1
      ) {
        chars.push(
          <span
            key="end-cursor"
            className={`
              relative inline-block bg-green-500 text-black
              ${isAnimating ? "animate-pulse" : ""}
            `}
          >
            {"\u00A0"}
          </span>
        );
      }

      charIndex += line.length + 1; // +1 for newline

      return (
        <div key={lineIndex} className="min-h-[1.5em]">
          {chars.length > 0 ? chars : <span>&nbsp;</span>}
        </div>
      );
    });
  }, [text, cursorPosition, highlight, isAnimating]);

  // Get current mode based on animation - show transition
  const currentMode = useMemo(() => {
    const mode =
      !showAfter || animationProgress < 0.5
        ? level.startMode || "normal"
        : level.endMode || level.startMode || "normal";

    console.log("Mode Debug:", {
      showAfter,
      animationProgress,
      startMode: level.startMode,
      endMode: level.endMode,
      currentMode: mode,
    });

    return mode;
  }, [level.startMode, level.endMode, showAfter, animationProgress]);

  // Check if mode is changing
  const isModeChanging = useMemo(() => {
    return (
      level.startMode && level.endMode && level.startMode !== level.endMode
    );
  }, [level.startMode, level.endMode]);

  // Mode display config
  const modeConfig = useMemo(() => {
    const configs = {
      normal: {
        label: "NORMAL",
        color: "text-[#569cd6]",
        bg: "bg-[#569cd6]/10",
        borderColor: "border-[#569cd6]",
      },
      insert: {
        label: "INSERT",
        color: "text-green-400",
        bg: "bg-green-400/10",
        borderColor: "border-green-400",
      },
      visual: {
        label: "VISUAL",
        color: "text-purple-400",
        bg: "bg-purple-400/10",
        borderColor: "border-purple-400",
      },
      "visual-line": {
        label: "V-LINE",
        color: "text-purple-400",
        bg: "bg-purple-400/10",
        borderColor: "border-purple-400",
      },
      command: {
        label: "COMMAND",
        color: "text-yellow-400",
        bg: "bg-yellow-400/10",
        borderColor: "border-yellow-400",
      },
    };
    return configs[currentMode] || configs.normal;
  }, [currentMode]);

  // Get start mode config for comparison
  const startModeConfig = useMemo(() => {
    const configs = {
      normal: { label: "NORMAL", color: "text-[#569cd6]" },
      insert: { label: "INSERT", color: "text-green-400" },
      visual: { label: "VISUAL", color: "text-purple-400" },
      "visual-line": { label: "V-LINE", color: "text-purple-400" },
      command: { label: "COMMAND", color: "text-yellow-400" },
    };
    const mode = level.startMode || "normal";
    return configs[mode] || configs.normal;
  }, [level.startMode]);

  return (
    <div
      className={`bg-[#1e1e1e] rounded-lg border overflow-hidden transition-colors duration-300 ${
        showAfter && isModeChanging ? modeConfig.borderColor : "border-[#333]"
      }`}
    >
      {/* Editor Header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#252526] border-b border-[#333]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
        </div>
        <span className="text-xs text-[#808080] ml-2">vim-tutor.txt</span>

        {/* Mode indicator with transition animation */}
        <div className="ml-auto flex items-center gap-2">
          {isModeChanging && (
            <>
              <span
                className={`text-xs px-2 py-0.5 rounded transition-opacity duration-300 ${
                  showAfter && animationProgress >= 0.5
                    ? "opacity-30"
                    : "opacity-100"
                } ${startModeConfig.color} bg-white/5`}
              >
                {startModeConfig.label}
              </span>
              <span className="text-[#555]">→</span>
            </>
          )}
          <span
            className={`text-xs px-2 py-0.5 rounded transition-all duration-300 ${
              modeConfig.color
            } ${modeConfig.bg} ${
              showAfter && animationProgress >= 0.5 && isModeChanging
                ? "scale-110"
                : "scale-100"
            }`}
          >
            {modeConfig.label}
          </span>
        </div>
      </div>

      {/* Editor Content */}
      <div className="p-4 font-mono text-sm leading-relaxed text-[#d4d4d4] min-h-[120px] relative">
        {renderText()}

        {/* Show "changed" indicator when text changes */}
        {showAfter &&
          level.beforeText !== level.afterText &&
          animationProgress >= 0.5 && (
            <div className="absolute top-2 right-2 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded animate-pulse">
              ✓ Değişti
            </div>
          )}
      </div>

      {/* Command Line / Status Bar */}
      <div className="px-4 py-2 bg-[#252526] border-t border-[#333] flex items-center justify-between">
        {level.commandLine && showAfter ? (
          <span className="text-sm text-yellow-400 font-mono">
            {level.commandLine}
            <span className="animate-pulse">▌</span>
          </span>
        ) : (
          <span className="text-xs text-[#808080]">
            {text.split("\n").length} satır, {text.length} karakter
            {showAfter && level.cursorBefore !== level.cursorAfter && (
              <span className="ml-2 text-green-400">
                | İmleç: {level.cursorBefore} → {level.cursorAfter}
              </span>
            )}
          </span>
        )}
        {currentMode === "insert" && (
          <span className="text-xs text-green-400">-- INSERT --</span>
        )}
        {(currentMode === "visual" || currentMode === "visual-line") && (
          <span className="text-xs text-purple-400">-- VISUAL --</span>
        )}
      </div>
    </div>
  );
}
