import { createQueryAdapter } from "nuqs/server";
import { parseAsString } from "nuqs";

export const queryAdapter = createQueryAdapter({
  category: parseAsString.withDefault(""),
}); 