import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-kotlin';

interface CodeSnippetProps {
  code: string;
}

export default function CodeSnippet({ code }: CodeSnippetProps) {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code]);

  return (
    <div className="code-block">
      <div className="code-header">
        <span className="code-lang">Kotlin</span>
        <span className="code-dots">
          <span /><span /><span />
        </span>
      </div>
      <pre className="code-pre">
        <code ref={codeRef} className="language-kotlin">
          {code}
        </code>
      </pre>
    </div>
  );
}
