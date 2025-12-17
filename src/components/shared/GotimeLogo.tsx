/**
 * GotimeLogo Component
 * Reusable Gotime logo SVG component
 */

import React from "react";

type LogoSize = 'small' | 'medium' | 'large';

interface GotimeLogoProps {
  /** Size of the logo: 'small' (24px), 'medium' (36px), 'large' (48px), or custom number */
  size?: LogoSize | number;
  /** Enable hover animation */
  animate?: boolean;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Click handler */
  onClick?: () => void;
}

const SIZE_MAP: Record<LogoSize, number> = {
  small: 24,
  medium: 36,
  large: 48,
};

export const GotimeLogo: React.FC<GotimeLogoProps> = ({
  size = 'medium',
  animate = false,
  style,
  onClick,
}) => {
  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size];

  const containerStyle: React.CSSProperties = {
    width: pixelSize,
    height: pixelSize,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: animate ? "transform 0.3s ease" : undefined,
    cursor: onClick || animate ? "pointer" : undefined,
    ...style,
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (animate) {
      e.currentTarget.style.transform = "scale(1.1) rotate(5deg)";
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (animate) {
      e.currentTarget.style.transform = "scale(1) rotate(0deg)";
    }
  };

  return (
    <div
      style={containerStyle}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 29 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.5 30C22.5081 30 29 23.2843 29 15C29 6.71573 22.5081 0 14.5 0C6.49187 0 0 6.71573 0 15C0 23.2843 6.49187 30 14.5 30Z"
          fill="#FADB14"
        />
        <path
          d="M21.75 11.25C21.75 13.3211 20.1266 15 18.125 15C16.1234 15 14.5 13.3211 14.5 11.25C14.5 9.17893 16.1234 7.5 18.125 7.5C20.1266 7.5 21.75 9.17893 21.75 11.25Z"
          fill="#FFF566"
        />
        <path
          d="M14.5 15C14.5 21.2132 10.4281 26.25 5.4375 26.25C5.4375 20.0368 9.50937 15 14.5 15Z"
          fill="#FADB14"
        />
      </svg>
    </div>
  );
};
