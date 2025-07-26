import React, { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@heroui/button";

type RateItProps = {
  loading: boolean;
  handleSubmitRate: (rate: number) => void;
  submitedRate: boolean;
};

const RateIt: React.FC<RateItProps> = ({
  loading,
  handleSubmitRate,
  submitedRate,
}) => {
  const [rate, setRate] = useState<number>(0);
  const [clickedRate, setClickedRate] = useState<number | null>(null);

  const handleClick = (val: number) => {
    setClickedRate(val);
  };

  const handleHover = (val: number) => {
    setRate(val);
  };

  const renderStars = () => {
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < rate) {
        stars.push(
          <Star
            fill="#e6ae2c"
            style={{ color: "#e6ae2c", fontSize: "35px" }}
            key={i}
            onMouseEnter={() => handleHover(i + 1)}
            onMouseLeave={() => handleHover(clickedRate || 0)}
            onClick={() => handleClick(i + 1)}
          />,
        );
      } else {
        stars.push(
          <Star
            style={{ color: "#e6ae2c", fontSize: "35px" }}
            key={i}
            onMouseEnter={() => handleHover(i + 1)}
            onMouseLeave={() => handleHover(clickedRate || 0)}
            onClick={() => handleClick(i + 1)}
          />,
        );
      }
    }
    return stars;
  };

  return (
    <div className={""}>
      <div className="flex items-center gap-1">
        <div className={"flex gap-1"}>{renderStars()}</div>
        {clickedRate !== null &&
          (submitedRate ? (
            <Button size="sm" className="">
              ثبت شد
            </Button>
          ) : (
            <Button
              isLoading={loading}
              size="sm"
              type="button"
              onClick={() => handleSubmitRate(rate)}
              disabled={loading || submitedRate}
            >
              ثبت {clickedRate}
            </Button>
          ))}
      </div>
    </div>
  );
};

export default RateIt;
