export function Settings({fillColor = '#FFFFFF'}: {fillColor?: string}) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={fillColor}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12ZM13.2 12C13.2 12.3183 13.0736 12.6235 12.8485 12.8485C12.6235 13.0736 12.3183 13.2 12 13.2C11.6817 13.2 11.3765 13.0736 11.1515 12.8485C10.9264 12.6235 10.8 12.3183 10.8 12C10.8 11.6817 10.9264 11.3765 11.1515 11.1515C11.3765 10.9264 11.6817 10.8 12 10.8C12.3183 10.8 12.6235 10.9264 12.8485 11.1515C13.0736 11.3765 13.2 11.6817 13.2 12Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.2524 3C10.1412 3 9.24117 3.9 9.24117 5.0112V5.8368C9.24117 5.904 9.18957 6.0408 9.00357 6.138C8.81997 6.234 8.63997 6.3396 8.46597 6.4524C8.28957 6.5688 8.14437 6.5436 8.08437 6.51L7.36437 6.0948C7.13564 5.96262 6.88312 5.87679 6.62122 5.84222C6.35931 5.80766 6.09317 5.82502 5.83798 5.89333C5.58279 5.96164 5.34356 6.07956 5.13396 6.24034C4.92435 6.40113 4.74847 6.60163 4.61637 6.8304L3.86997 8.1264C3.60339 8.58822 3.53113 9.13701 3.66908 9.6521C3.80702 10.1672 4.14387 10.6064 4.60557 10.8732L5.38317 11.322C5.44077 11.3556 5.53197 11.466 5.52597 11.67C5.52008 11.856 5.52208 12.0422 5.53197 12.228C5.54277 12.438 5.44797 12.552 5.38917 12.5868L4.60557 13.0392C4.3768 13.1713 4.17629 13.3472 4.01551 13.5568C3.85472 13.7664 3.73681 14.0056 3.6685 14.2608C3.60019 14.516 3.58282 14.7821 3.61739 15.044C3.65196 15.3059 3.73778 15.5585 3.86997 15.7872L4.61757 17.0832C4.74967 17.312 4.92555 17.5125 5.13516 17.6733C5.34476 17.834 5.58399 17.952 5.83918 18.0203C6.09437 18.0886 6.36051 18.1059 6.62242 18.0714C6.88432 18.0368 7.13684 17.951 7.36557 17.8188L8.20557 17.3328C8.26317 17.2992 8.40477 17.2752 8.57997 17.3844C8.71797 17.4696 8.85957 17.5512 9.00357 17.6268C9.18957 17.7228 9.24117 17.8608 9.24117 17.928V18.9012C9.24117 20.0124 10.1412 20.9124 11.2524 20.9124H12.7476C13.8588 20.9124 14.7588 20.0124 14.7588 18.9012V17.9292C14.7588 17.8608 14.8092 17.724 14.9952 17.6268C15.1404 17.5512 15.282 17.4708 15.42 17.3844C15.5952 17.2752 15.7368 17.3004 15.7944 17.3328L16.6344 17.8188C16.8632 17.9509 17.1158 18.0367 17.3777 18.0712C17.6396 18.1056 17.9058 18.0882 18.161 18.0198C18.4162 17.9513 18.6554 17.8333 18.865 17.6724C19.0746 17.5115 19.2504 17.3109 19.3824 17.082L20.13 15.786C20.3965 15.3242 20.4688 14.7754 20.3309 14.2603C20.1929 13.7452 19.8561 13.306 19.3944 13.0392L18.6108 12.5868C18.5508 12.552 18.4572 12.4392 18.468 12.2268C18.4778 12.0418 18.4798 11.8564 18.474 11.6712C18.468 11.466 18.558 11.3556 18.618 11.322L19.3944 10.8732C19.6231 10.7411 19.8236 10.5652 19.9844 10.3556C20.1452 10.146 20.2631 9.90677 20.3314 9.65158C20.3997 9.3964 20.4171 9.13025 20.3825 8.86835C20.348 8.60645 20.2621 8.35392 20.13 8.1252L19.3824 6.8304C19.2503 6.60163 19.0744 6.40113 18.8648 6.24034C18.6552 6.07956 18.4159 5.96164 18.1608 5.89333C17.9056 5.82502 17.6394 5.80766 17.3775 5.84222C17.1156 5.87679 16.8631 5.96262 16.6344 6.0948L15.9144 6.51C15.8556 6.5436 15.7104 6.5676 15.5328 6.4524C15.3587 6.33904 15.1793 6.23412 14.9952 6.138C14.8092 6.0408 14.7588 5.904 14.7588 5.8368V5.0112C14.7588 3.9 13.8588 3 12.7476 3H11.2524ZM11.0412 5.0112C11.0412 4.8948 11.1348 4.8 11.2524 4.8H12.7476C12.864 4.8 12.9588 4.8948 12.9588 5.0112V5.8368C12.9588 6.7104 13.5132 7.3944 14.1624 7.7328C14.2944 7.8024 14.4252 7.8792 14.55 7.9608C15.1704 8.3652 16.05 8.5104 16.8156 8.0688L17.5356 7.6536C17.584 7.62571 17.6414 7.61813 17.6954 7.63253C17.7494 7.64692 17.7955 7.68211 17.8236 7.7304L18.5712 9.0264C18.5991 9.0748 18.6066 9.13228 18.5922 9.18626C18.5778 9.24024 18.5427 9.28631 18.4944 9.3144L17.7168 9.7632C16.9692 10.1952 16.6512 11.004 16.6752 11.7288C16.679 11.8636 16.6774 11.9985 16.6704 12.1332C16.632 12.8712 16.9464 13.7052 17.7108 14.1456L18.4944 14.598C18.5427 14.6261 18.5778 14.6722 18.5922 14.7261C18.6066 14.7801 18.5991 14.8376 18.5712 14.886L17.8236 16.182C17.7957 16.2305 17.7497 16.2659 17.6957 16.2806C17.6417 16.2952 17.5841 16.2878 17.5356 16.26L16.6944 15.774C15.9456 15.342 15.0852 15.4728 14.4684 15.8568C14.3686 15.9186 14.2665 15.9766 14.1624 16.0308C13.5144 16.3704 12.9588 17.0544 12.9588 17.928V18.9012C12.9588 18.9572 12.9365 19.0109 12.8969 19.0505C12.8573 19.0901 12.8036 19.1124 12.7476 19.1124H11.2524C11.1964 19.1124 11.1426 19.0901 11.103 19.0505C11.0634 19.0109 11.0412 18.9572 11.0412 18.9012V17.9292C11.0412 17.0532 10.4868 16.3692 9.83757 16.0308C9.73339 15.9763 9.63131 15.9178 9.53157 15.8556C8.91477 15.4716 8.05557 15.342 7.30557 15.774L6.46557 16.26C6.44148 16.2739 6.41487 16.283 6.38727 16.2866C6.35967 16.2902 6.33162 16.2884 6.30475 16.2811C6.27787 16.2739 6.25269 16.2614 6.23066 16.2444C6.20863 16.2274 6.19018 16.2062 6.17637 16.182L5.42877 14.886C5.40088 14.8376 5.3933 14.7801 5.40769 14.7261C5.42209 14.6722 5.45728 14.6261 5.50557 14.598L6.28917 14.1456C7.05357 13.704 7.36797 12.8712 7.32957 12.1332C7.32224 11.9985 7.32064 11.8636 7.32477 11.7288C7.34877 11.004 7.03077 10.1952 6.28317 9.7632L5.50557 9.3144C5.45728 9.28631 5.42209 9.24024 5.40769 9.18626C5.3933 9.13228 5.40088 9.0748 5.42877 9.0264L6.17637 7.7304C6.20445 7.68211 6.25053 7.64692 6.30451 7.63253C6.35848 7.61813 6.41596 7.62571 6.46437 7.6536L7.18437 8.0688C7.94997 8.5104 8.82837 8.3652 9.44997 7.9608C9.57539 7.87855 9.70474 7.80246 9.83757 7.7328C10.4856 7.3944 11.0412 6.7104 11.0412 5.8368V5.0112Z"
      />
    </svg>
  );
}
