/**
 * Auth Group Layout
 * Intentionally bare — no Navbar, no Footer, no AudioPlayer.
 * The (auth) route group is isolated so social login pages
 * render full-screen without any competing chrome.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
