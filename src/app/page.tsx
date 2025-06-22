'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import jsPDF from 'jspdf';

// Results Display Component
const PlaybookResults = ({ result, onClose }: { result: string; onClose: () => void }) => {
  const downloadAsText = () => {
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'startup-playbook.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAsPDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const maxLineWidth = pageWidth - 2 * margin;
    
    // Split the text into lines and handle page breaks
    const lines = pdf.splitTextToSize(result, maxLineWidth);
    let yPosition = margin;
    
    pdf.setFontSize(12);
    
    for (let i = 0; i < lines.length; i++) {
      if (yPosition + 10 > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(lines[i], margin, yPosition);
      yPosition += 6;
    }
    
    pdf.save('startup-playbook.pdf');
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-5xl max-h-[90vh] overflow-y-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">📚 Your Startup Playbook</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold px-2"
          >
            ×
          </button>
        </div>
        
        {/* Markdown Content */}
        <div className="bg-gray-700 rounded-lg p-6 mb-6">
          <div className="prose prose-invert prose-gray max-w-none text-gray-200 leading-relaxed">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-gray-600">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-semibold text-white mb-3 mt-6">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-medium text-gray-300 mb-2 mt-4">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-300 mb-3 leading-relaxed">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc ml-6 mb-4 text-gray-300 space-y-1">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal ml-6 mb-4 text-gray-300 space-y-1">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-gray-300 leading-relaxed">
                    {children}
                  </li>
                ),
                strong: ({ children }) => (
                  <strong className="text-white font-semibold">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="text-gray-200 italic">
                    {children}
                  </em>
                ),
                code: ({ children }) => (
                  <code className="bg-gray-800 text-blue-300 px-2 py-1 rounded text-sm">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4">
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-400 mb-4">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {result}
            </ReactMarkdown>
          </div>
        </div>
        
        {/* Download Options */}
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={downloadAsPDF}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            📄 Download as PDF
          </button>
          <button
            onClick={downloadAsText}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            📝 Download as Text
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(result);
              alert('Playbook copied to clipboard!');
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            📋 Copy to Clipboard
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    location: '',
    businessOverview: '',
    teamSize: '',
    stage: '',
    playbookDescription: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load cached results on component mount
  useEffect(() => {
    const cached = localStorage.getItem('startup-playbook-cache');
    if (cached) {
      try {
        const { timestamp } = JSON.parse(cached);
        // Cache expires after 1 hour
        if (Date.now() - timestamp < 3600000) {
          console.log('Found cached playbook data');
        }
      } catch {
        console.log('No valid cache found');
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const buildPrompt = (data: typeof formData) => {
    const prompt = `
Create a comprehensive startup playbook for the following business:

**Business Information:**
- Business Name: ${data.businessName}
- Industry: ${data.industry}
- Location: ${data.location}
- Stage of Startup: ${data.stage}
- Team Size: ${data.teamSize}

**Business Overview:**
${data.businessOverview}

**Playbook Requirements:**
${data.playbookDescription}

Please generate a detailed startup playbook that includes:
1. Executive Summary
2. Market Analysis and Opportunity
3. Business Model and Strategy
5. Marketing and Customer Acquisition Strategy
6. Financial Planning and Projections
7. Team Building and Organizational Structure
8. Risk Assessment and Mitigation
9. Key Performance Indicators (KPIs)
10. Action Plan and Milestones

Tailor the playbook specifically for a ${data.stage} stage ${data.industry} startup with a team size of ${data.teamSize} located in ${data.location}. Make sure the recommendations are practical, actionable, and relevant to their current business stage and goals.
    `.trim();
    
    return prompt;
  };

  const sendToLyzr = async (prompt: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'sk-default-Aw9bJ0EgKiWCzITF9rqyGYMsgE0p2zck'
        },
        body: JSON.stringify({
          user_id: "irfanwork414@gmail.com",
          agent_id: "6857c5a017bfa0b3af0f3c2f",
          session_id: "6857c5a017bfa0b3af0f3c2f-mwfxntb46nb",
          message: prompt
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('=== LYZR API RESPONSE ===');
      console.log(data);
      console.log('========================');

      // Extract the actual response text (adjust based on actual API response structure)
      const playbookContent = data.response || data.message || data.content || JSON.stringify(data);
      
      // Cache the result
      localStorage.setItem('startup-playbook-cache', JSON.stringify({
        data: playbookContent,
        timestamp: Date.now(),
        formData: formData
      }));

      setResult(playbookContent);
      return playbookContent;

    } catch (error) {
      console.error('Error calling Lyzr API:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['businessName', 'industry', 'location', 'businessOverview', 'teamSize', 'stage', 'playbookDescription'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Build the prompt
    const prompt = buildPrompt(formData);
    
    console.log('=== GENERATED PROMPT ===');
    console.log(prompt);
    console.log('========================');
    
    try {
      await sendToLyzr(prompt);
    } catch (error) {
      console.error('Failed to generate playbook:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
            <span className="text-5xl">🚀</span>
            Startup Playbook Generator
          </h1>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-white">Generating your startup playbook...</p>
            </div>
          </div>
        )}

        {/* Results Modal */}
        {result && (
          <PlaybookResults 
            result={result} 
            onClose={() => setResult(null)} 
          />
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-900 border border-red-700 rounded-lg p-4">
            <p className="text-red-200">❌ Error: {error}</p>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Details Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-6 text-white">Business Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Business Name */}
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-300 mb-2">
                    Business Name*
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="e.g. Mayweather And So"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Industry */}
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-300 mb-2">
                    Industry*
                  </label>
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                  >
                    <option value="">- Please select -</option>
                    <option value="technology">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance</option>
                    <option value="education">Education</option>
                    <option value="retail">Retail</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="consulting">Consulting</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                    Location*
                  </label>
                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                  >
                    <option value="">- Please select -</option>
                    <option value="us">United States</option>
                    <option value="uk">United Kingdom</option>
                    <option value="canada">Canada</option>
                    <option value="australia">Australia</option>
                    <option value="germany">Germany</option>
                    <option value="france">France</option>
                    <option value="india">India</option>
                    <option value="singapore">Singapore</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Team Size */}
                <div>
                  <label htmlFor="teamSize" className="block text-sm font-medium text-gray-300 mb-2">
                    Team Size*
                  </label>
                  <select
                    id="teamSize"
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                  >
                    <option value="">- Please select -</option>
                    <option value="1">Just me (1)</option>
                    <option value="2-5">Small team (2-5)</option>
                    <option value="6-10">Medium team (6-10)</option>
                    <option value="11-25">Large team (11-25)</option>
                    <option value="26-50">Growing company (26-50)</option>
                    <option value="51+">Enterprise (51+)</option>
                  </select>
                </div>

                {/* Stage of Startup */}
                <div>
                  <label htmlFor="stage" className="block text-sm font-medium text-gray-300 mb-2">
                    Stage of Startup*
                  </label>
                  <select
                    id="stage"
                    name="stage"
                    value={formData.stage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                  >
                    <option value="">- Please select -</option>
                    <option value="idea">Idea Stage</option>
                    <option value="pre-seed">Pre-seed</option>
                    <option value="seed">Seed</option>
                    <option value="series-a">Series A</option>
                    <option value="series-b">Series B</option>
                    <option value="series-c">Series C</option>
                    <option value="later-stage">Later Stage</option>
                    <option value="growth">Growth Stage</option>
                    <option value="mature">Mature/Established</option>
                  </select>
                </div>

                {/* Business Overview */}
                <div className="md:col-span-2">
                  <label htmlFor="businessOverview" className="block text-sm font-medium text-gray-300 mb-2">
                    Business Overview*
                  </label>
                  <textarea
                    id="businessOverview"
                    name="businessOverview"
                    value={formData.businessOverview}
                    onChange={handleInputChange}
                    placeholder="Brief description of your business..."
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Playbook Description */}
            <div className="mb-8">
              <label htmlFor="playbookDescription" className="block text-sm font-medium text-gray-300 mb-2">
                Playbook Description*
              </label>
              <textarea
                id="playbookDescription"
                name="playbookDescription"
                value={formData.playbookDescription}
                onChange={handleInputChange}
                placeholder="Describe the purpose and goals of your playbook..."
                rows={6}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-red-500 hover:bg-red-600 disabled:bg-red-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                {isLoading ? 'Generating...' : 'Generate Playbook'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
