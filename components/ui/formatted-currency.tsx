"use client"

import { Input } from "@/components/ui/input"
import { cn, formatLargeCurrency, formatCurrency, formatNumberWithCommas, parseSystemNumberInput } from "@/lib/utils"
import { Language } from "@/types"

type FormattedCurrencyBaseProps = {
	className?: string
	locale?: Language
	value?: number
	largeCurrency?: boolean
}

type FormattedCurrencyInputProps = FormattedCurrencyBaseProps & {
	as: "input"
	onValueChange: (value: number) => void
	placeholder?: string
	id?: string
	disabled?: boolean
	min?: number
	max?: number
}

type FormattedCurrencyDivProps = FormattedCurrencyBaseProps & {
	as?: "div"
}

type FormattedCurrencySpanProps = FormattedCurrencyBaseProps & {
	as?: "span"
}

type FormattedCurrencyProps = FormattedCurrencyInputProps | FormattedCurrencyDivProps | FormattedCurrencySpanProps

const clampValue = (value: number, min?: number, max?: number): number => {
	if (min !== undefined && value < min) return min
	if (max !== undefined && value > max) return max
	return value
}

export function FormattedCurrency(props: FormattedCurrencyProps) {
	const locale = props.locale || "vi"
	const ammount = props.largeCurrency ? formatLargeCurrency(props.value ?? 0, locale) : formatCurrency(props.value ?? 0)

	if (props.as === "input") {
		return (
			<Input
				id={props.id}
				disabled={props.disabled}
				type="text"
				className={props.className}
				placeholder={props.placeholder}
				value={!props.value ? (props.min ?? "0") : formatNumberWithCommas(props.value)}
				onChange={(e) => {
					const rawValue = e.target.value.trim()
					const parsedValue = parseSystemNumberInput(rawValue)
					props.onValueChange(clampValue(parsedValue, props.min ?? 0, props.max))
				}}
			/>
		)
	}
	else if (props.as === "span") {
		return (
			<span className={cn("text-base md:text-sm", props.className)}>
				{ammount}
			</span>
		)
	}

	return (
		<div className={cn("w-full text-base md:text-sm", props.className)}>
			{ammount }
		</div>
	)
}
