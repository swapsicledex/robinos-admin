import React, { useState, useEffect } from "react";

type DateTime = {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  second: string;
};

const DateTimePicker: React.FC<{ onDateTimeChange: (dateTime: Date) => void }> = ({ onDateTimeChange }) => {
  const [dateTime, setDateTime] = useState<DateTime>({
    year: "",
    month: "",
    day: "",
    hour: "",
    minute: "",
    second: "",
  });

  useEffect(() => {
    // Pre-populate the fields with the current date and time
    const now = new Date();
    setDateTime({
      year: String(now.getFullYear()),
      month: String(now.getMonth() + 1).padStart(2, "0"), // Months are 0-indexed
      day: String(now.getDate()).padStart(2, "0"),
      hour: String(now.getHours()).padStart(2, "0"),
      minute: String(now.getMinutes()).padStart(2, "0"),
      second: String(now.getSeconds()).padStart(2, "0"),
    });
  }, []);

  const handleChange = (field: keyof DateTime, value: string) => {
    const updatedDateTime = { ...dateTime, [field]: value };
    setDateTime(updatedDateTime);

    // Trigger the onDateTimeChange callback when all fields are filled
    const { year, month, day, hour, minute, second } = updatedDateTime;
    if (year && month && day && hour && minute && second) {
      const parsedDate = new Date(
        parseInt(year),
        parseInt(month) - 1, // Month in JS Date is 0-indexed
        parseInt(day),
        parseInt(hour),
        parseInt(minute),
        parseInt(second)
      );
      if (!isNaN(parsedDate.getTime())) {
        onDateTimeChange(parsedDate);
      }
    }
  };

  return (
    <div className="p-4 rounded-md w-full max-w-3xl my-4 border border-gray-200 rounded-lg">
      <div className="flex items-center space-x-4">
        <div>
          <label className="block text-sm font-medium">Year</label>
          <input
            type="number"
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
            value={dateTime.second}
            onChange={(e) => handleChange("second", e.target.value)}
            placeholder="SS"
            className="w-16 px-2 py-1 border rounded"
            min="0"
            max="59"
          />
        </div>
      </div>
    </div>
  );
};

export default DateTimePicker;
