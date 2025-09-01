import { Input } from "@/components/ui/input";
import { formatNumberWithCommas, parseNumberInput } from "@/lib/utils";

interface IMoneyInputProps {
    id?: string;
    placeholder?: string;
    value: number | undefined;
    onChange: (value: number | undefined) => void;
}

export const MoneyInput = ({ id, placeholder, value, onChange }: IMoneyInputProps) => {
    return (
        <Input
            type="text"
            value={formatNumberWithCommas(value ?? 0)}
            onChange={(e) => {
                const value = parseNumberInput(e.target.value) || undefined;
                onChange(value);
            }}
            {...(id && { id })}
            {...(placeholder && { placeholder })}
        />
    )
}