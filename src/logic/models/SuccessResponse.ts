export function ResponseFormat<T>(
  data: T,
  status: boolean = true,
  message?: string
) {
  if (message) return { data: data, status: status, message: message };
  return { status: status, data: data };
}
