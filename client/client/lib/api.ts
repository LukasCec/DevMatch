export const authFetch = async (url: string, options: RequestInit = {}) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers = {
        ...(options.headers || {}),
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
    };

    const res = await fetch(url, { ...options, headers });
    return res.json();
};
