interface Props {
  title: string;
  colorHex?: string;
}

export const SectionHeader = ({ title, colorHex }: Props) => (
  <>
    <hr
      style={{
        borderColor: colorHex,
      }}
    />
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
