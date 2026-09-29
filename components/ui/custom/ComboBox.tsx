"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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

export function ComboboxDemo<Option>({
  options,
  selectedValue,
  onSelectedValueChange,
  getLabel,
  getValue
}: {
  selectedValue: string;
  onSelectedValueChange: (values: string) => void;
  options: Option[];
  getValue:(option:Option)=>string
  getLabel:(option:Option)=>string
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {selectedValue
            ? options.map((option) => getValue(option) === selectedValue?getLabel(option):null)
            : "Select author..."}
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
                  value={getLabel(option)}
                  onSelect={() => {
                    onSelectedValueChange(getValue(option) === selectedValue ? "" : getValue(option));
                    setOpen(false);
                  }}
                >
                  {getLabel(option)}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedValue === getValue(option) ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
