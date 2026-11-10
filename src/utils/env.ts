export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
  encryptionKey: process.env.NEXT_PUBLIC_ENCRYPTION_KEY ?? "app-local-storage-key",
};
