// Abstract signature art component
// This component renders an ASCII art signature for inspection visibility.

import React, { useEffect } from 'react';

const asciiArt = `
    ____ _               _                    
  / ___(_) ___  _ __ __| | __ _ _ __   ___  
 | |  _| |/ _ \\| '__/ _\` |/ _\` | '_ \\ / _ \\ 
 | |_| | | (_) | | | (_| | (_| | | | | (_) |
  \\____|_|\\___/|_|  \\__,_|\\__,_|_| |_|\\___/ 
GitHub: https://github.com/ggkooo
LinkedIn: https://www.linkedin.com/in/giordano-berwig/
Email: giordanoberwig@proton.me
`;

const SignatureArt: React.FC = () => {
  useEffect(() => {
    const comment = document.createComment(`\n${asciiArt}\n`);
    const html = document.documentElement;
    html.insertBefore(comment, html.firstChild);
    return () => {
      if (comment.parentNode) comment.parentNode.removeChild(comment);
    };
  }, []);
  return null;
};

export default SignatureArt;
