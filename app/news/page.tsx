import NewsPageWrapper from "@/components/pages/NewsPageWrapper";
import clientPromise from "@/lib/mongodb";
import { BannerContent } from "@/types/banner";

async function Page() {
  const client = await clientPromise;
  const db = client.db("vom_sauterhof");

  // Fetch banner content
  const bannersCollection = db.collection("banners");
  const bannerData = await bannersCollection.findOne({ page: "news" });
  const bannerContent: BannerContent = bannerData
    ? {
        title: bannerData.title,
        description: bannerData.description,
      }
    : {};

  // Fetch news page content
  const newsPageCollection = db.collection("newsPage");
  const newsPageData = await newsPageCollection.findOne({});
  const newsPageContent = newsPageData
    ? {
        searchPlaceholder: newsPageData.searchPlaceholder,
        sortNewest: newsPageData.sortNewest,
        sortOldest: newsPageData.sortOldest,
      }
    : {};

  // Fetch all published news
  const newsCollection = db.collection("news");
  const newsData = await newsCollection
    .find({ status: "published" })
    .sort({ createdAt: -1 })
    .toArray();

  const news = newsData.map((n) => ({
    id: n._id.toString(),
    title: n.title,
    author: n.author,
    content: n.content,
    date: n.date,
    hasVideo: n.hasVideo || false,
    coverImage: n.coverImage || "",
    slug: n.slug,
    status: n.status,
  }));

  return (
    <NewsPageWrapper
      bannerContent={bannerContent}
      newsPageContent={newsPageContent}
      news={news}
    />
  );
}

export default Page;
