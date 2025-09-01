import { ContractDocumentType } from '@shared/types'

type ContractDocumentTypeDocuments = Pick<ContractDocumentType, 'documents'>['documents']

const checkIsContractDocumentChanged = (originDocuments: ContractDocumentTypeDocuments, newDocuments: ContractDocumentTypeDocuments) => {
  newDocuments = newDocuments.map(({ id, fileName }) => ({ id, fileName }))
  return JSON.stringify(originDocuments) !== JSON.stringify(newDocuments)
}

export default checkIsContractDocumentChanged
