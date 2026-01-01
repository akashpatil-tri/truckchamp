export function formatString(str: string): string {
  return str
    .trim()
    .replace(/[_-]+/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function getInitials(str: string): string {
  return str
    ?.split(" ")
    ?.map((word) => word.charAt(0).toUpperCase())
    ?.join("");
}

// Source - https://stackoverflow.com/a
// Posted by Abbos Tajimov, modified by community. See post 'Timeline' for change history
// Retrieved 2025-12-24, License - CC BY-SA 4.0

export const snakeToCamel = (str: string) =>
  str
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace("-", "").replace("_", "")
    );
