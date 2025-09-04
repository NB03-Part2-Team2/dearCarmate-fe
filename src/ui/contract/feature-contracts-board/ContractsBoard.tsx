import classNames from 'classnames/bind'
import styles from './ContractsBoard.module.scss'
import useContracts from '../data-access-contracts/useContracts'
import { ContractStatus, SearchByContract } from '@shared/types'
import BoardGroup from './BoardGroup'
import CollabsibleBoardGroup from './CollabsibleBoardGroup/CollabsibleBoardGroup'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { ContractContextProvider } from '../util-contract-context/ContractContext'
import Loader from '@ui/shared/loader/Loader'
import { useQueryClient } from '@tanstack/react-query'
import useFormModal from '@ui/shared/modal/form-modal/useFormModal'
import ContractForm from '../feature-contract-form/ContractForm'
import { ContractFormInput } from '@shared/types'
import useRegisterContract from '../data-access-contract-form/useRegisterContract'

const cx = classNames.bind(styles)

type ContractsBoardProps = {
  searchBy: SearchByContract
  keyword: string
}

const ContractsBoard = ({ keyword, searchBy }: ContractsBoardProps) => {
  const { data: contractsData, isLoading, refetch } = useContracts({ searchBy, keyword })
  const queryClient = useQueryClient()
  const { openFormModal, closeFormModal } = useFormModal()
  const { mutate: registerContract } = useRegisterContract()

  if (isLoading || !contractsData) return (
    <div className={cx('loading')}>
      <Loader />
    </div>
  )

  const { carInspection, priceNegotiation, contractDraft, contractFailed, contractSuccessful } = contractsData

  // 통계 계산
  const totalInProgress = carInspection.totalItemCount + priceNegotiation.totalItemCount + contractDraft.totalItemCount
  const totalContracts = totalInProgress + contractSuccessful.totalItemCount + contractFailed.totalItemCount
  const successRate = totalContracts > 0 ? Math.round((contractSuccessful.totalItemCount / (contractSuccessful.totalItemCount + contractFailed.totalItemCount)) * 100) : 0

  // 오늘 마감 계약 수 (임시 데이터)
  const todayDeadline = Math.floor(totalInProgress * 0.2) // 전체의 20% 정도가 오늘 마감이라고 가정

  // 예상 매출 (임시 계산)
  const estimatedRevenue = totalInProgress * 15000000 // 계약 건당 평균 1500만원이라고 가정

  // 버튼 핸들러 함수들
  const handleNewContract = () => {
    openFormModal({
      title: '새 계약 생성',
      form: <ContractForm onSubmit={handleRegisterContract} onCancel={closeFormModal} />,
    })
  }

  const handleRegisterContract = (data: ContractFormInput) => {
    registerContract({
      ...data,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      meetings: data.meetings.map(({ id, ...rest }) => rest),
    })
    closeFormModal()
  }

  const handleRefresh = async () => {
    try {
      await refetch()
      queryClient.invalidateQueries({
        queryKey: ['contracts', { searchBy, keyword }],
      })
    } catch (error) {
      console.error('새로고침 실패:', error)
    }
  }

  return (
    <ContractContextProvider searchBy={searchBy} keyword={keyword}>
      <DndProvider backend={HTML5Backend}>
        <div className={cx('container')}>
          {/* 통계 헤더 */}
          <div className={cx('statsHeader')}>
            <div className={cx('headerTop')}>
              <div className={cx('statsGrid')}>
                <div className={cx('statCard', 'primary')}>
                  <div className={cx('statIcon')}>📊</div>
                  <div className={cx('statContent')}>
                    <div className={cx('statValue')}>{totalInProgress}건</div>
                    <div className={cx('statLabel')}>진행중인 계약</div>
                  </div>
                </div>

                <div className={cx('statCard', 'warning')}>
                  <div className={cx('statIcon')}>⏰</div>
                  <div className={cx('statContent')}>
                    <div className={cx('statValue')}>{todayDeadline}건</div>
                    <div className={cx('statLabel')}>오늘 마감</div>
                  </div>
                </div>

                <div className={cx('statCard', 'success')}>
                  <div className={cx('statIcon')}>💰</div>
                  <div className={cx('statContent')}>
                    <div className={cx('statValue')}>₩{(estimatedRevenue / 100000000).toFixed(1)}억</div>
                    <div className={cx('statLabel')}>예상 매출</div>
                  </div>
                </div>

                <div className={cx('statCard', 'info')}>
                  <div className={cx('statIcon')}>🎯</div>
                  <div className={cx('statContent')}>
                    <div className={cx('statValue')}>{successRate}%</div>
                    <div className={cx('statLabel')}>계약 성사율</div>
                  </div>
                </div>
              </div>

              <div className={cx('quickActions')}>
                <button className={cx('actionButton', 'primary')} onClick={handleNewContract}>
                  <span className={cx('actionIcon')}>➕</span>
                  새 계약
                </button>
                <button className={cx('actionButton', 'secondary')} onClick={handleRefresh}>
                  <span className={cx('actionIcon')}>🔄</span>
                  새로고침
                </button>
              </div>
            </div>
          </div>

          {/* 기존 보드 그룹들 */}
          <div className={cx('boardContent')}>
            <BoardGroup
              status={ContractStatus.carInspection}
              cards={carInspection.data}
              totalItemCount={carInspection.totalItemCount}
            />
            <BoardGroup
              status={ContractStatus.priceNegotiation}
              cards={priceNegotiation.data}
              totalItemCount={priceNegotiation.totalItemCount}
            />
            <BoardGroup
              status={ContractStatus.contractDraft}
              cards={contractDraft.data}
              totalItemCount={contractDraft.totalItemCount}
            />
            <div className={cx('collabsibleGroupWrapper')}>
              <CollabsibleBoardGroup
                status={ContractStatus.contractSuccessful}
                cards={contractSuccessful.data}
                totalItemCount={contractSuccessful.totalItemCount}
              />
            </div>
            <div className={cx('collabsibleGroupWrapper')}>
              <CollabsibleBoardGroup
                status={ContractStatus.contractFailed}
                cards={contractFailed.data}
                totalItemCount={contractFailed.totalItemCount}
              />
            </div>
          </div>
        </div>
      </DndProvider>
    </ContractContextProvider>
  )
}

export default ContractsBoard
