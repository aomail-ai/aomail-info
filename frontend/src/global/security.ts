export async function fetchWithToken(
    url: string,
    options: RequestInit = {}
): Promise<Response | void> {
    try {
        const response = await fetch(url, {
            ...options,
            credentials: "include" // Include cookies in requests
        });

        if (response.status === 401) {
            // Redirect to the login page if the user is unauthorized
            window.location.href = "/not-authorized";
        }

        return response;
    } catch (error) {
        console.error("Error in fetchWithToken:", error);
        return;
    }
}
