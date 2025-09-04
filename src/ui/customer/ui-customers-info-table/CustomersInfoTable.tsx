import { CustomerType } from '@shared/types'
import { Column } from '@ui/shared/table/types'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@ui/shared/table/composition'
import EmptyData from '@ui/shared/table/EmptyData'
import { CUSTOMER_GENDER_MAP } from '@ui/shared/util-constants/constants'
import CustomerOptionButtons from '../feature-customers/CustomerOptionButtons'
import useCustomerDetailModal from '../util-customer-detail-modal/useCustomerDetailModal'
import Badge from '@ui/shared/badge/Badge'
import classNames from 'classnames/bind'
import styles from './CustomersInfoTable.module.scss'

const cx = classNames.bind(styles)

type CustomersInfoTableProps = {
  data: CustomerType[]
}

const columns: Column<CustomerType>[] = [
  { key: 'name', title: '고객명' },
  { key: 'contractCount', title: '계약 횟수' },
  { key: 'gender', title: '성별' },
  { key: 'phoneNumber', title: '연락처' },
  { key: 'ageGroup', title: '연령대' },
  { key: 'region', title: '지역' },
  { key: 'email', title: '이메일' },
]

const CustomersInfoTable = ({ data }: CustomersInfoTableProps) => {
  const { openCustomerDetailModal } = useCustomerDetailModal()
  const isEmpty = data.length === 0

  const getContractBadgeVariant = (count: number) => {
    if (count >= 5) return 'success'
    if (count >= 2) return 'warning'
    return 'secondary'
  }

  const getGenderBadgeVariant = (gender: string) => {
    if (gender === '남성') return 'info'
    if (gender === '여성') return 'primary'
    return 'secondary'
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.key} width={column.key === 'email' ? '230px' : undefined}>{column.title}</TableCell>
            ))}
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((record) => {
            const processedRecord = {
              ...record,
              gender: CUSTOMER_GENDER_MAP[record.gender],
              ageGroup: record.ageGroup || '-',
              region: record.region || '-',
            }
            return (
              <TableRow
                key={record.id}
                onClick={() => {
                  openCustomerDetailModal({ data: record })
                }}
              >
                <TableCell>
                  <span className={cx('customerName')}>{processedRecord.name}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={getContractBadgeVariant(processedRecord.contractCount)}>
                    {processedRecord.contractCount}회
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getGenderBadgeVariant(processedRecord.gender)}>
                    {processedRecord.gender}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={cx('phoneNumber')}>{processedRecord.phoneNumber}</span>
                </TableCell>
                <TableCell>
                  <span className={cx('ageGroup')}>{processedRecord.ageGroup}</span>
                </TableCell>
                <TableCell>
                  <span className={cx('region')}>{processedRecord.region}</span>
                </TableCell>
                <TableCell>{processedRecord.email}</TableCell>
                <TableCell isLast>
                  <CustomerOptionButtons customer={record} />
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

export default CustomersInfoTable
