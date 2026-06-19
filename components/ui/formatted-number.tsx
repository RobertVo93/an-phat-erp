"use client"

import { Input } from "@/components/ui/input"
import { cn, formatNumberWithCommas, formatSystemNumber, parseSystemNumberInput } from "@/lib/utils"
import { Language } from "@/types"
import { FocusEventHandler } from "react"

type FormattedNumberBaseProps = {
	className?: string
	locale?: Language
	value?: number | ""
}

type FormattedNumberInputProps = FormattedNumberBaseProps & {
	as: "input"
	onValueChange: (value: number) => void
	onEmptyValue?: () => void
	onBlur?: FocusEventHandler<HTMLInputElement>
	placeholder?: string
	id?: string
	disabled?: boolean
	min?: number
	max?: number
	allowEmpty?: boolean
	autoFocus?: boolean
}

type FormattedNumberDivProps = FormattedNumberBaseProps & {
	as?: "div"
}

type FormattedNumberSpanProps = FormattedNumberBaseProps & {
	as?: "span"
}

type FormattedNumberProps = FormattedNumberInputProps | FormattedNumberDivProps | FormattedNumberSpanProps

const clampValue = (value: number, min?: number, max?: number): number => {
	if (min !== undefined && value < min) return min
	if (max !== undefined && value > max) return max
	return value
}

export function FormattedNumber(props: FormattedNumberProps) {
	const locale = props.locale || "vi"

	if (props.as === "input") {
		return (
			<Input
				id={props.id}
				disabled={props.disabled}
				type="text"
				className={props.className}
				placeholder={props.placeholder}
				value={props.allowEmpty && props.value === "" ? "" : !props.value ? (props.min ?? "0") : formatNumberWithCommas(props.value)}
				onBlur={props.onBlur}
				onChange={(e) => {
					const rawValue = e.target.value.trim()

					if (props.allowEmpty && rawValue === "") {
						props.onEmptyValue?.()
						return
					}

					const parsedValue = parseSystemNumberInput(rawValue)
					props.onValueChange(clampValue(parsedValue, props.min, props.max))
				}}
				autoFocus={props.autoFocus}
			/>
		)
	}
	else if (props.as === "span") {
		return (
			<span className={cn("text-base md:text-sm", props.className)}>
				{formatSystemNumber(typeof props.value === "number" ? props.value : 0, locale)}
			</span>
		)
	}

	return (
	<div className={cn("w-full text-base md:text-sm", props.className)}>
			{formatSystemNumber(typeof props.value === "number" ? props.value : 0, locale)}
		</div>
	)
}
