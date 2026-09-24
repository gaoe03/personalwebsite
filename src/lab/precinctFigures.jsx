// Precinctly 1.1 figures built from real app captures in public/projects/precinctly/v1-1/.
// Refreshing the captures only means copying new files over the same names.

const base = '/projects/precinctly/v1-1';

// The five party steps as the app draws them in light mode (partyColor in NumbersExplorations.swift).
const partySteps = [
  { label: 'Solid D', color: '#3957A6' },
  { label: 'Lean D', color: '#92A3CE' },
  { label: 'Even', color: '#A6A6A6' },
  { label: 'Lean R', color: '#D78197' },
  { label: 'Solid R', color: '#B71A42' },
];

function PrecinctDesignFigure() {
  return (
    <figure className="lab-project-note-figure precinct-design-figure">
      <div className="precinct-design-steps" role="img" aria-label="The five party colors, from solid blue through soft blue, gray and soft red to solid red">
        {partySteps.map((step) => (
          <div key={step.label}>
            <span style={{ background: step.color }} />
            <small>{step.label}</small>
          </div>
        ))}
      </div>
      <div className="precinct-design-grid">
        <div className="precinct-design-main">
          <img src={`${base}/hero-light.png`} alt="Precinct card header: Queens, NY (1322), a large R+10 figure, the label Lean Rep in 2024, a flat two-party bar, and the turnout caption" loading="lazy" />
          <img src={`${base}/stats-light.png`} alt="Money and education section: a title over a rule, median income $37,654 and 10% college degree, with orange differences against New York" loading="lazy" />
          <img src={`${base}/placebar-light.png`} alt="Map controls: search and the state picker on the left, By the Numbers and Settings on the right" loading="lazy" />
        </div>
        <div className="precinct-design-side">
          <img className="precinct-design-widget" src={`${base}/widget-light.png`} alt="Home Screen widget for Precinct 1322 in Queens with the lean, a two-party bar, past margins, income, college, age and renters" loading="lazy" />
          <img className="precinct-design-icon" src={`${base}/ballot.png`} alt="App icon: a heavy white lowercase p on navy, with its tail cut off by the bottom edge" loading="lazy" />
        </div>
      </div>
    </figure>
  );
}

function PrecinctNumbersFigure() {
  return (
    <figure className="lab-project-note-figure precinct-screens-figure">
      <img src={`${base}/dist1-light.png`} alt="By the Numbers for all of New York: precinct count, population, average lean and median income, then five bars of how precincts lean with your precinct marked You" loading="lazy" />
      <img src={`${base}/combo2-light.png`} alt="Five-bar charts of how far precincts moved between elections and how many eligible adults voted, with your precinct's bar marked You" loading="lazy" />
      <img src={`${base}/detail-light.png`} alt="Median household income chart with the under $50k bar selected, and the list of precincts in that bar" loading="lazy" />
    </figure>
  );
}

export const projectFigures = {
  'precinct-design': PrecinctDesignFigure,
  'precinct-numbers': PrecinctNumbersFigure,
};
