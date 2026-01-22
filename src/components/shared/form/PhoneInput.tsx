import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Scalar } from "@/types/global";
import React from "react";

const countries = [{ code: "+234", flag: "/flags/nigeria.svg", name: "Nigeria" }];

interface Props {
  error?: string | null;
  className?: string;
  customImage?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: Scalar;
}

const PhoneNumberInput = React.forwardRef<React.ElementRef<Scalar>, React.PropsWithoutRef<Scalar>>(
  (props: Props, ref: Scalar) => {
    const [selectedCountry, setSelectedCountry] = useState(countries[0]);

    return (
      <div className="relative w-full h-14">
        <div
          className={`w-full h-full flex ${!props.customImage ? "gap-2" : ""} items-center border border-input px-2 rounded-[10px] focus-within:ring-1 focus-within:ring-ring ${props.error ? "border-red-500 ring-red-500" : ""} ${props.className || ""}`}
        >
          {props.customImage ? (
            <span className="block w-[20px] mx-0 mr-2">
              <img src={props.customImage} alt="network" />
            </span>
          ) : (
            <CountrySelector
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
            />
          )}
          <span className="block w-[1px] h-[30px] bg-gray-200"></span>
          <input
            type="tel"
            ref={ref}
            placeholder={props.label || props.placeholder || "Enter phone number"}
            value={props.value}
            onChange={props.onChange}
            className="flex-1 h-full bg-transparent border-0 outline-none text-sm text-[#212121] placeholder:text-[#C8C8C8]"
            {...props}
            style={{
              backgroundColor: "transparent",
              border: "none",
              outline: "none",
              boxShadow: "none",
              padding: "0",
              margin: "0",
            }}
          />
        </div>
        {props.error && (
          <span className="text-[10px] text-red-500 absolute top-[100%] left-1">{props.error}</span>
        )}
      </div>
    );
  },
);

export default PhoneNumberInput;

function CountrySelector({
  selectedCountry,
  setSelectedCountry,
}: {
  selectedCountry: (typeof countries)[0];
  setSelectedCountry: (country: (typeof countries)[0]) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <span className="flex items-center gap-2">
          <span className="block">
            <img
              src={selectedCountry.flag as string}
              alt={selectedCountry.name}
              className="h-5 w-5"
            />
          </span>
          <span className="text-sm text-[#C8C8C8]">{selectedCountry.code}</span>
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <ScrollArea className="h-fit">
          <div className="p-1">
            {countries.map((country) => (
              <button
                key={country.code}
                onClick={() => setSelectedCountry(country)}
                className="w-full flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md text-sm"
              >
                <span className="block">
                  <img src={country.flag as string} alt={country.name} className="h-5 w-5" />
                </span>
                <span>{country.name}</span>
                <span className="text-[#C8C8C8] ml-auto">{country.code}</span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
