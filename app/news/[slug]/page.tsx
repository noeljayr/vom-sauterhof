"use client";

import Banner from "@/components/Banner";
import NewsCard from "@/components/news/NewsCard";
import { News } from "@/types/News";
import { IconArrowLeft, IconShare3 } from "@tabler/icons-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function Page() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [otherNews, setOtherNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchNews = async () => {
      try {
        // Fetch the selected news
        const response = await fetch(`/api/news/get?slug=${slug}`);
        const data = await response.json();

        if (data.success) {
          setSelectedNews(data.news);
        }

        // Fetch other news
        const otherResponse = await fetch("/api/news/list");
        const otherData = await otherResponse.json();

        if (otherData.success) {
          const filtered = otherData.news.filter(
            (item: News) => item.slug !== slug && item.status === "published"
          );
          setOtherNews(filtered);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [slug]);

  if (!slug) {
    return <></>;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <Banner />
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  if (!selectedNews) {
    return (
      <div className="flex flex-col">
        <Banner />
        <div className="text-center py-8">News not found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Banner />
      <div className="flex flex-col relative w-[60%] bg-red-80 mx-auto top-[-12rem] ">
        <Link
          href="/news"
          className="bg-[#FBF2EA] w-fit font-medium flex font-p4 items-center border border-[var(--c-border)] px-2 py-1 rounded-3xl"
        >
          <IconArrowLeft className="h-4 w-4 mr-2" color="#CD6917" />
          Zurück zur Übersicht
        </Link>

        <div className="flex w-full relative">
          <div className="absolute flex right-2 top-6">
            {/* <button className="flex share-btn items-center text-[#58483B] font-semibold font-p3">
              <IconShare3 /> Aktie
            </button> */}
          </div>
          <img
            src={
              selectedNews.coverImage.startsWith("data:")
                ? selectedNews.coverImage
                : `/news/${selectedNews.coverImage}`
            }
            alt={selectedNews.title}
            className="w-full h-fit object-cover rounded-[1rem] my-4"
          />
        </div>

        <div className="py-2 border-b flex items-center border-b-[var(--c-border)]">
          <h4>{selectedNews.title}</h4>
          <span className="opacity-50 font-p4 ml-auto">
            Gepostet am {selectedNews.date}
          </span>
        </div>

        <div
          className="prose max-w-none flex flex-col new-content mt-10"
          dangerouslySetInnerHTML={{ __html: selectedNews.content }}
        />
      </div>

      <div className="w-full py-32 bg-[#58483B]">
        <div className="news-grid grid grid-cols-1  w-[60%] mx-auto md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {otherNews.slice(0, 3).map((n) => (
            <NewsCard color="#ffff" news={n} key={n.id} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Page;
