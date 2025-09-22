import { useState } from "react";
import { AccountInfo } from "@/components/AccountInfo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarLayout } from "@/components/layouts/SidebarLayout";

type Item = { id: string; table: string; name: string; note?: string; status: "ordered"|"cooking"|"done" };
const INITIAL: Item[] = [
  { id: "1", table: "A1", name: "Beef Pho", note: "ít hành", status: "ordered" },
  { id: "2", table: "B3", name: "Ramen", note: "spicy", status: "ordered" },
];

export default function Chef(){
  const [tab, setTab] = useState("queue");
  const [list, setList] = useState<Item[]>(INITIAL);
  const next = (s: Item["status"]) => (s === "ordered" ? "cooking" : s === "cooking" ? "done" : "done");

  return (
    <SidebarLayout
      title="Bảng điều khiển Chef"
      items={[{ key: "queue", label: "Hàng chờ" }]}
      active={tab}
      onSelect={setTab}
    >
      <AccountInfo />
      <Card>
        <CardHeader><CardTitle>Hàng chờ món</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          {list.map((it,i)=> (
            <div key={it.id} className="flex items-center justify-between rounded-md border p-3">
              <div>
                <div className="font-medium">Bàn {it.table} — {it.name}</div>
                {it.note && <div className="text-xs text-muted-foreground">Ghi chú: {it.note}</div>}
              </div>
              <div className="flex gap-2">
                {it.status !== 'ordered' && (
                  <Button variant="outline" onClick={()=>{ const copy=[...list]; copy[i]={...it, status: 'ordered'}; setList(copy);} }>Đợi</Button>
                )}
                {it.status !== 'cooking' && (
                  <Button variant="secondary" onClick={()=>{ const copy=[...list]; copy[i]={...it, status: 'cooking'}; setList(copy);} }>Nấu</Button>
                )}
                {it.status !== 'done' && (
                  <Button className="bg-green-600 hover:bg-green-700" onClick={()=>{ const copy=[...list]; copy[i]={...it, status: 'done'}; setList(copy);} }>Xong</Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </SidebarLayout>
  );
}
