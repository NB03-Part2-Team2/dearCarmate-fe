import { CarType } from '@shared/types'
import { Column } from '@ui/shared/table/types'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@ui/shared/table/composition'
import EmptyData from '@ui/shared/table/EmptyData'
import { CAR_STATUS_MAP } from '@ui/shared/util-constants/constants'
import CarOptionButtons from '../feature-cars/CarOptionButtons'
import useCarDetailModal from '../util-car-detail-modal/useCarDetailModal'
import Badge from '@ui/shared/badge/Badge'
import classNames from 'classnames/bind'
import styles from './CarsInfoTable.module.scss'

const cx = classNames.bind(styles)

type CarsInfoTableProps = {
  data: CarType[]
}

const columns: Column<CarType>[] = [
  { key: 'carNumber', title: '차량번호' },
  { key: 'manufacturer', title: '제조사' },
  { key: 'model', title: '차종' },
  { key: 'type', title: '타입' },
  { key: 'mileage', title: '주행거리(km)' },
  { key: 'manufacturingYear', title: '제조년도(년)' },
  { key: 'price', title: '가격(원)' },
  { key: 'status', title: '상태' },
  { key: 'accidentCount', title: '사고횟수(회)' },
]

const CarsInfoTable = ({ data }: CarsInfoTableProps) => {
  const { openCarDetailModal } = useCarDetailModal()
  const isEmpty = data.length === 0

  const getStatusBadgeVariant = (status: string) => {
    if (status === '판매가능') return 'success'
    if (status === '수리중') return 'warning'
    if (status === '판매완료') return 'secondary'
    return 'info'
  }

  const getAccidentCountClass = (count: number) => {
    if (count >= 3) return 'high'
    if (count >= 1) return 'medium'
    return 'low'
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.key}>{column.title}</TableCell>
            ))}
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((record) => {
            const processedRecord = {
              ...record,
              status: CAR_STATUS_MAP[record.status],
              mileage: record.mileage.toLocaleString(),
              price: record.price.toLocaleString(),
            }
            return (
              <TableRow
                key={record.id}
                onClick={() => { openCarDetailModal({ data: record }) }}
              >
                <TableCell>
                  <span className={cx('carNumber')}>{processedRecord.carNumber}</span>
                </TableCell>
                <TableCell>
                  <span className={cx('manufacturer')}>{processedRecord.manufacturer}</span>
                </TableCell>
                <TableCell>
                  <span className={cx('model')}>{processedRecord.model}</span>
                </TableCell>
                <TableCell>{processedRecord.type}</TableCell>
                <TableCell>
                  <span className={cx('mileage')}>{processedRecord.mileage}</span>
                </TableCell>
                <TableCell>
                  <span className={cx('year')}>{processedRecord.manufacturingYear}</span>
                </TableCell>
                <TableCell>
                  <span className={cx('price')}>{processedRecord.price}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(processedRecord.status)}>
                    {processedRecord.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={cx('accidentCount', getAccidentCountClass(processedRecord.accidentCount))}>
                    {processedRecord.accidentCount}
                  </span>
                </TableCell>
                <TableCell isLast>
                  <CarOptionButtons car={record} />
                </TableCell>
              </TableRow>
            )
          })}
          {isEmpty && (
            <TableRow>
              <TableCell colSpan={columns.length + 1}>
                <EmptyData />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default CarsInfoTable
