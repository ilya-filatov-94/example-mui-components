import { ComponentProps } from 'react';
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

export const NoMaxWidthTooltip = styled(
  ({ children, className, ...props }: 
    ComponentProps<typeof Tooltip> & { className?: string }
  ) => (
    <Tooltip {...props} classes={{ popper: className }}>
      {children}
    </Tooltip>
  )
)({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 'none',
    whiteSpace: 'pre',
  },
});


// import { TooltipProps } from "@mui/material/Tooltip";
// interface NoMaxWidthTooltipProps extends TooltipProps {
//   className?: string;  // styled добавит сюда класс
// }

// const NoMaxWidthTooltipContent = ({
//   children,
//   className,
//   ...props
// }: NoMaxWidthTooltipProps) => (
//   <Tooltip {...props} classes={{ popper: className }}>
//     {children}
//   </Tooltip>
// );

// export const NoMaxWidthTooltip = styled(NoMaxWidthTooltipContent)({
//   [`& .${tooltipClasses.tooltip}`]: {
//     maxWidth: 'none',
//     whiteSpace: 'pre',
//   },
// });