// src/app/layout.tsx
import "./globals.css";
import { ThemeProvider } from "@/utils/theme-context";
import ReduxProvider from "@/store/provider";
import NavBar from "@/utils/NavBar";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider>
      <html lang="en">
        <body>
          <ReduxProvider>
            <NavBar />
            {children}
          </ReduxProvider>
        </body>
      </html>
    </ThemeProvider>
  );
}
