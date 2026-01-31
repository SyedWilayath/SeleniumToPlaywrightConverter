import { useState, useEffect } from 'react';
import { convertSeleniumToPlaywright, type Language } from './converter';
import { samples } from './samples';
import { ThemeToggle } from './components/ThemeToggle';
import './App.css';

function App() {
  const [inputLanguage, setInputLanguage] = useState<Language>('java');
  const [outputLanguage, setOutputLanguage] = useState<Language>('java');
  const [inputCode, setInputCode] = useState<string>(samples.java);
  const [outputCode, setOutputCode] = useState<string>('');

  useEffect(() => {
    // Convert code whenever input changes or output language changes
    const converted = convertSeleniumToPlaywright(inputCode, outputLanguage);
    setOutputCode(converted);
  }, [inputCode, outputLanguage]);

  useEffect(() => {
    // Load sample when input language changes
    setInputCode(samples[inputLanguage]);
  }, [inputLanguage]);

  const handleCopy = () => {
    navigator.clipboard.writeText(outputCode);
    // Could add a toast notification here
  };

  const handleDownload = () => {
    const extensions: Record<Language, string> = {
      java: 'java',
      python: 'py',
      javascript: 'js',
      typescript: 'ts',
      csharp: 'cs'
    };

    const blob = new Blob([outputCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `playwright-test.${extensions[outputLanguage]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const languageOptions: { value: Language; label: string }[] = [
    { value: 'java', label: 'Java' },
    { value: 'python', label: 'Python' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'csharp', label: 'C#' }
  ];

  return (
    <div className="app">
      <ThemeToggle />

      <header className="header">
        <div className="header-content">
          <div className="logo">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            <h1>Selenium → Playwright Converter</h1>
          </div>
          <p className="subtitle">Convert Selenium WebDriver code to Playwright across multiple languages</p>
        </div>
      </header>

      <main className="main">
        <div className="editor-container">
          {/* Input Editor */}
          <div className="editor-panel">
            <div className="panel-header">
              <div className="panel-title">
                <svg className="panel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <span>Selenium Code</span>
              </div>
              <select
                className="language-select"
                value={inputLanguage}
                onChange={(e) => setInputLanguage(e.target.value as Language)}
              >
                {languageOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <textarea
              className="code-editor"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Paste your Selenium code here..."
              spellCheck={false}
            />
          </div>

          {/* Divider */}
          <div className="divider">
            <div className="divider-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>

          {/* Output Editor */}
          <div className="editor-panel">
            <div className="panel-header">
              <div className="panel-title">
                <svg className="panel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                  <polyline points="13 2 13 9 20 9" />
                </svg>
                <span>Playwright Code</span>
              </div>
              <div className="panel-actions">
                <select
                  className="language-select"
                  value={outputLanguage}
                  onChange={(e) => setOutputLanguage(e.target.value as Language)}
                >
                  {languageOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <button className="action-btn" onClick={handleCopy} title="Copy to clipboard">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
                <button className="action-btn" onClick={handleDownload} title="Download file">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </button>
              </div>
            </div>
            <textarea
              className="code-editor"
              value={outputCode}
              readOnly
              placeholder="Playwright code will appear here..."
              spellCheck={false}
            />
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>Built with ❤️ for the testing community</p>
      </footer>
    </div>
  );
}

export default App;
