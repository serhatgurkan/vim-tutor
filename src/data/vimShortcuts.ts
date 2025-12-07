export interface VimShortcut {
  id: string;
  keys: string[];
  description: string;
  hint?: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const categories: Category[] = [
  {
    id: "navigation",
    name: "Navigasyon",
    description: "İmleç hareketleri ve sayfa gezinme",
    icon: "🧭",
  },
  {
    id: "editing",
    name: "Düzenleme",
    description: "Metin düzenleme komutları",
    icon: "✏️",
  },
  {
    id: "insert",
    name: "Insert Modu",
    description: "Insert moduna geçiş yolları",
    icon: "📝",
  },
  {
    id: "visual",
    name: "Visual Mod",
    description: "Seçim ve görsel mod",
    icon: "👁️",
  },
  {
    id: "search",
    name: "Arama",
    description: "Metin arama ve değiştirme",
    icon: "🔍",
  },
  {
    id: "file",
    name: "Dosya İşlemleri",
    description: "Kaydetme, açma ve çıkış",
    icon: "📁",
  },
  {
    id: "advanced",
    name: "İleri Seviye",
    description: "Makrolar ve ileri komutlar",
    icon: "🚀",
  },
];

export const vimShortcuts: VimShortcut[] = [
  // Navigation - Beginner
  {
    id: "h",
    keys: ["h"],
    description: "Sola git",
    category: "navigation",
    difficulty: "beginner",
  },
  {
    id: "j",
    keys: ["j"],
    description: "Aşağı git",
    category: "navigation",
    difficulty: "beginner",
  },
  {
    id: "k",
    keys: ["k"],
    description: "Yukarı git",
    category: "navigation",
    difficulty: "beginner",
  },
  {
    id: "l",
    keys: ["l"],
    description: "Sağa git",
    category: "navigation",
    difficulty: "beginner",
  },
  {
    id: "w",
    keys: ["w"],
    description: "Sonraki kelimeye git",
    hint: "word - kelime",
    category: "navigation",
    difficulty: "beginner",
  },
  {
    id: "b",
    keys: ["b"],
    description: "Önceki kelimeye git",
    hint: "back - geri",
    category: "navigation",
    difficulty: "beginner",
  },
  {
    id: "e",
    keys: ["e"],
    description: "Kelime sonuna git",
    hint: "end - son",
    category: "navigation",
    difficulty: "beginner",
  },
  {
    id: "0",
    keys: ["0"],
    description: "Satır başına git",
    category: "navigation",
    difficulty: "beginner",
  },
  {
    id: "$",
    keys: ["$"],
    description: "Satır sonuna git",
    hint: "Regex sonu gibi",
    category: "navigation",
    difficulty: "beginner",
  },
  {
    id: "gg",
    keys: ["g", "g"],
    description: "Dosya başına git",
    category: "navigation",
    difficulty: "beginner",
  },
  {
    id: "G",
    keys: ["G"],
    description: "Dosya sonuna git",
    category: "navigation",
    difficulty: "beginner",
  },

  // Navigation - Intermediate
  {
    id: "ctrl-d",
    keys: ["Ctrl", "d"],
    description: "Yarım sayfa aşağı",
    hint: "down",
    category: "navigation",
    difficulty: "intermediate",
  },
  {
    id: "ctrl-u",
    keys: ["Ctrl", "u"],
    description: "Yarım sayfa yukarı",
    hint: "up",
    category: "navigation",
    difficulty: "intermediate",
  },
  {
    id: "%",
    keys: ["%"],
    description: "Eşleşen paranteze git",
    category: "navigation",
    difficulty: "intermediate",
  },
  {
    id: "^",
    keys: ["^"],
    description: "İlk boşluk olmayan karaktere git",
    category: "navigation",
    difficulty: "intermediate",
  },
  {
    id: "f_char",
    keys: ["f"],
    description: "Satırda karaktere git (ileri)",
    hint: "find - bul",
    category: "navigation",
    difficulty: "intermediate",
  },
  {
    id: "F_char",
    keys: ["F"],
    description: "Satırda karaktere git (geri)",
    category: "navigation",
    difficulty: "intermediate",
  },
  {
    id: ";",
    keys: [";"],
    description: "Son f/F aramasını tekrarla",
    category: "navigation",
    difficulty: "intermediate",
  },
  {
    id: "zz",
    keys: ["z", "z"],
    description: "İmleci ekran ortasına al",
    category: "navigation",
    difficulty: "intermediate",
  },

  // Editing - Beginner
  {
    id: "x",
    keys: ["x"],
    description: "Karakter sil",
    category: "editing",
    difficulty: "beginner",
  },
  {
    id: "dd",
    keys: ["d", "d"],
    description: "Satır sil",
    hint: "delete - sil",
    category: "editing",
    difficulty: "beginner",
  },
  {
    id: "yy",
    keys: ["y", "y"],
    description: "Satır kopyala",
    hint: "yank - çek",
    category: "editing",
    difficulty: "beginner",
  },
  {
    id: "p",
    keys: ["p"],
    description: "Yapıştır (sonra)",
    hint: "paste",
    category: "editing",
    difficulty: "beginner",
  },
  {
    id: "P",
    keys: ["P"],
    description: "Yapıştır (önce)",
    category: "editing",
    difficulty: "beginner",
  },
  {
    id: "u",
    keys: ["u"],
    description: "Geri al",
    hint: "undo",
    category: "editing",
    difficulty: "beginner",
  },
  {
    id: "ctrl-r",
    keys: ["Ctrl", "r"],
    description: "Yinele",
    hint: "redo",
    category: "editing",
    difficulty: "beginner",
  },
  {
    id: ".",
    keys: ["."],
    description: "Son komutu tekrarla",
    category: "editing",
    difficulty: "beginner",
  },

  // Editing - Intermediate
  {
    id: "dw",
    keys: ["d", "w"],
    description: "Kelime sil",
    hint: "delete word",
    category: "editing",
    difficulty: "intermediate",
  },
  {
    id: "cw",
    keys: ["c", "w"],
    description: "Kelimeyi değiştir",
    hint: "change word",
    category: "editing",
    difficulty: "intermediate",
  },
  {
    id: "ciw",
    keys: ["c", "i", "w"],
    description: "İç kelimeyi değiştir",
    hint: "change inner word",
    category: "editing",
    difficulty: "intermediate",
  },
  {
    id: 'ci"',
    keys: ["c", "i", '"'],
    description: "Tırnak içini değiştir",
    hint: 'change inner "',
    category: "editing",
    difficulty: "intermediate",
  },
  {
    id: "di(",
    keys: ["d", "i", "("],
    description: "Parantez içini sil",
    hint: "delete inner (",
    category: "editing",
    difficulty: "intermediate",
  },
  {
    id: "D",
    keys: ["D"],
    description: "Satır sonuna kadar sil",
    category: "editing",
    difficulty: "intermediate",
  },
  {
    id: "C",
    keys: ["C"],
    description: "Satır sonuna kadar değiştir",
    category: "editing",
    difficulty: "intermediate",
  },
  {
    id: "J",
    keys: ["J"],
    description: "Alt satırı birleştir",
    hint: "join",
    category: "editing",
    difficulty: "intermediate",
  },
  {
    id: "r",
    keys: ["r"],
    description: "Karakter değiştir",
    hint: "replace",
    category: "editing",
    difficulty: "intermediate",
  },
  {
    id: "~",
    keys: ["~"],
    description: "Büyük/küçük harf değiştir",
    category: "editing",
    difficulty: "intermediate",
  },

  // Editing - Advanced
  {
    id: 'da"',
    keys: ["d", "a", '"'],
    description: "Tırnaklarla birlikte sil",
    hint: 'delete around "',
    category: "editing",
    difficulty: "advanced",
  },
  {
    id: "dit",
    keys: ["d", "i", "t"],
    description: "HTML tag içini sil",
    hint: "delete inner tag",
    category: "editing",
    difficulty: "advanced",
  },
  {
    id: "gU",
    keys: ["g", "U"],
    description: "Büyük harfe çevir (motion ile)",
    category: "editing",
    difficulty: "advanced",
  },
  {
    id: "gu",
    keys: ["g", "u"],
    description: "Küçük harfe çevir (motion ile)",
    category: "editing",
    difficulty: "advanced",
  },
  {
    id: ">>>",
    keys: [">"],
    description: "Satırı girintile",
    category: "editing",
    difficulty: "intermediate",
  },
  {
    id: "<<<",
    keys: ["<"],
    description: "Girintiyi azalt",
    category: "editing",
    difficulty: "intermediate",
  },

  // Insert Mode
  {
    id: "i",
    keys: ["i"],
    description: "İmleçten önce insert mod",
    hint: "insert",
    category: "insert",
    difficulty: "beginner",
  },
  {
    id: "I",
    keys: ["I"],
    description: "Satır başında insert mod",
    category: "insert",
    difficulty: "beginner",
  },
  {
    id: "a",
    keys: ["a"],
    description: "İmleçten sonra insert mod",
    hint: "append",
    category: "insert",
    difficulty: "beginner",
  },
  {
    id: "A",
    keys: ["A"],
    description: "Satır sonunda insert mod",
    category: "insert",
    difficulty: "beginner",
  },
  {
    id: "o",
    keys: ["o"],
    description: "Alt satıra yeni satır ekle",
    hint: "open line",
    category: "insert",
    difficulty: "beginner",
  },
  {
    id: "O",
    keys: ["O"],
    description: "Üst satıra yeni satır ekle",
    category: "insert",
    difficulty: "beginner",
  },
  {
    id: "Esc",
    keys: ["Escape"],
    description: "Normal moda dön",
    category: "insert",
    difficulty: "beginner",
  },
  {
    id: "s",
    keys: ["s"],
    description: "Karakter sil ve insert mod",
    hint: "substitute",
    category: "insert",
    difficulty: "intermediate",
  },
  {
    id: "S",
    keys: ["S"],
    description: "Satırı sil ve insert mod",
    category: "insert",
    difficulty: "intermediate",
  },

  // Visual Mode
  {
    id: "v",
    keys: ["v"],
    description: "Visual mod (karakter)",
    category: "visual",
    difficulty: "beginner",
  },
  {
    id: "V",
    keys: ["V"],
    description: "Visual mod (satır)",
    category: "visual",
    difficulty: "beginner",
  },
  {
    id: "ctrl-v",
    keys: ["Ctrl", "v"],
    description: "Visual blok mod",
    category: "visual",
    difficulty: "intermediate",
  },
  {
    id: "gv",
    keys: ["g", "v"],
    description: "Son seçimi tekrar seç",
    category: "visual",
    difficulty: "intermediate",
  },
  {
    id: "o_visual",
    keys: ["o"],
    description: "Seçim ucuna git (visual modda)",
    category: "visual",
    difficulty: "intermediate",
  },

  // Search
  {
    id: "/",
    keys: ["/"],
    description: "İleri ara",
    category: "search",
    difficulty: "beginner",
  },
  {
    id: "?",
    keys: ["?"],
    description: "Geri ara",
    category: "search",
    difficulty: "beginner",
  },
  {
    id: "n",
    keys: ["n"],
    description: "Sonraki sonuç",
    hint: "next",
    category: "search",
    difficulty: "beginner",
  },
  {
    id: "N",
    keys: ["N"],
    description: "Önceki sonuç",
    category: "search",
    difficulty: "beginner",
  },
  {
    id: "*",
    keys: ["*"],
    description: "İmleçteki kelimeyi ara (ileri)",
    category: "search",
    difficulty: "intermediate",
  },
  {
    id: "#",
    keys: ["#"],
    description: "İmleçteki kelimeyi ara (geri)",
    category: "search",
    difficulty: "intermediate",
  },

  // File Operations
  {
    id: ":w",
    keys: [":", "w", "Enter"],
    description: "Kaydet",
    hint: "write",
    category: "file",
    difficulty: "beginner",
  },
  {
    id: ":q",
    keys: [":", "q", "Enter"],
    description: "Çık",
    hint: "quit",
    category: "file",
    difficulty: "beginner",
  },
  {
    id: ":wq",
    keys: [":", "w", "q", "Enter"],
    description: "Kaydet ve çık",
    category: "file",
    difficulty: "beginner",
  },
  {
    id: ":q!",
    keys: [":", "q", "!", "Enter"],
    description: "Zorla çık (kaydetmeden)",
    category: "file",
    difficulty: "beginner",
  },
  {
    id: "ZZ",
    keys: ["Z", "Z"],
    description: "Kaydet ve çık (kısayol)",
    category: "file",
    difficulty: "intermediate",
  },
  {
    id: "ZQ",
    keys: ["Z", "Q"],
    description: "Kaydetmeden çık (kısayol)",
    category: "file",
    difficulty: "intermediate",
  },
  {
    id: ":e",
    keys: [":", "e", " "],
    description: "Dosya aç",
    hint: "edit",
    category: "file",
    difficulty: "intermediate",
  },

  // Advanced
  {
    id: "qa",
    keys: ["q", "a"],
    description: "Makro kaydet (a registerine)",
    hint: "record macro",
    category: "advanced",
    difficulty: "advanced",
  },
  {
    id: "q_stop",
    keys: ["q"],
    description: "Makro kaydını durdur",
    category: "advanced",
    difficulty: "advanced",
  },
  {
    id: "@a",
    keys: ["@", "a"],
    description: "Makro çalıştır (a registerinden)",
    category: "advanced",
    difficulty: "advanced",
  },
  {
    id: "@@",
    keys: ["@", "@"],
    description: "Son makroyu tekrarla",
    category: "advanced",
    difficulty: "advanced",
  },
  {
    id: "ctrl-a",
    keys: ["Ctrl", "a"],
    description: "Sayıyı artır",
    category: "advanced",
    difficulty: "advanced",
  },
  {
    id: "ctrl-x",
    keys: ["Ctrl", "x"],
    description: "Sayıyı azalt",
    category: "advanced",
    difficulty: "advanced",
  },
  {
    id: '"ay',
    keys: ['"', "a", "y"],
    description: "a registerine yank",
    category: "advanced",
    difficulty: "advanced",
  },
  {
    id: '"ap',
    keys: ['"', "a", "p"],
    description: "a registerinden paste",
    category: "advanced",
    difficulty: "advanced",
  },
];

export const getShortcutsByCategory = (categoryId: string): VimShortcut[] => {
  return vimShortcuts.filter((s) => s.category === categoryId);
};

export const getShortcutsByDifficulty = (
  difficulty: VimShortcut["difficulty"]
): VimShortcut[] => {
  return vimShortcuts.filter((s) => s.difficulty === difficulty);
};

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find((c) => c.id === id);
};
