import classNames from 'classnames/bind'
import { useRouter } from 'next/router'
import styles from './Dashboard.module.scss'
import useDashboardData from '../data-access-dashboard/useDashboardData'
import DashboardCard from '../ui-dashboard-card/DashboardCard'
import DashboardChart from '../ui-dashboard-chart/DashboardChart'
import Loader from '@ui/shared/loader/Loader'

const cx = classNames.bind(styles)

type DashboardProps = {

}

const Dashboard = ({ }: DashboardProps) => {
  const router = useRouter()
  const { data, isLoading } = useDashboardData()

  if (isLoading || !data) return (
    <div className={cx('loading')}>
      <Loader />
    </div>
  )

  const {
    completedContractsCount,
    growthRate,
    lastMonthSales,
    monthlySales,
    proceedingContractsCount,
    contractsByCarType,
    salesByCarType,
  } = data

  const quickActions = [
    {
      text: '새 계약 추가',
      icon: '📝',
      route: '/contract-document-upload',
      description: '새로운 계약을 생성합니다',
    },
    {
      text: '고객 관리',
      icon: '👥',
      route: '/customers',
      description: '고객 정보를 관리합니다',
    },
    {
      text: '차량 등록',
      icon: '🚗',
      route: '/cars',
      description: '새 차량을 등록합니다',
    },
    {
      text: '문서 업로드',
      icon: '📊',
      route: '/bulk-upload',
      description: '대량 데이터를 업로드합니다',
    },
  ]

  const handleQuickAction = (route: string) => {
    router.push(route)
  }

  return (
    <div className={cx('container')}>
      <header className={cx('header')}>
        <h1 className={cx('title')}>대시보드</h1>
        <p className={cx('subtitle')}>
          비즈니스 현황을 한눈에 확인하세요 • {new Date().toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </header>

      <div className={cx('metricsGrid')}>
        <DashboardCard data={{ completedContractsCount, growthRate, lastMonthSales, monthlySales, proceedingContractsCount }} />
      </div>

      <div className={cx('chartsContainer')}>
        <DashboardChart type='contracts' data={contractsByCarType} />
        <DashboardChart type='sales' data={salesByCarType} />
      </div>

      <div className={cx('insightsSection')}>
        <div className={cx('trendsCard')}>
          <h3 className={cx('sectionTitle')}>📈 성장 트렌드</h3>
          <div className={cx('trendItems')}>
            <div className={cx('trendItem')}>
              <div className={cx('trendLabel')}>이번 달 성장률</div>
              <div className={cx('trendValue', growthRate >= 0 ? 'positive' : 'negative')}>
                {growthRate >= 0 ? '↗️' : '↘️'} {Math.abs(growthRate)}%
              </div>
            </div>
            <div className={cx('trendItem')}>
              <div className={cx('trendLabel')}>완료된 계약</div>
              <div className={cx('trendValue')}>📋 {completedContractsCount}건</div>
            </div>
            <div className={cx('trendItem')}>
              <div className={cx('trendLabel')}>진행중 계약</div>
              <div className={cx('trendValue')}>⏳ {proceedingContractsCount}건</div>
            </div>
          </div>
        </div>

        <div className={cx('quickActions')}>
          <h3 className={cx('actionTitle')}>빠른 작업</h3>
          <div className={cx('actionList')}>
            {quickActions.map((action, index) => (
              <div
                key={index}
                className={cx('actionItem')}
                onClick={() => handleQuickAction(action.route)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleQuickAction(action.route)
                  }
                }}
              >
                <div className={cx('actionContent')}>
                  <div className={cx('actionHeader')}>
                    <span className={cx('actionText')}>{action.text}</span>
                    <span className={cx('actionIcon')}>{action.icon}</span>
                  </div>
                  <span className={cx('actionDescription')}>{action.description}</span>
                </div>
                <div className={cx('actionArrow')}>→</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
