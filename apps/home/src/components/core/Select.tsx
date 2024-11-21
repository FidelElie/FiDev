import type { JSX } from "solid-js";

import { Select as KolbalteSelect } from "@kobalte/core/select";
import { twMerge } from "tailwind-merge";

export const BaseSelect = <T,>(props: SelectProps<T>) => {
	return (
		<KolbalteSelect<T>
			value={props.values}
			onChange={props.onChange}
			options={props.options}
			placeholder={props.placeholder}
			itemComponent={(entry) => (
				<KolbalteSelect.Item item={entry.item} class={props.itemClass}>
					{props.itemComponent(entry.item.rawValue)}
				</KolbalteSelect.Item>
			)}
			multiple
			sameWidth
		>
			<KolbalteSelect.Label class={props.labelClass}>
				{props.label}
			</KolbalteSelect.Label>
			<KolbalteSelect.Trigger class={props.class}>
				<KolbalteSelect.Value>
					{(state) => props.valueComponent(state.selectedOptions() as T[])}
				</KolbalteSelect.Value>
			</KolbalteSelect.Trigger>
			<KolbalteSelect.Portal>
				<KolbalteSelect.Content
					class={twMerge("w-[--kb-popper-anchor-width]", props.listClass)}
				>
					<KolbalteSelect.Listbox />
				</KolbalteSelect.Content>
			</KolbalteSelect.Portal>
		</KolbalteSelect>
	);
};

export const Select = Object.assign(BaseSelect, {
	SelectedIndicator: KolbalteSelect.ItemIndicator,
});

export type SelectProps<T> = {
	options: T[];
	values: T[];
	onChange: (values: T[]) => void;
	placeholder?: JSX.Element;
	label?: JSX.Element;
	itemComponent: (entry: T) => JSX.Element;
	valueComponent: (value: T[]) => JSX.Element;
	class?: string;
	itemClass?: string;
	labelClass?: string;
	listClass?: string;
};
