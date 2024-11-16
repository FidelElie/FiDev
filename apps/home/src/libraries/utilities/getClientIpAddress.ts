export const getClientIpAddress = (request: Request) => {
	const { headers } = request;

	const forwarded = headers.get("x-forwarded-for");

	if (forwarded) { return forwarded; }

	return headers.get('cf-connecting-ip') || headers.get('x-real-ip') || null;
}
