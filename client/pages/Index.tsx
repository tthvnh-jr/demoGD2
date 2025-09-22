import { DemoResponse } from "@shared/api";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { setUser } from "@/components/AccountInfo";

export default function Index() {
  const [exampleFromServer, setExampleFromServer] = useState("");
  const nav = useNavigate();
  useEffect(() => { fetchDemo(); }, []);

  const fetchDemo = async () => {
    try {
      const response = await fetch("/api/demo");
      const data = (await response.json()) as DemoResponse;
      setExampleFromServer(data.message);
    } catch {}
  };

  const roles = [
    { key: "Admin", href: "/admin", desc: "Quản trị hệ thống iPos logic" },
    { key: "Manager", href: "/manager", desc: "Báo cáo doanh thu, quản lý sản phẩm" },
    { key: "Chef", href: "/chef", desc: "Hàng chờ món, cập nhật trạng thái" },
    { key: "Staff", href: "/staff", desc: "Phục vụ, quản lý bàn và order" },
  ] as const;

  return (
    <div>
      <section className="border-b bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="container py-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">Trang chủ — Nhân sự nhà hàng</h1>
          <p className="mt-3 text-muted-foreground">Chọn vai trò để đăng nhập và làm việc. {exampleFromServer}</p>
        </div>
      </section>

      <section className="container py-12">
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((r) => (
            <Card key={r.key} className="p-4 text-center">
              <div className="text-lg font-semibold">{r.key}</div>
              <div className="mt-2 text-sm text-muted-foreground">{r.desc}</div>
              <div className="mt-4">
                <LoginDialog role={r.key} onSuccess={(name)=>{ setUser({ name, role: r.key }); nav(r.href); }} />
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a href="/menu" className="text-sm font-medium text-primary underline">Xem trang giới thiệu quán (Menu)</a>
        </div>
      </section>
    </div>
  );
}

function LoginDialog({ role, onSuccess }: { role: "Admin"|"Manager"|"Chef"|"Staff"; onSuccess: (name: string)=>void }){
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Đăng nhập</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Đăng nhập — {role}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div>
            <Label htmlFor={`name-${role}`}>Tài khoản</Label>
            <Input id={`name-${role}`} value={name} onChange={(e)=>setName(e.target.value)} placeholder="Tên hoặc email"/>
          </div>
          <div>
            <Label htmlFor={`pass-${role}`}>Mật khẩu</Label>
            <Input id={`pass-${role}`} type="password" value={pass} onChange={(e)=>setPass(e.target.value)} placeholder="••••••"/>
          </div>
          <Button
            onClick={()=>{
              if(name.trim().length<2||pass.trim().length<4) return;
              onSuccess(name.trim());
            }}
          >
            Đăng nhập
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
