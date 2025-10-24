import clientPromise from "@/lib/mongodb";
import { AboutContent } from "@/types/about";
import AboutUsClient from "@/components/pages/AboutUsClient";

async function Page() {
  const client = await clientPromise;
  const db = client.db("vom_sauterhof");

  const aboutCollection = db.collection("about");
  const aboutData = await aboutCollection.findOne({});
  const content: AboutContent = aboutData
    ? {
        bannerTitle: aboutData.bannerTitle,
        bannerDescription: aboutData.bannerDescription,
        welcomeHeading: aboutData.welcomeHeading,
        welcomeText: aboutData.welcomeText,
        homeHeading: aboutData.homeHeading,
        homeText: aboutData.homeText,
        breedingHeading: aboutData.breedingHeading,
        breedingText: aboutData.breedingText,
        packHeading: aboutData.packHeading,
        packText: aboutData.packText,
        finalText: aboutData.finalText,
      }
    : {};

  return <AboutUsClient content={content} />;
}

export default Page;
