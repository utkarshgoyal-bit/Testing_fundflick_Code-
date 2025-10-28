import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface TabItem {
  title: string;
  amount: number;
  id: number;
}

interface IncomeTabsProps {
  customer: any;
  setPercentage: React.Dispatch<React.SetStateAction<number>>;
}

function IncomeLiabilitySection({
  items,
  selectedItems,
  setSelectedItems,
}: {
  items: TabItem[];
  selectedItems: any;
  setSelectedItems: (selectedItems: any) => void;
}) {
  return (
    <div>
      {items
        .sort((a, b) => b.amount - a.amount)
        .map(
          (item, index) =>
            item.amount > 0 && (
              <div className="flex  gap-2 w-full my-4" key={index}>
                <Checkbox
                  checked={!!selectedItems[item.id]}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedItems({
                        ...selectedItems,
                        [item.id]: item.amount,
                      });
                    } else {
                      const newSelectedItems = { ...selectedItems };
                      delete newSelectedItems[item.id];
                      setSelectedItems(newSelectedItems);
                    }
                  }}
                />
                <p className="flex justify-between text-[#616161] text-sm  w-full">
                  {item.title}
                  <span className="font-bold text-black text-xl">₹ {item.amount}</span>
                </p>
              </div>
            )
        )}
      <div className="border-t-2 mt-2 p-2">
        <p className="flex justify-between text-[#616161] text-sm w-full">
          Total:
          <span className="font-bold text-black text-xl">
            ₹ {Object.values(selectedItems).reduce((total: number, amount) => total + (amount as number), 0)}
          </span>
        </p>
      </div>
    </div>
  );
}

export default function IncomeTabs({ customer, setPercentage }: IncomeTabsProps) {
  const [selectedTab, setSelectedTab] = useState('Income');
  const [selectedItems, setSelectedItems] = useState<{ [key: number]: number }>({});

  const tabs = ['Income', 'Liability'];

  const income: TabItem[] = [
    {
      id: 1,
      title: 'Income',
      amount: customer?.customerEmploymentDetails?.income || 0,
    },
    {
      id: 2,
      title: 'Monthly Other Income',
      amount: customer?.customerEmploymentDetails?.monthlyOtherIncome || 0,
    },
    ...(customer?.customerOtherFamilyDetails?.map((item: any, index: number) => ({
      title: `${item.firstName ?? ''} ${item.middleName ?? ''} ${item.lastName ?? ''} (${item.customerType})`,
      amount: item.income || 0,
      id: index + 3,
    })) || []),
  ];

  const liability: TabItem[] = [
    {
      title: 'Monthly Other Expenses',
      amount: customer?.familyExpenses?.familyExpenses || 0,
      id: 1,
    },
    {
      title: 'Total Family Expenses',
      amount: customer.familyExpenses?.futureOutlays || 0,
      id: 2,
    },
    ...(customer?.existingLoans?.map((item: any, index: number) => ({
      title: item.lenderName,
      amount: item.emi || 0,
      id: index + 3,
    })) || []),
  ];

  useEffect(() => {
    const items = (selectedTab === 'Liability' ? liability : income).reduce((acc: any, item: TabItem) => {
      acc[item.id] = item.amount;
      return acc;
    }, {});
    setSelectedItems(items);
  }, [selectedTab]);

  // Calculate Total Income and Liability
  const totalIncome =
    selectedTab !== 'Liability'
      ? Object.values(selectedItems).reduce((total: number, amount) => total + (amount as number), 0)
      : income.reduce((sum, item) => sum + item.amount, 0);
  const totalLiability =
    selectedTab === 'Liability'
      ? Object.values(selectedItems).reduce((total: number, amount) => total + (amount as number), 0)
      : liability.reduce((sum, item) => sum + item.amount, 0);
  console.log(selectedItems);
  useEffect(() => {
    // Calculate the percentage as (Liability / Income) * 100
    if (totalIncome > 0) {
      setPercentage((totalLiability / totalIncome) * 100);
    } else {
      setPercentage(0);
    }
  }, [totalIncome, totalLiability]);

  return (
    <div className="my-2 w-full px-5">
      <div className="flex gap-3 border-b-2 justify-between">
        {tabs.map((item, index) => (
          <p
            onClick={() => setSelectedTab(item)}
            className={cn(
              'cursor-pointer py-3',
              selectedTab === item && 'border-b-2 border-b-secondary text-secondary'
            )}
            key={index}
          >
            {item}
          </p>
        ))}
      </div>

      <div className="p-1">
        {selectedTab === 'Income' && (
          <IncomeLiabilitySection items={income} selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
        )}
        {selectedTab === 'Liability' && (
          <IncomeLiabilitySection items={liability} selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
        )}
      </div>
    </div>
  );
}
