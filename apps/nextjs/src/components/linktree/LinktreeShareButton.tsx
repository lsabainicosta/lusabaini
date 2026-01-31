"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Share, Link as LinkIcon, Mail, Upload } from "lucide-react";
import {
  SiX,
  SiFacebook,
  SiWhatsapp,
  SiLinkedin,
  SiMessenger,
} from "react-icons/si";

const SnapchatIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path
      fill="#fff"
      d="M18.78 15.392c-.058-.193-.337-.329-.337-.329l-.07-.036a5.4 5.4 0 0 1-1.224-.802 4.2 4.2 0 0 1-.71-.809 3 3 0 0 1-.391-.806c-.026-.104-.022-.146 0-.2a.3.3 0 0 1 .097-.11c.157-.111.41-.275.565-.375.135-.087.25-.162.318-.21.218-.152.368-.308.456-.476a.82.82 0 0 0 .039-.69c-.12-.317-.416-.505-.792-.505q-.126 0-.255.027c-.216.047-.42.124-.59.19a.018.018 0 0 1-.026-.018c.019-.423.04-.992-.008-1.533a3.8 3.8 0 0 0-.307-1.26 3.4 3.4 0 0 0-.548-.821 3.4 3.4 0 0 0-.867-.697 4 4 0 0 0-2.022-.515 4 4 0 0 0-2.02.515c-.45.257-.737.547-.868.697-.168.193-.383.46-.548.82s-.266.771-.307 1.261a12 12 0 0 0-.009 1.533c0 .014-.012.024-.026.018a4 4 0 0 0-.59-.19 1.2 1.2 0 0 0-.256-.027c-.375 0-.67.188-.791.505a.82.82 0 0 0 .039.69c.089.168.237.324.455.476.067.048.183.123.318.21.151.099.397.258.556.368a.3.3 0 0 1 .106.117c.023.055.027.097-.002.208a3 3 0 0 1-.39.798c-.19.29-.43.561-.709.809-.347.306-.76.577-1.224.802l-.077.04s-.278.142-.33.325c-.078.271.129.525.339.661.344.223.763.342 1.006.407q.102.027.185.052a.4.4 0 0 1 .16.093c.047.06.052.136.07.22.025.143.085.32.262.442.194.133.44.143.752.156.326.012.732.027 1.197.182.215.07.411.191.636.33.472.29 1.06.651 2.062.651 1.004 0 1.596-.362 2.07-.654.226-.137.419-.257.63-.326.465-.154.87-.17 1.197-.182.312-.012.558-.02.752-.156.19-.13.243-.325.268-.47.014-.072.023-.138.064-.19a.36.36 0 0 1 .154-.09q.085-.027.192-.055c.243-.065.548-.142.92-.351.446-.254.477-.565.43-.72Z"
    ></path>
    <path
      fill="#000"
      d="M19.168 15.242c-.1-.269-.288-.412-.502-.531a1 1 0 0 0-.108-.057l-.195-.099c-.667-.354-1.19-.801-1.55-1.33a3 3 0 0 1-.267-.472c-.03-.09-.03-.14-.007-.185a.3.3 0 0 1 .086-.089c.115-.076.233-.153.314-.204.143-.093.257-.167.329-.217.275-.191.466-.395.586-.623.17-.32.19-.688.06-1.032-.18-.478-.634-.775-1.18-.775q-.173 0-.344.038l-.089.02a10 10 0 0 0-.031-1.01c-.103-1.195-.521-1.82-.957-2.32a3.8 3.8 0 0 0-.974-.784A4.4 4.4 0 0 0 12.11 5c-.815 0-1.565.192-2.227.57a3.8 3.8 0 0 0-.975.785c-.436.499-.854 1.125-.957 2.32-.029.338-.036.685-.032 1.01l-.089-.02a1.6 1.6 0 0 0-.343-.038c-.547 0-1 .297-1.18.775-.13.344-.11.71.06 1.031.12.228.312.432.586.624.073.051.186.125.329.217.078.05.19.123.301.197a.3.3 0 0 1 .098.097c.023.047.023.098-.012.193-.058.13-.143.287-.262.462-.354.518-.861.957-1.507 1.307-.343.182-.698.303-.848.711-.114.308-.039.66.248.955q.14.152.364.275c.353.195.653.29.889.356a.6.6 0 0 1 .18.08c.105.092.09.23.23.434.084.126.182.212.262.268.293.202.624.215.973.229.316.012.674.026 1.082.16.17.056.346.165.549.29.489.301 1.16.712 2.28.712 1.122 0 1.795-.414 2.288-.715.203-.124.378-.232.542-.286.408-.135.766-.149 1.082-.161.35-.014.678-.027.973-.23.092-.063.208-.167.3-.326.1-.17.099-.291.193-.373a.6.6 0 0 1 .17-.077 4 4 0 0 0 .9-.36c.16-.087.284-.183.382-.292l.005-.004c.267-.292.336-.632.224-.934m-.996.535c-.608.336-1.012.3-1.326.501-.267.173-.11.543-.303.677-.239.165-.943-.011-1.852.288-.75.249-1.23.961-2.58.961-1.354 0-1.82-.71-2.58-.96-.91-.3-1.615-.124-1.853-.29-.193-.133-.036-.503-.303-.676-.313-.202-.718-.166-1.326-.501-.387-.214-.168-.346-.039-.408 2.203-1.065 2.553-2.712 2.57-2.836.019-.147.04-.264-.123-.415-.157-.146-.855-.578-1.048-.712-.321-.224-.461-.447-.357-.722.072-.19.25-.261.437-.261q.089 0 .175.019c.352.076.693.253.89.3q.042.01.073.01c.105 0 .141-.053.134-.174-.022-.385-.078-1.134-.016-1.836.083-.963.394-1.441.763-1.865.178-.202 1.011-1.083 2.604-1.083 1.597 0 2.426.88 2.604 1.083.369.423.68.9.763 1.865.061.702.009 1.451-.016 1.836-.009.126.03.174.134.174a.3.3 0 0 0 .073-.01c.197-.047.538-.224.89-.3a1 1 0 0 1 .175-.02c.187 0 .365.073.437.262.104.275-.037.498-.357.722-.193.134-.891.566-1.048.712-.163.15-.142.267-.122.415.015.124.366 1.77 2.569 2.836.125.062.345.194-.042.408"
    ></path>
  </svg>
);

import Image from "next/image";
import { sanityImageLoader } from "@/lib/sanityImageLoader";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

type LinktreeShareButtonProps = {
  name?: string;
  username?: string;
  profileImage?: {
    url?: string;
    alt?: string;
  };
  children: React.ReactNode;
};

export default function LinktreeShareButton({
  name,
  username,
  profileImage,
  children,
}: LinktreeShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Set mounted state and check for native share API on client only to avoid hydration mismatch
  useEffect(() => {
    // Using queueMicrotask to avoid cascading renders lint warning
    queueMicrotask(() => {
      setMounted(true);
      setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share);
    });
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    if (open) {
      // Blur the trigger button before opening to prevent aria-hidden focus conflict
      triggerRef.current?.blur();
    }
    setIsOpen(open);
  }, []);

  const getShareUrl = () => window.location.href;

  const handleCopyLink = useCallback(async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }, []);

  const handleShare = useCallback((urlTemplate: string) => {
    const url = getShareUrl();
    const shareUrl = urlTemplate.replace("{url}", encodeURIComponent(url));
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }, []);

  const handleNativeShare = useCallback(async () => {
    const url = getShareUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: name || "Check this out",
          url,
        });
      } catch {
        // User cancelled or share failed
      }
    }
  }, [name]);

  const handleEmailShare = useCallback(() => {
    const url = getShareUrl();
    const subject = encodeURIComponent(name || "Check this out");
    const body = encodeURIComponent(url);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }, [name]);

  const shareOptions = [
    {
      label: copied ? "Copied!" : "Copy Link",
      icon: LinkIcon,
      onClick: handleCopyLink,
      color: "bg-slate-200 text-slate-700",
    },
    {
      label: "X",
      icon: SiX,
      onClick: () => handleShare("https://twitter.com/intent/tweet?url={url}"),
      color: "bg-black text-white",
    },
    {
      label: "Facebook",
      icon: SiFacebook,
      onClick: () =>
        handleShare("https://www.facebook.com/sharer/sharer.php?u={url}"),
      color: "bg-[#1877F2] text-white",
    },
    {
      label: "WhatsApp",
      icon: SiWhatsapp,
      onClick: () => handleShare("https://wa.me/?text={url}"),
      color: "bg-[#25D366] text-white",
    },
    {
      label: "LinkedIn",
      icon: SiLinkedin,
      onClick: () =>
        handleShare(
          "https://www.linkedin.com/sharing/share-offsite/?url={url}",
        ),
      color: "bg-[#0A66C2] text-white",
    },
    {
      label: "Messenger",
      icon: SiMessenger,
      onClick: () =>
        handleShare(
          "https://www.facebook.com/dialog/send?link={url}&app_id=291494419107518&redirect_uri={url}",
        ),
      color: "bg-gradient-to-br from-[#00B2FF] to-[#006AFF] text-white",
    },
    {
      label: "Snapchat",
      icon: SnapchatIcon,
      onClick: () => handleShare("https://www.snapchat.com/share?url={url}"),
      color: "bg-[#FFFC00]",
    },
    {
      label: "Email",
      icon: Mail,
      onClick: handleEmailShare,
      color: "bg-slate-500 text-white",
    },
    {
      label: "More",
      icon: Upload,
      onClick: handleNativeShare,
      color: "bg-slate-300 text-slate-700",
      hidden: !canNativeShare,
    },
  ];

  // Static button for SSR - matches the interactive button styling
  const shareButton = (
    <button
      ref={mounted ? triggerRef : undefined}
      className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md sm:right-6 sm:top-6 sm:h-12 sm:w-12"
      aria-label="Share"
      onClick={mounted ? undefined : undefined}
    >
      <Share className="h-5 w-5 sm:h-6 sm:w-6" />
    </button>
  );

  // Render static button during SSR to avoid hydration mismatch with Radix IDs
  if (!mounted) {
    return (
      <>
        {children}
        {shareButton}
      </>
    );
  }

  return (
    <>
      {/* Page content - rendered outside Drawer to avoid aria-hidden issues */}
      {children}

      <Drawer open={isOpen} onOpenChange={handleOpenChange}>
        {/* Trigger button - positioned by parent */}
        <DrawerTrigger asChild>
          <button
            ref={triggerRef}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md sm:right-6 sm:top-6 sm:h-12 sm:w-12"
            aria-label="Share"
          >
            <Share className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </DrawerTrigger>

        <DrawerContent className="mx-auto max-w-lg rounded-t-3xl">
        <DrawerHeader className="pb-2">
          <DrawerTitle className="text-center text-lg">Share</DrawerTitle>
          <DrawerDescription className="sr-only">
            Share this page via social media or copy the link
          </DrawerDescription>
        </DrawerHeader>

        {/* Preview Card */}
        <div className="mx-6 mb-6 overflow-hidden rounded-2xl bg-slate-800 p-6">
          <div className="flex flex-col items-center">
            {profileImage?.url && (
              <div className="relative mb-3 h-16 w-16 overflow-hidden rounded-full ring-2 ring-white/20">
                <Image
                  loader={sanityImageLoader}
                  src={profileImage.url}
                  alt={profileImage.alt || name || "Profile"}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            )}
            {name && <p className="text-lg font-semibold text-white">{name}</p>}
            {username && <p className="text-sm text-white/60">@{username}</p>}
          </div>
        </div>

        {/* Share Options */}
        <div className="overflow-x-auto pb-8">
          <div className="flex items-center px-6">
            {shareOptions
              .filter((option) => !("hidden" in option && option.hidden))
              .map((option, index, arr) => {
                const Icon = option.icon;
                const isLast = index === arr.length - 1;
                return (
                  <button
                    key={option.label}
                    onClick={option.onClick}
                    type="button"
                    className={`flex shrink-0 flex-col items-center gap-2 ${isLast ? "" : "mr-4"}`}
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full ${option.color} transition-transform hover:scale-105`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="w-16 truncate text-center text-xs text-slate-600">
                      {option.label}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
    </>
  );
}
