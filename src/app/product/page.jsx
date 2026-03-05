import Navbar from "./component/navbar";
import ProductCard from "./component/productCard";
import { getProducts } from "@/service/productService";

async function ProductPage({ searchParams }) {
  const params = (await searchParams) || {};
  const q = params.q ?? "";
  const status = params.status ?? "";

  const res = await getProducts({
    q,
    status,
  });

  const products = res || [];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Navbar />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Product Management</h1>
      </div>

      {/* Product Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductPage;