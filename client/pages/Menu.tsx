import AdvanceHeading from "@/components/home/AdvanceHeading";
import CountdownBanner from "@/components/home/CountdownBanner";
import PopularProducts from "@/components/home/PopularProducts";
import SaleHomeSection from "@/components/home/SaleHomeSection";
import type { Product } from "shared/types";

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Beef Pho",
    price: 7.9,
    images: [
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=1400&auto=format&fit=crop",
    ],
  },
  {
    id: 2,
    name: "Grilled Chicken",
    price: 9.5,
    images: [
      "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1604908554034-3cf9f4f15a75?q=80&w=1400&auto=format&fit=crop",
    ],
  },
  {
    id: 3,
    name: "Vegan Salad",
    price: 6.2,
    images: [
      "https://images.unsplash.com/photo-1551248429-40975aa4de74?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1400&auto=format&fit=crop",
    ],
  },
  {
    id: 4,
    name: "Salmon Bowl",
    price: 11.2,
    images: [
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1478144592103-25e218a04891?q=80&w=1400&auto=format&fit=crop",
    ],
  },
  {
    id: 5,
    name: "Ramen Spicy",
    price: 8.9,
    images: [
      "https://images.unsplash.com/photo-1604908177079-3e6d0157aa26?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605478902215-9d9a3f3ce9f2?q=80&w=1400&auto=format&fit=crop",
    ],
  },
  {
    id: 6,
    name: "Combo Lunch",
    price: 12.0,
    images: [
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1400&auto=format&fit=crop",
    ],
  },
];

export default function MenuPage() {
  return (
    <div>
      {/* Banner đầu trang */}
      <section className="border-b">
        <div className="container py-12">
          <div className="mt-6 aspect-[21/9] overflow-hidden rounded-xl border">
            <img
              src="https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=1600&auto=format&fit=crop"
              className="h-full w-full object-cover"
              alt="banner"
            />
          </div>
        </div>
      </section>

      {/* Heading “Our Best Sellers” */}
      <AdvanceHeading />

      {/* Countdown deal */}
      <section className="container py-6">
        <CountdownBanner />
      </section>

      {/* Danh sách sản phẩm động */}
      <PopularProducts data={mockProducts} />

      {/* Sale section có hiệu ứng translateX */}
      <SaleHomeSection />
    </div>
  );
}
