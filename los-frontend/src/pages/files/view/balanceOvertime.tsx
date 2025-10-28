import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BalanceBarChart } from './charts';
import I8nTextWrapper from '@/translations/i8nTextWrapper';
// import { Button } from "@/components/ui/button";

export default function BalanceOvertime() {
  return (
    <div className="w-full px-4 sm:px-6">
      {/* Heading Centered on Mobile */}
      <h2 className="text-lg sm:text-xl font-semibold my-4 text-center">
        <I8nTextWrapper text="balanceOverTime" />
      </h2>

      {/* Tabs Section */}
      <Tabs defaultValue="12Months" className="w-full">
        <div className="w-full overflow-x-auto flex justify-center">
          <TabsList className="flex w-fit min-w-[280px] gap-2 bg-white border rounded-lg shadow-sm">
            <TabsTrigger value="12Months" className="px-4 py-2 text-sm">
              12 <I8nTextWrapper text="months" />
            </TabsTrigger>
            <TabsTrigger value="30days" className="px-4 py-2 text-sm">
              30
              <I8nTextWrapper text="days" />
            </TabsTrigger>
            <TabsTrigger value="7days" className="px-4 py-2 text-sm">
              7 <I8nTextWrapper text="days" />
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Chart Container */}
        <div className="py-6 mt-5 border-y w-full">
          <TabsContent value="12Months">
            <div className="w-full  overflow-hidden">
              <BalanceBarChart />
            </div>
          </TabsContent>
          <TabsContent value="30days">
            <div className="w-full  overflow-hidden">
              <BalanceBarChart />
            </div>
          </TabsContent>
          <TabsContent value="7days">
            <div className="w-full  overflow-hidden">
              <BalanceBarChart />
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Button Responsive */}
      {/* <div className="flex justify-center">
        <Button className="my-5 py-3 px-6 w-full sm:w-auto" variant="outline">
          View Full Report
        </Button>
      </div> */}
    </div>
  );
}
