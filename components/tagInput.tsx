"use client";
import * as React from "react";
import { Check } from "lucide-react";

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
import { Tag } from "@prisma/client";
import { X } from "lucide-react";
import { useState } from "react";

type Props = {
  suggestions: Tag[];
  //this should be called selected
  value: string[];
  setValue: React.Dispatch<React.SetStateAction<string[]>>;
};

export function TagInput({ suggestions, value, setValue }: Props) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // handles the value [] which stores all tags

  const handleSetValue = (newVal: string) => {
    if (!value.includes(newVal)) {
      const updatedArr = [...value, newVal];
      setValue(updatedArr);
    }
    console.log("handle create value");

    console.log(value);
  };
  // handles the input field of the search field of combo box
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // adds new tags which the user can create by himself
  const handleButtonClick = async () => {
    handleSetValue(inputValue);
    setInputValue("");
    if (value.length >= 6) {
      alert("this is an alert bro");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue((value) => value.filter((item) => item !== tagToRemove));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex flex-wrap justify-start items-start w-full min-h-20 rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground"
        >
          {value?.length
            ? value.map((val, i) => (
                <div
                  key={i}
                  className="flex justify-center items-center gap-1 px-2 rounded-full border bg-slate-200 text-xs font-medium"
                >
                  {value.find((suggestion) => suggestion === val)}
                  <button onClick={() => handleRemoveTag(val)}>
                    <X className="w-3 aspect-square" />
                  </button>
                </div>
              ))
            : "Select Tag"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search suggestion..."
            value={inputValue}
            onInput={handleInputChange}
          />
          <CommandList>
            {/* <CommandEmpty>
              <Button onClick={handleButtonClick}>{"Add a new Tag"}</Button>
            </CommandEmpty> */}
            <CommandGroup className="flex justify-center items-center gap-2">
              {suggestions.map((suggestion) => (
                <CommandItem
                  className="flex justify-center items-center border-2 rounded-full m-2 pr-4 pl-4"
                  key={suggestion.name}
                  value={suggestion.name}
                  onSelect={() => {
                    handleSetValue(suggestion.name);
                  }}
                >
                  {suggestion.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
