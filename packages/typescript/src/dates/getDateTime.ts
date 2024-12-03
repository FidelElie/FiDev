export const getDateTimeString = (dateLike: string | Date | number) => {
	const parsedDate = new Date(dateLike);

	return `${parsedDate.getFullYear()}-${parsedDate.getMonth() + 1}-${parsedDate.getDate()}`;
}
