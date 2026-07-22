import { useEffect } from 'react';

const ACCENT_COLOR = '#3f86c7';
const ROOT_TOKENS = ['--lab-accent', '--portfolio-accent'];

export const useLabAccent = () => {
  useEffect(() => {
    const root = document.documentElement;
    const previousTokens = ROOT_TOKENS.map((token) => [token, root.style.getPropertyValue(token)]);

    ROOT_TOKENS.forEach((token) => root.style.setProperty(token, ACCENT_COLOR));

    return () => {
      previousTokens.forEach(([token, value]) => {
        if (value) root.style.setProperty(token, value);
        else root.style.removeProperty(token);
      });
    };
  }, []);
};
