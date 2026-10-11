import React from 'react';
import { createRoot } from 'react-dom/client';
// Шрифты сайтов TUGEN — как на tugen.ru (tugen.webservices): Ubuntu Sans для текста, Ubuntu Mono для кода
import '@fontsource-variable/ubuntu-sans';
import '@fontsource/ubuntu-mono/400.css';
import '@fontsource/ubuntu-mono/700.css';
import './global.css';
import { App } from './app';

createRoot(document.getElementById('root')!).render(<App />);
