// src/components/ui/header.tsx
import { ModeToggle } from "@/components/ui/mode-toggle";

const Header = () => {
  return (
    <header className="p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold"></h1>
      <ModeToggle /> {/* Theme toggle button */}
    </header>
  );
};

export default Header;
