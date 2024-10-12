export function getPath(path: string, params?: Record<string, string>) {
    if (!params) {
        return path;
    }
    return path
        .split("/")
        .map((segment) => {
            if (segment.startsWith(":")) {
                const key = segment.slice(1);
                return params[key as keyof typeof params] || segment;
            }
            return segment;
        })
        .join("/");
}
