"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import userStore from "@/store/user.store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Code, Play, X, ChevronRight, ChevronLeft, Home, User, LogOut, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import apiInstance from "@/utils/axios";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MonacoEditorComponent } from "@/components/monaco-editor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supportedLanguages } from "@/lib/piston.api";

// Map Piston language names to Monaco editor language names
const languageMap: { [key: string]: string } = {
  "javascript": "javascript",
  "typescript": "typescript",
  "python": "python",
  "java": "java",
  "csharp.net": "csharp",
  "c": "c",
  "c++": "cpp",
  "go": "go",
  "rust": "rust",
  "ruby": "ruby",
  "php": "php",
  "sqlite3": "sql",
  "bash": "shell",
  "powershell": "powershell"
};

// Format languages for the dropdown
const languageOptions = supportedLanguages.map(lang => ({
  value: lang.language,
  label: lang.language.charAt(0).toUpperCase() + lang.language.slice(1),
  version: lang.version,
  aliases: lang.aliases
}));

export default function CodeGenPage() {
  const router = useRouter();
  // const { user } = userStore();
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editorCode, setEditorCode] = useState("");
  const [editorLanguage, setEditorLanguage] = useState("javascript");
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0]);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const responseRef = useRef<HTMLDivElement>(null);

  // Handle language change
  const handleLanguageChange = (value: string) => {
    const language = languageOptions.find(lang => lang.value === value);
    if (language) {
      setSelectedLanguage(language);
      setEditorLanguage(languageMap[value] || value);
    }
  };

  // Scroll to response when it changes
  useEffect(() => {
    if (response && responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [response]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!input.trim()) return;
    
    // Clear previous response
    setResponse("");
    setIsLoading(true);
    
    try {
      // Make API call to generate code
      const apiResponse = await apiInstance.post("/code-generation", {
        prompt: input,
      });
      
      let responseContent = "## Sorry, I couldn't generate a response.";
      if (apiResponse.data.success === true) {
        responseContent = apiResponse.data.response || "## Sorry, I couldn't generate a response.";
        // Set the new response
        setResponse(responseContent);
      }
      
      // Clear input after successful response
      setInput("");
      
      // If code is detected in the response, extract it for the editor
      const codeMatch = responseContent.match(/```(\w+)?\s*([\s\S]*?)```/);
      if (codeMatch && codeMatch[2]) {
        // Get the language from the code block
        const codeLanguage = codeMatch[1]?.toLowerCase() || "javascript";
        setEditorCode(codeMatch[2].trim());
        
        // Try to find a matching Piston language
        const pistonLang = languageOptions.find(
          lang => lang.value === codeLanguage || lang.aliases.includes(codeLanguage)
        );
        
        if (pistonLang) {
          setSelectedLanguage(pistonLang);
          setEditorLanguage(languageMap[pistonLang.value] || pistonLang.value);
        } else {
          // Default to JavaScript if no match
          setSelectedLanguage(languageOptions[0]);
          setEditorLanguage("javascript");
        }
        
        if (!isEditorOpen) {
          setShowEditor(true);
        }
      }
    } catch (error) {
      console.error("Error generating code:", error);
      toast.error("Failed to generate code", {
        description: "There was an error processing your request.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput("");
    
    try {
      // Call Piston API directly for code execution
      const pistonResponse = await axios.post("https://emkc.org/api/v2/piston/execute", {
        language: selectedLanguage.value,
        version: selectedLanguage.version,
        files: [
          {
            content: editorCode
          }
        ],
        // Add arguments if needed
        // args: []
      });
      
      // Handle Piston API response
      if (pistonResponse.data && pistonResponse.data.run) {
        const { stdout, stderr, output, code } = pistonResponse.data.run;
        
        // Format and display the output
        let formattedOutput = "";
        
        if (code !== 0) {
          formattedOutput = `Execution error (code ${code}):\n${stderr || output || "No error details available"}`;
        } else if (stderr && stderr.trim() !== "") {
          formattedOutput = `Standard Error:\n${stderr}\n\nStandard Output:\n${stdout || "(No output)"}`;
        } else {
          formattedOutput = stdout || output || "Execution completed with no output.";
        }
        
        setOutput(formattedOutput);
      } else {
        setOutput("Unexpected response format from code execution service.");
      }
    } catch (error) {
      console.error("Error executing code:", error);
      setOutput(`Error executing code: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsRunning(false);
    }
  };

  const toggleEditor = () => {
    setIsEditorOpen(!isEditorOpen);
  };

  const handleClearResponse = () => {
    setResponse("");
  };

  const handleLogout = async () => {
    try {
      await apiInstance.get("/logout");
      toast.success("Logged out successfully", {
        description: "You have been logged out of your account.",
      });
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed", {
        description: "There was an error logging you out. Please try again.",
      });
    }
  };

  // Render markdown content
  const renderMarkdown = (content: string) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-10 bg-slate-900/90 backdrop-blur-sm border-b border-purple-800/30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/welcome" className="text-white font-bold text-xl flex items-center">
                <span className="bg-primary p-1 rounded mr-2">
                  <Home className="h-5 w-5" />
                </span>
                AutoDev
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/profile" className="text-gray-300 hover:text-white transition-colors">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </div>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-gray-300 hover:text-white hover:bg-red-900/20"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-grow overflow-hidden">
        {/* Main response interface */}
        <div className={`flex flex-col w-full transition-all duration-300 ${isEditorOpen ? "lg:w-1/2" : "w-full"}`}>
          {/* Header */}
          <header className="bg-slate-900/90 backdrop-blur-sm border-b border-purple-800/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Code className="h-5 w-5 text-primary mr-2" />
                <h1 className="text-white font-bold text-xl">Code Generation</h1>
              </div>
              <div className="flex items-center space-x-4">
                {response && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearResponse}
                    className="text-gray-300 border-gray-600 hover:text-white"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
                <div className="flex items-center space-x-2">
                  <Label htmlFor="editor-toggle" className="text-sm text-gray-300">
                    Code Editor
                  </Label>
                  <Switch 
                    id="editor-toggle" 
                    checked={showEditor}
                    onCheckedChange={setShowEditor}
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={toggleEditor}
                  className="text-gray-300 border-gray-600 hover:text-white"
                >
                  {isEditorOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </header>
          
          {/* Response container */}
          <div className="flex-grow overflow-y-auto p-4">
            {!response && !isLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <Code className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-white text-xl font-semibold mb-2">Welcome to Code Generation</h2>
                <p className="text-gray-300 max-w-md">
                  Ask me to generate code in any programming language, explain concepts, or help debug issues.
                </p>
              </div>
            ) : isLoading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <p className="text-gray-300">Generating response...</p>
              </div>
            ) : (
              <div 
                className="p-6 rounded-lg bg-slate-800/90 border border-purple-700/30 markdown-content text-gray-100 prose prose-invert max-w-none"
                ref={responseRef}
              >
                {renderMarkdown(response)}
              </div>
            )}
          </div>
          
          {/* Input form */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-purple-800/30 bg-slate-900/80">
            <div className="flex items-center space-x-2">
              <Textarea
                placeholder="Ask me to generate some code..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-12 bg-slate-800 border-purple-700/40 text-white placeholder:text-gray-400 focus-visible:ring-purple-500 resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button 
                type="submit" 
                size="icon"
                disabled={isLoading || !input.trim()}
                className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </form>
        </div>
        
        {/* Monaco Editor Panel (conditionally shown) */}
        {showEditor && (
          <div 
            className={`bg-slate-900 border-l border-purple-800/30 flex flex-col ${
              isEditorOpen ? "w-full lg:w-1/2" : "hidden"
            }`}
          >
            <div className="p-4 bg-slate-900/90 backdrop-blur-sm border-b border-purple-800/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h2 className="text-white font-semibold">Code Editor</h2>
                  <Select
                    value={selectedLanguage.value}
                    onValueChange={handleLanguageChange}
                  >
                    <SelectTrigger className="w-[180px] bg-slate-800 border-purple-700/40 text-white">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-purple-700/40 text-white max-h-60 overflow-y-auto">
                      {languageOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label} {option.version && `(${option.version})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={toggleEditor}
                    className="border-gray-600 text-gray-300 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleRunCode}
                    disabled={isRunning || !editorCode.trim()}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isRunning ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    ) : (
                      <Play className="h-4 w-4 mr-1" />
                    )}
                    Run Code
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex-grow overflow-hidden">
              <MonacoEditorComponent
                code={editorCode}
                language={editorLanguage}
                onChange={setEditorCode}
              />
            </div>
            
            {/* Output panel */}
            <div className="h-1/3 border-t border-purple-800/30 flex flex-col">
              <div className="bg-slate-800/90 backdrop-blur-sm p-2 border-b border-purple-800/30">
                <h3 className="text-sm font-medium text-white">Output</h3>
              </div>
              <div className="flex-grow overflow-auto bg-black/50 p-4">
                <pre className="text-gray-300 font-mono text-sm whitespace-pre-wrap">
                  {output || `Ready to execute ${selectedLanguage.label} code`}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}