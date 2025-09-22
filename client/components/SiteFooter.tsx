import { Facebook, Instagram } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 text-sm text-muted-foreground flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} MOSSD. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-foreground"><Instagram size={16}/> Instagram</a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-foreground"><Facebook size={16}/> Facebook</a>
          <span className="opacity-80">Contact: 0922393339</span>
        </div>
      </div>
    </footer>
  );
}
