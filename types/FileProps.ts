
export type UploadFileProps = {
  userId: string;
  onFileDataReceivedAction?: ({ generatedFilePath, fileName }: { generatedFilePath: string, fileName: string }) => void
}

export type UploadedFile = {
  file?: File;
  url: string;
};

type DownloadFileProps = {
  filePath: string;
  downloadFileName?: string;
}
