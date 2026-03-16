/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetAllCategoriesQuery } from "@/redux/fetures/admin/admin-category.api";
import LatestAddHome from "./_components/Home/LatestAddHome";
import SearchAndCategory from "./_components/SearchAndCategory";
import BestAdsHome from "./_components/Home/BestAdsHome";

const HomePage = () => {
  const { data: categoriesRes } = useGetAllCategoriesQuery({
    page: 1,
    limit: 10,
  });

  const categories = categoriesRes?.data || [];

  return (
    <div className="min-h-screen">
      <SearchAndCategory />

      <main className="max-w-7xl mx-auto py-10 px-4">
        <BestAdsHome />
        
        {/* Latest ads */}
        <LatestAddHome title="Latest Ads Added In Your Area" />

        {/* Dynamic category sections */}
        {categories.map((category: any) => (
          <LatestAddHome
            key={category.id}
            title={`Most Popular in ${category.name}`}
            categoryId={category.id}
          />
        ))}
      </main>
    </div>
  );
};

export default HomePage;
