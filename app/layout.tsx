import "../styles/globals.css";

export const metadata = {
  title: "Migrated Project",
  description: "Next.js template",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
