import { API_BASE_URL } from "./constants.ts";
import { fetchWithToken } from "./security";
import { FetchDataResult } from "./types";

export async function getData(path: string, headers?: Record<string, string>): Promise<FetchDataResult> {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...headers
        }
    };

    const response = await fetchWithToken(`${API_BASE_URL}${path}`, requestOptions);

    if (!response) {
        return {
            success: false,
            error: "No server response"
        };
    }

    const data = await response.json();

    if (response.ok) {
        return {
            success: true,
            data: data
        };
    } else {
        return {
            success: false,
            error: data.error ? data.error : "Unknown error"
        };
    }
}


export async function postData(path: string, body: Record<string, never>): Promise<FetchDataResult> {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    };
    const response = await fetchWithToken(`${API_BASE_URL}${path}`, requestOptions);

    if (!response) {
        return {
            success: false,
            error: "No server response"
        };
    }

    const data = await response.json();

    if (response.ok) {
        return {
            success: true,
            data: data
        };
    } else {
        return {
            success: false,
            error: data.error ? data.error : "Unknown error"
        };
    }
}

export async function deleteData(path: string, body?: never): Promise<FetchDataResult> {
    const requestOptions: RequestInit = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (body) {
        requestOptions.body = JSON.stringify(body);
    }

    const response = await fetchWithToken(`${API_BASE_URL}${path}`, requestOptions);

    if (!response) {
        return {
            success: false,
            error: "No server response"
        };
    }

    const data = await response.json();

    if (response.ok) {
        return {
            success: true,
            data: data
        };
    } else {
        return {
            success: false,
            error: data.error ? data.error : "Unknown error"
        };
    }
}

export async function putData(path: string, body: Record<string, never>): Promise<FetchDataResult> {
    const requestOptions = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    };

    const response = await fetchWithToken(`${API_BASE_URL}${path}`, requestOptions);

    if (!response) {
        return {
            success: false,
            error: "No server response"
        };
    }

    const data = await response.json();

    if (response.ok) {
        return {
            success: true,
            data: data
        };
    } else {
        return {
            success: false,
            error: data.error ? data.error : "Unknown error"
        };
    }
}