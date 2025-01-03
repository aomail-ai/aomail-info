import slugify from "slugify";

export const formatDate = (dateString: string, locales = "en-US") => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locales, {
        year: "numeric",
        month: "short",
        day: "numeric"
    }).format(date);
};

export const getSlug = (title: string) => {
    return slugify(title, {
        lower: true,
        trim: true
    });
};