import Link from "next/link";
import type { FC } from "react";

const Logo: FC = () => {
  return (
    <Link href="/">
      <div className="relative flex flex-col items-center select-none">
        {/* Partie structurée */}
        <span className="text-4xl font-bold tracking-tight text-foreground">
          TECHNO
        </span>

        {/* Partie chaotique - Ajusté pour meilleure lisibilité */}
        <span className="relative -mt-4 -mr-32 -rotate-6 text-xl text-primary font-bold font-marker tracking-wider flex">
          <span className="inline-block transform rotate-6 -translate-y-1">
            G
          </span>
          <span className="inline-block transform -rotate-5">O</span>
          <span className="inline-block transform rotate-4 -translate-y-1">
            R
          </span>
          <span className="inline-block transform -rotate-3">A</span>
          <span className="inline-block transform rotate-6">F</span>
          <span className="inline-block transform -rotate-5 -translate-y-1">
            I
          </span>
        </span>
      </div>
    </Link>
  );
};

export default Logo;
