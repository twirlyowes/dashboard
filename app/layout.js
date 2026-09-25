import './globals.css';

export const metadata = {
  title: 'Pixel Villa Staff Dashboard',
  description: 'Internal staff dashboard for Pixel Villa Support.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
