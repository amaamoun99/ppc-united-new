'use client';

/**
 * Decorative cloud components that can hover over/between sections
 * Usage: Place in page.js between section components
 */

// Individual cloud puff - building block
function CloudPuff({ className = '', style = {} }) {
  return (
    <div 
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={style}
    />
  );
}

/**
 * Cloud cluster component - a group of puffs forming one cloud
 * @param {string} position - 'left' | 'center' | 'right'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {string} color - tailwind color class base (e.g., 'blue', 'white', 'slate')
 * @param {number} opacity - base opacity 0-100
 */
function CloudCluster({ position = 'left', size = 'md', color = 'blue', opacity = 50 }) {
  const sizeConfig = {
    sm: { main: 'w-[180px] h-[80px]', mid: 'w-[120px] h-[60px]', small: 'w-[90px] h-[50px]' },
    md: { main: 'w-[300px] h-[120px]', mid: 'w-[180px] h-[90px]', small: 'w-[140px] h-[70px]' },
    lg: { main: 'w-[400px] h-[150px]', mid: 'w-[220px] h-[100px]', small: 'w-[180px] h-[90px]' },
  };

  const positionConfig = {
    left: { main: 'left-[5%]', mid: 'left-[12%]', small: 'left-[2%]' },
    center: { main: 'left-[35%]', mid: 'left-[42%]', small: 'left-[38%]' },
    right: { main: 'right-[8%]', mid: 'right-[15%]', small: 'right-[5%]' },
  };

  const sizes = sizeConfig[size];
  const positions = positionConfig[position];
  const isRight = position === 'right';

  return (
    <>
      <CloudPuff 
        className={`${sizes.main} bg-${color}-100/${opacity} blur-3xl ${isRight ? positions.main : positions.main}`}
        style={{ bottom: 0 }}
      />
      <CloudPuff 
        className={`${sizes.mid} bg-white/${opacity + 20} blur-2xl ${isRight ? positions.mid : positions.mid}`}
        style={{ bottom: size === 'lg' ? 32 : size === 'md' ? 24 : 16 }}
      />
      <CloudPuff 
        className={`${sizes.small} bg-${color}-50/${opacity + 10} blur-xl ${isRight ? positions.small : positions.small}`}
        style={{ bottom: size === 'lg' ? 16 : size === 'md' ? 12 : 8 }}
      />
    </>
  );
}

/**
 * Main Cloud component - positions a full cloud decoration
 * @param {string} variant - 'bridge' | 'left' | 'right' | 'full'
 * @param {string} colorScheme - 'blue' | 'white' | 'slate' | 'purple'
 * @param {number} intensity - opacity intensity 20-80
 * @param {string} className - additional classes for positioning
 */
export function Cloud({ 
  variant = 'full', 
  colorScheme = 'blue', 
  intensity = 50,
  className = ''
}) {
  const baseOpacity = Math.min(80, Math.max(20, intensity));
  
  return (
    <div className={`absolute left-0 right-0 pointer-events-none z-0 ${className}`}>
      <div className="relative h-full w-full">
        {/* Left cluster */}
        {(variant === 'full' || variant === 'left') && (
          <>
            <div 
              className={`absolute bottom-0 left-[5%] w-[350px] h-[130px] rounded-full blur-3xl`}
              style={{ backgroundColor: `rgb(219 234 254 / ${baseOpacity/100})` }} // blue-100
            />
            <div 
              className={`absolute bottom-6 left-[12%] w-[200px] h-[95px] rounded-full blur-2xl`}
              style={{ backgroundColor: `rgb(255 255 255 / ${(baseOpacity + 20)/100})` }} // white
            />
            <div 
              className={`absolute bottom-2 left-[2%] w-[150px] h-[80px] rounded-full blur-xl`}
              style={{ backgroundColor: `rgb(239 246 255 / ${(baseOpacity + 10)/100})` }} // blue-50
            />
          </>
        )}
        
        {/* Right cluster */}
        {(variant === 'full' || variant === 'right') && (
          <>
            <div 
              className={`absolute bottom-0 right-[8%] w-[380px] h-[140px] rounded-full blur-3xl`}
              style={{ backgroundColor: `rgb(219 234 254 / ${(baseOpacity - 5)/100})` }} // blue-100
            />
            <div 
              className={`absolute bottom-8 right-[15%] w-[190px] h-[90px] rounded-full blur-2xl`}
              style={{ backgroundColor: `rgb(255 255 255 / ${(baseOpacity + 15)/100})` }} // white
            />
            <div 
              className={`absolute bottom-2 right-[5%] w-[140px] h-[75px] rounded-full blur-xl`}
              style={{ backgroundColor: `rgb(239 246 255 / ${(baseOpacity + 5)/100})` }} // blue-50
            />
          </>
        )}
        
        {/* Center bridge - connects left and right */}
        {(variant === 'full' || variant === 'bridge') && (
          <>
            <div 
              className={`absolute bottom-4 left-[30%] w-[320px] h-[60px] rounded-full blur-3xl`}
              style={{ backgroundColor: `rgb(239 246 255 / ${(baseOpacity - 15)/100})` }} // blue-50
            />
            <div 
              className={`absolute bottom-10 left-[42%] w-[160px] h-[45px] rounded-full blur-2xl`}
              style={{ backgroundColor: `rgb(255 255 255 / ${(baseOpacity - 10)/100})` }} // white
            />
          </>
        )}
      </div>
    </div>
  );
}

/**
 * CloudLayer - A positioned cloud layer meant to float between sections
 * Use negative margins or absolute positioning in parent to overlap sections
 */
export function CloudLayer({ 
  position = 'bottom',
  variant = 'full',
  intensity = 50,
  height = 'h-40',
  offset = '-bottom-20',
  zIndex = 'z-[5]'
}) {
  const positionClass = position === 'top' ? `-top-20 ${offset}` : `${offset}`;
  
  return (
    <div 
      className={`absolute left-0 right-0 ${positionClass} pointer-events-none ${zIndex} overflow-visible`}
      style={{ height: 'auto' }}
    >
      <div className={`relative ${height} w-full`}>
        <Cloud variant={variant} intensity={intensity} className="inset-0" />
      </div>
    </div>
  );
}

/**
 * FloatingCloud - Standalone cloud that can be placed anywhere on the page
 * Great for absolute positioning between specific sections
 */
export function FloatingCloud({
  top,
  bottom,
  left,
  right,
  width = 'w-[500px]',
  height = 'h-[200px]',
  intensity = 45,
  variant = 'full',
  zIndex = 5,
  className = ''
}) {
  const style = {};
  if (top !== undefined) style.top = top;
  if (bottom !== undefined) style.bottom = bottom;
  if (left !== undefined) style.left = left;
  if (right !== undefined) style.right = right;
  style.zIndex = zIndex;

  return (
    <div 
      className={`absolute pointer-events-none ${width} ${height} ${className}`}
      style={style}
    >
      <div className="relative w-full h-full">
        {/* Main puff */}
        <div 
          className="absolute bottom-0 left-[10%] w-[70%] h-[80%] rounded-full blur-3xl"
          style={{ backgroundColor: `rgb(219 234 254 / ${intensity/100})` }}
        />
        {/* Highlight */}
        <div 
          className="absolute bottom-[15%] left-[25%] w-[50%] h-[60%] rounded-full blur-2xl"
          style={{ backgroundColor: `rgb(255 255 255 / ${(intensity + 20)/100})` }}
        />
        {/* Accent */}
        <div 
          className="absolute bottom-[5%] left-[5%] w-[35%] h-[50%] rounded-full blur-xl"
          style={{ backgroundColor: `rgb(239 246 255 / ${(intensity + 10)/100})` }}
        />
        {/* Right accent */}
        <div 
          className="absolute bottom-[10%] right-[10%] w-[30%] h-[45%] rounded-full blur-xl"
          style={{ backgroundColor: `rgb(239 246 255 / ${(intensity + 5)/100})` }}
        />
      </div>
    </div>
  );
}

export default Cloud;

