"use client";

import * as React from "react";
import { Check, CheckIcon, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "../badge";

export function MultiSelect<Option>({
  options,
  selectedValues,
  onSelectedValuesChange,
  getValue,
  getLable,
}: {
  selectedValues: string[];
  onSelectedValuesChange: (values: string[]) => void;
  options: Option[];
  getValue: (option: Option) => string;
  getLable: (option: Option) => string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] truncate justify-between"
          >
            Select item
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search framework..." className="h-9" />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={getValue(option)}
                    value={getLable(option)}
                    onSelect={() => {
                      selectedValues.includes(getValue(option))
                        ? onSelectedValuesChange(
                            selectedValues.filter(
                              (selectedValue) =>
                                selectedValue != getValue(option)
                            )
                          )
                        : onSelectedValuesChange([
                            ...selectedValues,
                            getValue(option),
                          ]);
                      setOpen(false);
                    }}
                  >
                    {getLable(option)}
                    <Check
                      className={cn(
                        "ml-auto",
                        selectedValues.includes(getValue(option))
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="flex gap-1 font-pop flex-wrap">
        {selectedValues.length == 0
          ? "No item selected."
          : selectedValues.map((selectedValue) => (
              <Badge
                key={crypto.randomUUID()}
                className="cursor-pointer"
                onClick={() =>
                  onSelectedValuesChange(
                    selectedValues.filter((value) => value !== selectedValue)
                  )
                }
              >
                {options.map((option) =>
                  getValue(option) == selectedValue ? getLable(option) : null
                )}
                <CheckIcon />
              </Badge>
            ))}
      </div>
    </div>
  );
}
