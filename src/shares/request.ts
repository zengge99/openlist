import {Context} from "hono";


export async function Requests(c: Context,
                               Params: Record<string, string> | string = "",
                               APIUrl: string = "/api/login",
                               Method: string = "GET",
                               Direct: boolean = false, // true时直接回传URL
                               Header: Record<string, string> | undefined = undefined,
                               Finder: string = "json",
): Promise<any> {
    try {
        // 请求参数 =====================================================================
        let parma_str: string;
        const parma_url = new URL(APIUrl);
        if (typeof Params !== "string") {
            parma_str = new URLSearchParams(Params).toString();
            Object.keys(Params).forEach(key => {
                parma_url.searchParams.append(key, Params[key]);
            });
        } else parma_str = Params;
        // 执行请求 =====================================================================
        const default_inf = {'Content-Type': 'application/x-www-form-urlencoded'}
        const header_data: Record<string, any> = Header ? Header : default_inf
        if (Direct) return {url: Method == "GET" ? parma_url.href : APIUrl}
        const result_data: Response = await fetch(
            Method == "GET" ? parma_url.href : APIUrl, {
                method: Method,
                body: Method == "GET" ? undefined : parma_str,
                headers: Method == "GET" ? undefined : header_data
            }
        );
        if (Finder === "json") return await result_data.json()
        if (Finder === "text") return await result_data.text()
        return result_data;
    } catch (error) {
        return {text: error}
    }
}