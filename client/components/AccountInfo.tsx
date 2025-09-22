import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export type UserSession = { name: string; role: "Admin"|"Manager"|"Chef"|"Staff" };

const KEY = "mossd_user";

export function getUser(): UserSession | null {
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as UserSession) : null;
}
export function setUser(u: UserSession) {
  localStorage.setItem(KEY, JSON.stringify(u));
}
export function clearUser() {
  localStorage.removeItem(KEY);
}

export function AccountInfo() {
  const user = getUser();
  const nav = useNavigate();
  if (!user) return null;
  return (
    <Card className="mb-6">
      <CardContent className="flex items-center justify-between p-4 text-sm">
        <div>
          <div className="font-medium">Xin chào {user.name}</div>
          <div className="text-muted-foreground">Vai trò: {user.role}</div>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            clearUser();
            nav("/");
          }}
        >
          Logout
        </Button>
      </CardContent>
    </Card>
  );
}
