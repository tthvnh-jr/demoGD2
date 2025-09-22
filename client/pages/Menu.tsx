import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MenuPage(){
  return (
    <div>
      <section className="border-b">
        <div className="container py-12">
          <h1 className="text-3xl font-bold">Giới thiệu về quán</h1>
          <p className="mt-2 text-muted-foreground">Banner & View menu (chỉ xem, không đặt món)</p>
          <div className="mt-6 aspect-[21/9] overflow-hidden rounded-xl border">
            <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop" className="h-full w-full object-cover" alt="banner"/>
          </div>
        </div>
      </section>
      <section className="container py-10">
        <h2 className="text-xl font-semibold">Best sellers</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {["Beef Pho","Grilled Chicken","Vegan Salad"].map((t)=> (
            <Card key={t}><CardHeader><CardTitle>{t}</CardTitle></CardHeader><CardContent>Ngon nhất tháng này.</CardContent></Card>
          ))}
        </div>
        <h2 className="mt-10 text-xl font-semibold">Good deals</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {["Combo Lunch","Happy Hour"].map((t)=> (
            <Card key={t}><CardHeader><CardTitle>{t}</CardTitle></CardHeader><CardContent>Ưu đãi hấp dẫn.</CardContent></Card>
          ))}
        </div>
        <h2 className="mt-10 text-xl font-semibold">Sale of the month</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {["Salmon Bowl","Ramen Spicy"].map((t)=> (
            <Card key={t}><CardHeader><CardTitle>{t}</CardTitle></CardHeader><CardContent>Giảm giá đặc biệt.</CardContent></Card>
          ))}
        </div>
      </section>
    </div>
  );
}
