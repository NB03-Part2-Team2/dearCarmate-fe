import classNames from 'classnames/bind'
import styles from './ContractDocument.module.scss'
import { Controller, useFormContext } from 'react-hook-form'
import { useRef, useState } from 'react'
import GlobalLoading from '@ui/shared/global-loading/GlobalLoading'
import Button from '@ui/shared/button/Button'
import uploadFile from './uploadFile'
import { AxiosErrorData, ContractDocumentRegisterFormInput, DocumentType } from '@shared/types'
import Icon from '@ui/shared/icon/Icon'
import Hint from '@ui/shared/input/Hint/Hint'
import { AxiosError } from 'axios'

const cx = classNames.bind(styles)

type ContractDocumentRegisterConnectProps = {
}

const ContractDocumentRegisterConnect = ({ }: ContractDocumentRegisterConnectProps) => {
  const { setValue, watch } = useFormContext<ContractDocumentRegisterFormInput>()
  const contractDocuments = watch('contractDocuments')
  const [isLoading, setIsLoading] = useState(false)
  const [previewFiles, setPreviewFiles] = useState<DocumentType[]>([])

  const inputRef = useRef<HTMLInputElement>(null)

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setIsLoading(true)
      const id = await uploadFile(file)
      console.log('받은 id:', id)
      const newDocument = { id, fileName: file.name }
      console.log('새 문서 객체:', newDocument)
      setValue('contractDocuments', [...contractDocuments, newDocument])
      setPreviewFiles([...previewFiles, newDocument])
    } catch (error) {
      const text = (error as AxiosError<AxiosErrorData>)?.response?.data?.message || '파일 업로드에 실패했습니다. 다시 시도해주세요.'
      alert(text)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFile = (id: number) => {
    setValue('contractDocuments', contractDocuments.filter((contractDocument) => contractDocument.id !== id))
    setPreviewFiles(previewFiles.filter((file) => file.id !== id))
  }

  return (
    <div>
      <Controller
        name='contractDocuments'
        rules={{
          validate: (value) => value.length > 0 || '계약서를 1개 이상 등록해주세요.',
        }}
        render={({ fieldState: { error } }) => (
          <div className={cx('container')}>
            {previewFiles.length > 0 && (
              <div className={cx('previewFilesContainer')}>
                {previewFiles.map(({ id, fileName }) => (
                  <div key={id} className={cx('item')}>
                    <button type="button" onClick={() => handleRemoveFile(id)}>
                      <Icon name='checkbox-minus' width={20} height={20} />
                    </button>
                    <div>{fileName}</div>
                  </div>
                ))}
              </div>
            )}
            <div className={cx('addButtonWrapper')}>
              <label>
                <input
                  ref={inputRef}
                  type='file'
                  accept="*"
                  hidden
                  onChange={handleUploadFile}
                />
                <Button
                  size='large'
                  theme='outline'
                  type='button'
                  onClick={() => inputRef.current?.click()}
                  className={cx('addButton')}
                >+ 파일 추가
                </Button>
              </label>
            </div>
            {error?.message && (<Hint message={error.message} />)}
          </div>
        )}
      />
      {isLoading && (
        <GlobalLoading hasBackDrop />
      )}
    </div>
  )
}

export default ContractDocumentRegisterConnect
