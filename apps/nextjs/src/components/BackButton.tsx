"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type Props = {
  className?: string;
  fallbackHref?: string;
};

export default function BackButton({ className, fallbackHref = "/my-work" }: Props) {
  const router = useRouter();

  const handleBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      router.back();
    } else {
      // Fallback to specified href if no history
      router.push(fallbackHref);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={className}
      type="button"
    >
      <ArrowLeft className="inline-block mr-2 h-4 w-4" />
      Back
    </button>
  );
}
