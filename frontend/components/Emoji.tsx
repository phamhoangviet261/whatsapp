import React from "react";

const Emoji = 
  ({
    className,
    label,
    symbol,
    data,
  }: {className: string,
    label: string,
    symbol: number, data: any}) => {
    // console.log({symbol})
    return (
      <span className={className} role="img" aria-label={label} onClick={() => {console.log({data})}}>
        {String.fromCodePoint(symbol)}
      </span>
    )
  }
// Emoji.displayName = "Emoji";

// type Props = {
//   className: string;
//   label: string;
//   symbol: number;
//   onClick: () => void;
// }
export default Emoji;
