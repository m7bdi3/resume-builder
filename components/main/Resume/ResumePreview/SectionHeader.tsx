interface Props {
  title: string;
  colorHex?: string;
  addHr?: boolean;
}

export const SectionHeader = ({ title, colorHex, addHr }: Props) => (
  <>
    {addHr && (
      <hr
        style={{
          borderColor: colorHex,
        }}
      />
    )}
    <h2
      className="text-lg font-semibold my-2"
      style={{
        color: colorHex,
      }}
    >
      {title}
    </h2>
  </>
);
