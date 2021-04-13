import fetchToCurl from "fetch-to-curl";

const originalFetch = fetch

const proxyFetch = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
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

export {}
