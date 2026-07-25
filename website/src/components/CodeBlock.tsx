"use client";

import React, { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  code,
  language = "tsx",
  filename,
  showLineNumbers = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split("\n");

  return (
    <div className="my-4 rounded-xl border border-gray-800 bg-[#0b0f1a] overflow-hidden shadow-lg shadow-black/40 group">
      {/* Header bar */}
      <div className="px-4 py-2.5 bg-[#080b13] border-b border-gray-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          {filename ? (
            <span className="ml-2 text-xs font-mono text-gray-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              {filename}
            </span>
          ) : (
            <span className="ml-2 text-xs font-mono uppercase text-gray-500 font-semibold tracking-wider">
              {language}
            </span>
          )}
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-400 hover:text-white bg-gray-900/60 hover:bg-gray-800 border border-gray-800 rounded-lg transition-all cursor-pointer"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code body */}
      <div className="p-4 overflow-x-auto text-sm font-mono leading-relaxed text-gray-200">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-gray-900/40">
                {showLineNumbers && (
                  <td className="w-8 select-none text-right pr-4 text-gray-600 text-xs font-mono border-r border-gray-800/40">
                    {idx + 1}
                  </td>
                )}
                <td className="pl-4 whitespace-pre">{line}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
