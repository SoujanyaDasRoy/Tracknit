import { redirect } from "next/navigation";

export default async function MusicPageRedirect() {
  redirect("/library/royalty-free-music");
}
