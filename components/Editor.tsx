import React, { useState } from 'react';
import { PortfolioState, SocialLink, Project, Experience } from '../types';
import { generateBio, enhanceProjectDescription } from '../services/geminiService';

interface EditorProps {
  data: PortfolioState;
  onChange: (newData: PortfolioState) => void;
}

const Editor: React.FC<EditorProps> = ({ data, onChange }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'experience' | 'theme' | 'seo'>('profile');
  const [aiLoading, setAiLoading] = useState<string | null>(null);

  const updateProfile = (key: keyof PortfolioState['profile'], value: string) => {
    onChange({
      ...data,
      profile: { ...data.profile, [key]: value }
    });
  };

  const updateTheme = (key: keyof PortfolioState['theme'], value: any) => {
    onChange({
      ...data,
      theme: { ...data.theme, [key]: value }
    });
  };

  const updateMeta = (key: keyof PortfolioState['meta'], value: string) => {
    onChange({
      ...data,
      meta: { ...data.meta, [key]: value }
    });
  };

  const handleMagicBio = async () => {
    if (!process.env.API_KEY) {
      alert("Please configure API_KEY in environment to use AI features.");
      return;
    }
    setAiLoading('bio');
    try {
      const newBio = await generateBio(data.profile.name, data.profile.title, data.profile.bio);
      updateProfile('bio', newBio);
    } catch (e) {
      alert("Failed to generate bio. Try again.");
    } finally {
      setAiLoading(null);
    }
  };

  const handleMagicProject = async (index: number) => {
     if (!process.env.API_KEY) {
      alert("Please configure API_KEY in environment to use AI features.");
      return;
    }
    setAiLoading(`project-${index}`);
    try {
      const project = data.projects[index];
      const newDesc = await enhanceProjectDescription(project.title, project.description);
      const newProjects = [...data.projects];
      newProjects[index] = { ...project, description: newDesc };
      onChange({ ...data, projects: newProjects });
    } catch (e) {
      alert("Failed to enhance description.");
    } finally {
      setAiLoading(null);
    }
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: 'New Project',
      description: 'A brief description of your project.',
      link: '#',
      imageUrl: '',
      tags: ['React', 'Design']
    };
    onChange({ ...data, projects: [...data.projects, newProject] });
  };

  const removeProject = (index: number) => {
    const newProjects = [...data.projects];
    newProjects.splice(index, 1);
    onChange({ ...data, projects: newProjects });
  };

  const updateProject = (index: number, key: keyof Project, value: any) => {
     const newProjects = [...data.projects];
     newProjects[index] = { ...newProjects[index], [key]: value };
     onChange({ ...data, projects: newProjects });
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: 'Company Name',
      role: 'Role Title',
      period: '2023 - Present',
      description: 'Describe your role and achievements...'
    };
    onChange({ ...data, experiences: [...data.experiences, newExp] });
  };

  const removeExperience = (index: number) => {
    const newExp = [...data.experiences];
    newExp.splice(index, 1);
    onChange({ ...data, experiences: newExp });
  };

  const updateExperience = (index: number, key: keyof Experience, value: any) => {
    const newExp = [...data.experiences];
    newExp[index] = { ...newExp[index], [key]: value };
    onChange({ ...data, experiences: newExp });
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'experience', label: 'Exp.', icon: '🏢' },
    { id: 'projects', label: 'Projects', icon: '💼' },
    { id: 'theme', label: 'Theme', icon: '🎨' },
    { id: 'seo', label: 'SEO', icon: '🔍' },
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 shadow-sm">
      {/* Tabs */}
      <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-4 px-3 text-sm font-medium flex items-center justify-center gap-2 whitespace-nowrap transition-colors
              ${activeTab === tab.id ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {activeTab === 'profile' && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Full Name</label>
              <input type="text" value={data.profile.name} onChange={e => updateProfile('name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-shadow" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Job Title</label>
              <input type="text" value={data.profile.title} onChange={e => updateProfile('title', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-shadow" placeholder="Full Stack Developer" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Location</label>
              <input type="text" value={data.profile.location} onChange={e => updateProfile('location', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-shadow" placeholder="San Francisco, CA" />
            </div>
            <div>
               <div className="flex justify-between items-center mb-1">
                 <label className="block text-xs font-semibold text-gray-500 uppercase">Bio</label>
                 <button onClick={handleMagicBio} disabled={!!aiLoading} className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium">
                   {aiLoading === 'bio' ? '✨ Writing...' : '✨ Magic Write'}
                 </button>
               </div>
              <textarea rows={4} value={data.profile.bio} onChange={e => updateProfile('bio', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-shadow resize-none" placeholder="Short description about yourself..." />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Skills (Comma separated)</label>
              <textarea 
                rows={3} 
                value={data.skills.join(', ')} 
                onChange={e => onChange({...data, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)})} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                placeholder="React, Design, Writing..." 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Avatar URL</label>
              <input type="text" value={data.profile.avatar} onChange={e => updateProfile('avatar', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-shadow" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Resume URL (Optional)</label>
              <input type="text" value={data.profile.resumeUrl} onChange={e => updateProfile('resumeUrl', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-shadow" placeholder="https://..." />
            </div>
            
            <div className="pt-4 border-t border-gray-100">
               <label className="block text-xs font-semibold text-gray-500 uppercase mb-3">Social Links</label>
               {data.socials.map((social, idx) => (
                 <div key={social.id} className="flex gap-2 mb-2">
                   <select 
                      value={social.platform} 
                      onChange={(e) => {
                        const newSocials = [...data.socials];
                        newSocials[idx].platform = e.target.value as any;
                        onChange({...data, socials: newSocials});
                      }}
                      className="px-2 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                   >
                     {['github', 'twitter', 'linkedin', 'instagram', 'email', 'website'].map(p => <option key={p} value={p}>{p}</option>)}
                   </select>
                   <input 
                      type="text" 
                      value={social.url} 
                      onChange={(e) => {
                         const newSocials = [...data.socials];
                         newSocials[idx].url = e.target.value;
                         onChange({...data, socials: newSocials});
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" 
                      placeholder="URL..." 
                   />
                 </div>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="space-y-6 animate-fadeIn">
            {data.experiences.map((exp, idx) => (
              <div key={exp.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative group">
                <button onClick={() => removeExperience(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <div className="space-y-3">
                   <div className="grid grid-cols-2 gap-2">
                     <input 
                      type="text" 
                      value={exp.company} 
                      onChange={e => updateExperience(idx, 'company', e.target.value)} 
                      className="w-full bg-transparent font-bold text-gray-900 border-b border-gray-200 focus:border-indigo-500 px-0 py-1 outline-none" 
                      placeholder="Company"
                     />
                     <input 
                      type="text" 
                      value={exp.role} 
                      onChange={e => updateExperience(idx, 'role', e.target.value)} 
                      className="w-full bg-transparent font-medium text-gray-600 border-b border-gray-200 focus:border-indigo-500 px-0 py-1 outline-none" 
                      placeholder="Role"
                     />
                   </div>
                   <input 
                      type="text" 
                      value={exp.period} 
                      onChange={e => updateExperience(idx, 'period', e.target.value)} 
                      className="w-full text-xs text-gray-500 bg-white px-2 py-1 border border-gray-200 rounded" 
                      placeholder="e.g. 2020 - 2022"
                   />
                   <textarea 
                      value={exp.description} 
                      onChange={e => updateExperience(idx, 'description', e.target.value)} 
                      className="w-full bg-white px-3 py-2 border border-gray-200 rounded-lg text-sm" 
                      rows={2} 
                      placeholder="What did you do there?" 
                   />
                </div>
              </div>
            ))}
            <button onClick={addExperience} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-indigo-500 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              Add Experience
            </button>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-6 animate-fadeIn">
            {data.projects.map((project, idx) => (
              <div key={project.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative group">
                <button onClick={() => removeProject(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <div className="space-y-3">
                   <input 
                    type="text" 
                    value={project.title} 
                    onChange={e => updateProject(idx, 'title', e.target.value)} 
                    className="w-full bg-transparent font-bold text-gray-900 border-b border-gray-200 focus:border-indigo-500 px-0 py-1 outline-none" 
                    placeholder="Project Title"
                   />
                   <div className="relative">
                      <textarea 
                        value={project.description} 
                        onChange={e => updateProject(idx, 'description', e.target.value)} 
                        className="w-full bg-white px-3 py-2 border border-gray-200 rounded-lg text-sm" 
                        rows={2} 
                        placeholder="Description..." 
                      />
                      <button 
                        onClick={() => handleMagicProject(idx)}
                        disabled={!!aiLoading}
                        className="absolute bottom-2 right-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full hover:bg-indigo-200 flex items-center gap-1"
                      >
                         {aiLoading === `project-${idx}` ? '...' : '✨ Enhance'}
                      </button>
                   </div>
                   <input 
                    type="text" 
                    value={project.imageUrl} 
                    onChange={e => updateProject(idx, 'imageUrl', e.target.value)} 
                    className="w-full text-xs bg-white px-3 py-2 border border-gray-200 rounded-lg" 
                    placeholder="Image URL (optional)"
                   />
                   <input 
                    type="text" 
                    value={project.link} 
                    onChange={e => updateProject(idx, 'link', e.target.value)} 
                    className="w-full text-xs bg-white px-3 py-2 border border-gray-200 rounded-lg" 
                    placeholder="Project Link"
                   />
                    <input 
                    type="text" 
                    value={project.tags.join(', ')} 
                    onChange={e => updateProject(idx, 'tags', e.target.value.split(',').map(s => s.trim()))} 
                    className="w-full text-xs bg-white px-3 py-2 border border-gray-200 rounded-lg" 
                    placeholder="Tags (comma separated)"
                   />
                </div>
              </div>
            ))}
            <button onClick={addProject} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-indigo-500 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              Add Project
            </button>
          </div>
        )}

        {activeTab === 'theme' && (
          <div className="space-y-6 animate-fadeIn">
             <div>
               <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Layout Style</label>
               <div className="grid grid-cols-3 gap-2">
                 {['modern', 'minimal', 'bold'].map(layout => (
                   <button 
                    key={layout}
                    onClick={() => updateTheme('layout', layout)}
                    className={`px-3 py-2 rounded-lg border text-sm capitalize ${data.theme.layout === layout ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-gray-300'}`}
                   >
                     {layout}
                   </button>
                 ))}
               </div>
             </div>
             
             <div>
               <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Colors</label>
               <div className="space-y-3">
                 <div className="flex items-center justify-between p-2 border border-gray-200 rounded-lg">
                    <span className="text-sm">Primary</span>
                    <input type="color" value={data.theme.primaryColor} onChange={e => updateTheme('primaryColor', e.target.value)} className="h-8 w-12 rounded cursor-pointer" />
                 </div>
                 <div className="flex items-center justify-between p-2 border border-gray-200 rounded-lg">
                    <span className="text-sm">Background</span>
                    <input type="color" value={data.theme.backgroundColor} onChange={e => updateTheme('backgroundColor', e.target.value)} className="h-8 w-12 rounded cursor-pointer" />
                 </div>
                 <div className="flex items-center justify-between p-2 border border-gray-200 rounded-lg">
                    <span className="text-sm">Text</span>
                    <input type="color" value={data.theme.textColor} onChange={e => updateTheme('textColor', e.target.value)} className="h-8 w-12 rounded cursor-pointer" />
                 </div>
               </div>
             </div>

             <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Background Image</label>
                <input 
                  type="text" 
                  value={data.theme.backgroundImage} 
                  onChange={e => updateTheme('backgroundImage', e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none mb-2 text-sm" 
                  placeholder="https://... or linear-gradient(...)" 
                />
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-gray-500">Overlay Opacity</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05" 
                    value={data.theme.backgroundOverlay} 
                    onChange={e => updateTheme('backgroundOverlay', parseFloat(e.target.value))} 
                    className="flex-1"
                  />
                  <span className="text-xs w-8 text-right">{Math.round(data.theme.backgroundOverlay * 100)}%</span>
                </div>
             </div>

             <div>
               <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Typography</label>
               <select value={data.theme.font} onChange={e => updateTheme('font', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
                 <option value="Inter">Inter (Clean)</option>
                 <option value="Playfair Display">Playfair Display (Serif)</option>
                 <option value="Space Grotesk">Space Grotesk (Modern)</option>
               </select>
             </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 mb-4">
              These settings control how your site appears on Google and when shared on social media (Twitter, LinkedIn, etc.).
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Page Title</label>
              <input type="text" value={data.meta.title} onChange={e => updateMeta('title', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
             <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Description</label>
              <textarea rows={3} value={data.meta.description} onChange={e => updateMeta('description', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
             <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Open Graph Image URL</label>
              <input type="text" value={data.meta.ogImage} onChange={e => updateMeta('ogImage', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://... (1200x630)" />
            </div>
             <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Favicon URL</label>
              <input type="text" value={data.meta.favicon} onChange={e => updateMeta('favicon', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://.../favicon.ico" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;