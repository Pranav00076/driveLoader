import React from "react";
import { DocsTopicView } from "@/components/DocsTopicView";

export function generateStaticParams() {
  return [
    { slug: "installation" },
    { slug: "quick-start" },
    { slug: "drive-image" },
    { slug: "drive-video" },
    { slug: "drive-gallery" },
    { slug: "folder-support" },
    { slug: "hooks" },
    { slug: "utilities" },
    { slug: "caching" },
    { slug: "retry-logic" },
    { slug: "performance" },
    { slug: "migration-guide" },
    { slug: "faq" },
  ];
}

export default async function DynamicDocsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  return <DocsTopicView slug={resolvedParams.slug} />;
}
