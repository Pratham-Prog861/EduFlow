/**
 * EDUFLOW CLERK BRANDING CONFIGURATION
 * Custom UI configuration for the Clerk identity portal.
 */

import { dark } from '@clerk/themes';

export const clerkAppearance = {
  baseTheme: dark,
  variables: {
    colorPrimary: '#4F46E5', // Indigo-600
    colorText: '#f8fafc',
    colorBackground: '#020617', // Slate-950
    borderRadius: '1.5rem',
  },
  elements: {
    card: 'bg-glass border-2 border-white/10 shadow-3xl',
    headerTitle: 'uppercase font-black tracking-tight text-3xl',
    headerSubtitle: 'font-medium text-slate-400',
    formButtonPrimary: 'rounded-full h-14 bg-indigo-600 hover:bg-slate-900 font-black uppercase tracking-widest text-[10px] transition-all',
    formFieldInput: 'rounded-[1.2rem] h-12 bg-slate-900 border-none px-6 focus:ring-1 focus:ring-indigo-600/50',
    footerActionLink: 'text-indigo-600 font-black tracking-tight',
    socialButtonsBlockButton: 'rounded-[1.2rem] h-12 border-2 border-white/5 hover:bg-slate-900 transition-all',
    dividerLine: 'bg-white/5',
    dividerText: 'text-slate-500 uppercase font-black text-[10px] tracking-widest',
  }
};
