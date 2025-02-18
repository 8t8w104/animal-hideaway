
type UploadFileProps = {
  userId: string;
  onFileDataReceivedAction?: ({ generatedFilePath, fileName }: { generatedFilePath: string, fileName: string }) => void
}

type DownloadFileProps = {
  filePath: string;
  downloadFileName?: string;
}
