"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
// import userStore from "@/store/user.store";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { Loader2, 
  // Code, 
  Play, X, ChevronRight, ChevronLeft, Home, User, LogOut, RefreshCw, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import apiInstance from "@/utils/axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MonacoEditorComponent } from "@/components/monaco-editor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

// Available languages for Monaco Editor
const languageOptions = [
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
];

export default function PicSitePage() {
  const router = useRouter();
  // const { user } = userStore();
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editorCode, setEditorCode] = useState("");
  const [editorLanguage, setEditorLanguage] = useState("html");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const responseRef = useRef<HTMLDivElement>(null);

  // Scroll to response when it changes
  useEffect(() => {
    if (response && responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [response]);

  // React Dropzone setup
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    if (!file.type.startsWith('image/')) {
      toast.error("Invalid file type", {
        description: "Please upload an image file (JPEG, PNG, etc.)",
        action: {
          label: "Try Again",
          onClick: () => toast.dismiss(),
        },
      });
      return;
    }

    // Clear previous
    setResponse("");
    setUploadedImage(null);
    setUploadProgress(0);
    setIsLoading(true);

    // Read and display the image
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
      setUploadProgress(30);
    };
    reader.readAsDataURL(file);

    try {
      // Create form data for the API
      const formData = new FormData();
      formData.append('image', file);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // Send the image to the API
      const apiResponse = await apiInstance.post("/image-to-web", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      const responseContent = apiResponse.data.data || "Sorry, I couldn't generate code from this image.";
      
      // Set the new response
      setResponse(responseContent);
      
      // If code is detected in the response, extract it for the editor
      const codeMatch = responseContent.match(/```(\w+)?\s*([\s\S]*?)```/);
      if (codeMatch && codeMatch[2]) {
        const language = codeMatch[1] || "html";
        setEditorCode(codeMatch[2].trim());
        setEditorLanguage(language);
        if (!isEditorOpen) {
          setShowEditor(true);
        }
      }
    } catch (error) {
      console.error("Error generating code from image:", error);
      toast.error("Failed to generate code", {
        description: "There was an error processing your image.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isEditorOpen]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpeg', '.jpg', '.gif', '.webp']
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput("");
    
    try {
      // For web preview, we'll display HTML directly
      if (editorLanguage === "html") {
        setOutput(editorCode);
      } else {
        // For other languages, use the API
        const response = await apiInstance.post("/execute-code", {
          code: editorCode,
          language: editorLanguage,
        });
        
        setOutput(response.data.output || "No output");
      }
    } catch (error) {
      console.error("Error executing code:", error);
      setOutput("Error executing code. Please check your syntax and try again.");
    } finally {
      setIsRunning(false);
    }
  };

  const toggleEditor = () => {
    setIsEditorOpen(!isEditorOpen);
  };

  const handleClearResponse = () => {
    setResponse("");
    setUploadedImage(null);
    setUploadProgress(0);
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

  // Render HTML preview
  const renderHtmlPreview = (htmlContent: string) => {
    return (
      <div className="bg-white rounded-md p-4 mt-4 h-full">
        <iframe
          srcDoc={htmlContent}
          className="w-full h-full border-0"
          title="HTML Preview"
          sandbox="allow-scripts"
        />
      </div>
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
                <ImageIcon className="h-5 w-5 text-primary mr-2" />
                <h1 className="text-white font-bold text-xl">Image to Website</h1>
              </div>
              <div className="flex items-center space-x-4">
                {(response || uploadedImage) && (
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
            {!uploadedImage && !response && !isLoading ? (
              <div 
                {...getRootProps()} 
                className={`flex flex-col items-center justify-center h-full text-center p-8 border-2 border-dashed 
                  ${isDragActive ? 'border-primary bg-primary/10' : 'border-purple-500/30'} 
                  rounded-lg transition-colors cursor-pointer hover:border-primary hover:bg-primary/5`}
              >
                <input {...getInputProps()} />
                <ImageIcon className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-white text-xl font-semibold mb-2">
                  {isDragActive ? 'Drop your image here' : 'Upload a screenshot or image'}
                </h2>
                <p className="text-gray-300 max-w-md mb-4">
                  Drag and drop an image, or click to select one from your files.
                  We&apos;ll convert it into clean, responsive HTML/CSS code.
                </p>
                <Button className="bg-primary hover:bg-primary/90">
                  <Upload className="h-4 w-4 mr-2" />
                  Select Image
                </Button>
              </div>
            ) : isLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                {uploadedImage && (
                  <div className="relative w-64 h-64 mb-6 rounded-lg overflow-hidden border border-purple-500/30">
                    <Image
                      src={uploadedImage}
                      alt="Uploaded image"
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <p className="text-gray-300 mb-4">Analyzing your image and generating code...</p>
                <div className="w-full max-w-md">
                  <Progress value={uploadProgress} className="h-2 bg-slate-700" />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {uploadedImage && (
                  <div className="flex justify-center mb-6">
                    <div className="relative w-full max-w-md h-64 rounded-lg overflow-hidden border border-purple-500/30">
                      <Image
                        src={uploadedImage}
                        alt="Uploaded image"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
                
                {response && (
                  <div 
                    className="p-6 rounded-lg bg-slate-800/90 border border-purple-700/30 markdown-content text-gray-100 prose prose-invert max-w-none"
                    ref={responseRef}
                  >
                    {renderMarkdown(response)}
                  </div>
                )}
                
                <div 
                  {...getRootProps()} 
                  className={`flex flex-col items-center justify-center p-6 border-2 border-dashed 
                    ${isDragActive ? 'border-primary bg-primary/10' : 'border-purple-500/30'} 
                    rounded-lg transition-colors cursor-pointer hover:border-primary hover:bg-primary/5 mt-4`}
                >
                  <input {...getInputProps()} />
                  <p className="text-gray-300 text-center">
                    Try another image? Drag and drop or click to select.
                  </p>
                </div>
              </div>
            )}
          </div>
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
                  <h2 className="text-white font-semibold">Generated Code</h2>
                  <Select
                    value={editorLanguage}
                    onValueChange={setEditorLanguage}
                  >
                    <SelectTrigger className="w-[180px] bg-slate-800 border-purple-700/40 text-white">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-purple-700/40 text-white">
                      {languageOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
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
                    Preview
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
            
            {/* Preview panel */}
            <div className="h-1/3 border-t border-purple-800/30 flex flex-col">
              <div className="bg-slate-800/90 backdrop-blur-sm p-2 border-b border-purple-800/30">
                <h3 className="text-sm font-medium text-white">
                  {editorLanguage === "html" ? "Preview" : "Output"}
                </h3>
              </div>
              <div className="flex-grow overflow-auto bg-black/50 p-4">
                {editorLanguage === "html" && output ? (
                  renderHtmlPreview(output)
                ) : (
                  <pre className="text-gray-300 font-mono text-sm whitespace-pre-wrap">
                    {output || `${editorLanguage === "html" ? "HTML preview" : "Code execution output"} will appear here`}
                  </pre>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}