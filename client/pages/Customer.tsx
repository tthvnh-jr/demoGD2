import { useMemo, useState } from "react";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ShoppingCart, Phone, ScanLine, Salad, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";

const phoneSchema = z.string().regex(/^0\d{9}$/);

const DISH_KEY = "mossd_dishes";
const PAY_KEY = "mossd_payments";
const ORD_KEY = "mossd_orders";

type Dish = {
  id: string;
  name: string;
  desc: string;
  img: string;
  calories: number;
  price: number;
  tags: string[];
};

type CartItem = {
  dish: Dish;
  qty: number;
  size: "S" | "M" | "L";
  spicy: "None" | "Mild" | "Medium" | "Hot";
  addons: { name: string; price: number }[];
};

const DEFAULT_DISHES: Dish[] = [
  {
    id: "1",
    name: "Grilled Chicken Bowl",
    desc: "Protein-rich bowl with quinoa and veggies.",
    img: "https://images.unsplash.com/photo-1604908554007-59a3c49d5d9b?q=80&w=800&auto=format&fit=crop",
    calories: 520,
    price: 120000,
    tags: ["healthy", "protein"],
  },
  {
    id: "2",
    name: "Vegan Salad",
    desc: "Fresh greens, avocado, and citrus dressing.",
    img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format&fit=crop",
    calories: 340,
    price: 90000,
    tags: ["vegan", "light"],
  },
  {
    id: "3",
    name: "Beef Pho",
    desc: "Traditional Vietnamese beef noodle soup.",
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop",
    calories: 610,
    price: 80000,
    tags: ["soup", "classic"],
  },
  {
    id: "4",
    name: "Spicy Ramen",
    desc: "Rich broth with chili oil and soft-boiled egg.",
    img: "https://images.unsplash.com/photo-1557872943-16a5ac26437b?q=80&w=800&auto=format&fit=crop",
    calories: 700,
    price: 110000,
    tags: ["spicy", "noodles"],
  },
];

const TAGS = ["all", "healthy", "protein", "vegan", "light", "soup", "classic", "spicy", "noodles"] as const;

function loadDishes(): Dish[] {
  const raw = localStorage.getItem(DISH_KEY);
  const admin = raw ? (JSON.parse(raw) as { id:string; name:string; price:number; visible:boolean }[]) : [];
  const mapped: Dish[] = admin.filter(d=> d.visible).map(d=> ({ id: d.id, name: d.name, price: d.price, desc: "Món theo menu", img: DEFAULT_DISHES[0].img, calories: 500, tags: ["classic" ] }));
  const merged = [...DEFAULT_DISHES, ...mapped.filter(m=> !DEFAULT_DISHES.find(x=> x.id===m.id))];
  return merged;
}

export default function Customer() {
  const [phone, setPhone] = useState("");
  const [isLogged, setLogged] = useState(false);
  const [qr, setQr] = useState("");
  const [filter, setFilter] = useState<(typeof TAGS)[number]>("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [payment, setPayment] = useState<"momo" | "bank" | "cash">("momo");
  const [split, setSplit] = useState(false);
  const [status, setStatus] = useState<"created" | "confirmed" | "cooking" | "serving" | "done">("created");

  const [showPersonalize, setShowPersonalize] = useState(false);
  const [bmi, setBmi] = useState<number | null>(null);
  const [diet, setDiet] = useState<string>("");
  const [likes, setLikes] = useState<string>("");
  const [recommendTags, setRecommendTags] = useState<string[] | null>(null);

  const dishes = useMemo(()=> loadDishes(), []);
  const visibleDishes = useMemo(() => {
    const base = filter === "all" ? dishes : dishes.filter((d) => d.tags.includes(filter));
    if (!recommendTags || recommendTags.length === 0) return base;
    return base.filter((d) => recommendTags.some((t) => d.tags.includes(t)));
  }, [filter, recommendTags, dishes]);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, it) => {
      const addons = it.addons.reduce((s, a) => s + a.price, 0);
      return sum + (it.dish.price + addons) * it.qty;
    }, 0);
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (it) => it.dish.id === item.dish.id && it.size === item.size && it.spicy === item.spicy,
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + item.qty };
        return copy;
      }
      return [...prev, item];
    });
    toast.success("Đã thêm vào giỏ hàng");
  };

  const checkout = () => {
    if (!qr) { toast.error("Vui lòng nhập/scan QR bàn"); return; }
    if (!isLogged && !phoneSchema.safeParse(phone).success) { toast.error("Số điện thoại không hợp lệ (bắt đầu bằng 0, 10 số)"); return; }
    if (cart.length === 0) { toast.error("Giỏ hàng đang trống"); return; }

    const paysRaw = localStorage.getItem(PAY_KEY);
    const pays = paysRaw ? JSON.parse(paysRaw) as any[] : [];
    pays.push({ id: crypto.randomUUID(), amount: subtotal, method: payment, createdAt: new Date().toISOString(), table: qr, phone });
    localStorage.setItem(PAY_KEY, JSON.stringify(pays));

    const ordRaw = localStorage.getItem(ORD_KEY);
    const ords = ordRaw ? JSON.parse(ordRaw) as any[] : [];
    for(const it of cart){
      ords.push({ dishId: it.dish.id, qty: it.qty, createdAt: new Date().toISOString()});
    }
    localStorage.setItem(ORD_KEY, JSON.stringify(ords));

    setStatus("confirmed");
    toast("Đặt món thành công", { description: "Nhà bếp sẽ chuẩn bị ngay!" });
  };

  return (
    <div className="container py-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="grid gap-6">
          <Card>
            <CardHeader className="flex items-center justify-between sm:flex-row sm:items-end gap-4">
              <CardTitle className="flex items-center gap-2"><Salad className="text-primary"/> MOSSD – Customer</CardTitle>
              <div className="flex flex-wrap items-center gap-3">
                {!isLogged ? (
                  <div className="flex items-end gap-2">
                    <div>
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <Input id="phone" placeholder="0xxxxxxxxx" value={phone} onChange={(e)=>setPhone(e.target.value)} className="w-44" />
                    </div>
                    <Button onClick={() => {
                      if (!phoneSchema.safeParse(phone).success) { toast.error("SĐT không hợp lệ"); return; }
                      setLogged(true);
                      toast.success("Đăng nhập thành công");
                    }}>
                      <Phone className="mr-2"/> Đăng nhập
                    </Button>
                    <Button variant="ghost" onClick={() => setLogged(true)}>Bỏ qua</Button>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">Xin chào{phone ? `, ${phone}` : "!"}</div>
                )}
                <div className="flex items-end gap-2">
                  <div>
                    <Label htmlFor="qr">QR bàn</Label>
                    <Input id="qr" placeholder="Nhập mã QR" value={qr} onChange={(e)=>setQr(e.target.value)} className="w-36" />
                  </div>
                  <Button variant="outline"><ScanLine className="mr-2"/> Quét</Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Cá nhân hoá món ăn</CardTitle>
              <Button variant="outline" onClick={()=> setShowPersonalize(v=>!v)}>{showPersonalize? 'Đóng' : 'Cá nhân hoá'}</Button>
            </CardHeader>
            {showPersonalize && (
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-3 max-w-xl">
                  <div>
                    <Label htmlFor="h">Chiều cao (cm)</Label>
                    <Input id="h" type="number" placeholder="170" onChange={(e)=>{}} />
                  </div>
                  <div>
                    <Label htmlFor="w">Cân nặng (kg)</Label>
                    <Input id="w" type="number" placeholder="65" onChange={(e)=>{}} />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="diet">Nhu cầu ăn uống</Label>
                    <Input id="diet" placeholder="Healthy, giảm cân, tăng cơ..." value={diet} onChange={(e)=>setDiet(e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="likes">Sở thích</Label>
                    <Input id="likes" placeholder="spicy, soup..." value={likes} onChange={(e)=>setLikes(e.target.value)} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => {
                    const h = Number((document.getElementById('h') as HTMLInputElement)?.value || 0);
                    const w = Number((document.getElementById('w') as HTMLInputElement)?.value || 0);
                    if (!h || !w) { toast.error('Vui lòng nhập đủ chiều cao, cân nặng'); return; }
                    const val = Number((w / Math.pow(h/100,2)).toFixed(1));
                    setBmi(val);
                    const tags: string[] = [];
                    if (val >= 25) tags.push('healthy','light','vegan');
                    if (val < 18.5) tags.push('protein');
                    if (likes.toLowerCase().includes('spicy')) tags.push('spicy');
                    if (likes.toLowerCase().includes('soup')) tags.push('soup');
                    setRecommendTags(Array.from(new Set(tags)));
                  }}>Submit</Button>
                  {recommendTags && (
                    <Button variant="ghost" onClick={()=>{ setRecommendTags(null); setBmi(null); }}>Reset</Button>
                  )}
                </div>
                {bmi !== null && (
                  <div className="text-sm text-muted-foreground">BMI của bạn: <span className="font-medium text-foreground">{bmi}</span> • Gợi ý theo tag: {recommendTags?.join(', ') || '—'}</div>
                )}
              </CardContent>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Menu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-wrap gap-2">
                {TAGS.map((t) => (
                  <Button key={t} variant={filter === t ? "default" : "outline"} onClick={() => setFilter(t)} className="capitalize">
                    {t}
                  </Button>
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {visibleDishes.map((d) => (
                  <DishCard key={d.id} dish={d} onAdd={addToCart} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="lg:sticky lg:top-20 h-max">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2"><ShoppingCart/> Giỏ hàng</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                Chia hóa đơn
                <Switch checked={split} onCheckedChange={setSplit} />
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              {cart.length === 0 ? (
                <p className="text-sm text-muted-foreground">Chưa có món nào.</p>
              ) : (
                <div className="grid gap-3">
                  {cart.map((it, idx) => (
                    <div key={idx} className="rounded-md border p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-medium">{it.dish.name} × {it.qty}</div>
                          <div className="text-xs text-muted-foreground">Size {it.size} • {it.spicy}
                            {it.addons.length ? ` • +${it.addons.map(a=>a.name).join(", ")}` : ""}
                          </div>
                        </div>
                        <div className="font-semibold">{((it.dish.price + it.addons.reduce((s,a)=>s+a.price,0)) * it.qty).toLocaleString()}₫</div>
                      </div>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex items-center justify-between font-semibold">
                    <span>Tạm tính</span>
                    <span>{subtotal.toLocaleString()}₫</span>
                  </div>
                  <div>
                    <Label className="mb-2 block">Phương thức thanh toán</Label>
                    <RadioGroup value={payment} onValueChange={(v)=>setPayment(v as any)} className="grid gap-2">
                      <label className={cn("flex items-center gap-3 rounded-md border p-3", payment==='momo' && 'ring-2 ring-primary')}>
                        <RadioGroupItem value="momo" id="pay-momo" />
                        <span>Ví MoMo</span>
                      </label>
                      <label className={cn("flex items-center gap-3 rounded-md border p-3", payment==='bank' && 'ring-2 ring-primary')}>
                        <RadioGroupItem value="bank" id="pay-bank" />
                        <span>Chuyển khoản ngân hàng</span>
                      </label>
                      <label className={cn("flex items-center gap-3 rounded-md border p-3", payment==='cash' && 'ring-2 ring-primary')}>
                        <RadioGroupItem value="cash" id="pay-cash" />
                        <span>Tiền mặt</span>
                      </label>
                    </RadioGroup>
                  </div>
                  <Button className="w-full" onClick={checkout}>Thanh toán</Button>
                  <Button variant="outline" className="w-full" onClick={()=> toast.info("Đã gửi yêu cầu, vui lòng chờ trong giây lát" , { description: "Nhân viên sẽ đến hỗ trợ"})}>
                    Gọi nhân viên
                  </Button>
                  <OrderStatus status={status} onNext={() => setStatus(nextStatus(status))} />
                </div>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function nextStatus(s: "created" | "confirmed" | "cooking" | "serving" | "done") {
  const arr = ["created","confirmed","cooking","serving","done"] as const;
  const i = arr.indexOf(s);
  return arr[Math.min(i+1, arr.length-1)];
}

function OrderStatus({ status, onNext }: { status: "created" | "confirmed" | "cooking" | "serving" | "done"; onNext: () => void }) {
  const steps = [
    { key: "created", label: "Đã tạo" },
    { key: "confirmed", label: "Xác nhận" },
    { key: "cooking", label: "Đang nấu" },
    { key: "serving", label: "Đang phục vụ" },
    { key: "done", label: "Hoàn thành" },
  ] as const;
  return (
    <div>
      <div className="mb-2 text-sm font-medium">Trạng thái đơn</div>
      <div className="flex items-center justify-between gap-2">
        {steps.map((s, i) => (
          <div key={s.key} className={cn("grid place-items-center text-center text-xs", status === s.key ? "text-primary" : "text-muted-foreground")}> 
            <div className={cn("size-6 grid place-items-center rounded-full border", status === s.key && "bg-primary text-primary-foreground border-primary")}>{i+1}</div>
            <div className="mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      {status !== "done" && (
        <Button variant="ghost" className="mt-2" onClick={onNext}>Cập nhật trạng thái tiếp theo</Button>
      )}
    </div>
  );
}

function DishCard({ dish, onAdd }: { dish: Dish; onAdd: (it: CartItem) => void }) {
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState<CartItem["size"]>("M");
  const [spicy, setSpicy] = useState<CartItem["spicy"]>("Medium");
  const [addons, setAddons] = useState<{ name: string; price: number }[]>([]);

  const toggleAddon = (a: { name: string; price: number }) => {
    setAddons((prev) =>
      prev.find((x) => x.name === a.name) ? prev.filter((x) => x.name !== a.name) : [...prev, a],
    );
  };

  const price = dish.price + addons.reduce((s, a) => s + a.price, 0);

  return (
    <Card className="overflow-hidden">
      <div className="aspect-[4/3] w-full overflow-hidden">
        <img src={dish.img} alt={dish.name} className="h-full w-full object-cover transition-transform hover:scale-105"/>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-semibold leading-tight">{dish.name}</div>
            <div className="text-xs text-muted-foreground line-clamp-2">{dish.desc}</div>
            <div className="mt-2 flex flex-wrap gap-1">
              {dish.tags.map((t) => (
                <Badge key={t} variant="secondary" className="capitalize">{t}</Badge>
              ))}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{dish.calories} kcal</div>
          </div>
          <div className="text-right">
            <div className="font-semibold">{dish.price.toLocaleString()}₫</div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="mt-2">Chọn món</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2"><ChefHat className="text-primary"/> Tuỳ chỉnh món</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Bắt bu��c: Size</Label>
                    <RadioGroup value={size} onValueChange={(v)=>setSize(v as any)} className="flex gap-2">
                      {["S","M","L"].map((s) => (
                        <label key={s} className={cn("flex items-center gap-2 rounded-md border px-3 py-2", size===s && 'ring-2 ring-primary')}>
                          <RadioGroupItem value={s} id={`size-${s}`} /> Size {s}
                        </label>
                      ))}
                    </RadioGroup>
                  </div>
                  <div className="grid gap-2">
                    <Label>Bắt buộc: Mức cay</Label>
                    <RadioGroup value={spicy} onValueChange={(v)=>setSpicy(v as any)} className="grid grid-cols-2 gap-2 sm:flex">
                      {["None","Mild","Medium","Hot"].map((s) => (
                        <label key={s} className={cn("flex items-center gap-2 rounded-md border px-3 py-2", spicy===s && 'ring-2 ring-primary')}>
                          <RadioGroupItem value={s} id={`spicy-${s}`} /> {s}
                        </label>
                      ))}
                    </RadioGroup>
                  </div>
                  <div className="grid gap-2">
                    <Label>Tùy chọn thêm</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { name: "Trứng", price: 10000 },
                        { name: "Phô mai", price: 12000 },
                        { name: "Thịt thêm", price: 20000 },
                        { name: "Bánh mì", price: 8000 },
                      ].map((a) => (
                        <button
                          key={a.name}
                          onClick={() => toggleAddon(a)}
                          className={cn(
                            "rounded-md border px-3 py-2 text-left text-sm",
                            addons.find((x) => x.name === a.name) && "border-primary bg-primary/5",
                          )}
                        >
                          {a.name} (+{a.price.toLocaleString()}₫)
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={()=> setQty(Math.max(1, qty-1))}>-</Button>
                      <div className="w-8 text-center">{qty}</div>
                      <Button variant="outline" size="icon" onClick={()=> setQty(qty+1)}>+</Button>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Tạm tính</div>
                      <div className="text-lg font-semibold">{(price*qty).toLocaleString()}₫</div>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      onAdd({ dish, qty, size, spicy, addons });
                      setOpen(false);
                      setQty(1);
                      setAddons([]);
                    }}
                  >
                    Thêm vào giỏ
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
