"use client";

import dynamic from "next/dynamic";

const AudioPlayer = dynamic(() => import("@/components/AudioPlayer"), {
  ssr: false,
});

const CartDrawer = dynamic(() => import("@/components/library/CartDrawer"), {
  ssr: false,
});

export default function GlobalOverlays() {
  return (
    <>
      <AudioPlayer />
      <CartDrawer />
    </>
  );
}
