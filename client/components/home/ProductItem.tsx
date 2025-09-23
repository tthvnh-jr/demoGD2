import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Info, RotateCw } from "lucide-react";

type Props = {
  src: string;
  prevSrc: string;
  name: string;
  price: number;
};

export default function ProductItem({ src, prevSrc, name, price }: Props) {
  return (
    <Card className="group overflow-hidden">
      {/* Hộp ảnh */}
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        {/* Ảnh chính */}
        <img
          src={src}
          alt={name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-0"
        />
        {/* Ảnh hover */}
        <img
          src={prevSrc}
          alt={`${name} hover`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        {/* Action icons khi hover */}
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex translate-y-4 justify-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur border">
            <ShoppingCart className="h-5 w-5" />
          </button>
          <button className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur border">
            <Info className="h-5 w-5" />
          </button>
          <button className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur border">
            <RotateCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Title & Price */}
      <CardHeader className="p-4">
        <CardTitle className="text-base">{name}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-4 px-4">
        <div className="text-sm font-medium">${price}</div>
      </CardContent>
    </Card>
  );
}
