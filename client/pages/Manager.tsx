import { useEffect, useMemo, useState } from "react";
import { AccountInfo } from "@/components/AccountInfo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SidebarLayout } from "@/components/layouts/SidebarLayout";

const PAY_KEY = "mossd_payments";
const DISH_KEY = "mossd_dishes";

type Tx = { id: string; method: "cash"|"momo"|"bank"; amount: number; createdAt: string };
function loadPays(): Tx[] { const raw = localStorage.getItem(PAY_KEY); return raw? JSON.parse(raw): []; }

type Product = { id: string; name: string; plan: number; visible: boolean };
function loadDishes(): Product[] { const raw = localStorage.getItem(DISH_KEY); const arr = raw? JSON.parse(raw) as { id:string;name:string;price:number;visible:boolean }[]: []; return arr.map(d=> ({ id: d.id, name: d.name, plan: 0, visible: d.visible })); }

export default function Manager(){
  const [tab, setTab] = useState("report");
  const [txs, setTxs] = useState<Tx[]>([]);
  const [items, setItems] = useState<Product[]>([]);
  const [accName, setAccName] = useState("");

  useEffect(()=>{ setTxs(loadPays()); setItems(loadDishes()); },[]);

  const totals = useMemo(()=> ({
    cash: txs.filter(t=>t.method==='cash').reduce((s,t)=>s+t.amount,0),
    momo: txs.filter(t=>t.method==='momo').reduce((s,t)=>s+t.amount,0),
    bank: txs.filter(t=>t.method==='bank').reduce((s,t)=>s+t.amount,0),
  }),[txs]);
  const grand = totals.cash + totals.momo + totals.bank;

  return (
    <SidebarLayout
      title="Bảng điều khiển Manager"
      items={[
        { key: "report", label: "Báo cáo doanh thu" },
        { key: "products", label: "Quản lý sản phẩm" },
        { key: "accounts", label: "Tài khoản (đơn giản)" },
      ]}
      active={tab}
      onSelect={setTab}
    >
      <AccountInfo />
      {tab === "report" && (
        <Card>
          <CardHeader><CardTitle>Report doanh thu ngày</CardTitle></CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div>Tiền mặt: <b>{totals.cash.toLocaleString()}₫</b></div>
            <div>MoMo: <b>{totals.momo.toLocaleString()}₫</b></div>
            <div>Ngân hàng: <b>{totals.bank.toLocaleString()}₫</b></div>
            <div className="pt-2 border-t">Tổng kết ca: <b>{grand.toLocaleString()}₫</b></div>
          </CardContent>
        </Card>
      )}
      {tab === "products" && (
        <Card>
          <CardHeader><CardTitle>Product Management</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            {items.map((p,i)=> (
              <div key={p.id} className="flex items-center justify-between gap-3 rounded-md border p-3">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">Kế hoạch bán trong ngày</div>
                </div>
                <div className="flex items-center gap-2">
                  <Input value={p.plan} onChange={(e)=>{
                    const v = parseInt(e.target.value||"0");
                    const next=[...items]; next[i] = { ...p, plan: Number.isNaN(v)?0:v }; setItems(next);
                  }} className="w-20"/>
                  <Button variant={p.visible?"secondary":"outline"} onClick={()=>{ const next=[...items]; next[i] = { ...p, visible: !p.visible }; setItems(next); }}>
                    {p.visible?"Đang bán":"Ẩn"}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      {tab === "accounts" && (
        <Card>
          <CardHeader><CardTitle>CRUD tài khoản (đơn giản)</CardTitle></CardHeader>
          <CardContent className="flex gap-2">
            <Input placeholder="Tên tài khoản" value={accName} onChange={(e)=>setAccName(e.target.value)} />
            <Button onClick={()=> setAccName("")}>Thêm (mock)</Button>
          </CardContent>
        </Card>
      )}
    </SidebarLayout>
  );
}
