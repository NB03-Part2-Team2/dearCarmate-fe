import { uploadFile as uploadFileAPI } from '@shared/api'

const uploadFile = async (file: File) => {
  const response = await uploadFileAPI(file)
  console.log('uploadFile response:', response)
  // API 응답에서 contractDocumentId가 오는 경우 처리
  return (response as any).contractDocumentId || response.id
}

export default uploadFile
