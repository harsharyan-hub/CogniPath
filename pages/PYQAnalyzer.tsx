import React, { useState, useRef } from 'react';
import { analyzePYQ } from '../services/geminiService';
import { PYQAnalysis, LoadingState } from '../types';
import { FileText, Loader2, AlertCircle, CheckCircle, GraduationCap, Upload, X } from 'lucide-react';

const PYQAnalyzer: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [textInput, setTextInput] = useState('');
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [analysis, setAnalysis] = useState<PYQAnalysis | null>(null);
  const [selectedFile, setSelectedFile] = useState<{ name: string, data: string, mimeType: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const base64String = (event.target?.result as string).split(',')[1];
        setSelectedFile({
          name: file.name,
          data: base64String,
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || (!textInput && !selectedFile)) return;

    setStatus(LoadingState.LOADING);
    try {
      const attachment = selectedFile ? { mimeType: selectedFile.mimeType, data: selectedFile.data } : undefined;
      const result = await analyzePYQ(subject, textInput, attachment);
      setAnalysis(result);
      
      // Save to local history
      const saved = localStorage.getItem('scholar_pyq_history');
      const history = saved ? JSON.parse(saved) : [];
      localStorage.setItem('scholar_pyq_history', JSON.stringify([result, ...history]));
      
      setStatus(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(LoadingState.ERROR);
    }
  };

  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900">Exam Question Predictor</h1>
        <p className="text-slate-500 mt-2">Upload question papers or paste text to identify patterns and get predicted questions with answers.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-fit">
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subject Name</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Biology Class 12"
                className="w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Upload Question Paper (PDF/Image) or Paste Text
              </label>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors
                  ${selectedFile ? 'border-emerald-300 bg-emerald-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'}
                `}
              >
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   className="hidden" 
                   accept="image/*,.pdf" 
                   onChange={handleFileChange}
                 />
                 
                 {selectedFile ? (
                   <div className="flex items-center gap-2 text-emerald-700">
                     <FileText className="w-6 h-6" />
                     <span className="font-medium text-sm truncate max-w-[200px]">{selectedFile.name}</span>
                     <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(); }} className="p-1 hover:bg-emerald-100 rounded-full">
                       <X className="w-4 h-4" />
                     </button>
                   </div>
                 ) : (
                   <>
                     <Upload className="w-8 h-8 text-slate-400 mb-2" />
                     <p className="text-sm text-slate-500 font-medium">Click to upload document</p>
                     <p className="text-xs text-slate-400">Supports PDF, PNG, JPG</p>
                   </>
                 )}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-2 text-xs text-slate-500">OR PASTE TEXT</span>
                </div>
              </div>

              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste the text of questions from previous years here..."
                className="w-full h-32 rounded-lg border-slate-300 border p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none font-mono text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={status === LoadingState.LOADING || (!textInput && !selectedFile)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === LoadingState.LOADING ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Analyze & Predict
                </>
              )}
            </button>

            {status === LoadingState.ERROR && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4" />
                Failed to analyze. Please try again.
              </div>
            )}
          </form>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
           {analysis ? (
             <>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="text-emerald-500 w-6 h-6" />
                    Key Topics Identified
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {analysis.topics.map((t, idx) => (
                      <span 
                        key={idx}
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${
                          t.importance === 'High' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          t.importance === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {t.topic}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-slate-600 italic">
                    Based on the provided questions, these topics appear most frequently.
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-slate-900">Predicted Important Questions</h2>
                  {analysis.predictedQuestions.map((q, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-semibold text-lg text-slate-900">Q: {q.question}</h3>
                        <span className="shrink-0 px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded">
                          {q.probabilityScore}% Prob.
                        </span>
                      </div>
                      
                      <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="font-medium text-slate-700 mb-2">Answer:</p>
                        <p className="text-slate-600 text-sm whitespace-pre-wrap">{q.answer}</p>
                      </div>

                      <div className="mt-3">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Explanation</p>
                        <p className="text-sm text-slate-600 mt-1">{q.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
             </>
           ) : (
             <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
               <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                 <GraduationCap className="w-8 h-8 text-slate-300" />
               </div>
               <p>Analysis results will appear here.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default PYQAnalyzer;