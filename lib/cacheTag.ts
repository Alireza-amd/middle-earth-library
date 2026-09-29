type CACHE_TAG =
  | "user"
  | "book"
  | "plan"
  | "purchase"
  | "author"
  | "category"
  | "reserve"
  | "comment"
  | "slider";

export function getGlobalTag(tag: CACHE_TAG) {
  return `global:${tag}` as const;
}

export function getIdTag(tag: CACHE_TAG, id: string) {
  return `id:${id}-${tag}` as const;
}

export function getUserTag(tag: CACHE_TAG, id: string) {
  return `user:${id}-${tag}` as const;
}
export function getBookTag(tag: CACHE_TAG, id: string) {
  return `book:${id}-${tag}` as const;
}
export function getAuthorTag(tag: CACHE_TAG, id: string) {
  return `author:${id}-${tag}` as const;
}
export function getCategoryTag(tag: CACHE_TAG, id: string) {
  return `category:${id}-${tag}` as const;
}
