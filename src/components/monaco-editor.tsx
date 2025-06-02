"use client";

import dynamic from 'next/dynamic';

// Dynamically import the actual editor implementation with SSR disabled
const MonacoEditorWithNoSSR = dynamic(
  () => import("@/components/monaco-editor-client").then(mod => mod.MonacoEditorClient),
  { ssr: false }
);

interface MonacoEditorProps {
  code: string;
  language: string;
  onChange: (value: string) => void;
}

export function MonacoEditorComponent(props: MonacoEditorProps) {
  return <MonacoEditorWithNoSSR {...props} />;
}