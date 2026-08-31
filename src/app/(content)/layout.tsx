import "@/styles/content-pages.css";
import { CookieNotice } from "@/components/content/akmendarba/cookie-notice";

export default function ContentLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}<CookieNotice /></>;
}
