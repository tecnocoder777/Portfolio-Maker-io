import { PortfolioState } from '../types';

export const generatePortfolioHTML = (data: PortfolioState): string => {
  const { meta, theme, profile, socials, projects, skills, experiences } = data;

  const fontLink = `https://fonts.googleapis.com/css2?family=${theme.font.replace(' ', '+')}:wght@300;400;500;600;700&display=swap`;
  const fontFamily = `'${theme.font}', sans-serif`;

  // Helper to render socials
  const renderSocials = () => socials.map(s => `
    <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="social-icon transition-transform hover:-translate-y-1 opacity-80 hover:opacity-100">
      <img src="https://cdn.simpleicons.org/${s.platform}/${theme.primaryColor.replace('#', '')}" alt="${s.platform}" class="w-6 h-6" />
    </a>
  `).join('');

  // Helper to render projects
  const renderProjects = () => projects.map(p => `
    <article class="project-card group relative bg-white/10 border border-white/10 dark:border-white/5 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.01] flex flex-col h-full backdrop-blur-sm">
      ${p.imageUrl ? `<div class="aspect-video w-full overflow-hidden bg-gray-100/10">
        <img src="${p.imageUrl}" alt="${p.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
      </div>` : ''}
      <div class="p-6 flex-1 flex flex-col">
        <div class="flex flex-wrap gap-2 mb-3">
          ${p.tags.map(t => `<span class="text-xs font-medium px-2 py-1 rounded-full bg-black/5 dark:bg-white/10 opacity-70">${t}</span>`).join('')}
        </div>
        <h3 class="text-xl font-bold mb-2">${p.title}</h3>
        <p class="opacity-80 leading-relaxed mb-6 text-sm flex-1">${p.description}</p>
        <a href="${p.link}" target="_blank" class="inline-flex items-center text-sm font-semibold hover:underline decoration-2 underline-offset-4 mt-auto" style="color: ${theme.primaryColor}">
          View Project &rarr;
        </a>
      </div>
    </article>
  `).join('');

  // Helper to render skills
  const renderSkills = () => skills.map(skill => `
    <span class="px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/10 text-sm font-medium opacity-90">${skill}</span>
  `).join('');

  // Helper to render experience
  const renderExperience = () => experiences.map(exp => `
    <div class="relative pl-8 border-l-2 border-dashed border-gray-300 dark:border-gray-700 pb-8 last:pb-0">
      <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white dark:bg-gray-900 border-2" style="border-color: ${theme.primaryColor}"></div>
      <div class="mb-1 flex flex-wrap items-center gap-2">
        <h4 class="font-bold text-lg">${exp.role}</h4>
        <span class="text-sm opacity-60">at ${exp.company}</span>
      </div>
      <p class="text-xs font-mono opacity-50 mb-2 uppercase tracking-wide">${exp.period}</p>
      <p class="opacity-80 text-sm leading-relaxed">${exp.description}</p>
    </div>
  `).join('');

  // Background Handling
  const hasBgImage = !!theme.backgroundImage;
  const bgStyle = hasBgImage ? 
    `background-image: url('${theme.backgroundImage}'); background-size: cover; background-position: center; background-attachment: fixed;` : 
    `background-color: ${theme.backgroundColor};`;
  
  const overlayStyle = hasBgImage ? 
    `background-color: ${theme.backgroundColor}; opacity: ${theme.backgroundOverlay};` : 
    ``;

  // Layout Styles
  let layoutHTML = '';

  if (theme.layout === 'modern') {
    layoutHTML = `
      <div class="max-w-6xl mx-auto px-6 py-12 md:py-24 grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
        <!-- Sidebar / Profile -->
        <div class="md:col-span-4 lg:col-span-3 space-y-8 md:sticky md:top-24 h-fit">
          <div class="space-y-6 text-center md:text-left">
            <div class="relative inline-block mx-auto md:mx-0">
               <img src="${profile.avatar}" alt="${profile.name}" class="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 shadow-xl relative z-10 bg-white" style="border-color: ${theme.primaryColor}" />
               <div class="absolute inset-0 rounded-full blur-2xl opacity-40 -z-10 transform translate-y-4" style="background-color: ${theme.primaryColor}"></div>
            </div>
            <div>
              <h1 class="text-3xl md:text-4xl font-bold tracking-tight mb-2 leading-tight">${profile.name}</h1>
              <p class="text-lg opacity-75 font-medium" style="color: ${theme.primaryColor}">${profile.title}</p>
              <p class="text-sm opacity-60 mt-1 flex items-center justify-center md:justify-start gap-1">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                ${profile.location}
              </p>
            </div>
            <p class="opacity-80 leading-relaxed text-sm md:text-base">${profile.bio}</p>
            
            ${skills.length > 0 ? `
              <div class="pt-4">
                <h3 class="text-xs font-bold uppercase tracking-widest opacity-50 mb-3">Skills</h3>
                <div class="flex flex-wrap gap-2 justify-center md:justify-start">
                  ${renderSkills()}
                </div>
              </div>
            ` : ''}

            <div class="flex gap-4 justify-center md:justify-start pt-4">
              ${renderSocials()}
            </div>
             ${profile.resumeUrl ? `<a href="${profile.resumeUrl}" class="inline-block px-6 py-2.5 rounded-full font-medium text-white transition-all hover:opacity-90 hover:shadow-lg w-full md:w-auto text-center" style="background-color: ${theme.primaryColor}">Download Resume</a>` : ''}
          </div>
        </div>

        <!-- Main Content -->
        <div class="md:col-span-8 lg:col-span-9 space-y-20">
          
          ${experiences.length > 0 ? `
          <section>
            <h2 class="text-2xl font-bold mb-8 flex items-center gap-3 pb-4 border-b border-black/5 dark:border-white/10">
              <span class="text-2xl">⚡</span> Experience
            </h2>
            <div class="ml-2">
              ${renderExperience()}
            </div>
          </section>
          ` : ''}

          <section>
            <h2 class="text-2xl font-bold mb-8 flex items-center gap-3 pb-4 border-b border-black/5 dark:border-white/10">
              <span class="text-2xl">🚀</span> Selected Projects
            </h2>
            <div class="grid grid-cols-1 gap-8">
              ${renderProjects()}
            </div>
          </section>

          <section id="contact" class="bg-black/5 dark:bg-white/10 rounded-3xl p-8 md:p-12 text-center md:text-left relative overflow-hidden">
            <div class="relative z-10">
                <h2 class="text-3xl font-bold mb-4">Let's build something great.</h2>
                <p class="opacity-70 mb-8 max-w-lg text-lg">Interested in working together? I'm always open to discussing new projects and opportunities.</p>
                <a href="mailto:${socials.find(s => s.platform === 'email')?.url || ''}" class="inline-flex items-center gap-2 px-8 py-3 rounded-full text-white font-semibold transition-transform hover:scale-105" style="background-color: ${theme.primaryColor}">
                Send me an email
                </a>
            </div>
            <div class="absolute right-0 bottom-0 opacity-10 transform translate-x-1/3 translate-y-1/3">
                 <svg width="300" height="300" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            </div>
          </section>
        </div>
      </div>
    `;
  } else if (theme.layout === 'minimal') {
    layoutHTML = `
      <div class="max-w-2xl mx-auto px-6 py-20 space-y-20 relative z-10">
        <header class="text-center space-y-8">
          <img src="${profile.avatar}" alt="${profile.name}" class="w-24 h-24 rounded-full object-cover mx-auto ring-2 ring-offset-4 ring-offset-transparent shadow-lg" style="--tw-ring-color: ${theme.primaryColor}" />
          <div>
            <h1 class="text-4xl md:text-5xl font-bold mb-4 tracking-tight">${profile.name}</h1>
            <p class="text-xl opacity-60 font-light">${profile.title}</p>
          </div>
          <p class="max-w-lg mx-auto text-lg leading-relaxed opacity-80">${profile.bio}</p>
          <div class="flex gap-6 justify-center">
            ${renderSocials()}
          </div>
          ${skills.length > 0 ? `
             <div class="flex flex-wrap gap-2 justify-center pt-2 max-w-lg mx-auto">
                ${renderSkills()}
             </div>
          ` : ''}
        </header>

        ${experiences.length > 0 ? `
        <section class="space-y-10">
           <h2 class="text-xs font-bold uppercase tracking-widest opacity-40 text-center">Work Experience</h2>
           <div class="space-y-10">
              ${experiences.map(exp => `
                <div class="flex flex-col md:flex-row gap-2 md:gap-8 text-center md:text-left">
                   <div class="md:w-32 flex-shrink-0 text-sm opacity-50 font-mono py-1">${exp.period}</div>
                   <div>
                      <h4 class="font-bold">${exp.role}</h4>
                      <p class="text-sm opacity-60 mb-2">${exp.company}</p>
                      <p class="opacity-80 text-sm">${exp.description}</p>
                   </div>
                </div>
              `).join('')}
           </div>
        </section>
        ` : ''}

        <section class="space-y-10">
          <h2 class="text-xs font-bold uppercase tracking-widest opacity-40 text-center">Projects</h2>
          <div class="grid gap-12">
             ${renderProjects()}
          </div>
        </section>

        <footer class="text-center pt-12 border-t border-black/5 dark:border-white/10">
          <a href="mailto:${socials.find(s => s.platform === 'email')?.url || ''}" class="inline-block mb-8 text-2xl font-bold hover:underline" style="color: ${theme.primaryColor}">Get in touch</a>
          <p class="opacity-50 text-sm">© ${new Date().getFullYear()} ${profile.name}.</p>
        </footer>
      </div>
    `;
  } else {
    // Bold Layout
    layoutHTML = `
      <div class="min-h-screen flex flex-col relative z-10">
        <header class="px-6 py-12 md:py-28 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div class="order-2 md:order-1 space-y-8">
             <div class="flex items-center gap-3">
                 <span class="inline-block w-8 h-1 rounded-full" style="background-color: ${theme.primaryColor}"></span>
                 <span class="text-sm font-bold tracking-widest uppercase opacity-60">${profile.title}</span>
             </div>
             <h1 class="text-5xl md:text-8xl font-extrabold leading-tight tracking-tighter">
               ${profile.name.split(' ')[0]} <br/>
               <span class="text-transparent bg-clip-text" style="background-image: linear-gradient(to right, ${theme.primaryColor}, ${theme.textColor})">${profile.name.split(' ').slice(1).join(' ')}</span>.
             </h1>
             <p class="text-xl md:text-2xl opacity-70 max-w-lg leading-relaxed">${profile.bio}</p>
             
             ${skills.length > 0 ? `
              <div class="flex flex-wrap gap-2 opacity-80">
                 ${skills.map(s => `<span class="border border-current px-3 py-1 rounded-full text-sm">${s}</span>`).join('')}
              </div>
             ` : ''}

             <div class="flex gap-6 pt-4 items-center">
                ${renderSocials()}
                ${profile.resumeUrl ? `<span class="mx-2 opacity-20">|</span> <a href="${profile.resumeUrl}" class="font-bold hover:underline">Resume</a>` : ''}
             </div>
          </div>
          <div class="order-1 md:order-2 flex justify-center md:justify-end">
             <div class="relative w-72 h-72 md:w-[500px] md:h-[500px]">
                <div class="absolute inset-0 rounded-full blur-[100px] opacity-30 animate-pulse" style="background-color: ${theme.primaryColor}"></div>
                <img src="${profile.avatar}" class="relative w-full h-full object-cover rounded-[3rem] rotate-3 hover:rotate-0 transition-transform duration-700 shadow-2xl grayscale hover:grayscale-0" alt="${profile.name}" />
             </div>
          </div>
        </header>

        <main class="flex-grow px-6 py-20 bg-black/5 dark:bg-white/5 backdrop-blur-md">
           <div class="max-w-7xl mx-auto space-y-24">
             
             ${experiences.length > 0 ? `
             <section>
                <h2 class="text-4xl font-extrabold mb-12">Experience</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  ${experiences.map(exp => `
                     <div class="p-8 border border-current border-opacity-10 rounded-2xl hover:bg-white/5 transition-colors">
                        <span class="text-sm font-mono opacity-50 mb-2 block">${exp.period}</span>
                        <h3 class="text-2xl font-bold mb-1">${exp.role}</h3>
                        <div class="text-lg opacity-70 mb-4" style="color: ${theme.primaryColor}">${exp.company}</div>
                        <p class="opacity-80 leading-relaxed">${exp.description}</p>
                     </div>
                  `).join('')}
                </div>
             </section>
             ` : ''}

             <section>
               <h2 class="text-4xl font-extrabold mb-12">Featured Work</h2>
               <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  ${renderProjects()}
               </div>
             </section>
             
             <section class="py-20 text-center">
                <h2 class="text-4xl md:text-6xl font-black mb-8">Ready to collaborate?</h2>
                <a href="mailto:${socials.find(s => s.platform === 'email')?.url || ''}" class="inline-block text-2xl md:text-3xl border-b-4 border-current pb-2 hover:opacity-70 transition-opacity" style="border-color: ${theme.primaryColor}">
                  ${socials.find(s => s.platform === 'email')?.url.replace('mailto:', '') || 'Get in touch'}
                </a>
             </section>
           </div>
        </main>
      </div>
    `;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${meta.title}</title>
    <meta name="description" content="${meta.description}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${meta.title}">
    <meta property="og:description" content="${meta.description}">
    <meta property="og:image" content="${meta.ogImage}">
    <meta property="og:type" content="website">
    
    <link rel="icon" href="${meta.favicon}">
    <link href="${fontLink}" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body { 
        font-family: ${fontFamily}; 
        ${bgStyle}
      }
      .bg-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
        ${overlayStyle}
      }
    </style>
</head>
<body class="min-h-screen transition-colors duration-300 relative text-[${theme.textColor}]">
    ${hasBgImage ? '<div class="bg-overlay"></div>' : ''}
    ${layoutHTML}
</body>
</html>`;
};