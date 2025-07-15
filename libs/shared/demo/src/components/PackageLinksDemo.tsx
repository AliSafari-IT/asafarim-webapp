import { PackageLinks } from '@asafarim/shared';
import { useTheme } from '@asafarim/react-themes';

export default function PackageLinksDemo() {
  const { mode, currentTheme } = useTheme();

  return (
    <div>
      <div className="demo-section">
        <h2 className="demo-title">PackageLinks Component</h2>
        <div className="demo-description">
          <p>
            The PackageLinks component displays a set of styled links for npm packages, GitHub repositories, and live demos.
            It automatically formats URLs and provides consistent styling with hover effects that adapt to the current theme.
          </p>
          <div style={{ 
            padding: 'var(--theme-spacing-md)', 
            backgroundColor: 'var(--theme-color-background-secondary)',
            borderRadius: 'var(--theme-radius-md)',
            marginTop: 'var(--theme-spacing-lg)'
          }}>
            <strong>Current Theme Mode:</strong> {mode} | <strong>Theme:</strong> {currentTheme.name}
          </div>
        </div>

        <div className="demo-section">
          <h3 className="demo-title">Props</h3>
          <table className="props-table">
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Required</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>packageName</td>
                <td>string</td>
                <td>Yes</td>
                <td>The npm package name (e.g., "@asafarim/display-code")</td>
              </tr>
              <tr>
                <td>githubPath</td>
                <td>string</td>
                <td>Yes</td>
                <td>The path to the package in the GitHub repository (e.g., "packages/display-code")</td>
              </tr>
              <tr>
                <td>demoPath</td>
                <td>string</td>
                <td>No</td>
                <td>The path to the demo in the GitHub Pages deployment (e.g., "packages/display-code")</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="demo-section">
        <h3 className="demo-title">Example 1: Full Package Links</h3>
        <div className="demo-description">
          <p>This example shows all three links: npm package, GitHub repository, and live demo.</p>
        </div>
        
        <div className="example-showcase">
          <PackageLinks 
            packageName="@asafarim/display-code" 
            githubPath="packages/display-code" 
            demoPath="packages/display-code" 
          />
        </div>

        <div className="demo-code">
          <pre>{`<PackageLinks 
  packageName="@asafarim/display-code" 
  githubPath="packages/display-code" 
  demoPath="packages/display-code" 
/>`}</pre>
        </div>
      </div>

      <div className="demo-section">
        <h3 className="demo-title">Example 2: Without Demo Link</h3>
        <div className="demo-description">
          <p>This example shows only npm and GitHub links when no demo is available.</p>
        </div>
        
        <div className="example-showcase">
          <PackageLinks 
            packageName="@asafarim/shared" 
            githubPath="shared" 
          />
        </div>

        <div className="demo-code">
          <pre>{`<PackageLinks 
  packageName="@asafarim/shared" 
  githubPath="shared" 
/>`}</pre>
        </div>
      </div>

      <div className="demo-section">
        <h3 className="demo-title">Example 3: Different Package Types</h3>
        <div className="demo-description">
          <p>Examples with different package names and paths.</p>
        </div>
        
        <div className="example-showcase multiple-examples">
          <div>
            <h4>React Component Library</h4>
            <PackageLinks 
              packageName="@asafarim/ui-components" 
              githubPath="packages/ui-components" 
              demoPath="packages/ui-components" 
            />
          </div>
          
          <div>
            <h4>Utility Library</h4>
            <PackageLinks 
              packageName="@asafarim/utils" 
              githubPath="packages/utils" 
            />
          </div>
          
          <div>
            <h4>Build Tool</h4>
            <PackageLinks 
              packageName="@asafarim/build-scripts" 
              githubPath="tools/build-scripts" 
              demoPath="tools/build-scripts" 
            />
          </div>
        </div>

        <div className="demo-code">
          <pre>{`{/* React Component Library */}
<PackageLinks 
  packageName="@asafarim/ui-components" 
  githubPath="packages/ui-components" 
  demoPath="packages/ui-components" 
/>

{/* Utility Library */}
<PackageLinks 
  packageName="@asafarim/utils" 
  githubPath="packages/utils" 
/>

{/* Build Tool */}
<PackageLinks 
  packageName="@asafarim/build-scripts" 
  githubPath="tools/build-scripts" 
  demoPath="tools/build-scripts" 
/>`}</pre>
        </div>
      </div>

      <div className="demo-section">
        <h3 className="demo-title">Features</h3>
        <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
          <li>🎨 Consistent styling with hover effects</li>
          <li>🔗 Automatic URL formatting for npm, GitHub, and demo links</li>
          <li>📱 Responsive design that works on all screen sizes</li>
          <li>♿ Accessible with proper ARIA attributes</li>
          <li>🎯 TypeScript support with full type safety</li>
          <li>🌙 Works well with both light and dark themes</li>
          <li>📦 Zero external dependencies (except React)</li>
        </ul>
      </div>
    </div>
  );
}
