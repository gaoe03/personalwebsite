import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Play, Youtube } from 'lucide-react';
import { AmericaMap, HikingTrail, ProjectMockup, TravelMap, WobbleDefs, projects, skills, useWobbleLoop, videos } from '../portfolioVisuals.jsx';
import { Cover, BlogWobbleDefs } from '../blogArt.jsx';
import posts from '../posts/index.js';
import usePageTitle from '../usePageTitle.js';
import { useLabAccent } from './accentTheme.js';
import { projectDetails } from './projectDetails.js';
import OverlayDialog from './OverlayDialog.jsx';
import { CustomCursor, SiteNav } from './SiteChrome.jsx';
import './lab.css';

const navLinks = [
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Interests', href: '#interests' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '#contact' },
];

const heroRoles = [
  'a Deloitte analyst',
  'a CS and business graduate',
  'a travel vlogger',
];

const RoleCycle = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % heroRoles.length);
    }, 2600);
    return () => window.clearInterval(interval);
  }, []);

  const showNextRole = () => {
    setActiveIndex((index) => (index + 1) % heroRoles.length);
  };

  return (
    <button
      type="button"
      className="lab-role-cycle"
      onClick={showNextRole}
      aria-label="Cycle through Ethan's roles"
    >
      <span key={heroRoles[activeIndex]} className="lab-role-text">{heroRoles[activeIndex]}</span>
      <span className="lab-role-handle lab-role-handle-tl" aria-hidden="true" />
      <span className="lab-role-handle lab-role-handle-tr" aria-hidden="true" />
      <span className="lab-role-handle lab-role-handle-bl" aria-hidden="true" />
      <span className="lab-role-handle lab-role-handle-br" aria-hidden="true" />
    </button>
  );
};

const SocialLinks = ({ label }) => (
  <nav className="lab-socials" aria-label={label}>
    <a href="https://linkedin.com/in/gaoe" target="_blank" rel="noopener noreferrer">LinkedIn</a>
    <a href="https://github.com/gaoe03" target="_blank" rel="noopener noreferrer">GitHub</a>
    <a href="https://youtube.com/@gaofiles" target="_blank" rel="noopener noreferrer">YouTube</a>
    <a href="mailto:one@ethangao.xyz">Email</a>
  </nav>
);

const HeroArtwork = () => (
  <div className="lab-hero-art" aria-hidden="true">
    <img src="/favicon.png" alt="" draggable="false" />
  </div>
);

export const ProjectLinks = ({ project, showNotes = false, onOpenNotes }) => (
  <div className="lab-project-links">
    {showNotes && (
      <button type="button" onClick={onOpenNotes} aria-haspopup="dialog" aria-controls={`lab-notes-dialog-${project.id}`}>Project notes</button>
    )}
    {project.live && project.link && (
      <a href={project.link} target="_blank" rel="noopener noreferrer">
        Visit site <ArrowUpRight size={15} />
      </a>
    )}
    {!project.live && project.link && (
      <a href={project.link} target="_blank" rel="noopener noreferrer">
        View code <ArrowUpRight size={15} />
      </a>
    )}
    {project.repo && (
      <a href={project.repo} target="_blank" rel="noopener noreferrer">
        View code <ArrowUpRight size={15} />
      </a>
    )}
  </div>
);

const ProjectNotesDialog = ({ project, onClose, returnFocus }) => {
  const detail = projectDetails[project.id];
  const facts = detail.meta
    .map(([label, value]) => [label, typeof value === 'string' ? value : value.text, typeof value === 'object' && value.missing])
    .filter(([, , isMissing]) => !isMissing)
    .slice(0, 3);

  return (
    <OverlayDialog
      id={`lab-notes-dialog-${project.id}`}
      className="lab-notes-dialog"
      labelledBy={`lab-notes-title-${project.id}`}
      closeLabel="Close project notes"
      onClose={onClose}
      returnFocus={returnFocus}
    >
        <header className="lab-notes-header">
          <div>
            <p>{project.category}, {project.type}</p>
            <h2 id={`lab-notes-title-${project.id}`}>{project.title}</h2>
          </div>
        </header>

        <div className="lab-notes-scroll">
          <div className="lab-notes-intro">
            <p>{project.desc}</p>
            <dl>
              {facts.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lab-notes-sections">
            {detail.highlights.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>

          {project.id === 'precinct' && (
            <p className="lab-notes-credit">
              Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>
            </p>
          )}
        </div>

        <footer className="lab-notes-footer">
          <ProjectLinks project={project} />
          {detail.hasPage && (
            <a className="lab-notes-expand" href={`/projects/${project.id}`}>
              Read the full project
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          )}
        </footer>
    </OverlayDialog>
  );
};

const LabProjects = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <>
      <section id="projects" className="lab-section lab-projects">
        <header className="lab-section-header">
          <h2>Recent Projects</h2>
        </header>

        <div className="lab-project-grid">
          {projects.map((project) => (
            <article id={`lab-project-${project.id}`} className="lab-project-card" key={project.id}>
              <div className="lab-project-preview">
                <ProjectMockup projectId={project.id} frameless />
              </div>
              <div className="lab-project-card-copy">
                <div className="lab-project-card-heading">
                  <h3>{project.title}</h3>
                  <p className="lab-meta">{project.category}, {project.type}</p>
                </div>
                <p className="lab-project-summary">{project.desc}</p>
                <p className="lab-tech">{project.tech.join(', ')}</p>
                <ProjectLinks
                  project={project}
                  showNotes
                  onOpenNotes={(event) => {
                    event.currentTarget.focus();
                    setSelectedProject({ project, returnFocus: event.currentTarget });
                  }}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      {selectedProject && (
        <ProjectNotesDialog
          project={selectedProject.project}
          returnFocus={selectedProject.returnFocus}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
};

const LabExperience = () => (
  <section id="experience" className="lab-section lab-experience">
    <header className="lab-section-header">
      <h2>Experience</h2>
      <p>Click on a card for more info</p>
    </header>
    <HikingTrail />
  </section>
);

const LabSkills = () => (
  <section id="skills" className="lab-section lab-skills">
    <header className="lab-section-header">
      <h2>Technical Skills</h2>
    </header>
    <div className="lab-skills-grid">
      {Object.entries(skills).map(([key, category]) => (
        <article key={key}>
          <h3>{category.title}</h3>
          {key === 'certs' ? (
            <p className="lab-skill-lines">{category.items.map((item) => <span key={item}>{item}</span>)}</p>
          ) : (
            <p>{category.items.join(', ')}</p>
          )}
        </article>
      ))}
    </div>
  </section>
);

const LabTravel = () => {
  const publishedVideos = videos.filter((video) => !video.comingSoon);
  const [region, setRegion] = useState('Asia');
  const [selectedVideo, setSelectedVideo] = useState(0);
  const filteredVideos = publishedVideos.filter((video) => (
    region === 'Asia' ? ['Japan', 'China'].includes(video.country) : video.country === 'USA'
  ));
  const currentVideo = filteredVideos[selectedVideo] || filteredVideos[0];
  const changeRegion = (nextRegion) => {
    setRegion(nextRegion);
    setSelectedVideo(0);
  };

  return (
    <section id="interests" className="lab-section lab-travel">
      <header className="lab-section-header">
        <h2>gao life</h2>
        <a className="lab-travel-channel" href="https://youtube.com/@gaofiles" target="_blank" rel="noopener noreferrer">
          <Youtube size={20} aria-hidden="true" />
          @gaofiles
        </a>
      </header>
      <div className="lab-travel-intro">
        <p>I like traveling and making videos about it. Mostly Asia so far.</p>
      </div>
      <div className="lab-travel-explorer">
        <div className="lab-travel-map">
          {region === 'Asia' ? (
            <TravelMap videos={filteredVideos} onSelectVideo={setSelectedVideo} selectedIndex={selectedVideo} />
          ) : (
            <AmericaMap videos={filteredVideos} onSelectVideo={setSelectedVideo} selectedIndex={selectedVideo} />
          )}
        </div>
        <div className="lab-travel-selection">
          <a href={currentVideo.url} target="_blank" rel="noopener noreferrer" className="lab-travel-feature">
            <span className="lab-travel-feature-media">
              <img src={currentVideo.thumbnail} alt={currentVideo.title} />
              <span className="lab-travel-play" aria-hidden="true">
                <Play size={24} fill="currentColor" />
              </span>
            </span>
            <span>
              <small>gao life {currentVideo.num}, {currentVideo.country}</small>
              <strong>{currentVideo.title}</strong>
            </span>
          </a>
          <div className="lab-travel-regions" role="group" aria-label="Map region">
            {['Asia', 'America'].map((option) => (
              <button key={option} type="button" className={region === option ? 'is-active' : ''} aria-pressed={region === option} onClick={() => changeRegion(option)}>{option}</button>
            ))}
          </div>
          <div className="lab-travel-places" role="group" aria-label="Video location">
            {filteredVideos.map((video, index) => (
              <button key={video.num} type="button" className={selectedVideo === index ? 'is-active' : ''} aria-pressed={selectedVideo === index} onClick={() => setSelectedVideo(index)}>{video.title}</button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const LabWriting = () => {
  const recent = posts.filter((post) => post.status !== 'draft').slice(0, 3);
  const formatDate = (iso) => new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <section id="writing" className="lab-section lab-writing">
      <BlogWobbleDefs />
      <header className="lab-section-header">
        <h2>Recent Writing</h2>
        <a href="/blog">read more</a>
      </header>
      <div className="lab-writing-list">
        {recent.map((post) => (
          <a key={post.slug} href={`/blog/${post.slug}`}>
            <div className="lab-writing-cover"><Cover slug={post.slug} aspect="16 / 9" /></div>
            <div>
              <small>{post.category}</small>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
            </div>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </a>
        ))}
      </div>
    </section>
  );
};

export default function Lab() {
  const rootRef = useRef(null);
  useLabAccent();
  useWobbleLoop(rootRef);
  usePageTitle('Ethan Gao', {
    description: 'Portfolio of Ethan Gao, a Deloitte Digital analyst and software builder working across iOS, data pipelines, web tools, and automation.',
    path: '/',
  });

  return (
    <div ref={rootRef} className="lab-page">
      <WobbleDefs />
      <CustomCursor />
      <SiteNav links={navLinks} />

      <main>
        <header className="lab-hero">
          <div className="lab-hero-stage">
            <div className="lab-hero-copy">
              <div className="lab-hero-intro">
                <h1>Ethan Gao is</h1>
                <RoleCycle />
              </div>
              <div className="lab-hero-details">
                <p>I'm an Analyst at <strong>Deloitte Digital</strong> in Costa Mesa, with degrees in Computer Science and Business Administration from <strong>UC Irvine</strong>. I like turning messy data and workflows into software people can use.</p>
                <div>
                  <p>I also make travel videos and keep building side projects.</p>
                  <SocialLinks label="Profile links" />
                </div>
              </div>
            </div>
            <HeroArtwork />
          </div>
        </header>

        <LabProjects />
        <LabExperience />
        <LabSkills />
        <LabTravel />
        <LabWriting />
      </main>

      <footer id="contact" className="lab-footer">
        <p>Ethan Gao</p>
        <a href="mailto:one@ethangao.xyz">one@ethangao.xyz</a>
        <SocialLinks label="Contact links" />
      </footer>
    </div>
  );
}
