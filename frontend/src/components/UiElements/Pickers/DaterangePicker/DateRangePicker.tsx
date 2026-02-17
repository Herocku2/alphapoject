import { useState } from 'react'
import { DateRangePicker as Calendar, Range } from 'react-date-range'
import { addDays } from 'date-fns'

import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

const DateRangePicker = () => {
  const [state, setState] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection',
    },
  ])

  return (
    <div>
      <Calendar
        onChange={(item) => setState([item.selection as Range])}
        moveRangeOnFirstSelection={false}
        months={2}
        ranges={state}
        direction="horizontal"
      />
    </div>
  )
}

export default DateRangePicker
