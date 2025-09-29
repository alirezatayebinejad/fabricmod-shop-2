import React, { useState } from "react";
import { Star } from "lucide-react";

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
  const [hoverRate, setHoverRate] = useState<number>(0);
  const [clickedRate, setClickedRate] = useState<number | null>(null);

  const handleClick = (val: number) => {
    setClickedRate(val);
    handleSubmitRate(val); // ارسال مستقیم امتیاز
  };

  const renderStars = () => {
    return [...Array(5)].map((_, i) => {
      // از راست به چپ → index برعکس میشه
      const starValue = 5 - i;
      const isFilled =
        hoverRate >= starValue || clickedRate === starValue || (clickedRate ?? 0) >= starValue;

      return (
        <Star
          key={starValue}
          onMouseEnter={() => setHoverRate(starValue)}
          onMouseLeave={() => setHoverRate(0)}
          onClick={() => !loading && !submitedRate && handleClick(starValue)}
          className="cursor-pointer transition"
          fill={isFilled ? "#e6ae2c" : "transparent"}
          stroke="#e6ae2c"
          size={35}
        />
      );
    });
  };

  return (
    <div className="flex items-center gap-2">
      {/* flex-row-reverse برای راست به چپ شدن ترتیب ستاره‌ها */}
      <div className="flex flex-row-reverse gap-1">{renderStars()}</div>
      {clickedRate && (
        <span className="text-sm text-gray-600">
          {submitedRate ? "ثبت شد" : `امتیاز شما: ${clickedRate}`}
        </span>
      )}
    </div>
  );
};

export default RateIt;
