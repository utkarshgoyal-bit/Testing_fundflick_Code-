import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { IPersonalDetails } from '@/lib/interfaces';
import { GET_CREDIT_PERSONAL_DETAILS, UPDATE_CREDIT_PERSONAL_DETAILS } from '@/redux/actions/types';
import { RootState } from '@/redux/slices';
import { Pencil, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { calculatePersonalDetailsProgress } from "@/utils/progress";
import ProgressBar from "./progressBar"; 

const detailsList: { label: string; key: keyof IPersonalDetails }[] = [
  { label: 'Who Met At The Time Of PD Visit ?', key: 'whoMet' },

  { label: 'Loan Required', key: 'loanRequired' },
  { label: 'End Use Of Funds/Loan', key: 'loanUse' },
];

export default function PersonalDetails() {
  const { personalDetails } = useSelector((state: RootState) => state.credit);
  const progressPercent = calculatePersonalDetailsProgress(personalDetails);
  const [editKey, setEditKey] = useState<string | null>(null);
  const dispatch = useDispatch();
  const { register, handleSubmit, setValue, watch } = useForm<{ [key: string]: string }>({
    defaultValues: {
      whoMet: '',
      married: '',
      siblings: '',
      education: '',
      totalMembers: '',
      earningMembers: '',
      monthlyEarning: '',
      neighborName: '',
      neighborFeedback: '',
      livingStandard: '',
      loanRequired: '',
      loanUse: '',
    },
  });

  const onSave = (key: keyof IPersonalDetails) => {
    const updatedValue = watch(key);
    const data = { ...personalDetails, [key]: updatedValue };
    dispatch({ type: UPDATE_CREDIT_PERSONAL_DETAILS, payload: data });
    setEditKey(null);
  };

  useEffect(() => {
    dispatch({ type: GET_CREDIT_PERSONAL_DETAILS });
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Credit Details</h2>
        <ProgressBar label="Personal Details Progress" percentage={progressPercent} />
      <Card>
        <CardContent className="space-y-4 pt-4">
          {detailsList.map(({ label, key }) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <div className="w-1/2 text-sm font-medium text-gray-700">{label}</div>
              <div className="w-1/3 flex justify-end items-center gap-2">
                <div>
                  {editKey === key ? (
                    <Input className="h-8" {...register(key)} />
                  ) : (
                    <p className="text-gray-500 font-semibold">{personalDetails?.[key] || 'N/A'}</p>
                  )}
                </div>
                <div>
                  {editKey === key ? (
                    <Button onClick={handleSubmit(() => onSave(key))} size="sm" variant="link">
                      <Save />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setEditKey(key);
                        setValue(key, personalDetails?.[key] || '');
                      }}
                      size="sm"
                      variant="link"
                    >
                      <Pencil />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
