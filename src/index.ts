import fetchToCurl from "fetch-to-curl";

type Logger = (message?: any, ...optionalParams: any[]) => void
const originalFetch = fetch

let isEnabled = true
let localLogger: Logger = console.log
export const setEnabled = (enabled: boolean) => isEnabled = enabled
export const setLogger = (logger: Logger) => {
    localLogger = logger
}

const proxyFetch = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
    if (!isEnabled) return originalFetch(input, init)
    if (typeof input === "string") {
        if (input.startsWith('http://localhost:8081') || input.startsWith('http://localhost:8082')) return originalFetch(input, init)
    }
    localLogger('REQUEST---------------------------->')
    localLogger(fetchToCurl({
        url: input.toString(),
        body: init?.body,
        method: init?.method,
        headers: init?.headers
    }))
    localLogger(JSON.stringify({
        url: input,
        method: init?.method,
        headers: init?.headers,
        body: init?.body,
    }, undefined, 2))

    const response = await originalFetch(input, init)
    const json = await response.json()
    localLogger('RESPONSE----------------------------<')
    localLogger(JSON.stringify({
        url: input,
        status: response.status,
        data: json,
    }, undefined, 2))
    response.json = async (): Promise<any> => json
    return response
}

global.fetch = proxyFetch
