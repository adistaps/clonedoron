import HeroSection from "@/sections/HeroSection";
import CrowdFavorites from "@/sections/CrowdFavorites";
import ShopByType from "@/sections/ShopByType";
import BuildBundle from "@/sections/BuildBundle";
import PopularBundles from "@/sections/PopularBundles";
import Portfolio from "@/sections/Portfolio";
import MissionSection from "@/sections/MissionSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CrowdFavorites />
      <ShopByType />
      <BuildBundle />
      <PopularBundles />
      <Portfolio />
      <MissionSection />
    </>
  );
}
