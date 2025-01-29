import React from 'react';

interface LogoProps {
  /**
   * Color theme for the logo - 'white' or 'black'
   * @default 'black'
   */
  theme?: 'white' | 'black';
  
  /**
   * Width of the logo in pixels
   * @default 200
   */
  width?: number;
  
  /**
   * Height of the logo in pixels
   * @default 120
   */
  height?: number;
  
  /**
   * Optional CSS class name
   */
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  theme = 'black',
  width = 200,
  height = 120,
  className
}) => {
  // Define color schemes based on theme
  const colors = {
    white: {
    //   primary: '#FFFFFF',
    //   primaryDark: '#F0F0F0',
    //   primaryLight: '#FFFFFF',
    //   secondary: '#FAFAFA',
    primary: '#0042B6',
      primaryDark: '#0124A8',
      primaryLight: '#008ADD',
      secondary: '#00C8FF',
      text: '#FFFFFF'
    },
    black: {
      primary: '#0042B6',
      primaryDark: '#0124A8',
      primaryLight: '#008ADD',
      secondary: '#00C8FF',
      text: '#000000'
    }
  };

  const currentColors = colors[theme];

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={width}
      height={height}
      viewBox="75.55563354492188 160.00050354003906 414.9183786621094 255"
      className={className}
    >
      <svg 
        version="1.1" 
        x="145.55563354492188" 
        y="230.00050354003906" 
        viewBox="302.5123291015625 208.37301635742188 148.8212890625 179.2659912109375" 
        enableBackground="new 0 0 1200 600"
        height="115" 
        width="95.46875" 
        preserveAspectRatio="xMinYMin"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="302.5122" y1="264.5029" x2="401.0527" y2="264.5029">
            <stop offset="0" style={{ stopColor: currentColors.primary }}/>
            <stop offset="1" style={{ stopColor: currentColors.secondary }}/>
          </linearGradient>
          <linearGradient id="SVGID_2_" gradientUnits="userSpaceOnUse" x1="313.1147" y1="341.0869" x2="402.5728" y2="341.0869">
            <stop offset="0" style={{ stopColor: currentColors.primaryDark }}/>
            <stop offset="1" style={{ stopColor: currentColors.secondary }}/>
          </linearGradient>
          <linearGradient id="SVGID_3_" gradientUnits="userSpaceOnUse" x1="377.1973" y1="317.4189" x2="451.3335" y2="317.4189">
            <stop offset="0" style={{ stopColor: currentColors.primary }}/>
            <stop offset="1" style={{ stopColor: currentColors.secondary }}/>
          </linearGradient>
          <linearGradient id="SVGID_4_" gradientUnits="userSpaceOnUse" x1="407.7388" y1="290.978" x2="357.6001" y2="290.978">
            <stop offset="0" style={{ stopColor: currentColors.primary }}/>
            <stop offset="0.5" style={{ stopColor: currentColors.primaryLight }}/>
            <stop offset="1" style={{ stopColor: currentColors.secondary }}/>
          </linearGradient>
          <linearGradient id="SVGID_5_" gradientUnits="userSpaceOnUse" x1="436.1396" y1="282.1709" x2="391.1799" y2="256.2134">
            <stop offset="0" style={{ stopColor: currentColors.primaryDark }}/>
            <stop offset="0.5" style={{ stopColor: currentColors.primaryLight }}/>
            <stop offset="1" style={{ stopColor: currentColors.secondary }}/>
          </linearGradient>
        </defs>

        <path fill="url(#SVGID_1_)" d="M313.115,320.634c0,0-23.856-23.552,0-48.179l64.083-64.082l23.855,23.388L313.115,320.634z"/>
        <polygon fill="url(#SVGID_2_)" points="338.939,294.535 313.115,320.634 377.197,387.639 402.573,362.381"/>
        <path fill="url(#SVGID_3_)" d="M441.749,272.457c0,0,22.451,22.078-1.369,51.026l-37.807,38.897l-25.375-26.55L441.749,272.457z"/>
        <polygon fill="url(#SVGID_4_)" points="380.325,316.51 357.6,293.555 385.851,265.445 407.739,288.511"/>
        <polygon fill="url(#SVGID_5_)" points="416.254,297.486 385.851,265.445 410.641,240.653 441.749,272.457"/>
      </svg>
      
      <svg 
        x="273.024" 
        y="257.495" 
        viewBox="2.4000000953674316 10.649999618530273 147.45001220703125 57.400001525878906" 
        height="57.400001525878906" 
        width="147.45001220703125" 
        style={{ overflow: 'visible' }}
      >
        <g fill={currentColors.text}>
          <path d="M2.40 39.53L2.40 39.53Q2.40 32.15 5.87 27.75Q9.33 23.35 15.07 23.35L15.07 23.35Q20.48 23.35 23.58 27.12L23.58 27.12L23.90 23.93L30.31 23.93L30.31 54.62Q30.31 60.85 26.43 64.45Q22.56 68.05 15.97 68.05L15.97 68.05Q12.49 68.05 9.17 66.60Q5.85 65.15 4.13 62.81L4.13 62.81L7.49 58.54Q10.77 62.43 15.56 62.43L15.56 62.43Q19.10 62.43 21.15 60.52Q23.20 58.60 23.20 54.89L23.20 54.89L23.20 52.75Q20.13 56.17 15.01 56.17L15.01 56.17Q9.45 56.17 5.92 51.76Q2.40 47.34 2.40 39.53ZM9.48 40.14L9.48 40.14Q9.48 44.91 11.42 47.64Q13.37 50.38 16.82 50.38L16.82 50.38Q21.12 50.38 23.20 46.69L23.20 46.69L23.20 32.77Q21.18 29.17 16.88 29.17L16.88 29.17Q13.37 29.17 11.42 31.95Q9.48 34.73 9.48 40.14ZM51.55 56.17L51.55 56.17Q44.79 56.17 40.59 51.92Q36.40 47.66 36.40 40.58L36.40 40.58L36.40 39.70Q36.40 34.96 38.22 31.23Q40.05 27.50 43.36 25.42Q46.66 23.35 50.73 23.35L50.73 23.35Q57.20 23.35 60.72 27.47Q64.25 31.60 64.25 39.15L64.25 39.15L64.25 42.01L43.56 42.01Q43.88 45.93 46.18 48.21Q48.48 50.50 51.96 50.50L51.96 50.50Q56.85 50.50 59.92 46.55L59.92 46.55L63.75 50.20Q61.85 53.04 58.67 54.61Q55.50 56.17 51.55 56.17ZM50.70 29.05L50.70 29.05Q47.78 29.05 45.98 31.10Q44.18 33.15 43.68 36.80L43.68 36.80L57.23 36.80L57.23 36.28Q56.99 32.71 55.32 30.88Q53.66 29.05 50.70 29.05ZM97.54 39.67L97.54 40.08Q97.54 47.45 94.25 51.81Q90.96 56.17 85.20 56.17L85.20 56.17Q79.64 56.17 76.54 52.16L76.54 52.16L76.18 55.59L69.75 55.59L69.75 10.65L76.86 10.65L76.86 26.97Q79.93 23.35 85.14 23.35L85.14 23.35Q90.93 23.35 94.24 27.65Q97.54 31.95 97.54 39.67L97.54 39.67ZM90.43 40.37L90.43 39.47Q90.43 34.32 88.62 31.74Q86.80 29.17 83.35 29.17L83.35 29.17Q78.73 29.17 76.86 33.21L76.86 33.21L76.86 46.25Q78.76 50.38 83.41 50.38L83.41 50.38Q86.75 50.38 88.56 47.89Q90.37 45.41 90.43 40.37L90.43 40.37ZM120.10 23.76L120.07 30.43Q118.66 30.19 117.17 30.19L117.17 30.19Q112.29 30.19 110.59 33.94L110.59 33.94L110.59 55.59L103.48 55.59L103.48 23.93L110.27 23.93L110.44 27.47Q113.02 23.35 117.58 23.35L117.58 23.35Q119.10 23.35 120.10 23.76L120.10 23.76ZM149.85 55.59L142.60 55.59Q142.13 54.68 141.78 52.63L141.78 52.63Q138.38 56.17 133.47 56.17L133.47 56.17Q128.70 56.17 125.69 53.45Q122.67 50.73 122.67 46.72L122.67 46.72Q122.67 41.66 126.43 38.96Q130.19 36.25 137.18 36.25L137.18 36.25L141.54 36.25L141.54 34.17Q141.54 31.71 140.17 30.24Q138.79 28.76 135.98 28.76L135.98 28.76Q133.56 28.76 132.01 29.97Q130.46 31.19 130.46 33.06L130.46 33.06L123.35 33.06Q123.35 30.46 125.07 28.19Q126.80 25.92 129.77 24.63Q132.74 23.35 136.39 23.35L136.39 23.35Q141.95 23.35 145.26 26.14Q148.57 28.93 148.65 34.00L148.65 34.00L148.65 48.27Q148.65 52.54 149.85 55.09L149.85 55.09L149.85 55.59ZM134.79 50.47L134.79 50.47Q136.89 50.47 138.75 49.44Q140.61 48.42 141.54 46.69L141.54 46.69L141.54 40.73L137.71 40.73Q133.76 40.73 131.77 42.10Q129.78 43.48 129.78 45.99L129.78 45.99Q129.78 48.04 131.14 49.25Q132.50 50.47 134.79 50.47Z"/>
        </g>
      </svg>
    </svg>
  );
};

export default Logo;