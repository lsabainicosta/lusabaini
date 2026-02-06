"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useTransitionNavigation } from "@/components/motion/TransitionContext";

type Props = {
  className?: string;
  fallbackHref?: string;
};

export default function BackButton({ className, fallbackHref = "/my-work" }: Props) {
  const router = useRouter();
  const { navigate } = useTransitionNavigation();

  const handleBack = () => {
    if (navigate) {
      navigate(fallbackHref);
      return;
    }
    router.push(fallbackHref);
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
