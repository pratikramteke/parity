import { revalidateTag, unstable_cache } from "next/cache"
import { cache } from "react"

export type ValidTags =
  | ReturnType<typeof getGlobalTag>
  | ReturnType<typeof getUserTag>
  | ReturnType<typeof getIdTag>

export const CACHE_TAGS = {
  products: "products",
  productViews: "productViews",
  subscription: "subscription",
  countries: "countries",
  countryGroups: "countryGroups",
} as const

export function getGlobalTag(tag: keyof typeof CACHE_TAGS) {
  return `global:${CACHE_TAGS[tag]}` as const
}

export function getUserTag(userId: string, tag: keyof typeof CACHE_TAGS) {
  return `user:${userId}-${CACHE_TAGS[tag]}` as const
}

export function getIdTag(id: string, tag: keyof typeof CACHE_TAGS) {
  return `id:${id}-${CACHE_TAGS[tag]}` as const
}

export function clearFullCache() {
  revalidateTag("*")
}

export function dbCache<TArgs extends unknown[], TResult>(
  cb: (...args: TArgs) => Promise<TResult>,
  { tags }: { tags: ValidTags[] }
): (...args: TArgs) => Promise<TResult> {
  return cache(
    unstable_cache(cb, undefined, { tags: [...tags, "*"] })
  )
}


export function revalidateDbCache({
  tag,
  userId,
  id,
}: {
  tag: keyof typeof CACHE_TAGS
  userId?: string
  id?: string
}) {
  revalidateTag(getGlobalTag(tag))
  if (userId != null) {
    revalidateTag(getUserTag(userId, tag))
  }
  if (id != null) {
    revalidateTag(getIdTag(id, tag))
  }
}
