import { useState } from "react";
import axios from "axios";
import { RESUME_API_END_POINT } from "@/utils/costant";

export default function useResumeAnalyzer() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const analyzeResume = async (resumeText) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(`${RESUME_API_END_POINT}/analyze-resume`, { resumeText });
      if (res.data.success) {
        setResult(res.data.analysis);
      } else {
        setResult({ error: res.data.message });
      }
    } catch (err) {
      setResult({ error: err.response?.data?.message || "Analysis failed." });
    }
    setLoading(false);
  };

  return { loading, result, analyzeResume };
}