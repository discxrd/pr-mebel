interface UploadFilesToR2Params {
  name: string;
  files: File[];
  onFileProgress?: (fileIndex: number, percent: number) => void;
  onTotalProgress?: (percent: number) => void;
}

interface UploadFilesToR2Result {
  success: boolean;
  message: string;
  uploadUrl: string;
  key: string;
}

export async function uploadFilesToR2({
  name,
  files,
  onFileProgress,
  onTotalProgress,
}: UploadFilesToR2Params): Promise<UploadFilesToR2Result> {
  const formData = new FormData();
  formData.append("name", name);

  files.forEach((file) => {
    formData.append("files", file);
  });

  return await new Promise<UploadFilesToR2Result>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/generate-upload-url");

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) {
        return;
      }

      const totalPercent = Math.round((event.loaded / event.total) * 100);
      onTotalProgress?.(totalPercent);

      files.forEach((_, index) => {
        onFileProgress?.(index, totalPercent);
      });
    };

    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error(`Upload failed: ${xhr.status}`));
        return;
      }

      try {
        resolve(JSON.parse(xhr.responseText));
      } catch (error) {
        reject(error);
      }
    };

    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send(formData);
  });
}
