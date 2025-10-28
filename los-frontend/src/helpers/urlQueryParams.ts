export default function urlQueryParams(key: string) {
    return new URLSearchParams(window.location.search).get(key) || null;
}