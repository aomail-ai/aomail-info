export const formatDate = (dateString: string, locales = "en-US") => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locales, {
        year: "numeric",
        month: "short",
        day: "numeric"
    }).format(date);
};

export const getSlug = (title: string) => {
    return title.toLowerCase().replace(/\s+/g, "-");
};