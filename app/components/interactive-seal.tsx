import Image from "next/image";

type InteractiveSealProps = {
  alt: string;
  className: string;
  height: number;
  src: string;
  width: number;
};

export function InteractiveSeal({
  alt,
  className,
  height,
  src,
  width,
}: InteractiveSealProps) {
  return (
    <div className={`seal-chip ${className}`}>
      <Image
        alt={alt}
        className="mark-image"
        height={height}
        priority
        src={src}
        width={width}
      />
    </div>
  );
}
