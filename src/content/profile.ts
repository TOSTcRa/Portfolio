import { profileSchema, type Profile } from "./schema";
import fallback from "./profile.fallback.json";
import generated from "./profile.generated.json";

export function loadProfile(): Profile {
  const parsed = profileSchema.safeParse(generated);
  return parsed.success ? parsed.data : profileSchema.parse(fallback);
}
