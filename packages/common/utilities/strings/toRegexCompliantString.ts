/**
 * Escape a string to be regex compliant modified from
 * @url https://stackoverflow.com/questions/3115150/how-to-escape-regular-expression-special-characters-using-javascript
 * @param text
 * @returns regex complaint string
 */
export const toRegexCompliantString = (text: string) => {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
