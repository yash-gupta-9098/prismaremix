import {DatePicker} from '@shopify/polaris';
import {useState, useCallback} from 'react';

function DatePickerExample() {
  const today = new Date();
  
  const [{month, year}, setDate] = useState({day , month: today.getMonth(), year: today.getFullYear()});
  
  const [selectedDates, setSelectedDates] = useState({
    start: today,
    end: today,  // You can set it to whatever you need, or let users change it
  });

  const handleMonthChange = useCallback(
    (month, year) => setDate({month, year}),
    [],
  );

    console.log({month, year});
  return (
    <DatePicker
      month={month}
      year={year}
      onChange={setSelectedDates}
      onMonthChange={handleMonthChange}
      selected={selectedDates}
      disableDatesBefore={today} // Disable all dates before today
      allowRange
    />
  );
}

export default DatePickerExample;
