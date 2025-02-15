// 署名付きURLの有効期限
export const SIGNED_URL_EXPIRATION: number = 60;

// 署名付きURLを取得仕分ける
export enum SignedUrlType {
  Upload = "Upload",
  Download = "Download"
}

// ベースURL
export const NEXT_PUBLIC_API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL!;

// ロール
export enum Role {
  General = "general",
  Staff = "staff"
}
