import { Link, NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { toast } from "sonner";

export function SiteHeader() {
  const { pathname } = useLocation();
  const isMenuPage = pathname.startsWith("/menu");
  const desktopNav = isMenuPage
    ? [{ to: "/", label: "Trang chủ" }]
    : [{ to: "/", label: "Trang chủ" }];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <div className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground">
            MOSSD
          </div>
          <span className="hidden sm:inline">Meal Ordering Support System</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {desktopNav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )
              }
            >
              {n.label}
            </NavLink>
          ))}
          {isMenuPage && (
            <>
              <AboutUsTrigger />
              <ViewMenuTrigger />
              <ReservationTrigger />
            </>
          )}
        </nav>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="mt-6 grid gap-2">
                {desktopNav.map((n) => (
                  <NavLink
                    key={n.to}
                    to={n.to}
                    className={({ isActive }) =>
                      cn(
                        "px-3 py-2 text-sm font-medium rounded-md",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-accent",
                      )
                    }
                  >
                    {n.label}
                  </NavLink>
                ))}
                {isMenuPage && (
                  <div className="grid gap-2">
                    <AboutUsTrigger asButton />
                    <ReservationTrigger asButton />
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function AboutUsTrigger({ asButton }: { asButton?: boolean }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {asButton ? (
          <Button variant="outline">About Us</Button>
        ) : (
          <button className="px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground">
            About Us
          </button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-[420px]">
        <SheetHeader>
          <SheetTitle>Về nhà hàng</SheetTitle>
          <SheetDescription>
            Tổng quan về concept, chất lượng món ăn và dịch vụ.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-3 text-sm text-muted-foreground">
          <p>
            Nhà hàng tập trung vào nguyên liệu tươi, chế biến theo ngày. Không
            gian hiện đại, phù hợp gia đình và bạn bè.
          </p>
          <p>
            Giờ mở cửa: 10:00 - 22:00 hằng ngày. Đặt bàn qua mục Reservation để
            giữ chỗ.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ViewMenuTrigger({ asButton }: { asButton?: boolean }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {asButton ? (
          <Button variant="outline">View Menu</Button>
        ) : (
          <button className="px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground">
            View Menu
          </button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-[420px]">
        <SheetHeader>
          <SheetTitle>Về nhà hàng</SheetTitle>
          <SheetDescription>
            Tổng quan về concept, chất lượng món ăn và dịch vụ.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-3 text-sm text-muted-foreground">
          <p>
            Nhà hàng tập trung vào nguyên liệu tươi, chế biến theo ngày. Không
            gian hiện đại, phù hợp gia đình và bạn bè.
          </p>
          <p>
            Giờ mở cửa: 10:00 - 22:00 hằng ngày. Đặt bàn qua mục Reservation để
            giữ chỗ.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ReservationTrigger({ asButton }: { asButton?: boolean }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {asButton ? (
          <Button>Reservation</Button>
        ) : (
          <button className="px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground">
            Reservation
          </button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-[420px]">
        <SheetHeader>
          <SheetTitle>Đặt bàn</SheetTitle>
          <SheetDescription>
            Nhập thông tin để nhà hàng chuẩn bị tốt nhất.
          </SheetDescription>
        </SheetHeader>
        <form
          className="mt-4 grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const data = Object.fromEntries(fd.entries());
            const raw = localStorage.getItem("mossd_reservations");
            const arr = raw ? JSON.parse(raw) : [];
            arr.push({
              ...data,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            });
            localStorage.setItem("mossd_reservations", JSON.stringify(arr));
            toast.success("Đã gửi yêu cầu đặt bàn");
          }}
        >
          <input
            name="phone"
            className="rounded-md border px-3 py-2"
            placeholder="Số điện thoại"
          />
          <input
            name="name"
            className="rounded-md border px-3 py-2"
            placeholder="Tên"
          />
          <input
            name="date"
            className="rounded-md border px-3 py-2"
            placeholder="Ngày (YYYY-MM-DD)"
          />
          <input
            name="time"
            className="rounded-md border px-3 py-2"
            placeholder="Giờ (HH:mm)"
          />
          <input
            name="size"
            className="rounded-md border px-3 py-2"
            placeholder="Số người"
          />
          <Button type="submit">Gửi yêu cầu</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
