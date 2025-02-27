// components/deals/Step2.tsx
import { Control } from "react-hook-form";
import { DealFormValues } from "@/lib/validations/deal-validation";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Step2Props {
  control: Control<DealFormValues>;
  dealType: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
  goBack: () => void;
  goNext: () => void;
  form: any;
}

export const Step2 = ({
  control,
  dealType,
  setStartDate,
  setEndDate,
  startDate,
  endDate,
  goBack,
  goNext,
  form,
}: Step2Props) => {
  // This function handles the date selection from the Calendar component
  const handleStartDateSelect = (date: Date | null | undefined) => {
    if (date) {
      // Adjusts the selected date by adding the time zone offset (in minutes)
      // getTimezoneOffset() returns the difference between UTC and local time in minutes
      // Multiplying by 60000 converts the offset to milliseconds, which is then added to the original date's time
      const localDate = new Date(
        date.getTime() + Math.abs(date.getTimezoneOffset() * 60000)
      );

      // Updates the startDate state variable with the adjusted local date
      setStartDate(localDate);

      // Sets the form field's "startDate" value using react-hook-form's setValue function
      // This ensures the form's internal state is updated with the adjusted local date
      form.setValue("startDate", localDate);
    }
  };

  // This function handles the date selection from the Calendar component
  const handleEndDateSelect = (date: Date | null | undefined) => {
    if (date) {
      // Adjusts the selected date by adding the time zone offset (in minutes)
      // getTimezoneOffset() returns the difference between UTC and local time in minutes
      // Multiplying by 60000 converts the offset to milliseconds, which is then added to the original date's time
      const localDate = new Date(
        date.getTime() + Math.abs(date.getTimezoneOffset() * 60000)
      );

      // Updates the startDate state variable with the adjusted local date
      setEndDate(localDate);

      // Sets the form field's "startDate" value using react-hook-form's setValue function
      // This ensures the form's internal state is updated with the adjusted local date
      form.setValue("endDate", localDate);
    }
  };
  return (
    <div className="space-y-6">
      {dealType === "flash_sale" && (
        <div>
          <label className="block mb-2 my-3" htmlFor="percentage">
            Discount Percentage (%)
          </label>
          <input
            id="percentage"
            type="number"
            {...control.register("percentage", { valueAsNumber: true })}
            className="w-full p-2 border rounded"
          />

          <label htmlFor="Flash Sale Quantity" className="block mb-2 my-3">
            Flash Sale Quantity
          </label>

          <input
            id="Flash Sale Quantity"
            type="number"
            {...control.register("flashSaleQuantity", { valueAsNumber: true })}
            className="w-full p-2 border rounded"
          />

          <div className="flex items-center gap-2 flex-wrap justify-between">
            <label
              htmlFor="Start Date"
              className="mb-2 my-3 flex gap-2 items-center"
            >
              {/* <span>Start Date</span> */}

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {startDate ? (
                      format(startDate, "PPP")
                    ) : (
                      <span>Start Date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single" // Only allows one date to be selected at a time
                    selected={startDate} // Controlled input binding the selected date to the startDate state
                    onSelect={handleStartDateSelect} // Calls the handleStartDateSelect function when a date is selected
                    disabled={(date) => {
                      const today = new Date(); // Get today's date
                      today.setHours(0, 0, 0, 0); // Reset time to midnight (00:00:00) for comparison
                      return date < today; // Disable any date before today (but not today itself)
                    }} // Disables dates before the current date
                    initialFocus // Gives initial focus to the calendar when it is rendered
                  />
                </PopoverContent>
              </Popover>
            </label>

            <label
              htmlFor="End Date"
              className="mb-2 my-3 flex gap-2 items-center"
            >
              {/* <span className="">End Date</span> */}

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {endDate ? format(endDate, "PPP") : <span>End Date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single" // Only allows one date to be selected at a time
                    selected={endDate} // Controlled input binding the selected date to the startDate state
                    onSelect={handleEndDateSelect} // Calls the handleStartDateSelect function when a date is selected
                    disabled={(date) => {
                      const today = new Date(); // Get today's date
                      today.setHours(0, 0, 0, 0); // Reset time to midnight (00:00:00) for comparison
                      return startDate ? date < startDate : date < today; // Disable any date before today (but not today itself)
                    }}
                    initialFocus // Gives initial focus to the calendar when it is rendered
                  />
                </PopoverContent>
              </Popover>
            </label>
          </div>
        </div>
      )}

      {/* {dealType === "fixed" && (
        <div>
          <label className="block mb-2">Discount Amount</label>
          <input
            type="number"
            {...control.register("amount", { valueAsNumber: true })}
            className="w-full p-2 border rounded"
          />
        </div>
      )} */}

      {/* Add other deal type fields */}

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={goBack}>
          Back
        </Button>
        <Button onClick={goNext}>Next</Button>
      </div>
    </div>
  );
};
