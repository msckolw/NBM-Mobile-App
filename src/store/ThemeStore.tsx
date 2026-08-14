import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeType = "light" | "dark";

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: "light" as ThemeType,
      toggleTheme: () =>
        set((state:any) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
    }),
    { name: "theme-storage" }
  )
);
