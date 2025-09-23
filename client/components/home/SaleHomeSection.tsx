import { Button } from "@/components/ui/button";
import useTranslateXImage from "@/hooks/use-translate-x-image";

export default function SaleHomeSection() {
  // translateXPosition lấy từ custom hook
  const { translateXPosition } = useTranslateXImage(800, 5);

  return (
    <section className="container py-10">
      <div className="grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
        <div
          className="overflow-hidden rounded-xl border"
          style={{
            transform: `translateX(${translateXPosition}px)`,
            transition: "transform 0.6s ease",
          }}
        >
          <img
            src="https://media.istockphoto.com/id/530650573/vi/anh/ph%E1%BB%9F-b%C3%B2.jpg?s=612x612&w=0&k=20&c=AsQ_5rac8KZEaWXhh_u0kXFXssPGQm8gsomHJD7cRJE="
            alt="Dish A"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold">Sale Of The Month</h2>
          <p className="mt-1 text-muted-foreground">
            For your best choice and good deal
          </p>
          <div className="mt-4">
            <Button variant="secondary">Read more</Button>
          </div>
        </div>

        {/* Ảnh bên phải */}
        <div
          className="overflow-hidden rounded-xl border"
          style={{
            transform: `translateX(-${translateXPosition}px)`,
            transition: "transform 0.6s ease",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1594007654729-407eedc4be65?q=80&w=1400&auto=format&fit=crop"
            alt="Dish B"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
