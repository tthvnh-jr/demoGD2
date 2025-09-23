import ProductItem from "./ProductItem";
import type { Product } from "shared/types";

export default function PopularProducts({ data }: { data: Product[] }) {
  return (
    <section className="container py-10">
      <h2 className="text-xl font-semibold">Popular Products</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((item) => (
          <ProductItem
            key={item.id}
            src={item.images[0]}
            prevSrc={item.images[1]}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </section>
  );
}
