export const DevCode = (props: { children: any; disable?: boolean }) => {
	if (!import.meta.env.DEV || props.disable) { return null; }

	return (
		<pre>
			<code>
				{JSON.stringify(props.children, null, 2)}
			</code>
		</pre>
	)
}
