import { ContractDocumentType } from '@shared/types'
import { Column } from '@ui/shared/table/types'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@ui/shared/table/composition'
import EmptyData from '@ui/shared/table/EmptyData'
import { format, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'
import ContractDocumentOptionButtons from '../feature-contract-documents/ContractDocumentOptionButtons'
import Badge from '@ui/shared/badge/Badge'
import classNames from 'classnames/bind'
import styles from './ContractDocumentListTable.module.scss'

const cx = classNames.bind(styles)

type ContractDocumentListTableProps = {
  data: ContractDocumentType[]
}

const columns: Column<Omit<ContractDocumentType, 'documents'>>[] = [
  { key: 'contractName', title: '계약명' },
  { key: 'resolutionDate', title: '계약체결일' },
  { key: 'documentCount', title: '문서 수(개)' },
  { key: 'userName', title: '담당자' },
  { key: 'carNumber', title: '차량번호' },
]

const ContractDocumentListTable = ({ data }: ContractDocumentListTableProps) => {
  const isEmpty = data.length === 0

  const getDocumentCountBadgeVariant = (count: number) => {
    if (count >= 5) return 'success'
    if (count >= 2) return 'warning'
    return 'secondary'
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
              resolutionDate: record.resolutionDate ? format(parseISO(record.resolutionDate), 'yyyy년 MM월 dd일', { locale: ko }) : '-',
              // manager 필드를 userName으로 매핑
              userName: record.userName || '-',
            }
            return (
              <TableRow
                key={record.id}
              >
                <TableCell>
                  <span className={cx('contractName')}>{processedRecord.contractName}</span>
                </TableCell>
                <TableCell>
                  <span className={cx('resolutionDate')}>{processedRecord.resolutionDate}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={getDocumentCountBadgeVariant(processedRecord.documentCount)}>
                    {processedRecord.documentCount}개
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={cx('userName')}>{processedRecord.userName}</span>
                </TableCell>
                <TableCell>
                  <span className={cx('carNumber')}>{processedRecord.carNumber}</span>
                </TableCell>
                <TableCell isLast>
                  <ContractDocumentOptionButtons contractDocument={record} />
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

export default ContractDocumentListTable
