import { cn } from '@/lib/utils';
import { AmountReceive } from './amountReceive';
import moment from 'moment';

export default function LedgerBalance({
  ledgerBalanceHistory,
  userId,
}: {
  ledgerBalanceHistory: [
    {
      ledgerBalance: number;
      date: string;
      remarks: string;
      type: string;
    },
  ];
  userId: string;
}) {
  return (
    <div>
      <div>
        <AmountReceive userId={userId} />
      </div>
      <div className="max-h-[50vh] overflow-auto space-y-2">
        {ledgerBalanceHistory.map((item, index) => (
          <div key={index} className="space-y-2 border-2 rounded-md p-2">
            <div> Amount : ₹ {item.ledgerBalance}</div>
            <div className="text-xs text-gray-500">Date : {moment(item.date).format('DD/MM/YYYY')}</div>
            <div className="text-xs text-gray-500">Remarks : {item.remarks}</div>
            <div className="text-xs text-gray-500">
              Transition :{' '}
              <span className={cn(item.type.toUpperCase() === 'CREDIT' ? 'text-green-500' : 'text-red-500')}>
                {item.type.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
