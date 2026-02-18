import Image from "next/image";

/**
 * SafeImage - A wrapper around Next.js Image component that ensures alt text is always provided
 * This prevents "Image is missing required alt property" console errors
 */
export default function SafeImage({ 
  alt,
  src,
  ...props 
}) {
  return (
    <Image
      src={src}
      alt={alt || "Image"}
      {...props}
    />
  );
}
