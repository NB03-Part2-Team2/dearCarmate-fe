import { ChartOptions } from 'chart.js'

const getOptions = (type: 'contracts' | 'sales') => {
  const CHART_OPTIONS: ChartOptions<'bar'> = {
    aspectRatio: 333 / 210,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            weight: 500,
            family: 'system-ui, -apple-system, sans-serif',
          },
          padding: 8,
          color: '#6b7280',
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: '#f3f5fb',
          lineWidth: 1,
        },
        ticks: {
          font: {
            size: 12,
            weight: 500,
            family: 'system-ui, -apple-system, sans-serif',
          },
          padding: 8,
          color: '#6b7280',
          stepSize: type === 'contracts' ? 1 : 100,
          callback: (tick, index) => {
            const value = type === 'contracts' ? tick : Number(tick).toLocaleString()
            if (index === 0) return `${value}${type === 'contracts' ? '건' : '만원'}`
            return value
          },
        },
        border: {
          display: false,
        },
        beginAtZero: true,
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
        padding: 16,
        cornerRadius: 12,
        xAlign: 'center',
        yAlign: 'bottom',
        titleFont: {
          size: 14,
          weight: 600,
          family: 'system-ui, -apple-system, sans-serif',
        },
        bodyFont: {
          size: 16,
          weight: 500,
          family: 'system-ui, -apple-system, sans-serif',
        },
        titleColor: '#f3f4f6',
        bodyColor: '#ffffff',
        displayColors: true,
        usePointStyle: true,
        boxWidth: 8,
        boxHeight: 8,
        titleMarginBottom: 8,
        bodySpacing: 4,
        callbacks: {
          title: (context) => {
            return context[0].label
          },
          label: (ctx) => {
            const value = type === 'contracts'
              ? `${ctx.formattedValue}건`
              : `${Number(ctx.parsed.y).toLocaleString()}만원`
            return ` ${value}`
          },
          afterLabel: (ctx) => {
            if (type === 'sales') {
              const total = ctx.dataset.data.reduce((a: number, b: unknown) => a + (typeof b === 'number' ? b : 0), 0)
              const percentage = ((ctx.parsed.y / total) * 100).toFixed(1)
              return `전체의 ${percentage}%`
            }
            return undefined
          },
        },
      },
    },
  }

  return CHART_OPTIONS
}

export default getOptions
