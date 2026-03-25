import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LLM Council — Multi-Model AI Deliberation',
  description:
    'Assemble a council of AI minds. Assign personas, run structured debates, and let the Chairman synthesize the truth.',
  openGraph: {
    title: 'LLM Council',
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
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
