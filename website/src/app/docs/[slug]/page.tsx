import React from "react";
import { DocsTopicView } from "@/components/DocsTopicView";

export function generateStaticParams() {
  return [
    { slug: "installation" },
    { slug: "quick-start" },
    { slug: "drive-media" },
    { slug: "drive-image" },
    { slug: "drive-video" },
    { slug: "drive-audio" },
    { slug: "drive-document" },
    { slug: "drive-gallery" },
    { slug: "cli" },
    { slug: "caching" },
    { slug: "nextjs-react19" },
    { slug: "debug-hud" },
    { slug: "folder-support" },
    { slug: "hooks" },
    { slug: "utilities" },
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
