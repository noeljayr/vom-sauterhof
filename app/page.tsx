import React, { Suspense } from "react";
import Home from "@/components/pages/Home";
import clientPromise from "@/lib/mongodb";
import { HomepageContent } from "@/types/homepage";

async function Page() {
  const client = await clientPromise;
  const db = client.db("vom_sauterhof");

  const homepageCollection = db.collection("homepage");
  const homepageContent = await homepageCollection.findOne({});

  // Fetch published news
  const newsCollection = db.collection("news");
  const newsData = await newsCollection
    .find({ status: "published" })
    .sort({ createdAt: -1 })
    .limit(6)
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

  // Convert MongoDB document to plain object (remove _id and other non-serializable fields)
  const content: HomepageContent = homepageContent
    ? {
        heroTitle: homepageContent.heroTitle,
        heroDescription: homepageContent.heroDescription,
        heroButtonText: homepageContent.heroButtonText,
        contentHeading: homepageContent.contentHeading,
        contentSubheading: homepageContent.contentSubheading,
        whyBreedTitle: homepageContent.whyBreedTitle,
        whyBreedDescription: homepageContent.whyBreedDescription,
        feature1: homepageContent.feature1,
        feature2: homepageContent.feature2,
        feature3: homepageContent.feature3,
        feature4: homepageContent.feature4,
        feature5: homepageContent.feature5,
        feature6: homepageContent.feature6,
        darkSectionTitle: homepageContent.darkSectionTitle,
        darkSectionDescription: homepageContent.darkSectionDescription,
        newsHeading: homepageContent.newsHeading,
        newsSeeAllText: homepageContent.newsSeeAllText,
        newsSeeAllSubtext: homepageContent.newsSeeAllSubtext,
      }
    : {};

  return (
    <Suspense fallback={<></>}>
      <Home content={content} news={news} />
    </Suspense>
  );
}

export default Page;
