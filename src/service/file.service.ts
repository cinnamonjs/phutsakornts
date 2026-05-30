export async function uploadFile(file: File, _kind: string): Promise<string> {
  return URL.createObjectURL(file)
}
