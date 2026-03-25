import type { Metadata } from 'next';
import { DM_Sans, Sora } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-inter', display: 'swap', weight: ['400', '500', '600', '700'] });
const sora = Sora({ subsets: ['latin'], variable: '--font-sora', display: 'swap' });

export const metadata: Metadata = {
  title: 'Debate Dock — Multi-Model AI Deliberation',
  description:
    'Assemble a council of AI minds. Assign personas, run structured debates, and let the Chairman synthesize the truth.',
  openGraph: {
    title: 'Debate Dock',
    description: 'Multi-model AI deliberation with personas and structured debate rounds.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${sora.variable}`}>
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
