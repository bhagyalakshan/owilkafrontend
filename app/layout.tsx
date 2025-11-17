import "../styles/globals.css";

export const metadata = {
  title: "Owilka",
  description: "Next.js template",
  icons: {
    icon: '/assets/fav.png',
  },
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
