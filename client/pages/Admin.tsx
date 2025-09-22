import { useEffect, useMemo, useState } from "react";
import { AccountInfo } from "@/components/AccountInfo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SidebarLayout } from "@/components/layouts/SidebarLayout";

export type Account = { id: string; name: string; role: "Admin"|"Manager"|"Chef"|"Staff" };
const ACC_KEY = "mossd_accounts";
const DISH_KEY = "mossd_dishes";
const PAY_KEY = "mossd_payments";
const ORD_KEY = "mossd_orders";

type Dish = { id: string; name: string; price: number; visible: boolean };
type Payment = { id: string; amount: number; method: "cash"|"momo"|"bank"; createdAt: string };
type OrderItem = { dishId: string; qty: number; createdAt: string };

function loadAcc(): Account[] { const raw = localStorage.getItem(ACC_KEY); return raw? JSON.parse(raw): []; }
function saveAcc(list: Account[]) { localStorage.setItem(ACC_KEY, JSON.stringify(list)); }
function loadDishes(): Dish[] { const raw = localStorage.getItem(DISH_KEY); return raw? JSON.parse(raw): []; }
function saveDishes(list: Dish[]) { localStorage.setItem(DISH_KEY, JSON.stringify(list)); }
function loadPays(): Payment[] { const raw = localStorage.getItem(PAY_KEY); return raw? JSON.parse(raw): []; }
function loadOrders(): OrderItem[] { const raw = localStorage.getItem(ORD_KEY); return raw? JSON.parse(raw): []; }

export default function Admin(){
  const [tab, setTab] = useState("dashboard");
  const [list, setList] = useState<Account[]>([]);
  const [editing, setEditing] = useState<Account | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState<Account["role"]>("Staff");

  const [dishes, setDishes] = useState<Dish[]>([]);
  const [dishName, setDishName] = useState("");
  const [dishPrice, setDishPrice] = useState<number>(0);
  const [dishEditing, setDishEditing] = useState<Dish | null>(null);

  const pays = useMemo(()=> loadPays(), []);
  const orders = useMemo(()=> loadOrders(), []);

  useEffect(()=>{ setList(loadAcc()); setDishes(loadDishes()); },[]);

  const upsertAcc = () => {
    if(!name.trim()) return;
    if(editing){
      const next = list.map(a=> a.id===editing.id? { ...a, name, role}: a);
      setList(next); saveAcc(next); setEditing(null); setName("");
    } else {
      const next = [...list, { id: crypto.randomUUID(), name: name.trim(), role }];
      setList(next); saveAcc(next); setName(""); setRole("Staff");
    }
  };
  const removeAcc = (id: string) => { const next = list.filter(a=>a.id!==id); setList(next); saveAcc(next); };

  const upsertDish = () => {
    if(!dishName.trim() || dishPrice<=0) return;
    if(dishEditing){
      const next = dishes.map(d=> d.id===dishEditing.id? { ...d, name: dishName.trim(), price: dishPrice }: d);
      setDishes(next); saveDishes(next); setDishEditing(null); setDishName(""); setDishPrice(0);
    } else {
      const next = [...dishes, { id: crypto.randomUUID(), name: dishName.trim(), price: dishPrice, visible: true }];
      setDishes(next); saveDishes(next); setDishName(""); setDishPrice(0);
    }
  };
  const removeDish = (id: string) => { const next = dishes.filter(d=>d.id!==id); setDishes(next); saveDishes(next); };

  const revBy = (fmt: (d: Date)=> string) => {
    const map = new Map<string, number>();
    for(const p of pays){
      const k = fmt(new Date(p.createdAt));
      map.set(k, (map.get(k)||0) + p.amount);
    }
    return Array.from(map.entries()).sort((a,b)=> a[0].localeCompare(b[0]));
  };
  const byDay = revBy(d=> d.toISOString().slice(0,10));
  const byMonth = revBy(d=> `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`);
  const byYear = revBy(d=> `${d.getFullYear()}`);

  const topDishes = useMemo(()=>{
    const m = new Map<string, number>();
    for(const o of orders){ m.set(o.dishId, (m.get(o.dishId)||0) + o.qty); }
    return Array.from(m.entries()).sort((a,b)=> b[1]-a[1]).slice(0,5);
  },[orders]);

  const exportCSV = () => {
    const rows = ["id,amount,method,createdAt", ...pays.map(p=> `${p.id},${p.amount},${p.method},${p.createdAt}`)];
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `invoices_${Date.now()}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <SidebarLayout
      title="Bảng điều khiển Admin"
      items={[
        { key: "dashboard", label: "Dashboard" },
        { key: "accounts", label: "Quản lý tài khoản" },
        { key: "dishes", label: "Quản lý món ăn" },
        { key: "invoices", label: "Hoá đơn & Doanh thu" },
      ]}
      active={tab}
      onSelect={setTab}
    >
      <AccountInfo />

      {tab === "dashboard" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Top món được gọi</CardTitle></CardHeader>
            <CardContent className="grid gap-2 text-sm">
              {topDishes.length===0 && <div className="text-muted-foreground">Chưa có dữ liệu</div>}
              {topDishes.map(([id, qty])=> (
                <div key={id} className="flex items-center justify-between border-b py-2 last:border-0">
                  <span>{(dishes.find(d=>d.id===id)?.name)||id}</span>
                  <b>× {qty}</b>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Doanh thu theo ngày/tháng/năm</CardTitle></CardHeader>
            <CardContent className="grid gap-4 text-sm">
              <section>
                <div className="font-medium">Theo ngày</div>
                {byDay.map(([k,v])=> (<div key={k} className="flex justify-between border-b py-1"><span>{k}</span><b>{v.toLocaleString()}₫</b></div>))}
              </section>
              <section>
                <div className="font-medium">Theo tháng</div>
                {byMonth.map(([k,v])=> (<div key={k} className="flex justify-between border-b py-1"><span>{k}</span><b>{v.toLocaleString()}₫</b></div>))}
              </section>
              <section>
                <div className="font-medium">Theo năm</div>
                {byYear.map(([k,v])=> (<div key={k} className="flex justify-between border-b py-1"><span>{k}</span><b>{v.toLocaleString()}₫</b></div>))}
              </section>
            </CardContent>
          </Card>
        </div>
      )}

      {tab === "accounts" && (
        <Card>
          <CardHeader><CardTitle>Quản lý tài khoản (Admin)</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex flex-wrap items-end gap-2">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Tên tài khoản</label>
                <Input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Tên" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Quyền</label>
                <select className="rounded-md border px-3 py-2" value={role} onChange={(e)=> setRole(e.target.value as any)}>
                  {( ["Admin","Manager","Chef","Staff"] as const).map(r=> <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <Button onClick={upsertAcc}>{editing? "Cập nhật" : "Thêm"}</Button>
              {editing && <Button variant="ghost" onClick={()=>{setEditing(null); setName("");}}>Hủy</Button>}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="p-2">Tên</th>
                    <th className="p-2">Quyền</th>
                    <th className="p-2 w-40">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map(a=> (
                    <tr key={a.id} className="border-t">
                      <td className="p-2">{a.name}</td>
                      <td className="p-2">{a.role}</td>
                      <td className="p-2 flex gap-2">
                        <Button variant="outline" size="sm" onClick={()=>{setEditing(a); setName(a.name); setRole(a.role);}}>Sửa</Button>
                        <Button variant="destructive" size="sm" onClick={()=>removeAcc(a.id)}>Xóa</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {tab === "dishes" && (
        <Card>
          <CardHeader><CardTitle>Quản lý món ăn</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex flex-wrap items-end gap-2">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Tên món</label>
                <Input value={dishName} onChange={(e)=>setDishName(e.target.value)} placeholder="Tên món" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Giá (VND)</label>
                <Input type="number" value={dishPrice} onChange={(e)=> setDishPrice(parseInt(e.target.value||"0"))} placeholder="0" className="w-40" />
              </div>
              <Button onClick={upsertDish}>{dishEditing? "Cập nhật" : "Thêm"}</Button>
              {dishEditing && <Button variant="ghost" onClick={()=>{setDishEditing(null); setDishName(""); setDishPrice(0);}}>Hủy</Button>}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="p-2">Tên</th>
                    <th className="p-2">Giá</th>
                    <th className="p-2">Trạng thái</th>
                    <th className="p-2 w-56">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {dishes.map(d=> (
                    <tr key={d.id} className="border-t">
                      <td className="p-2">{d.name}</td>
                      <td className="p-2">{d.price.toLocaleString()}₫</td>
                      <td className="p-2">{d.visible? 'Đang bán' : 'Ẩn'}</td>
                      <td className="p-2 flex gap-2">
                        <Button variant="outline" size="sm" onClick={()=>{setDishEditing(d); setDishName(d.name); setDishPrice(d.price);}}>Sửa</Button>
                        <Button variant={d.visible? 'secondary' : 'outline'} size="sm" onClick={()=>{ const next=dishes.map(x=> x.id===d.id? {...x, visible: !x.visible}: x); setDishes(next); saveDishes(next); }}>{d.visible? 'Ẩn' : 'Hiện'}</Button>
                        <Button variant="destructive" size="sm" onClick={()=>removeDish(d.id)}>Xóa</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {tab === "invoices" && (
        <Card>
          <CardHeader className="flex items-center justify-between sm:flex-row sm:items-end gap-4">
            <CardTitle>Hoá đơn & Doanh thu</CardTitle>
            <Button onClick={exportCSV}>Xuất CSV</Button>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm">
            <div className="font-medium">Tổng số hoá đơn: {pays.length}</div>
            <div className="grid gap-2">
              {pays.map((p)=> (
                <div key={p.id} className="flex items-center justify-between border-b py-2">
                  <span>{new Date(p.createdAt).toLocaleString()} • {p.method.toUpperCase()}</span>
                  <b>{p.amount.toLocaleString()}₫</b>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </SidebarLayout>
  );
}
