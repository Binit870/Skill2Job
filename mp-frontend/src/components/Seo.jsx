import { useEffect } from "react";

const SITE_NAME = "Skill2Career";
const SITE_URL = "https://skill-2-job.vercel.app";

/**
 * Drop this at the top of any page component to set that page's
 * <title>, meta description, and canonical URL. Falls back to the
 * defaults already in index.html when a page doesn't use it.
 *
 *   <Seo title="Features" description="..." path="/features" />
 */
export default function Seo({ title, description, path = "" }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    document.title = fullTitle;

    const setMeta = (attr, key, value) => {
      if (!value) return;
      let tag = document.querySelector(`meta[${attr}="${key}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", value);
    };

    if (description) {
      setMeta("name", "description", description);
      setMeta("property", "og:description", description);
      setMeta("name", "twitter:description", description);
    }
    setMeta("property", "og:title", fullTitle);
    setMeta("name", "twitter:title", fullTitle);

    const canonicalUrl = `${SITE_URL}${path}`;
    setMeta("property", "og:url", canonicalUrl);
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);
  }, [title, description, path]);

  return null;
}
