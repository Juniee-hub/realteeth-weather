export function jsonp<T>(url: string, params: Record<string, string>): Promise<T> {
  return new Promise((resolve, reject) => {
    const callbackName = `jsonp_callback_${Math.round(100000 * Math.random())}`;
    const script = document.createElement("script");

    const queryParams = new URLSearchParams(params);
    queryParams.set("callback", callbackName);

    const fullUrl = `${url}?${queryParams.toString()}`;

    (window as any)[callbackName] = (data: T) => {
      delete (window as any)[callbackName];
      document.body.removeChild(script);
      resolve(data);
    };

    script.onerror = () => {
      delete (window as any)[callbackName];
      document.body.removeChild(script);
      reject(new Error(`JSONP request to ${url} failed`));
    };

    script.src = fullUrl;
    document.body.appendChild(script);
  });
}
