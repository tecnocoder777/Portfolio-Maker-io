import React, { useState } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { PortfolioState } from './types';
import { generatePortfolioHTML } from './utils/htmlGenerator';

const INITIAL_STATE: PortfolioState = {
  meta: {
    title: 'John Doe | Portfolio',
    description: 'Portfolio of a creative developer.',
    favicon: 'https://cdn.simpleicons.org/react',
    ogImage: 'https://picsum.photos/1200/630'
  },
  theme: {
    layout: 'modern',
    font: 'Inter',
    primaryColor: '#4f46e5',
    backgroundColor: '#f8fafc',
    backgroundImage: '',
    backgroundOverlay: 0.9,
    textColor: '#1e293b'
  },
  profile: {
    name: 'John Doe',
    title: 'Creative Frontend Developer',
    bio: 'I build accessible, pixel-perfect, and performant web experiences. Passionate about UI/UX and open source.',
    avatar: 'https://picsum.photos/400/400',
    location: 'New York, USA',
    resumeUrl: ''
  },
  skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'UI/UX Design', 'Figma', 'Next.js', 'GraphQL'],
  experiences: [
    {
      id: '1',
      company: 'Tech Corp',
      role: 'Senior Frontend Engineer',
      period: '2022 - Present',
      description: 'Leading the frontend team in building scalable web applications using React and TypeScript.'
    },
    {
      id: '2',
      company: 'Startup Inc',
      role: 'Web Developer',
      period: '2020 - 2022',
      description: 'Collaborated with designers to implement responsive user interfaces and improve site performance.'
    }
  ],
  socials: [
    { id: '1', platform: 'github', url: 'https://github.com' },
    { id: '2', platform: 'linkedin', url: 'https://linkedin.com' },
    { id: '3', platform: 'twitter', url: 'https://twitter.com' },
    { id: '4', platform: 'email', url: 'mailto:john@example.com' }
  ],
  projects: [
    {
      id: '1',
      title: 'E-commerce Dashboard',
      description: 'A comprehensive dashboard designed for online retailers to track sales and analytics.',
      link: '#',
      imageUrl: 'https://picsum.photos/600/400?random=1',
      tags: ['React', 'Tailwind', 'Recharts']
    },
    {
      id: '2',
      title: 'Task Management App',
      description: 'A collaborative tool to help teams organize and prioritize their daily workflow.',
      link: '#',
      imageUrl: 'https://picsum.photos/600/400?random=2',
      tags: ['TypeScript', 'Node.js']
    }
  ]
};

function App() {
  const [data, setData] = useState<PortfolioState>(INITIAL_STATE);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  const handleExport = () => {
    const html = generatePortfolioHTML(data);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            P
          </div>
          <h1 className="font-bold text-xl text-gray-800 tracking-tight">Portfol.io</h1>
        </div>
        <div className="flex items-center gap-4">
           <button 
            className="md:hidden text-gray-600 hover:text-gray-900"
            onClick={() => setShowMobilePreview(!showMobilePreview)}
           >
             {showMobilePreview ? 'Edit' : 'Preview'}
           </button>
           <button 
            onClick={handleExport}
            className="hidden md:flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Export HTML
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* Editor Side */}
        <div className={`w-full md:w-[400px] lg:w-[450px] bg-white h-full z-20 flex flex-col transition-transform duration-300 absolute md:relative ${showMobilePreview ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}`}>
          <Editor data={data} onChange={setData} />
          {/* Mobile Export Button (Floating) */}
          <div className="md:hidden p-4 border-t border-gray-100 bg-white">
            <button 
              onClick={handleExport}
              className="w-full flex justify-center items-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-800"
            >
              Export Website
            </button>
          </div>
        </div>

        {/* Preview Side */}
        <div className={`flex-1 bg-slate-100 p-4 md:p-8 flex items-center justify-center h-full overflow-hidden transition-all duration-300 ${showMobilePreview ? 'opacity-100' : 'opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto'}`}>
           <div className="w-full h-full max-w-[1200px] mx-auto">
             <Preview data={data} />
           </div>
        </div>

      </main>
    </div>
  );
}

export default App;