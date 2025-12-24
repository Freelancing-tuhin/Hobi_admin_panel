import NewCustomers from 'src/components/dashboards/Dashboard2/NewCustomers';
import TotalIncome from 'src/components/dashboards/Dashboard2/TotalIncome';
import WeeklyStats from 'src/components/dashboards/Dashboard2/WeeklyStats';

const Dashboard2 = () => {
  return (
    <>
      <div className="grid grid-cols-12 gap-30 mt-8">
        <div className="lg:col-span-4 col-span-12">
          <NewCustomers />
          <TotalIncome />
        </div>
        <div className="lg:col-span-4 col-span-12">
          {/* <AnnualProfit /> */}
          <WeeklyStats />
        </div>
       
      </div>
    </>
  );
};

export default Dashboard2;
