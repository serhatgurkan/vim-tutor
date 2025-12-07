import { categories, getShortcutsByCategory } from "@/data/vimShortcuts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CategorySelectorProps {
  onSelectCategory: (categoryId: string) => void;
}

export function CategorySelector({ onSelectCategory }: CategorySelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => {
        const shortcuts = getShortcutsByCategory(category.id);
        const beginnerCount = shortcuts.filter(
          (s) => s.difficulty === "beginner"
        ).length;
        const intermediateCount = shortcuts.filter(
          (s) => s.difficulty === "intermediate"
        ).length;
        const advancedCount = shortcuts.filter(
          (s) => s.difficulty === "advanced"
        ).length;

        return (
          <Card
            key={category.id}
            className={cn(
              "cursor-pointer transition-all duration-200",
              "hover:shadow-lg hover:scale-[1.02] hover:border-primary/50",
              "active:scale-[0.98]"
            )}
            onClick={() => onSelectCategory(category.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{category.icon}</span>
                <div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {category.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 flex-wrap">
                {beginnerCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    🌱 {beginnerCount}
                  </Badge>
                )}
                {intermediateCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    🌿 {intermediateCount}
                  </Badge>
                )}
                {advancedCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    🌳 {advancedCount}
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs ml-auto">
                  {shortcuts.length} kısayol
                </Badge>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
