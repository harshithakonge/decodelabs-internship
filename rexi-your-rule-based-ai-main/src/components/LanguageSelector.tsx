import { LANGUAGES, type LanguageCode } from "@/chatbot/languages";

type Props = {
  value: LanguageCode;
  onChange: (code: LanguageCode) => void;
  label: string;
};

export function LanguageSelector({ value, onChange, label }: Props) {
  return (
    <label className="flex items-center gap-2">
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value as LanguageCode)}
        className="cursor-pointer rounded-full border border-panel-border bg-background/70 px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {LANGUAGES.map((language) => (
          <option key={language.code} value={language.code}>
            {language.label}
          </option>
        ))}
      </select>
    </label>
  );
}
