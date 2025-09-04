import { useState, useRef } from 'react'
import { AxiosError } from 'axios'
import classNames from 'classnames/bind'
import useConfirmModal from '@ui/shared/modal/confirm-modal/useConfirmModal'
import GlobalLoading from '@ui/shared/global-loading/GlobalLoading'
import { useQueryClient } from '@tanstack/react-query'
import { AxiosErrorData } from '@shared/types'
import { bulkUploadCars, bulkUploadCustomers } from '@shared/api'
import styles from './BulkUpload.module.scss'

const cx = classNames.bind(styles)

const BulkUpload = () => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const boxLeftPercentage = (selectedTabIndex / 2) * 100
  const { openConfirmModal } = useConfirmModal()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const processFile = async (file: File) => {
    try {
      // 파일 크기 검증 (5MB = 5 * 1024 * 1024 bytes)
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        openConfirmModal({ text: '파일 크기는 최대 5MB까지 허용됩니다.' })
        return
      }

      setIsLoading(true)
      setUploadProgress(0)
      setSelectedFile(file)

      // 진행률 시뮬레이션
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + Math.random() * 10
        })
      }, 200)

      const formData = new FormData()
      formData.append('file', file)
      const bulkUpload =
        selectedTabIndex === 0 ? bulkUploadCustomers : bulkUploadCars

      await bulkUpload(formData)

      clearInterval(progressInterval)
      setUploadProgress(100)

      setTimeout(() => {
        openConfirmModal({ text: '파일 업로드에 성공했습니다.' })
        queryClient.invalidateQueries({
          queryKey: selectedTabIndex === 0 ? ['customers'] : ['cars'],
        })
        setSelectedFile(null)
        setUploadProgress(0)
      }, 500)

    } catch (error) {
      const text =
        (error as AxiosError<AxiosErrorData>)?.response?.data?.message ||
        '파일 업로드에 실패했습니다.'
      openConfirmModal({ text })
      setSelectedFile(null)
      setUploadProgress(0)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      openConfirmModal({ text: 'CSV 파일만 업로드 가능합니다.' })
      return
    }

    await processFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const csvFile = files.find(file => file.name.endsWith('.csv'))

    if (!csvFile) {
      openConfirmModal({ text: 'CSV 파일만 업로드 가능합니다.' })
      return
    }

    await processFile(csvFile)
  }

  const handleClickUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={cx('container')}>
      <div className={cx('header')}>
        <h1 className={cx('title')}>대용량 데이터 업로드</h1>
        <p className={cx('description')}>
          CSV 파일을 통해 고객 정보와 차량 정보를 한번에 업로드할 수 있습니다.
        </p>
      </div>

      <div className={cx('tabContainer')}>
        <button
          type="button"
          onClick={() => setSelectedTabIndex(0)}
          className={cx('tab', { active: selectedTabIndex === 0 })}
        >
          👥 고객 데이터
        </button>
        <button
          type="button"
          onClick={() => setSelectedTabIndex(1)}
          className={cx('tab', { active: selectedTabIndex === 1 })}
        >
          🚗 차량 데이터
        </button>
      </div>

      <div className={cx('uploadCard')}>
        <div className={cx('uploadArea')}>
          <div
            className={cx('input', { dragging: isDragging, uploading: isLoading })}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClickUpload}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              hidden
              onChange={handleUploadFile}
            />
            <div className={cx('content')}>
              <div className={cx('icon')} />
              {isLoading ? (
                <>
                  <div className={cx('text')}>업로드 중...</div>
                  <div className={cx('fileName')}>{selectedFile?.name}</div>
                  <div className={cx('progressContainer')}>
                    <div className={cx('progressBar')}>
                      <div
                        className={cx('progressFill')}
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <div className={cx('progressText')}>{Math.round(uploadProgress)}%</div>
                  </div>
                </>
              ) : isDragging ? (
                <>
                  <div className={cx('text', 'dragText')}>파일을 여기에 놓으세요</div>
                  <div className={cx('subtext')}>CSV 파일만 가능합니다</div>
                </>
              ) : (
                <>
                  <div className={cx('text')}>
                    {selectedTabIndex === 0 ? '고객 데이터 CSV 파일을 선택하세요' : '차량 데이터 CSV 파일을 선택하세요'}
                  </div>
                  <div className={cx('subtext')}>
                    파일을 클릭하거나 드래그해서 업로드하세요 • 최대 5MB
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className={cx('features')}>
          <div className={cx('feature')}>
            <div className={cx('featureIcon')}>✨</div>
            <div className={cx('featureText')}>드래그 앤 드롭</div>
          </div>
          <div className={cx('feature')}>
            <div className={cx('featureIcon')}>🔒</div>
            <div className={cx('featureText')}>안전한 데이터 처리</div>
          </div>
          <div className={cx('feature')}>
            <div className={cx('featureIcon')}>📊</div>
            <div className={cx('featureText')}>실시간 진행률</div>
          </div>
        </div>
      </div>

      {isLoading && <GlobalLoading hasBackDrop />}
    </div>
  )
}

export default BulkUpload
