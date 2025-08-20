import { redirect } from "next/navigation";
import { getPosterAuthUrl } from "@/lib/poster-service";

export default async function PosterConnectPage() {
  const url = await getPosterAuthUrl();
  if (!url) {
    return (
      <div className="p-6 text-sm text-red-400">
        Poster OAuth is not configured. Please set POSTER_INTEGRATION, POSTER_INTEGRATION_ACCOUNT, POSTER_APP_ID, POSTER_APP_SECRET, POSTER_REDIRECT_URI.
      </div>
    );
  }
  redirect(url);
}
