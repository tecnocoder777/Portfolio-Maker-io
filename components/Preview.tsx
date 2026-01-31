import React, { useEffect, useRef } from 'react';
import { PortfolioState } from '../types';
import { generatePortfolioHTML } from '../utils/htmlGenerator';

interface PreviewProps {
  data: PortfolioState;
}

const Preview: React.FC<PreviewProps> = ({ data }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const html = generatePortfolioHTML(data);
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    }
  }, [data]);

  return (
    <div className="w-full h-full bg-gray-900 flex flex-col rounded-xl overflow-hidden shadow-2xl border border-gray-700">
      <div className="h-10 bg-gray-800 flex items-center px-4 space-x-2 border-b border-gray-700">
        <div className="flex space-x-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="flex-1 flex justify-center">
            <div className="bg-gray-900 text-gray-400 text-xs px-3 py-1 rounded-md font-mono flex items-center">
                <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                portfolio.preview.app
            </div>
        </div>
      </div>
      <div className="flex-1 relative bg-white">
        <iframe
          ref={iframeRef}
          title="Portfolio Preview"
          className="absolute inset-0 w-full h-full"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
};

export default Preview;