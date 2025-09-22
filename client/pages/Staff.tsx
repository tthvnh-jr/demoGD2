import { useState } from "react";
import { AccountInfo } from "@/components/AccountInfo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarLayout } from "@/components/layouts/SidebarLayout";

const TABLES = ["A1","A2","A3","B1","B2","B3"] as const;

type Dish = { id: string; name: string; note?: string; status: "cooking"|"served" };
const INITIAL: Record<string, Dish[]> = {
  A1: [{ id: "1", name: "Beef Pho", note: "ít hành", status: "cooking" }],
  B2: [{ id: "2", name: "Ramen", note: "", status: "cooking" }],
};

export default function Staff(){
  const [tab, setTab] = useState("tables");
  const [orders, setOrders] = useState<Record<string, Dish[]>>(INITIAL);
  const [helps, setHelps] = useState<string[]>(["B3"]);

  return (
    <SidebarLayout
      title="Bảng điều khiển Staff"
      items={[{ key: "tables", label: "Tổng quan bàn" }, { key: "orders", label: "Đơn theo bàn" }]}
      active={tab}
      onSelect={setTab}
    >
      <AccountInfo />
      {tab === "tables" && (
        <Card>
          <CardHeader><CardTitle>Tổng quan bàn</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-3 gap-2">
            {TABLES.map((t)=>{
              const occupied = (orders[t]||[]).length>0;
              const needHelp = helps.includes(t);
              return (
                <div key={t} className={`rounded-md border p-3 text-center text-sm ${occupied? 'bg-accent/50':''}`}>
                  <div className="font-medium">{t}</div>
                  <div className="text-xs text-muted-foreground">{occupied? 'Có khách':'Trống'}</div>
                  {needHelp && <div className="mt-1 text-xs text-orange-600">Cần hỗ trợ</div>}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
      {tab === "orders" && (
        <Card>
          <CardHeader><CardTitle>Đơn theo bàn</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            {Object.entries(orders).map(([table, list])=> (
              <div key={table} className="rounded-md border p-3">
                <div className="mb-2 font-medium">Bàn {table}</div>
                {list.map((d,i)=> (
                  <div key={d.id} className="flex items-center justify-between py-2">
                    <div>
                      <div>{d.name}</div>
                      {d.note && <div className="text-xs text-muted-foreground">Ghi chú: {d.note}</div>}
                    </div>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={()=>{ const copy={...orders}; copy[table][i] = { ...d, status: 'served' }; setOrders(copy); }}
                    >Đã lên món</Button>
                  </div>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </SidebarLayout>
  );
}
