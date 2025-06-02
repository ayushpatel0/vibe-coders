"use client";

import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import { loader } from "@monaco-editor/react";

// Initialize monaco loader
loader.config({ monaco });

interface MonacoEditorProps {
  code: string;
  language: string;
  onChange: (value: string) => void;
}

export function MonacoEditorClient({ code, language, onChange }: MonacoEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      // Destroy existing editor if it exists
      if (monacoEditorRef.current) {
        monacoEditorRef.current.dispose();
      }

      // Create new editor
      monacoEditorRef.current = monaco.editor.create(editorRef.current, {
        value: code,
        language: language,
        theme: "vs-dark",
        automaticLayout: true,
        minimap: {
          enabled: false,
        },
        scrollBeyondLastLine: false,
        fontSize: 14,
        fontFamily: "Menlo, Monaco, 'Courier New', monospace",
        lineNumbers: "on",
        wordWrap: "on",
        tabSize: 2,
        renderLineHighlight: "all",
      });

      // Add change listener
      monacoEditorRef.current.onDidChangeModelContent(() => {
        if (monacoEditorRef.current) {
          onChange(monacoEditorRef.current.getValue());
        }
      });
    }

    return () => {
      if (monacoEditorRef.current) {
        monacoEditorRef.current.dispose();
      }
    };
  }, [language]); // Only recreate when language changes

  // Update editor content when code prop changes
  useEffect(() => {
    if (monacoEditorRef.current && code !== monacoEditorRef.current.getValue()) {
      monacoEditorRef.current.setValue(code);
    }
  }, [code]);

  return (
    <div ref={editorRef} className="h-full w-full" />
  );
}