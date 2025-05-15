import type { FC } from "react";

type Props = {
  name: string;
};

export const CategoryBadge: FC<Props> = ({ name }) => {
  return (
    <span className="inline-block bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded">
      {name}
    </span>
  );
};
