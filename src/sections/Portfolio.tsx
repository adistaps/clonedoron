"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { supabase } from "@/lib/supabase";
import { videos as staticVideos } from "@/data/videos";

interface PortfolioVideo {
  id: string;
  title: string;
  thumbnail_url?: string;
  youtube_url: string;
  is_active: boolean;
}

export default function Portfolio() {
  const [displayVideos, setDisplayVideos] = useState(staticVideos.slice(0, 4));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    async function fetchPortfolioVideos() {
      try {
        const { data: videos } = await supabase
          .from("videos")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true });

        if (videos && videos.length > 0) {
          // Map DB videos to display format (match static format)
          const mappedVideos = videos.map((v: PortfolioVideo) => ({
            id: v.id,
            title: v.title,
            url: v.youtube_url,
            thumbnail: v.thumbnail_url || `https://img.youtube.com/vi/${extractYoutubeId(v.youtube_url)}/hqdefault.jpg`,
          }));
          setDisplayVideos(mappedVideos);
        }
      } catch (error) {
        console.error("Failed to fetch portfolio videos:", error);
        // Use static fallback
      }
      setLoading(false);
    }

    fetchPortfolioVideos();
  }, []);

  const extractYoutubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : "";
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayVideos.length);
    setAutoPlay(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + displayVideos.length) % displayVideos.length);
    setAutoPlay(false);
  };

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (!autoPlay || displayVideos.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayVideos.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, displayVideos.length]);

  if (loading || displayVideos.length === 0) {
    return null;
  }

  const currentVideo = displayVideos[currentIndex];

  return (
    <section className="py-20 px-6 border-b border-[rgba(0,0,0,0.1)]">
      <div className="max-w-content mx-auto">
        <ScrollReveal>
          <div className="mb-10">
            <p className="font-mono text-[10px] uppercase text-text-tertiary mb-2 tracking-[0.12em]">
              [PORTFOLIO]
            </p>
            <h2 className="font-display text-display-m text-text-primary italic">
              Work That Speaks
            </h2>
            <p className="font-sans text-body-m text-text-secondary mt-3 max-w-2xl">
              Explore featured work and tutorials showcasing the power of our design assets.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="relative w-full aspect-video bg-[#f5f5f5] rounded-lg overflow-hidden border border-[rgba(0,0,0,0.08)]">
            {/* Video iframe */}
            <iframe
              key={currentVideo.id}
              src={`https://www.youtube.com/embed/${extractYoutubeId(currentVideo.url)}?autoplay=1`}
              title={currentVideo.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />

            {/* Navigation buttons */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-text-primary rounded-full p-2 transition-colors z-10 backdrop-blur-sm"
              aria-label="Previous video"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-text-primary rounded-full p-2 transition-colors z-10 backdrop-blur-sm"
              aria-label="Next video"
            >
              <ChevronRight size={20} />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {displayVideos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setAutoPlay(false);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-text-primary" : "bg-text-tertiary"
                  }`}
                  aria-label={`Go to video ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Title below carousel */}
        <ScrollReveal delay={0.2}>
          <p className="font-sans text-body-m text-text-primary mt-4 font-medium">
            {currentVideo.title}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
