import React, { useState } from "react";
import useResumeAnalyzer from "../hooks/useResumeAnalyzer";

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const { loading, result, analyzeResume } = useResumeAnalyzer();

  // Convert PDF to text using a simple approach
  const extractTextFromPDF = async (file) => {
    setIsExtracting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Option 1: If you have a backend endpoint for PDF parsing
      // const response = await fetch('/api/extract-pdf-text', {
      //   method: 'POST',
      //   body: formData
      // });
      // const data = await response.json();
      // return data.text;

      // Option 2: Simple client-side extraction (basic, but works for many PDFs)
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const binaryString = Array.from(uint8Array).map(byte => String.fromCharCode(byte)).join('');
      
      // Extract readable text using regex patterns
      let extractedText = '';
      
      // Try to find text content between common PDF text markers
      const textPatterns = [
        /\((.*?)\)\s*Tj/g,  // Text show operator
        /\[(.*?)\]\s*TJ/g,  // Array text show operator
        /BT\s+(.*?)\s+ET/gs, // Text object
      ];
      
      textPatterns.forEach(pattern => {
        const matches = binaryString.match(pattern);
        if (matches) {
          matches.forEach(match => {
            // Clean up the extracted text
            const cleanText = match
              .replace(/[()[\]]/g, '')
              .replace(/Tj|TJ|BT|ET/g, '')
              .replace(/[^\x20-\x7E\s]/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();
            
            if (cleanText.length > 2) {
              extractedText += cleanText + ' ';
            }
          });
        }
      });

      // Fallback: extract all printable characters
      if (extractedText.length < 50) {
        extractedText = binaryString
          .replace(/[^\x20-\x7E\n\r]/g, ' ')
          .replace(/\s+/g, ' ')
          .split(' ')
          .filter(word => word.length > 1 && /[a-zA-Z]/.test(word))
          .join(' ');
      }

      return extractedText.trim() || "Could not extract readable text from this PDF. Please try uploading a text file (.txt) or a PDF with selectable text.";
      
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      throw new Error("Failed to process PDF file");
    } finally {
      setIsExtracting(false);
    }
  };

  const extractTextFromTextFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error("Failed to read text file"));
      reader.readAsText(file);
    });
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    try {
      let resumeText = "";
      
      if (file.type === "text/plain") {
        resumeText = await extractTextFromTextFile(file);
      } else if (file.type === "application/pdf") {
        resumeText = await extractTextFromPDF(file);
      } else {
        throw new Error("Unsupported file type. Please upload a PDF or TXT file.");
      }
      
      setExtractedText(resumeText);
      
      if (resumeText.length < 50) {
        alert("Very little text was extracted. For best results, please upload a text file (.txt) or ensure your PDF has selectable text.");
        return;
      }
      
      analyzeResume(resumeText);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      alert(error.message || "Error processing file. Please try a different file format.");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setExtractedText("");
  };

  const fileTypeHelp = file ? (
    <div className="text-xs text-gray-600 mt-1 p-2 bg-blue-50 rounded">
      {file.type === "application/pdf" && "📄 PDF selected - text will be extracted automatically"}
      {file.type === "text/plain" && "📝 Text file selected - perfect for analysis"}
      {!["application/pdf", "text/plain"].includes(file.type) && "⚠️ Unsupported file type"}
    </div>
  ) : null;

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Resume Analyzer</h1>
      
      <form onSubmit={handleAnalyze} className="mb-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Upload Your Resume
          </label>
          <input
            type="file"
            accept="application/pdf,.pdf,.txt,text/plain"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 
                     file:mr-4 file:py-3 file:px-4 
                     file:rounded-lg file:border-0 
                     file:text-sm file:font-semibold 
                     file:bg-blue-50 file:text-blue-700 
                     hover:file:bg-blue-100 
                     border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          {fileTypeHelp}
          <div className="text-xs text-gray-500 mt-2 space-y-1">
            <p>• <strong>PDF files:</strong> Text will be extracted automatically (works best with text-based PDFs)</p>
            <p>• <strong>TXT files:</strong> Recommended for best results - copy/paste your resume into a text file</p>
            <p>• <strong>Tip:</strong> If PDF extraction doesn't work well, try copying your resume text into a .txt file</p>
          </div>
        </div>
        
        <button
          type="submit"
          className="bg-[#6A38C2] text-white px-8 py-3 rounded-lg font-semibold 
                   hover:bg-[#5A2A9D] disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors duration-200 shadow-md hover:shadow-lg"
          disabled={loading || !file || isExtracting}
        >
          {isExtracting ? "Extracting Text..." : loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </form>

      {extractedText && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Extracted Text Preview</h2>
          <div className="bg-gray-50 p-4 rounded-lg border max-h-60 overflow-y-auto">
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {extractedText.substring(0, 1000)}
              {extractedText.length > 1000 && "..."}
            </p>
            <div className="mt-2 text-xs text-gray-500">
              Total characters: {extractedText.length}
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Analysis Result</h2>
          <div className="bg-white border rounded-lg shadow-inner">
            <pre className="p-4 text-sm overflow-x-auto whitespace-pre-wrap text-gray-700 leading-relaxed">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
/*⚡ Interview Explanation (Simple Flow):

“The ResumeAnalyzer.jsx component allows a user to upload their resume in PDF or TXT format.
 Once uploaded, it extracts the text content – for TXT files it’s straightforward, and for PDFs I used a regex-based parser.
  After extraction, the text is previewed to the user. 
Then I pass this text to a custom hook useResumeAnalyzer, which sends it to an AI backend for analysis.   The results are displayed in a structured format, helping users understand how ATS systems might read their resumes. 
   The component also has proper state management, 
loading indicators, and user feedback for a smooth UX.”*/