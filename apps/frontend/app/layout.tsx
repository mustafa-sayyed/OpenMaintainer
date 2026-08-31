import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OpenMaintainer | Your repo deserves a co-maintainer',
  description: 'Autonomous AI agents for open source maintainers.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
