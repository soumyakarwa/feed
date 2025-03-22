export const getSenderName = (name: string) => {
	return name.split('<')[0].trim().toUpperCase().replace(/\s+/g, '');
};
