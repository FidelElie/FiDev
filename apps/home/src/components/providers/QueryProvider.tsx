import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";
import { type JSX, Show } from "solid-js";

const queryClient = new QueryClient();

export const QueryProvider = (props: QueryProviderProps) => {
	return (
		<QueryClientProvider client={queryClient}>
			{props.children}
			<Show when={props.devtools}>
				<SolidQueryDevtools />
			</Show>
		</QueryClientProvider>
	);
};

export type QueryProviderProps = {
	children: JSX.Element;
	devtools?: boolean;
};
