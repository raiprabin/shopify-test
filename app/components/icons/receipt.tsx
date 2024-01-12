const Receipt = ({fillColor = '#0F1010'}: {fillColor?: string}) => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.5 10C15.1022 10 14.7206 10.158 14.4393 10.4393C14.158 10.7206 14 11.1022 14 11.5C14 11.8978 14.158 12.2794 14.4393 12.5607C14.7206 12.842 15.1022 13 15.5 13H24.5C24.8978 13 25.2794 12.842 25.5607 12.5607C25.842 12.2794 26 11.8978 26 11.5C26 11.1022 25.842 10.7206 25.5607 10.4393C25.2794 10.158 24.8978 10 24.5 10H15.5Z"
        fill={fillColor}
      />
      <path
        d="M14 17.5C14 17.1022 14.158 16.7206 14.4393 16.4393C14.7206 16.158 15.1022 16 15.5 16H18.5C18.8978 16 19.2794 16.158 19.5607 16.4393C19.842 16.7206 20 17.1022 20 17.5C20 17.8978 19.842 18.2794 19.5607 18.5607C19.2794 18.842 18.8978 19 18.5 19H15.5C15.1022 19 14.7206 18.842 14.4393 18.5607C14.158 18.2794 14 17.8978 14 17.5Z"
        fill={fillColor}
      />
      <path
        d="M15.5 22C15.1022 22 14.7206 22.158 14.4393 22.4393C14.158 22.7206 14 23.1022 14 23.5C14 23.8978 14.158 24.2794 14.4393 24.5607C14.7206 24.842 15.1022 25 15.5 25H18.5C18.8978 25 19.2794 24.842 19.5607 24.5607C19.842 24.2794 20 23.8978 20 23.5C20 23.1022 19.842 22.7206 19.5607 22.4393C19.2794 22.158 18.8978 22 18.5 22H15.5Z"
        fill={fillColor}
      />
      <path
        d="M22 17.5C22 17.1022 22.158 16.7206 22.4393 16.4393C22.7206 16.158 23.1022 16 23.5 16H24.5C24.8978 16 25.2794 16.158 25.5607 16.4393C25.842 16.7206 26 17.1022 26 17.5C26 17.8978 25.842 18.2794 25.5607 18.5607C25.2794 18.842 24.8978 19 24.5 19H23.5C23.1022 19 22.7206 18.842 22.4393 18.5607C22.158 18.2794 22 17.8978 22 17.5Z"
        fill={fillColor}
      />
      <path
        d="M23.5 22C23.1022 22 22.7206 22.158 22.4393 22.4393C22.158 22.7206 22 23.1022 22 23.5C22 23.8978 22.158 24.2794 22.4393 24.5607C22.7206 24.842 23.1022 25 23.5 25H24.5C24.8978 25 25.2794 24.842 25.5607 24.5607C25.842 24.2794 26 23.8978 26 23.5C26 23.1022 25.842 22.7206 25.5607 22.4393C25.2794 22.158 24.8978 22 24.5 22H23.5Z"
        fill={fillColor}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 32C8.00015 32.6067 8.18428 33.1992 8.52807 33.6991C8.87186 34.199 9.35915 34.583 9.92565 34.8003C10.4921 35.0175 11.1112 35.058 11.7011 34.9162C12.2911 34.7744 12.8241 34.457 13.23 34.006L15.5 31.486L17.77 34.006C18.0513 34.3186 18.3952 34.5686 18.7794 34.7397C19.1636 34.9108 19.5794 34.9992 20 34.9992C20.4206 34.9992 20.8364 34.9108 21.2206 34.7397C21.6048 34.5686 21.9487 34.3186 22.23 34.006L24.5 31.486L26.77 34.006C27.1759 34.457 27.7089 34.7744 28.2989 34.9162C28.8888 35.058 29.5079 35.0175 30.0744 34.8003C30.6408 34.583 31.1281 34.199 31.4719 33.6991C31.8157 33.1992 31.9998 32.6067 32 32V10C32 8.67392 31.4732 7.40215 30.5355 6.46447C29.5979 5.52678 28.3261 5 27 5H13C11.6739 5 10.4021 5.52678 9.46447 6.46447C8.52678 7.40215 8 8.67392 8 10V32ZM13 8C12.4696 8 11.9609 8.21071 11.5858 8.58579C11.2107 8.96086 11 9.46957 11 10V32L14.014 28.652C14.2015 28.4438 14.4307 28.2773 14.6867 28.1634C14.9427 28.0495 15.2198 27.9906 15.5 27.9906C15.7802 27.9906 16.0573 28.0495 16.3133 28.1634C16.5693 28.2773 16.7985 28.4438 16.986 28.652L20 32L23.014 28.652C23.2015 28.4438 23.4307 28.2773 23.6867 28.1634C23.9427 28.0495 24.2198 27.9906 24.5 27.9906C24.7802 27.9906 25.0573 28.0495 25.3133 28.1634C25.5693 28.2773 25.7985 28.4438 25.986 28.652L29 32V10C29 9.46957 28.7893 8.96086 28.4142 8.58579C28.0391 8.21071 27.5304 8 27 8H13Z"
        fill={fillColor}
      />
    </svg>
  );
};

export default Receipt;