export const resolveProductImage = (image) => {
  if (!image) return '/noimage.png'
  if (/^https?:\/\//i.test(image)) return image
  return `${import.meta.env.VITE_API_BASE_URL}${image}`
}
