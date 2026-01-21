import "../styles/globals.css";
import WhatsAppButton from "../components/WhatsAppButton";

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
    <html lang="en" className="scroll-smooth">
      <body className="overflow-x-hidden">
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
