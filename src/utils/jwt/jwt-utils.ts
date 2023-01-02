export function parseJwt<T>(token: string): T | null {
    if (!token) return null;
    const b64Token = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(b64DecodeUnicode(b64Token)) as T;
}

export function tryParseJwt<T>(token: string, warn: boolean = true): T | null {
    try {
        return parseJwt<T>(token);
    } catch (err) {
        if (warn) console.warn(err);
        return null;
    }
}

function b64DecodeUnicode(str: string) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(window.atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}
