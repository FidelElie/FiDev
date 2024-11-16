import type { JSX } from "solid-js";
import { Dynamic } from "solid-js/web";

import { QueryProvider, type QueryProviderProps } from "@/components/providers/QueryProvider";

export const withQueryProvider = <T,>(
	Component: (props: T) => JSX.Element,
	providerProps?: Partial<Omit<QueryProviderProps, "children">>
) => {
	return (props: any) => (
		<QueryProvider {...providerProps}>
			<Dynamic component={Component} {...props} />
		</QueryProvider>
	)
}
