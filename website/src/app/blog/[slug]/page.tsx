import React from "react";
import { BlogPostView } from "@/components/BlogPostView";

export function generateStaticParams() {
  return [
    { slug: "google-drive-media-cdn-react" },
    { slug: "solving-google-drive-cors-corb-restrictions" },
    { slug: "request-coalescing-and-endpoint-learning" },
  ];
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  return <BlogPostView slug={resolvedParams.slug} />;
}
