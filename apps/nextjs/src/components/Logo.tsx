import { Heart } from "lucide-react";
import TransitionLink from "@/components/motion/TransitionLink";

const Logo = () => {
  return (
    <TransitionLink href="/" className="flex items-center gap-2 group z-50">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black transition-transform group-hover:scale-105">
        <Heart className="w-5 h-5 text-white fill-white" />
      </div>
      <span className="text-[26px] font-medium leading-none tracking-[-0.06em] text-black font-sans">
        lu sabaini
      </span>
    </TransitionLink>
  );
};

export default Logo;
