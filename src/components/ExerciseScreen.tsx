import { useState, useEffect, useCallback } from "react";
import type { VimShortcut } from "@/data/vimShortcuts";
import { KeyboardIndicator } from "./KeyboardIndicator";
import { HintComponent } from "./HintComponent";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Trophy,
} from "lucide-react";

interface ExerciseScreenProps {
  shortcuts: VimShortcut[];
  categoryName: string;
  onComplete: () => void;
  onBack: () => void;
}

type ExerciseStatus = "waiting" | "success" | "error";

export function ExerciseScreen({
  shortcuts,
  categoryName,
  onComplete,
  onBack,
}: ExerciseScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pressedKeys, setPressedKeys] = useState<string[]>([]);
  const [status, setStatus] = useState<ExerciseStatus>("waiting");
  const [showHint, setShowHint] = useState(false);
  const [streak, setStreak] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [lastKeyPressed, setLastKeyPressed] = useState<string>("");

  const currentShortcut = shortcuts[currentIndex];
  const progress = (currentIndex / shortcuts.length) * 100;

  const normalizeKey = useCallback((key: string): string => {
    if (key === "Control") return "Ctrl";
    if (key === " ") return "Space";
    return key;
  }, []);

  const handleSuccess = useCallback(() => {
    setStatus("success");
    setStreak((s) => s + 1);

    setTimeout(() => {
      if (currentIndex + 1 >= shortcuts.length) {
        setCompleted(true);
      } else {
        setCurrentIndex((prev) => prev + 1);
        setPressedKeys([]);
        setStatus("waiting");
        setShowHint(false);
      }
    }, 600);
  }, [currentIndex, shortcuts.length]);

  const handleError = useCallback(() => {
    setStatus("error");
    setStreak(0);

    setTimeout(() => {
      setCurrentIndex(0);
      setPressedKeys([]);
      setStatus("waiting");
      setShowHint(false);
    }, 800);
  }, []);

  const resetExercise = useCallback(() => {
    setCurrentIndex(0);
    setPressedKeys([]);
    setStatus("waiting");
    setShowHint(false);
    setStreak(0);
    setCompleted(false);
  }, []);

  useEffect(() => {
    if (!currentShortcut || status !== "waiting" || completed) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();

      const key = normalizeKey(e.key);
      setLastKeyPressed(key);

      const expectedKey = currentShortcut.keys[pressedKeys.length];
      const normalizedExpected = normalizeKey(expectedKey);

      if (
        key === normalizedExpected ||
        key.toLowerCase() === normalizedExpected.toLowerCase()
      ) {
        const newPressedKeys = [...pressedKeys, expectedKey];
        setPressedKeys(newPressedKeys);

        if (newPressedKeys.length === currentShortcut.keys.length) {
          handleSuccess();
        }
      } else {
        handleError();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    currentShortcut,
    pressedKeys,
    status,
    completed,
    normalizeKey,
    handleSuccess,
    handleError,
  ]);

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="text-6xl animate-bounce">🎉</div>
        <h2 className="text-3xl font-bold text-primary">Tebrikler!</h2>
        <p className="text-muted-foreground text-lg">
          {categoryName} kategorisini tamamladınız!
        </p>
        <div className="flex items-center gap-2 text-xl">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <span>{shortcuts.length} kısayol öğrenildi</span>
        </div>
        <div className="flex gap-4 mt-4">
          <Button variant="outline" onClick={resetExercise}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Tekrar Başla
          </Button>
          <Button onClick={onComplete}>
            <ArrowRight className="w-4 h-4 mr-2" />
            Devam Et
          </Button>
        </div>
      </div>
    );
  }

  if (!currentShortcut) return null;

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          ← Geri
        </Button>
        <Badge variant="secondary" className="text-sm">
          {currentIndex + 1} / {shortcuts.length}
        </Badge>
        {streak > 0 && (
          <Badge variant="default" className="text-sm">
            🔥 {streak} seri
          </Badge>
        )}
      </div>

      {/* Progress Bar */}
      <Progress value={progress} className="h-2" />

      {/* Main Exercise Card */}
      <Card
        className={cn(
          "transition-all duration-300",
          status === "success" && "ring-2 ring-green-500 bg-green-500/5",
          status === "error" &&
            "ring-2 ring-destructive bg-destructive/5 animate-shake"
        )}
      >
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs">
              {currentShortcut.difficulty === "beginner" && "🌱 Başlangıç"}
              {currentShortcut.difficulty === "intermediate" && "🌿 Orta"}
              {currentShortcut.difficulty === "advanced" && "🌳 İleri"}
            </Badge>
          </div>
          <CardTitle className="text-2xl">
            {currentShortcut.description}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-8 pt-6">
          {/* Keyboard Indicator */}
          <KeyboardIndicator
            keys={currentShortcut.keys}
            pressedKeys={pressedKeys}
            showAllKeys={true}
          />

          {/* Status Feedback */}
          <div className="h-12 flex items-center justify-center">
            {status === "success" && (
              <div className="flex items-center gap-2 text-green-500 animate-in zoom-in duration-200">
                <CheckCircle2 className="w-6 h-6" />
                <span className="font-semibold">Doğru!</span>
              </div>
            )}
            {status === "error" && (
              <div className="flex items-center gap-2 text-destructive animate-in zoom-in duration-200">
                <XCircle className="w-6 h-6" />
                <span className="font-semibold">
                  Yanlış! Bastığın: {lastKeyPressed}
                </span>
              </div>
            )}
            {status === "waiting" && (
              <p className="text-muted-foreground text-sm">
                Tuş kombinasyonunu gir...
              </p>
            )}
          </div>

          {/* Hint */}
          <HintComponent
            hint={currentShortcut.hint}
            isVisible={showHint}
            onToggle={() => setShowHint(!showHint)}
          />
        </CardContent>
      </Card>

      {/* Reset Button */}
      <div className="flex justify-center">
        <Button variant="ghost" size="sm" onClick={resetExercise}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Sıfırla
        </Button>
      </div>
    </div>
  );
}
