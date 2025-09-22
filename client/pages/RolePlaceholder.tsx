import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function RolePlaceholder({
  role,
  description,
  features,
}: {
  role: string;
  description: string;
  features: string[];
}) {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{role}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <p className="text-muted-foreground">{description}</p>
            <div className="flex flex-wrap gap-2">
              {features.map((f) => (
                <Badge key={f} variant="secondary">{f}</Badge>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              Nội dung chi tiết sẽ được hoàn thiện tiếp. Yêu cầu thêm gì hãy nhắn tiếp trong chat.
            </div>
            <div className="flex gap-3">
              <Link to="/customer"><Button>Trải nghiệm Customer</Button></Link>
              <Link to="/"><Button variant="outline">Trang chủ</Button></Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
