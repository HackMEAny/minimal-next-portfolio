import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aniket Das | Full Stack Developer",
    short_name: "Aniket Das",
    description:
      "Aniket Das - Full Stack Developer working at the intersection of AI, data, and scalable software systems.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "64x64",
        type: "image/png",
      },
      {
        src: "/favicon.ico",
        sizes: "64x64",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: [
      "portfolio",
      "full stack",
      "ai",
      "software engineering",
      "machine learning",
      "developer",
      "web development",
    ],
    lang: "en",
    dir: "ltr",
    scope: "/",
  };
}
