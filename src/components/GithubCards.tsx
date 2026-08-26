import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  GitFork, 
  Star, 
  ExternalLink, 
  Github, 
  Folder, 
  Search, 
  Filter, 
  ArrowUpRight 
} from 'lucide-react';
import { Repository } from '../types';
import { fetchGithubRepos } from '../utils/github';

export function ProjectCard({ repo }: { repo: Repository }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  // High performance calculation for real-time 3D tilt mechanics
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    
    // Position of hover inside card framework
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Target rotation based on distance from center
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Tilt limit degrees (e.g., 12deg max tilt)
    const maxRot = 12;
    const rotX = ((centerY - y) / centerY) * maxRot;
    const rotY = ((x - centerX) / centerX) * maxRot;

    setTilt({ x: rotX, y: rotY });
    setGlowPos({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  };

  const formattedDate = new Date(repo.updated_at).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  // Pick color representation for distinct languages
  const getLanguageColor = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'typescript': return 'bg-cyan-500';
      case 'javascript': return 'bg-yellow-500';
      case 'react': return 'bg-sky-400';
      case 'python': return 'bg-purple-500';
      case 'glsl': return 'bg-pink-500';
      case 'c++': return 'bg-blue-600';
      case 'docker': return 'bg-emerald-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div
      className="perspective-1000 w-full"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1000px' }}
    >
      <div
        className="glassmorphism-card w-full h-[256px] rounded-2xl p-6 relative overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer select-none border border-white/[0.03] select-none"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.02 : 1})`,
          transformStyle: 'preserve-3d',
          transition: hovered ? 'none' : 'transform 0.5s ease-out, border-color 0.4s',
        }}
      >
        {/* Radial Spotlight mouse tracking overlay */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{
            background: hovered 
              ? `radial-gradient(400px circle at ${glowPos.x}px ${glowPos.y}px, rgba(255, 255, 255, 0.04), transparent 80%)`
              : 'transparent',
            opacity: hovered ? 1 : 0,
          }}
        />

        {/* Ambient colored indicator belt */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-opacity duration-300"
             style={{ opacity: hovered ? 1 : 0.2 }} />

        {/* Header content */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Folder className={`w-5 h-5 transition-colors duration-300 ${hovered ? 'text-white' : 'text-gray-500'}`} />
              <span className="text-xs font-mono text-gray-500">{formattedDate}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <a 
                href={repo.html_url} 
                target="_blank" 
                referrerPolicy="no-referrer"
                rel="noreferrer"
                className="p-1.5 rounded-lg border border-white/5 bg-white/[0.02] text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all"
                title="View on GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              {repo.homepage && (
                <a 
                  href={repo.homepage} 
                  target="_blank" 
                  referrerPolicy="no-referrer"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg border border-white/5 bg-white/[0.02] text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all"
                  title="Live Demo"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <h4 className="text-lg font-display font-semibold text-white tracking-tight mb-2 mb-2 line-clamp-1 group-hover:text-zinc-300">
            {repo.name.replace(/-/g, ' ')}
          </h4>
          
          <p className="text-xs text-gray-400 font-sans leading-relaxed line-clamp-3">
            {repo.description}
          </p>
        </div>

        {/* Card stats footer */}
        <div className="mt-4 pt-4 border-t border-white/[0.05] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${getLanguageColor(repo.language)}`} />
            <span className="text-xs font-mono text-gray-400">{repo.language}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-gray-500 group-hover:text-yellow-400/80 transition-colors">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-mono">{repo.stargazers_count}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <GitFork className="w-3.5 h-3.5" />
              <span className="text-xs font-mono">{repo.forks_count}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GithubCards() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');

  useEffect(() => {
    async function loadRepos() {
      setLoading(true);
      const data = await fetchGithubRepos('biruk6049');
      setRepos(data);
      setLoading(false);
    }
    loadRepos();
  }, []);

  // Filter computations
  const languages = ['All', ...Array.from(new Set(repos.map(r => r.language))).filter(Boolean)];

  const filteredRepos = repos.filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          repo.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = selectedLanguage === 'All' || repo.language === selectedLanguage;
    return matchesSearch && matchesLanguage;
  });

  return (
    <div className="w-full">
      {/* Search / Filters layout */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 pl-9 pr-4 text-sm rounded-xl border border-white/5 bg-white/[0.02] focus:bg-white/[0.05] focus:border-white/30 text-white placeholder-gray-500 outline-none transition-all duration-300"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-3 py-1 rounded-full text-xs font-mono whitespace-nowrap transition-all duration-200 border cursor-pointer
                ${selectedLanguage === lang 
                  ? 'border-white/25 text-white bg-white/10 ring-1 ring-white/5'
                  : 'border-white/5 text-gray-400 hover:text-white hover:bg-white/[0.02]'}`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Grid container layout */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glassmorphism-card w-full h-[256px] rounded-2xl p-6 flex flex-col justify-between animate-pulse">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="w-1/3 h-4 bg-white/5 rounded" />
                  <div className="w-8 h-8 rounded-lg bg-white/5" />
                </div>
                <div className="w-3/4 h-6 bg-white/10 rounded mb-3" />
                <div className="w-full h-4 bg-white/5 rounded mb-2" />
                <div className="w-5/6 h-4 bg-white/5 rounded" />
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-white/[0.05]">
                <div className="w-1/4 h-4 bg-white/5 rounded" />
                <div className="w-1/4 h-4 bg-white/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredRepos.length > 0 ? (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredRepos.map((repo) => (
            <motion.div
              layout
              key={repo.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ProjectCard repo={repo} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20 border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
          <p className="text-gray-500 text-sm">No projects found matching your search. Try a different filter!</p>
        </div>
      )}
    </div>
  );
}
