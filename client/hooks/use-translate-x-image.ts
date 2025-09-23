import { useEffect, useState } from "react";
import useScrollHandling from "@/hooks/use-scroll-handling";

const useTranslateXImage = (threshold: number = 1596, max: number = 5) => {
  const { scrollPosition, scrollDirection } = useScrollHandling();
  const [translateXPosition, setTranslateXPosition] = useState<number>(max);

  const handleTranslateXPosition = () => {
    if (scrollDirection === "down" && scrollPosition >= threshold) {
      setTranslateXPosition((prev) => (prev <= 0 ? 0 : prev - 1));
    } else if (scrollDirection === "up") {
      setTranslateXPosition((prev) => (prev >= max ? max : prev + 1));
    }
  };

  useEffect(() => {
    handleTranslateXPosition();
  }, [scrollPosition, scrollDirection]);

  return { translateXPosition };
};

export default useTranslateXImage;
