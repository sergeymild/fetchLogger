import fetchToCurl from "fetch-to-curl";

const originalFetch = fetch

let isEnabled = true
export const setEnabled = (enabled: boolean) => isEnabled = enabled

const proxyFetch = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
    if (!isEnabled) return originalFetch(input, init)
    if (typeof input === "string") {
        if (input.startsWith('http://localhost:8081') || input.startsWith('http://localhost:8082')) return originalFetch(input, init)
    }
    console.log('REQUEST---------------------------->')
    console.log(fetchToCurl({
        url: input.toString(),
        body: init?.body,
        method: init?.method,
        headers: init?.headers
    }))
    console.log(JSON.stringify({
        url: input,
        method: init?.method,
        headers: init?.headers,
        body: init?.body,
    }, undefined, 2))

    const response = await originalFetch(input, init)
    const json = await response.json()
    console.log('RESPONSE----------------------------<')
    console.log(JSON.stringify({
        url: input,
        status: response.status,
        data: json,
    }, undefined, 2))
    response.json = async (): Promise<any> => json
    return response
}

global.fetch = proxyFetch
