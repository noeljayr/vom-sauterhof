import Banner from "@/components/Banner";
import BeauceronCard from "@/components/BeauceronCard";
import { beauceron } from "@/data/beauceron";
import clientPromise from "@/lib/mongodb";
import { BannerContent } from "@/types/banner";

async function Page() {
  const client = await clientPromise;
  const db = client.db("vom_sauterhof");

  const bannersCollection = db.collection("banners");
  const bannerData = await bannersCollection.findOne({ page: "beauceron" });
  const bannerContent: BannerContent = bannerData
    ? {
        title: bannerData.title,
        description: bannerData.description,
      }
    : {};

  return (
    <div className="gap-16 flex flex-col">
      <Banner
        name={bannerContent.title}
        description={bannerContent.description}
      />

      <div className="grid gap-8 grid-cols-3 section-container mx-auto">
        {beauceron.map((dog) => (
          <BeauceronCard key={dog.id} beauceron={dog} />
        ))}
      </div>
    </div>
  );
}

export default Page;
