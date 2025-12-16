import React, { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Label } from "./label";

export default function CountryStateCitySelector({
  control,
  userAddress,
  setValue,
  className,
  label,
}: any) {
  const [allData, setAllData] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState<any>(
    userAddress?.country
  );
  const [selectedState, setSelectedState] = useState<any>(userAddress?.state);
  const [selectedCity, setSelectedCity] = useState<any>(userAddress?.city);

  const [statesOfCountry, setStatesOfCountry] = useState<any>([]);
  const [citiesOfState, setCitiesOfState] = useState<any>([]);

  // -------- Get all data ------------- //
  useEffect(() => {
    fetch("/data/countries-states-cities.json")
      .then((res) => res.json())
      .then((data) => {
        setAllData(data);
      });
  }, []);

  // -------- Keep data memoized to load once ------------ //
  const memoizedAllCountries = useMemo<any>(() => allData, [allData]);

  // -------- Load states of selected country -------- //
  useEffect(() => {
    if (selectedCountry) {
      const countryData = memoizedAllCountries?.find((country: any) => {
        if (selectedCountry === country.name) {
          return country;
        }
      });

      setStatesOfCountry(countryData?.states);
    }
  }, [memoizedAllCountries, selectedCountry]);

  // ----------- Load cities of selected state ------- //
  useEffect(() => {
    if (selectedState) {
      const stateData = statesOfCountry?.find(
        (state: any) => state.name === selectedState
      );
      setCitiesOfState(stateData?.cities);
    }
  }, [memoizedAllCountries, selectedState, statesOfCountry]);

  useEffect(() => {
    if (userAddress?.country) {
      setSelectedCountry(userAddress.country);
      setSelectedState(userAddress.state);
      setSelectedCity(userAddress.city);

      setValue("country", "United States");
      setValue("state", userAddress.state);
      setValue("city", userAddress.city);
    }
  }, [userAddress?.country]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col md:flex-row gap-x-2">
        <div className="flex-1 hidden">
          <Controller
            name="country"
            control={control}
            defaultValue={"United States"}
            render={({ field }) => (
              <Select
                onValueChange={(countryName) => {
                  field.onChange(countryName);
                  setSelectedCountry(countryName);
                }}
                value={"United States"}
              >
                <SelectTrigger className=" bg-primary-light-gray w-full ">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {memoizedAllCountries?.map((country: any) => (
                    <SelectItem key={country.name} value={country.name}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="flex-1">
          {label && <Label>State</Label>}
          {selectedCountry ? (
            <>
              {statesOfCountry?.length ? (
                <Controller
                  name="state"
                  control={control}
                  defaultValue={selectedState}
                  render={({ field }) => (
                    <Select
                      onValueChange={(stateName) => {
                        field.onChange(stateName);
                        setSelectedState(stateName);
                      }}
                      value={selectedState || ""}
                    >
                      <SelectTrigger
                        className={cn(
                          "w-full bg-gray-200  shadow-sm",
                          className
                        )}
                      >
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {statesOfCountry?.map((state: any) => (
                          <SelectItem key={state.name} value={state.name}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : (
                <Select>
                  <SelectTrigger
                    className={cn("w-full bg-gray-200 shadow-sm", className)}
                  >
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no state found">
                      No state found!
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            </>
          ) : (
            <Select>
              <SelectTrigger
                disabled
                className={cn("w-full bg-gray-200 shadow-sm", className)}
              >
                <SelectValue placeholder="Select a country first" />
              </SelectTrigger>
              <SelectContent></SelectContent>
            </Select>
          )}
        </div>

        <div className="flex-1">
          {label && <Label>City</Label>}
          {selectedState ? (
            <>
              <Controller
                name="city"
                control={control}
                defaultValue={selectedCity}
                render={({ field }) => (
                  <>
                    {citiesOfState?.length ? (
                      <Select
                        onValueChange={(cityName) => {
                          field.onChange(cityName);
                          setSelectedCity(cityName);
                        }}
                        value={selectedCity || ""}
                      >
                        <SelectTrigger
                          className={cn(
                            "w-full bg-gray-200 shadow-sm",
                            className
                          )}
                        >
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          {citiesOfState?.map((city: any) => (
                            <SelectItem key={city.name} value={city.name}>
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger
                          className={cn(
                            "w-full bg-gray-200 shadow-sm",
                            className
                          )}
                        >
                          <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="No city found">
                            No city found
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </>
                )}
              />
            </>
          ) : (
            <Select>
              <SelectTrigger
                disabled
                className={cn("w-full bg-gray-200 shadow-sm", className)}
              >
                <SelectValue placeholder="Select a state first" />
              </SelectTrigger>
              <SelectContent></SelectContent>
            </Select>
          )}
        </div>
      </div>
    </div>
  );
}
