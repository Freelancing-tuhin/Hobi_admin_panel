// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import { ProductProvider } from '../../../context/Ecommercecontext';
import BreadcrumbComp from '../../../layouts/full/shared/breadcrumb/BreadcrumbComp';
import LockScreen from 'src/views/authentication/lockScreen/LockScreen';
import BOkkingsTable from 'src/components/apps/ecommerce/productTableList/BOkkingsTable';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Booking list',
  },
];

const BookingList = () => {
  return (
    <ProductProvider>
      <LockScreen />
      <BreadcrumbComp title="Booking list" items={BCrumb} />
      <BOkkingsTable />
    </ProductProvider>
  );
};

export default BookingList;
