import { ContractType } from '@shared/types'

type ContractTypeMeetings = Pick<ContractType, 'meetings'>['meetings']

const checkIsMeetingChanged = (originMeetings: ContractTypeMeetings, newMeetings: ContractTypeMeetings) => {
  newMeetings = newMeetings.map(({ date, alarms }) => ({ date, alarms }))
  return JSON.stringify(originMeetings) !== JSON.stringify(newMeetings)
}

export default checkIsMeetingChanged
