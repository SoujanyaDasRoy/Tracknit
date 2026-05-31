import { redirect } from "next/navigation";

export default async function SfxPageRedirect() {
  redirect("/library/sound-effects");
}
