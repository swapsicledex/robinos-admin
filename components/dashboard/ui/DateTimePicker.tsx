import React, { useState, useEffect, useCallback } from "react";
type DateTime = {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  second: string;
};

type DateTimePickerProps = {
  initialDateTime?: Date;
  onDateTimeChange: (dateTime: Date) => void;
};

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  initialDateTime = new Date(),
  onDateTimeChange,
}) => {
  const [dateTime, setDateTime] = useState<DateTime>({
    year: String(initialDateTime.getFullYear()),
    month: String(initialDateTime.getMonth() + 1).padStart(2, "0"),
    day: String(initialDateTime.getDate()).padStart(2, "0"),
    hour: String(initialDateTime.getHours()).padStart(2, "0"),
    minute: String(initialDateTime.getMinutes()).padStart(2, "0"),
    second: String(initialDateTime.getSeconds()).padStart(2, "0"),
  });

  const [timestamp, setTimestamp] = useState(
    Math.floor(initialDateTime.getTime() / 1000).toString()
  );

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timer: NodeJS.Timeout;
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const updateDateTime = (newDate: Date) => {
    setDateTime({
      year: String(newDate.getFullYear()),
      month: String(newDate.getMonth() + 1).padStart(2, "0"),
      day: String(newDate.getDate()).padStart(2, "0"),
      hour: String(newDate.getHours()).padStart(2, "0"),
      minute: String(newDate.getMinutes()).padStart(2, "0"),
      second: String(newDate.getSeconds()).padStart(2, "0"),
    });
    setTimestamp(Math.floor(newDate.getTime() / 1000).toString());
    onDateTimeChange(newDate);
  };

  const debouncedUpdateDateTime = useCallback(
    debounce((newDate: Date) => updateDateTime(newDate), 300),
    []
  );

  const handleChange = (field: keyof DateTime, value: string) => {
    const updatedDateTime = { ...dateTime, [field]: value };
    setDateTime(updatedDateTime);

    const { year, month, day, hour, minute, second } = updatedDateTime;
    if (year && month && day && hour && minute && second) {
      const parsedDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hour),
        parseInt(minute),
        parseInt(second)
      );
      if (!isNaN(parsedDate.getTime())) {
        debouncedUpdateDateTime(parsedDate);
      }
    }
  };

  const debouncedHandleTimestampChange = useCallback(
    debounce((value: string) => {
      const parsedTimestamp = parseInt(value) * 1000;
      if (!isNaN(parsedTimestamp)) {
        const newDate = new Date(parsedTimestamp);
        if (!isNaN(newDate.getTime())) {
          updateDateTime(newDate);
        }
      }
    }, 300),
    []
  );

  const handleTimestampChange = (value: string) => {
    setTimestamp(value);
    debouncedHandleTimestampChange(value);
  };

  useEffect(() => {
    updateDateTime(initialDateTime);
  }, []);

  const disableArrowKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
    }
  };

  return (
    <div className="p-4 rounded-md w-full max-w-3xl my-4 border border-gray-200 rounded-lg">
      <div className="flex items-center space-x-4 mb-4">
        <div>
          <label className="block text-sm font-medium">Year</label>
          <input
            type="number"
            onKeyDown={disableArrowKeys}
            value={dateTime.year}
            onChange={(e) => handleChange("year", e.target.value)}
            placeholder="YYYY"
            className="w-20 px-2 py-1 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Month</label>
          <input
            type="number"
            onKeyDown={disableArrowKeys}
            value={dateTime.month}
            onChange={(e) => handleChange("month", e.target.value)}
            placeholder="MM"
            className="w-16 px-2 py-1 border rounded"
            min="1"
            max="12"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Day</label>
          <input
            type="number"
            onKeyDown={disableArrowKeys}
            value={dateTime.day}
            onChange={(e) => handleChange("day", e.target.value)}
            placeholder="DD"
            className="w-16 px-2 py-1 border rounded"
            min="1"
            max="31"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Hour</label>
          <input
            type="number"
            onKeyDown={disableArrowKeys}
            value={dateTime.hour}
            onChange={(e) => handleChange("hour", e.target.value)}
            placeholder="HH"
            className="w-16 px-2 py-1 border rounded"
            min="0"
            max="23"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Minutes</label>
          <input
            type="number"
            onKeyDown={disableArrowKeys}
            value={dateTime.minute}
            onChange={(e) => handleChange("minute", e.target.value)}
            placeholder="MM"
            className="w-16 px-2 py-1 border rounded"
            min="0"
            max="59"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Seconds</label>
          <input
            type="number"
            onKeyDown={disableArrowKeys}
            value={dateTime.second}
            onChange={(e) => handleChange("second", e.target.value)}
            placeholder="SS"
            className="w-16 px-2 py-1 border rounded"
            min="0"
            max="59"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Timestamp</label>
        <input
          type="number"
          onKeyDown={disableArrowKeys}
          value={timestamp}
          onChange={(e) => handleTimestampChange(e.target.value)}
          placeholder="Timestamp (seconds)"
          className="w-full px-2 py-1 border rounded"
        />
      </div>
    </div>
  );
};

export default DateTimePicker;
