/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetAllCategoriesQuery } from "@/redux/fetures/admin/admin-category.api";
import LatestAddHome from "./_components/Home/LatestAddHome";
import SearchAndCategory from "./_components/SearchAndCategory";

const HomePage = () => {

  const { data: categoriesRes } = useGetAllCategoriesQuery({
    page: 1,
    limit: 10,
  });
  const categories = categoriesRes?.data || [];

  const realEstateId = categories.find(
    (c: any) => c.slug === "real-estate",
  )?.id;
  const electronicsId = categories.find((c: any) => c.slug === "electronics")?.id;

  return (
    <div className="min-h-screen">
      <SearchAndCategory />

      <main className="max-w-7xl mx-auto py-10 px-4">
        <LatestAddHome title="Latest Ads Added In Your Area" />

        {realEstateId && (
          <LatestAddHome title="Top of Real-Estate" categoryId={realEstateId} />
        )}

        {electronicsId && (
          <LatestAddHome
            title="Most Popular in vehicle"
            categoryId={electronicsId}
          />
        )}
      </main>
    </div>
  );
};

export default HomePage;
