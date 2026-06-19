"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Video } from "@/types";

interface YouTubeCarouselProps {
  videos: Video[];
}

export default function YouTubeCarousel({ videos }: YouTubeCarouselProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
      {videos.map((video) => (
        <motion.a
          key={video.id}
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 w-[280px] snap-start group"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.20 }}
        >
          <div className="relative aspect-video bg-[#e8e8e8] rounded-card overflow-hidden mb-2 border border-[rgba(0,0,0,0.1)]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#f5f5f5] to-[#eaeaea] flex items-center justify-center">
              <span className="font-mono text-body-sm text-[#aaa] uppercase tracking-widest text-center px-4">
                {video.title.split(" ").slice(0, 3).join(" ")}
              </span>
            </div>
            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="w-12 h-12 bg-white shadow-md rounded-full flex items-center justify-center">
                <Play size={20} className="text-text-primary ml-0.5" />
              </div>
            </div>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.04em] text-text-secondary line-clamp-2 group-hover:text-text-primary transition-colors duration-150 leading-relaxed">
            {video.title}
          </p>
        </motion.a>
      ))}
    </div>
  );
}
