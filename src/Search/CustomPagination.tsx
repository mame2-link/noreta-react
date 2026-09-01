import { usePagination, UsePaginationProps } from "react-instantsearch";
import Pagination from "@mui/material/Pagination";
// import PaginationItem from "@mui/material/PaginationItem";
// import Link from "@mui/material/Link";
// import Stack from "@mui/material/Stack";
// import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import { Button, IconButton } from "@mui/material";

export function CustomPagination(props: UsePaginationProps) {
  const {
    // pages,
    currentRefinement,
    nbPages,
    // isFirstPage,
    // isLastPage,
    refine,
    // createURL,
  } = usePagination(props);
  // const firstPageIndex = 0;
  // const previousPageIndex = currentRefinement - 1;
  // const nextPageIndex = currentRefinement + 1;
  // const lastPageIndex = nbPages - 1;

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    if (isModifierClick(event)) {
      return;
    }
    event.preventDefault();
    refine(value - 1);
  };

  return (
    <Pagination
      count={nbPages}
      page={currentRefinement + 1}
      onChange={handleChange}
      sx={{ my: 2 }}
    />
    // <Stack direction="row" spacing={2}>
    //   <PaginationRenderItem
    //     disabled={isFirstPage}
    //     href={createURL(firstPageIndex)}
    //     onClick={() => refine(firstPageIndex)}
    //   >
    //     First
    //   </PaginationRenderItem>
    //   <PaginationRenderItem
    //     isDisabled={isFirstPage}
    //     href={createURL(previousPageIndex)}
    //     onClick={() => refine(previousPageIndex)}
    //   >
    //     <ArrowBackIosNewIcon />
    //   </PaginationRenderItem>
    //   {pages.map((page) => {
    //     const label = page + 1;
    //     return (
    //       <PaginationRenderItem
    //         aria-label={`Page ${label}`}
    //         href={createURL(page)}
    //         onClick={() => refine(page)}
    //       >
    //         {label}
    //       </PaginationRenderItem>
    //     );
    //   })}
    //   <PaginationRenderItem
    //     isDisabled={isLastPage}
    //     href={createURL(nextPageIndex)}
    //     onClick={() => refine(nextPageIndex)}
    //   >
    //     Next
    //   </PaginationRenderItem>
    //   <PaginationRenderItem
    //     isDisabled={isLastPage}
    //     href={createURL(lastPageIndex)}
    //     onClick={() => refine(lastPageIndex)}
    //   >
    //     Last
    //   </PaginationRenderItem>
    // </Stack>
  );
}

// function PaginationRenderItem({ isDisabled, href, onClick, ...props }) {
//   console.log(props);
//   if (isDisabled) {
//     return <span {...props} />;
//   }

//   return (
//     <Button
//       href={href}
//       onClick={(event) => {
//         if (isModifierClick(event)) {
//           return;
//         }
//         event.preventDefault();
//         onClick(event);
//       }}
//       {...props}
//     />
//   );
// }

function isModifierClick(event: React.ChangeEvent<unknown>) {
  const nativeEvent = event.nativeEvent as MouseEvent;
  const isMiddleClick = nativeEvent.button === 1;

  return Boolean(
    isMiddleClick ||
    nativeEvent.altKey ||
    nativeEvent.ctrlKey ||
    nativeEvent.metaKey ||
    nativeEvent.shiftKey
  );
}
