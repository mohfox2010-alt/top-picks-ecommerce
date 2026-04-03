import { affiliateProducts } from '../../data/products';
import ProductCard from '../../components/ProductCard';
import { notFound } from 'next/navigation';

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const categoryInfo = categoriesList.find(c => c.slug === slug);

  if (!categoryInfo) {
    notFound();
  }

  const categoryProducts = affiliateProducts.filter(p => p.category === categoryInfo.name);

  if (categoryProducts.length === 0) {
    return (
      <div className="text-center text-gray-500 py-16 text-lg bg-gray-50 rounded-2xl border border-dashed border-gray-300">
        قريباً.. سيتم إضافة منتجات قوية لهذا القسم! 🚀
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {categoryProducts.map((product) => (
        <ProductCard 
          key={product.id} id={product.id} title={product.title} description={product.description} price={product.price} imageUrl={product.imageUrl}
        />
      ))}
    </div>
  );
}