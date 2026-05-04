type Props = {
  text: string;
  subtitle?: string;
};

export default function Title({ text, subtitle }: Props) {
  return (
    <div className="mb-4">
      <h2 style={{ fontWeight: 700, color: '#1a3a5c' }}>{text}</h2>
      {subtitle && <p className="text-muted mb-0">{subtitle}</p>}
    </div>
  );
}
