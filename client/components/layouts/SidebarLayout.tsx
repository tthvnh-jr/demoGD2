import { ReactNode } from "react";

export type SidebarItem = {
  key: string;
  label: string;
};

export function SidebarLayout({
  items,
  active,
  onSelect,
  children,
  title,
}: {
  title?: string;
  items: SidebarItem[];
  active: string;
  onSelect: (key: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="container py-8">
      {title && <h1 className="mb-4 text-2xl font-bold">{title}</h1>}
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="h-max rounded-md border bg-card">
          <nav className="grid">
            {items.map((it) => (
              <button
                key={it.key}
                onClick={() => onSelect(it.key)}
                className={`text-left px-4 py-3 text-sm border-b last:border-b-0 hover:bg-accent ${
                  active === it.key ? "bg-accent/60 font-medium" : ""
                }`}
              >
                {it.label}
              </button>
            ))}
          </nav>
        </aside>
        <section>{children}</section>
      </div>
    </div>
  );
}
