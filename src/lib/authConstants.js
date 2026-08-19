export const ADMIN_ROLES = ["admin", "super_admin", "owner"];

export const PUBLIC_PATHS = ["/login"];

export const buildLoginUrl = (path, reason = "auth_required") => {
  const params = new URLSearchParams();
  params.set("reason", reason);
  if (path && path !== "/") {
    params.set("redirect", path);
  }
  return `/login?${params.toString()}`;
};

export const validateRedirectUrl = (value) => {
  if (!value || typeof value !== "string") return "/dashboard";
  if (!value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  try {
    const parsed = new URL(value, "http://localhost");
    if (parsed.origin !== "http://localhost") return "/dashboard";
    return value;
  } catch {
    return "/dashboard";
  }
};
