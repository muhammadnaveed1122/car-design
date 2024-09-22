import { IconArrowBarToRight, IconArrowBarToLeft, IconArrowLeft, IconArrowRight, IconGripHorizontal } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Pagination } from '@mantine/core';

export default function MyPagination({ totalPages, onChange,value=1 }) {


  return (
    <>
      <Pagination
        total={totalPages}
        position="center"
        withEdges
        nextIcon={IconArrowRight}
        previousIcon={IconArrowLeft}
        firstIcon={IconArrowBarToLeft}
        lastIcon={IconArrowBarToRight}
        dotsIcon={IconGripHorizontal}
        value={value} // Use value from props
        onChange={onChange}
      />
    </>
  );
}