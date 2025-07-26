"use client";
import { useEffect, useState } from "react";
import { Map, Marker, Overlay, Point } from "pigeon-maps";
import { cn } from "@/utils/twMerge";
import { X } from "lucide-react";
import Loader from "@/components/svg/Loader";
import RetryError from "@/components/datadisplay/RetryError";
import SelectSearchCustom, {
  SelectSearchItem,
} from "@/components/inputs/SelectSearchCustom";

export type MapLocation = {
  lat: number;
  long: number;
};

export type MapCustomProps = {
  selectMode?: boolean;
  onChange?: (location: MapLocation) => void;
  classNames?: {
    container?: string;
    marker?: string;
    dataContainer?: string;
  };
  markerData?: {
    long: number;
    lat: number;
    data?: React.ReactNode;
  }[];
  loading?: boolean;
  error?: boolean;
  errorRetryFunction?: () => void;
  onCenterChanged?: (center: Point) => void;
  onClickedMarkerLoc?: (loc: Point) => void;
  canSelectCity?: boolean;
  citiesGeo?: SelectSearchItem[] | undefined;
};

const MapCustom = ({
  selectMode = false,
  onChange,
  classNames,
  markerData,
  onCenterChanged,
  loading,
  error,
  errorRetryFunction,
  onClickedMarkerLoc,
  canSelectCity,
  citiesGeo,
}: MapCustomProps) => {
  const [showMarkerData, setShowMarkerData] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedLocation, setSelectedLocation] = useState<Point | undefined>(
    markerData ? [markerData?.[0]?.lat, markerData?.[0]?.long] : undefined,
  );

  useEffect(() => {
    if (markerData)
      setSelectedLocation([markerData?.[0]?.lat, markerData?.[0]?.long]);
  }, [markerData]);

  const handleMapClick = ({ latLng }: { latLng: [number, number] }) => {
    if (selectMode) {
      setSelectedLocation(latLng);
      if (onChange) {
        onChange({
          lat: latLng[0],
          long: latLng[1],
        });
      }
    }
  };

  return (
    <div
      className={cn(
        "relative !h-[350px] overflow-hidden rounded-[8px]",
        classNames?.container,
      )}
    >
      {loading && (
        <div className="absolute right-2 top-2 z-20 inline-block opacity-80">
          <Loader size="25" />
        </div>
      )}
      {error && (
        <div className="absolute z-20 h-[350px] w-full bg-black/30">
          <RetryError
            onRetry={errorRetryFunction || (() => {})}
            classNames={{ button: "bg-white" }}
          />
        </div>
      )}
      <div className="absolute right-9 top-3 z-50">
        {canSelectCity && (
          <SelectSearchCustom
            options={citiesGeo}
            onChange={(option) =>
              setSelectedLocation(
                option[0]?.helperValue?.split(" ") as Point | undefined,
              )
            }
            isMultiSelect={false}
            placeholder="شهر"
            showNoOneOption={false}
            classNames={{
              container: "bg-white z-50 shadow-lg min-w-[120px]",
            }}
          />
        )}
      </div>
      <Map
        center={selectedLocation || [35.73, 51.33]}
        onClick={handleMapClick}
        zoom={14}
        onBoundsChanged={({ center }) => {
          if (onCenterChanged) onCenterChanged(center);
        }}
      >
        {selectMode && selectedLocation && (
          <Marker
            width={40}
            anchor={selectedLocation}
            color="tomato"
            className={cn(classNames?.marker)}
          />
        )}
        {markerData &&
          markerData.length > 0 &&
          markerData.map((marker) => (
            <Marker
              key={marker.lat + marker.long}
              width={40}
              anchor={[marker.lat, marker.long]}
              color="tomato"
              className={cn(classNames?.marker)}
              onClick={(e) => {
                onClickedMarkerLoc?.(e?.anchor);
                if (marker.data)
                  setShowMarkerData((prev) => ({
                    ...prev,
                    [marker.lat + marker.long]: true,
                  }));
              }}
            />
          ))}
        {markerData &&
          markerData.length > 0 &&
          markerData.map(
            (marker) =>
              showMarkerData?.[marker.lat + marker.long] === true && (
                <Overlay
                  key={marker.lat + marker.long}
                  anchor={[marker.lat, marker.long]}
                  offset={[-20, 50]}
                >
                  <div
                    dir="rtl"
                    className="border-border300 min-w-[150px] rounded-lg border-1 bg-white p-2 opacity-80"
                  >
                    <div>
                      <X
                        className="-mr-1 -mt-2 w-4 cursor-pointer"
                        onClick={() => {
                          setShowMarkerData((prev) => ({
                            ...prev,
                            [marker.lat + marker.long]: false,
                          }));
                        }}
                      />
                    </div>
                    {marker.data}
                  </div>
                </Overlay>
              ),
          )}
      </Map>
      <input
        name="longitude"
        type="hidden"
        value={selectedLocation?.[1] || ""}
      />
      <input
        name="latitude"
        type="hidden"
        value={selectedLocation?.[0] || ""}
      />
    </div>
  );
};
export default MapCustom;
