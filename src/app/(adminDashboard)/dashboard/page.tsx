import RecentServiceList from "./_components/RecentServiceList/RecentServiceList";
import StatContainer from "./_components/stats/StatContainer";
import ViewReportChart from "./_components/ViewReportChart/ViewReportChart";

const DashboardPage = () => {
  return (
    <div className="lg:space-y-7 space-y-5 ">
      <StatContainer />
      <ViewReportChart />
      <RecentServiceList />
    </div>
  );
};

export default DashboardPage;
