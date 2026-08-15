import type { MetadataRoute } from "next";

const BASE_URL = "https://2econd2kin.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/lookbook", "/behind-the-scenes", "/shop"];
  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));
}
