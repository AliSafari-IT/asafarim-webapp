import React from 'react';

const styles = {
  packageLinks: {
    margin: '20px 0',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  linksContainer: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
  },
  linkItem: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: '#4dabf7',
    fontWeight: 500,
    padding: '8px 16px',
    borderRadius: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transition: 'background-color 0.2s, transform 0.2s',
  },
  linkItemHover: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: 'translateY(-2px)',
  },
  svg: {
    marginRight: '8px',
  },
  // Dark theme styles can be applied conditionally based on a theme prop
};

export interface PackageLinksProps {
  packageName: string;
  githubPath: string;
  demoPath?: string;
}

export const PackageLinks: React.FC<PackageLinksProps> = ({ 
  packageName, 
  githubPath,
  demoPath
}) => {

  const npmUrl = packageName.includes('npmjs.com') ? packageName : `https://www.npmjs.com/package/${packageName}`;
  const githubUrl = githubPath.includes('github.com') ? githubPath : `https://github.com/AliSafari-IT/${githubPath}`;
  const demoUrl = demoPath ? demoPath.includes('alisafari-it.github.io') ? demoPath : `https://alisafari-it.github.io/${demoPath}/` : undefined;
  
  return (
    <div style={styles.packageLinks}>
      <div style={styles.linksContainer}>
        <a 
          href={npmUrl}
          target="_blank" 
          rel="noopener noreferrer"
          style={styles.linkItem}
        >
          <svg height="20" width="20" viewBox="0 0 780 250" style={styles.svg}>
            <path fill="currentColor" d="M240,250h100v-50h100V0H240V250z M340,50h50v100h-50V50z M480,0v200h100V50h50v150h50V50h50v150h50V0H480z M0,200h100V50h50v150h50V0H0V200z"></path>
          </svg>
          npm package
        </a>
        <a 
          href={githubUrl}
          target="_blank" 
          rel="noopener noreferrer"
          style={styles.linkItem}
        >
          <svg height="20" width="20" viewBox="0 0 16 16" style={styles.svg}>
            <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
          </svg>
          GitHub repository
        </a>
        {demoUrl && (
          <a 
            href={demoUrl}
            target="_blank" 
            rel="noopener noreferrer"
            style={styles.linkItem}
          >
            <svg height="20" width="20" viewBox="0 0 24 24" style={styles.svg}>
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"></path>
            </svg>
            Live demo
          </a>
        )}
      </div>
    </div>
  );
};

export default PackageLinks;
