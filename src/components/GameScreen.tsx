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

      // Build combo string for display - show physical key, not produced character
      const modifiers = [];
      if (e.ctrlKey) modifiers.push("Ctrl");
      if (e.altKey) modifiers.push("Option");
      if (e.shiftKey) modifiers.push("Shift");
      if (e.metaKey) modifiers.push("Cmd");

      // Get physical key from code (e.g., "Digit4" -> "4", "KeyA" -> "a")
      let physicalKey = e.code;
      if (e.code.startsWith("Digit")) {
        physicalKey = e.code.replace("Digit", "");
      } else if (e.code.startsWith("Key")) {
        physicalKey = e.code.replace("Key", "").toLowerCase();
      } else if (e.code === "Comma") {
        physicalKey = ",";
      } else if (e.code === "Period") {
        physicalKey = ".";
      } else if (e.code === "Slash") {
        physicalKey = "/";
      } else if (e.code === "Backslash") {
        physicalKey = ","; // On Turkish Mac, this is the comma key position
      } else if (e.code === "BracketLeft") {
        physicalKey = "ğ";
      } else if (e.code === "BracketRight") {
        physicalKey = "ü";
      } else if (e.code === "Semicolon") {
        physicalKey = "ş";
      } else if (e.code === "Quote") {
        physicalKey = "i";
      } else if (e.code === "Minus") {
        physicalKey = "-";
      } else if (e.code === "Equal") {
        physicalKey = "*";
      } else if (e.code === "IntlBackslash") {
        physicalKey = "<";
      }

      const combo = [...modifiers, physicalKey].join(" + ");
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
            <div className="space-y-6">
              <p className="text-[#888] text-sm uppercase tracking-wide text-center">
                Tuş Kombinasyonu
              </p>

              <div className="flex items-center justify-center gap-4 flex-wrap py-8">
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
                    "`": ["⌥", ","],
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
                      <div key={groupIndex} className="flex items-center gap-4">
                        <div className="flex items-center gap-6">
                          {group.keys.map((k, kIndex) => {
                            const displaySymbol = getKeySymbol(k);

                            return (
                              <div
                                key={kIndex}
                                className="flex items-center gap-6"
                              >
                                <kbd
                                  style={{
                                    transform: isKeyPressed
                                      ? "scale(1.3)"
                                      : "scale(1)",
                                    transition:
                                      "transform 0.3s ease-out, background 0.3s ease-out, border-color 0.3s ease-out",
                                  }}
                                  className={`
                                    px-5 h-14 flex items-center justify-center
                                    rounded-xl font-sans text-xl font-medium
                                    shadow-[0_4px_0_0_rgba(0,0,0,0.5)]
                                    min-w-[50px]
                                    ${
                                      isKeyPressed
                                        ? "bg-gradient-to-b from-green-400 to-green-500 border-2 border-green-300 text-white"
                                        : isCurrentKey
                                        ? "bg-gradient-to-b from-[#3a3a3a] to-[#2a2a2a] border-2 border-[#555] text-white"
                                        : "bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border-2 border-[#333] text-[#666]"
                                    }
                                    ${
                                      status === "error" && !isKeyPressed
                                        ? "bg-gradient-to-b from-red-500 to-red-600 border-red-400 text-white"
                                        : ""
                                    }
                                  `}
                                >
                                  {displaySymbol}
                                </kbd>
                                {kIndex < group.keys.length - 1 && (
                                  <span className="text-[#444] text-xl">+</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {groupIndex < allDisplayKeys.length - 1 && (
                          <span className="text-[#555] text-2xl font-light mx-4">
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
      </main>
    </div>
  );
}
