import { Fragment, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ProjectMockup, WobbleDefs, projects, useWobbleLoop } from '../portfolioVisuals.jsx';
import usePageTitle from '../usePageTitle.js';
import { ProjectLinks } from './Lab.jsx';
import { useLabAccent } from './accentTheme.js';
import { projectDetails } from './projectDetails.js';
import { CustomCursor, SiteNav } from './SiteChrome.jsx';
import './lab.css';

const detailNav = [
  { label: 'Overview', href: '#project-overview' },
  { label: 'Demo', href: '#project-demo' },
  { label: 'Story', href: '#project-details' },
];

export default function LabProjectPage() {
  const { projectId } = useParams();
  const project = projects.find((item) => item.id === projectId);
  const detail = projectDetails[projectId];
  const rootRef = useRef(null);
  useLabAccent();
  useWobbleLoop(rootRef);
  usePageTitle(project && detail?.hasPage ? `${project.title}, Ethan Gao` : 'Project not found', {
    description: project && detail?.hasPage ? project.desc : 'The requested project could not be found.',
    path: `/projects/${projectId}`,
    robots: project && detail?.hasPage ? 'index, follow' : 'noindex, follow',
    type: 'article',
  });

  if (!project || !detail?.hasPage) {
    return (
      <div className="lab-page">
        <CustomCursor />
        <SiteNav />
        <main className="lab-project-missing">
          <div>
            <h1>Project not found</h1>
            <Link to="/#projects">Back to projects</Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div ref={rootRef} className={`lab-page lab-project-page lab-project-page-${project.id}`}>
      <WobbleDefs />
      <CustomCursor />
      <SiteNav
        links={detailNav}
        trailingLink={{ label: 'All projects', href: '/#projects' }}
      />

      <main>
        <header id="project-overview" className="lab-project-detail-hero">
          <Link to="/#projects" className="lab-project-back">← Back to projects</Link>
          <div className="lab-project-detail-title">
            <div>
              <p>{project.category}, {project.type}</p>
              <h1>{project.title}</h1>
            </div>
            <p>{project.desc}</p>
          </div>
          <ProjectLinks project={project} />
        </header>

        <section className="lab-project-facts" aria-label="Project facts">
          {detail.meta.map(([label, value]) => {
            return (
              <div key={label}>
                <span>{label}</span>
                <p>{value}</p>
              </div>
            );
          })}
        </section>

        <section id="project-demo" className="lab-project-detail-demo">
          <div className="lab-project-detail-demo-label"><span>Interactive sketch</span></div>
          <div className="lab-project-detail-stage"><ProjectMockup projectId={project.id} frameless /></div>
        </section>

        <section id="project-details" className="lab-project-notes">
          <aside>
            <span>Built with</span>
            <p>{project.tech.join(', ')}</p>
          </aside>
          <div className="lab-project-note-copy">
            {detail.sections.map((section) => (
              <article key={section.heading}>
                <h2>{section.heading}</h2>
                {(() => {
                  const paragraphs = Array.isArray(section.body) ? section.body : [section.body];
                  const figureIndex = section.image ? (section.image.afterParagraph ?? paragraphs.length - 1) : -1;
                  return paragraphs.map((paragraph, index) => (
                    <Fragment key={paragraph}>
                      <p>{paragraph}</p>
                      {index === figureIndex && (
                        <figure className="lab-project-note-figure">
                          <img src={section.image.src} alt={section.image.alt} loading="lazy" />
                          {section.image.caption && <figcaption>{section.image.caption}</figcaption>}
                        </figure>
                      )}
                    </Fragment>
                  ));
                })()}
              </article>
            ))}
          </div>
        </section>

        <footer className="lab-project-next">
          <span>Next project</span>
          {(() => {
            const pageProjects = projects.filter((item) => projectDetails[item.id]?.hasPage);
            const nextProject = pageProjects[(pageProjects.indexOf(project) + 1) % pageProjects.length];
            return <Link to={`/projects/${nextProject.id}`}>{nextProject.title} →</Link>;
          })()}
        </footer>
      </main>
    </div>
  );
}
