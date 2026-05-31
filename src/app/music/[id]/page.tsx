import { redirect } from "next/navigation";

export default async function MusicDetailRedirect({ params }: { params: { id: string } }) {
  redirect(`/library/royalty-free-music/${params.id}`);
}
