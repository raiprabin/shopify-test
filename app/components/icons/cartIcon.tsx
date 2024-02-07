import type {SVGProps} from 'react';

export const CartIcon = ({
  fill = '#FFE600',
  className,
  width = 20,
  height = 20,
}: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <mask
        id="mask0_4518_17123"
        mask-type="luminance"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="16"
        height="16"
      >
        <path d="M0 0H16V16H0V0Z" fill="white" />
      </mask>
      <g mask="url(#mask0_4518_17123)">
        <path
          d="M4.80024 12.8003C3.91625 12.8003 3.20825 13.5163 3.20825 14.4003C3.20825 15.2843 3.91625 16.0003 4.80024 16.0003C5.68423 16.0003 6.40025 15.2843 6.40025 14.4003C6.40025 13.5163 5.68423 12.8003 4.80024 12.8003Z"
          fill={fill}
        />
        <path
          d="M5.68001 8.8H11.64C12.24 8.8 12.764 8.46802 13.04 7.97602L15.9 2.784C15.964 2.67199 16 2.53999 16 2.4C16 1.956 15.64 1.60001 15.2 1.60001H3.372L2.61199 0H0V1.60001H1.60001L4.476 7.668L3.396 9.62801C3.27199 9.86002 3.19999 10.12 3.19999 10.4C3.19999 11.284 3.91601 12 4.8 12H14.4V10.4H5.14001C5.028 10.4 4.94002 10.312 4.94002 10.2C4.94002 10.164 4.94801 10.132 4.96402 10.104L5.68001 8.8Z"
          fill={fill}
        />
        <path
          d="M12.8002 12.8003C11.9163 12.8003 11.2083 13.5163 11.2083 14.4003C11.2083 15.2843 11.9163 16.0003 12.8002 16.0003C13.6843 16.0003 14.4003 15.2843 14.4003 14.4003C14.4003 13.5163 13.6843 12.8003 12.8002 12.8003Z"
          fill={fill}
        />
      </g>
    </svg>
  );
};