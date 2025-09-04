import classNames from 'classnames/bind'
import styles from './DashboardChart.module.scss'
import {
  Chart as ChartJS,
  CategoryScale,
  BarElement,
  Tooltip,
  LinearScale,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import getOptions from './getOptions'
import { DashboardChartType } from '@shared/types'

ChartJS.register(CategoryScale,
  LinearScale,
  BarElement,
  Tooltip)

const cx = classNames.bind(styles)

type DashboardChartProps = {
  type: 'contracts' | 'sales'
  data: DashboardChartType['contractsByCarType']
}

const DashboardChart = ({ type, data }: DashboardChartProps) => {
  const carLabels = data.map(({ carType }) => carType)
  const counts = data.map(({ count }) => count)
  const title = `차량타입별 ${type === 'contracts' ? '계약수' : '매출액'}`
  // Modern gradient colors for different chart types
  const getChartColors = (type: 'contracts' | 'sales') => {
    if (type === 'contracts') {
      return {
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)',
        ],
      }
    } else {
      return {
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(168, 85, 247)',
          'rgb(251, 146, 60)',
          'rgb(236, 72, 153)',
        ],
      }
    }
  }

  const colors = getChartColors(type)

  return (
    <div className={cx('container')}>
      <h2 className={cx('title')}>{title}</h2>
      <div className={cx('chartWrapper')}>
        <Bar
          data={{
            labels: carLabels,
            datasets: [
              {
                data: counts,
                backgroundColor: colors.backgroundColor,
                borderColor: colors.borderColor,
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
                barThickness: 'flex',
                maxBarThickness: 60,
              },
            ],
          }}
          options={{
            ...getOptions(type),
            plugins: {
              ...getOptions(type).plugins,
              legend: {
                display: false,
              },
            },
            scales: {
              ...getOptions(type).scales,
              x: {
                ...getOptions(type).scales?.x,
                grid: {
                  display: false,
                },
              },
              y: {
                ...getOptions(type).scales?.y,
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)',
                  lineWidth: 1,
                },
              },
            },
          }}
        />
      </div>
    </div>
  )
}

export default DashboardChart
