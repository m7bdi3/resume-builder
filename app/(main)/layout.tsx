import { Navbar } from "@/components/navbar/Navbar";

export default function ResumesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
