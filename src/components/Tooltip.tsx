import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  text: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, text }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const timeoutRef = useRef<number | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const showTooltip = (): void => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setIsVisible(true);
  };

  const hideTooltip = (): void => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setIsVisible(false), 300);
  };

  useEffect(() => () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    const tooltipElement = tooltipRef.current;
    if (tooltipElement) {
      const rect = tooltipElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      if (rect.right > viewportWidth) {
        tooltipElement.style.left = 'auto';
        tooltipElement.style.right = '0';
      }
    }
  }, [isVisible]);

  return (
    <div className="relative inline-block">
      <div className="p-2 -m-2" onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
        {children}
      </div>
      <div
        ref={tooltipRef}
        className={`absolute z-10 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg tooltip dark:bg-gray-700 transition-all duration-300 ease-in-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
        }`}
        style={{
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: 'calc(100% + 10px)',
          width: 'max-content',
          maxWidth: '250px',
          pointerEvents: isVisible ? 'auto' : 'none',
        }}
      >
        {text}
        <div
          className="tooltip-arrow"
          style={{
            position: 'absolute',
            bottom: '-5px',
            left: '50%',
            marginLeft: '-5px',
            borderWidth: '5px',
            borderStyle: 'solid',
            borderColor: 'rgb(17, 24, 39) transparent transparent transparent',
          }}
        />
      </div>
    </div>
  );
};

export default Tooltip;


