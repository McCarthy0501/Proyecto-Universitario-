function Skeleton({ className = '', width, height, rounded = 'rounded-lg' }) {
 const style = {};
 if (width) style.width = typeof width === 'number' ? `${width}px` : width;
 if (height) style.height = typeof height === 'number' ? `${height}px` : height;

 return (
 <div
 className={`animate-pulse bg-gray-200 ${rounded} ${className}`}
 style={style}
 />
 );
}

export default Skeleton;
