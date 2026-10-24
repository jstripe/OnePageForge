import manifest from "@/lib/media-manifest.json";

type Key = keyof typeof manifest;

export function Photo({ name, alt, priority = false, sizes = "(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw", className = "" }: { name: Key; alt: string; priority?: boolean; sizes?: string; className?: string }) {
  const m = manifest[name];
  const base = `/media/${m.dir}/${name}`;
  return (
    <>
      {priority && <link rel="preload" as="image" type="image/avif" imageSrcSet={`${base}-640.avif 640w, ${base}-1280.avif 1280w, ${base}-1920.avif 1920w`} imageSizes={sizes} fetchPriority="high" />}
    <picture>
      <source type="image/avif" srcSet={`${base}-640.avif 640w, ${base}-1280.avif 1280w, ${base}-1920.avif 1920w`} sizes={sizes} />
      <source type="image/webp" srcSet={`${base}-640.webp 640w, ${base}-1280.webp 1280w, ${base}-1920.webp 1920w`} sizes={sizes} />
      <img
        src={`${base}-1280.webp`}
        alt={alt}
        width={1280}
        height={Math.round(1280 / m.ratio)}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        {...(priority ? { fetchPriority: "high" as const } : {})}
        style={{ backgroundImage: `url(${m.blur})`, backgroundSize: "cover" }}
        className={className}
      />
    </picture>
    </>
  );
}
