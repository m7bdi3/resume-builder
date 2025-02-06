import Image from "next/image";

export function BackgroundImages() {
  const images = [
    {
      src: "/assets/Asset 1.svg",
      alt: "Background shape 3",
      width: 1700,
      height: 40,
    },
  ];

  return (
    <>
      {images.map((img, index) => (
        <Image
          key={index}
          src={img.src || "/placeholder.svg"}
          alt={img.alt}
          width={img.width}
          height={img.height}
          className={` absolute -translate-x-1/4 lg:translate-x-1/2 animate-float`}
        />
      ))}
    </>
  );
}
