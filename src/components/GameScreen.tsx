import { useState, useEffect, useCallback } from "react";
import { vimLevels, getTotalLevels } from "@/data/levels";
import { VimEditor } from "./VimEditor";

export function GameScreen() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [pressedKeys, setPressedKeys] = useState<string[]>([]);
  const [status, setStatus] = useState<"playing" | "success" | "error">(
    "playing"
  );
  const [showAnimation, setShowAnimation] = useState(false);
  const [lastPressedKey, setLastPressedKey] = useState<string>("");
  const [lastKeyCombo, setLastKeyCombo] = useState<string>("");

  const level = vimLevels[currentLevel];
  const totalLevels = getTotalLevels();

  const normalizeKey = useCallback((key: string): string => {
    if (key === "Control") return "Ctrl";
    if (key === " ") return "Space";
    return key;
  }, []);

  // Check if the pressed key matches expected (handles shift+key for special chars)
  const keysMatch = useCallback(
    (pressed: string, expected: string): boolean => {
      // Direct match
      if (pressed === expected) return true;
      // Case insensitive match for letters
      if (
        pressed.toLowerCase() === expected.toLowerCase() &&
        /^[a-zA-Z]$/.test(expected)
      ) {
        // But preserve case sensitivity for Vim commands (e.g., 'G' vs 'g')
        return pressed === expected;
      }
      // The key event already gives us the resulting character (e.g., '$' when Shift+4)
      return false;
    },
    []
  );

  const resetLevel = useCallback(() => {
    setPressedKeys([]);
    setStatus("playing");
    setShowAnimation(false);
  }, []);

  const handleSuccess = useCallback(() => {
    setStatus("success");
    setShowAnimation(true);

    // Wait longer so user can see the animation result
    setTimeout(() => {
      if (currentLevel + 1 < totalLevels) {
        setCurrentLevel((prev) => prev + 1);
        resetLevel();
      }
    }, 2000); // 2 seconds to see the change
  }, [currentLevel, totalLevels, resetLevel]);

  const handleError = useCallback(() => {
    setStatus("error");
    setTimeout(() => {
      resetLevel();
    }, 500);
  }, [resetLevel]);

  useEffect(() => {
    if (status !== "playing") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore modifier keys when pressed alone
      const modifierKeys = ["Alt", "Shift", "Control", "Meta", "CapsLock"];
      if (modifierKeys.includes(e.key)) {
        return; // Don't process modifier keys alone
      }

      // Prevent default for vim keys
      if (!e.metaKey) {
        e.preventDefault();
      }

      let key = normalizeKey(e.key);

      // Handle dead keys (like ^ on Turkish keyboard with Shift+3)
      // Dead keys return "Dead" but we can identify them by the code
      if (key === "Dead") {
        // Check specific key combinations for dead keys
        if (e.shiftKey && e.code === "Digit3") {
          key = "^";
        } else if (e.altKey && e.code === "Backslash") {
          // Option + , = ` (backtick) on Turkish Mac keyboard
          // This is a dead key, so we treat it as backtick
          key = "`";
        }
      }

      // Handle composed characters (when dead key + letter produces accent)
      // For example: Option+, then 'a' might produce 'à' instead of separate ` and a
      // We need to check if this is the backtick+letter pattern
      if (level.keys.includes("`") && /^[àèìòù]$/.test(key)) {
        // User pressed dead key ` followed by vowel, got accented char
        // This means they completed the backtick, now expecting the letter
        // Map back: à->a, è->e, etc.
        const accentMap: Record<string, string> = {
          à: "a",
          è: "e",
          ì: "i",
          ò: "o",
          ù: "u",
        };
        key = accentMap[key] || key;
      }

      // Build combo string for display
      const modifiers = [];
      if (e.ctrlKey) modifiers.push("Ctrl");
      if (e.altKey) modifiers.push("Option");
      if (e.shiftKey) modifiers.push("Shift");
      if (e.metaKey) modifiers.push("Cmd");
      const combo = [...modifiers, key].join(" + ");
      setLastKeyCombo(combo);
      setLastPressedKey(key);

      const expectedKey = level.keys[pressedKeys.length];
      const normalizedExpected = normalizeKey(expectedKey);

      // Check if keys match
      let isMatch = false;

      // Check if this is a Ctrl+key combination
      // If expected is "Ctrl" and next expected is a letter, and user pressed Ctrl+letter
      if (
        expectedKey === "Ctrl" &&
        level.keys.length > pressedKeys.length + 1
      ) {
        const nextExpectedKey = level.keys[pressedKeys.length + 1];
        if (e.ctrlKey && keysMatch(key, normalizeKey(nextExpectedKey))) {
          // User pressed Ctrl+letter in one go - mark both as pressed
          const newPressedKeys = [...pressedKeys, "Ctrl", nextExpectedKey];
          setPressedKeys(newPressedKeys);
          if (newPressedKeys.length === level.keys.length) {
            handleSuccess();
          }
          return; // Early return, we handled both keys
        }
      }

      // Normal key matching
      isMatch = keysMatch(key, normalizedExpected);

      if (isMatch) {
        const newPressedKeys = [...pressedKeys, expectedKey];
        setPressedKeys(newPressedKeys);

        if (newPressedKeys.length === level.keys.length) {
          handleSuccess();
        }
      } else {
        handleError();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    level,
    pressedKeys,
    status,
    normalizeKey,
    keysMatch,
    handleSuccess,
    handleError,
  ]);

  const goToLevel = (levelIndex: number) => {
    setCurrentLevel(levelIndex);
    resetLevel();
  };

  // Get unique categories
  const categories = [...new Set(vimLevels.map((l) => l.category))];
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredLevels =
    selectedCategory === "all"
      ? vimLevels
      : vimLevels.filter((l) => l.category === selectedCategory);

  // Category labels in Turkish
  const categoryLabels: Record<string, string> = {
    all: "Tümü",
    navigation: "Gezinme",
    editing: "Düzenleme",
    insert: "Insert Mod",
    visual: "Visual Mod",
    yank: "Kopyala/Yapıştır",
    search: "Arama",
    file: "Dosya",
    command: "Komut Modu",
    marks: "İşaretler",
    window: "Pencere",
    macro: "Makrolar",
    registers: "Registerlar",
    indent: "Girinti",
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-[#222] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight">VIM TUTOR</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#666]">
              Level {currentLevel + 1} / {totalLevels}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Instructions */}
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  selectedCategory === "all"
                    ? "bg-white text-black"
                    : "bg-[#222] text-[#888] hover:bg-[#333]"
                }`}
              >
                Tümü
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    selectedCategory === cat
                      ? "bg-white text-black"
                      : "bg-[#222] text-[#888] hover:bg-[#333]"
                  }`}
                >
                  {categoryLabels[cat] || cat}
                </button>
              ))}
            </div>

            {/* Level Selector */}
            <div className="flex items-center gap-2">
              <select
                value={currentLevel}
                onChange={(e) => goToLevel(Number(e.target.value))}
                className="bg-[#111] border border-[#333] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#444] flex-1"
              >
                {vimLevels.map((l, i) => (
                  <option key={l.id} value={i}>
                    Level {i + 1}: {l.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Task Description */}
            <div className="space-y-4">
              <p className="text-[#888] text-sm uppercase tracking-wide">
                Görev
              </p>
              <h2 className="text-2xl font-medium">{level.description}</h2>

              {level.hint && (
                <p className="text-sm text-[#569cd6] mt-2">💡 {level.hint}</p>
              )}
            </div>

            {/* Key Input Area */}
            <div className="space-y-4">
              <p className="text-[#888] text-sm uppercase tracking-wide">
                Tuş Kombinasyonu
              </p>

              <div className="flex items-center gap-3 flex-wrap">
                {(() => {
                  // Special characters that need modifier keys displayed
                  // macOS Turkish-QWERTY-PC keyboard layout (from user's keyboard photo)
                  const specialKeyDisplay: Record<string, string[]> = {
                    // Option key combinations (Turkish Mac)
                    $: ["⌥", "4"],
                    "#": ["⌥", "3"],
                    "@": ["⌥", "q"],
                    "[": ["⌥", "8"],
                    "]": ["⌥", "9"],
                    "{": ["⌥", "7"],
                    "}": ["⌥", "0"],
                    "\\": ["⌥", "7"],
                    "|": ["⌥", "⇧", "7"],
                    "~": ["⌥", "n"],
                    "`": ["⌥", "<"],
                    // Shift + number combinations (from keyboard photo)
                    "!": ["⇧", "1"],
                    "'": ["⇧", "2"],
                    "^": ["⇧", "3"],
                    "+": ["⇧", "4"],
                    "%": ["⇧", "5"],
                    "&": ["⇧", "6"],
                    "/": ["⇧", "7"],
                    "(": ["⇧", "8"],
                    ")": ["⇧", "9"],
                    "=": ["⇧", "0"],
                    "?": ["⇧", "*"],
                    _: ["⇧", "-"],
                    ":": ["⇧", "."],
                    ";": ["⇧", ","],
                    ">": ["⇧", "<"],
                    "<": ["<"],
                    // These are direct keys on Turkish Mac keyboard (no modifier needed)
                    // "*" - direct key next to backspace
                    // "-" - direct key
                  };

                  // Uppercase letters need Shift
                  const isUpperCase = (k: string) => /^[A-Z]$/.test(k);

                  // Mac keyboard symbol mapping
                  const getKeySymbol = (k: string) => {
                    const symbols: Record<string, string> = {
                      Option: "⌥",
                      Alt: "⌥",
                      Shift: "⇧",
                      Ctrl: "⌃",
                      Control: "⌃",
                      Cmd: "⌘",
                      Command: "⌘",
                      Enter: "↵",
                      Return: "↵",
                      Escape: "esc",
                      Esc: "esc",
                      Tab: "⇥",
                      Space: "␣",
                      Backspace: "⌫",
                      Delete: "⌦",
                      ArrowUp: "↑",
                      ArrowDown: "↓",
                      ArrowLeft: "←",
                      ArrowRight: "→",
                    };
                    return symbols[k] || k;
                  };

                  // Build display keys for each key in level.keys
                  const allDisplayKeys: { keys: string[]; keyIndex: number }[] =
                    [];

                  level.keys.forEach((key, keyIndex) => {
                    if (specialKeyDisplay[key]) {
                      // Special character: show modifier + key
                      allDisplayKeys.push({
                        keys: specialKeyDisplay[key],
                        keyIndex,
                      });
                    } else if (isUpperCase(key)) {
                      // Uppercase letter: show Shift + letter
                      allDisplayKeys.push({ keys: ["⇧", key], keyIndex });
                    } else {
                      // Normal key
                      allDisplayKeys.push({ keys: [key], keyIndex });
                    }
                  });

                  return allDisplayKeys.map((group, groupIndex) => {
                    const isKeyPressed = group.keyIndex < pressedKeys.length;
                    const isCurrentKey =
                      group.keyIndex === pressedKeys.length &&
                      status === "playing";

                    return (
                      <div key={groupIndex} className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {group.keys.map((k, kIndex) => {
                            const displaySymbol = getKeySymbol(k);
                            const isModifier = ["⌥", "⇧", "⌃", "⌘"].includes(k);

                            return (
                              <div
                                key={kIndex}
                                className="flex items-center gap-1"
                              >
                                <kbd
                                  className={`
                                    px-3 h-11 flex items-center justify-center
                                    rounded-lg font-sans text-base font-medium
                                    shadow-[0_2px_0_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.1)]
                                    transition-all duration-150
                                    ${
                                      isModifier
                                        ? "min-w-[40px]"
                                        : "min-w-[36px]"
                                    }
                                    ${
                                      isKeyPressed
                                        ? "bg-gradient-to-b from-green-500 to-green-600 border border-green-400 text-white shadow-[0_2px_0_0_#166534,inset_0_1px_0_0_rgba(255,255,255,0.2)]"
                                        : isCurrentKey
                                        ? "bg-gradient-to-b from-[#3a3a3a] to-[#2a2a2a] border border-[#555] text-white"
                                        : "bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border border-[#333] text-[#888]"
                                    }
                                    ${
                                      status === "error" && !isKeyPressed
                                        ? "bg-gradient-to-b from-red-600 to-red-700 border-red-500 text-white"
                                        : ""
                                    }
                                  `}
                                >
                                  {displaySymbol}
                                </kbd>
                                {kIndex < group.keys.length - 1 && (
                                  <span className="text-[#444] text-sm">+</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {groupIndex < allDisplayKeys.length - 1 && (
                          <span className="text-[#555] text-lg font-light mx-1">
                            →
                          </span>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Last Pressed Key Display */}
              {lastKeyCombo && (
                <div className="mt-4 p-3 bg-[#111] border border-[#333] rounded">
                  <p className="text-xs text-[#666] mb-1">Son basılan:</p>
                  <p className="font-mono text-sm">
                    <span className="text-yellow-500">{lastKeyCombo}</span>
                    <span className="text-[#444] mx-2">=</span>
                    <span className="text-green-400 text-lg">
                      "{lastPressedKey}"
                    </span>
                  </p>
                  <p className="text-xs text-[#555] mt-1">
                    Klavyende hangi tuşlar hangi karakteri üretiyor öğren!
                  </p>
                </div>
              )}

              {/* Status Message */}
              <div className="mt-4">
                {status === "success" && (
                  <p className="text-green-400 text-sm">✓ Doğru!</p>
                )}
                {status === "error" && (
                  <p className="text-red-400 text-sm">
                    ✗ Yanlış tuş! Beklenen: "{level.keys[pressedKeys.length]}"
                  </p>
                )}
                {status === "playing" && pressedKeys.length === 0 && (
                  <p className="text-[#666] text-sm">Tuşlara bas...</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Editor Preview */}
          <div className="space-y-4">
            <p className="text-[#888] text-sm uppercase tracking-wide">
              Önizleme
            </p>
            <VimEditor
              level={level}
              isAnimating={status === "playing"}
              showAfter={showAnimation}
            />

            {/* Before/After Labels */}
            <div className="flex justify-between text-xs text-[#666]">
              <span>{showAnimation ? "Sonra" : "Önce"}</span>
              <span className="text-[#569cd6]">
                İmleç: {showAnimation ? level.cursorAfter : level.cursorBefore}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-12">
          <div className="flex gap-1">
            {vimLevels.map((_, i) => (
              <button
                key={i}
                onClick={() => goToLevel(i)}
                className={`
                  h-1.5 flex-1 rounded-full transition-colors
                  ${
                    i < currentLevel
                      ? "bg-green-500"
                      : i === currentLevel
                      ? "bg-white"
                      : "bg-[#333]"
                  }
                `}
              />
            ))}
          </div>
          <p className="text-center text-[#666] text-sm mt-4">
            {Math.round((currentLevel / totalLevels) * 100)}% tamamlandı
          </p>
        </div>
      </main>
    </div>
  );
}
