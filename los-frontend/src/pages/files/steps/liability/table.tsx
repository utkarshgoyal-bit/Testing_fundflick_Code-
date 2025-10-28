import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RootState } from "@/redux/store";
import { setLiabilityDialogEdit } from "@/redux/slices/files";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LiabilityForm from "./form";
import { Button } from "@/components/ui/button";

export default function LiabilityCards() {
  const {
    liability: { existingLoans },
  } = useSelector((state: RootState) => state.fileLiability);
  const dispatch = useDispatch();
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const { liabilityDialogEdit } = useSelector(
    (state: RootState) => state.customerFiles
  );

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {existingLoans?.length > 0 ? (
        existingLoans?.map((loan: any, index: number) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-4 flex flex-col gap-2"
          >
            <div className="text-xl font-semibold text-gray-800">
              {loan.loanCategory.charAt(0).toUpperCase() +
                loan.loanCategory.slice(1)}{" "}
              Loan
            </div>
            <div className="text-sm text-gray-600">{loan.loanType}</div>
            <div className="text-sm text-gray-600">{`${loan.customerDetails.firstName} ${loan.customerDetails.middleName ? loan.customerDetails.middleName + " " : ""}${loan.customerDetails.lastName}`}</div>
            <div className="text-md font-semibold text-gray-900">{`Loan Amount ₹${loan.loanAmount}`}</div>
            <div className="text-sm text-gray-600">{`Tenure: ${loan.tenure} months`}</div>
            <div className="text-sm text-gray-600">{`EMI: ₹${loan.emi}`}</div>
            <div className="text-sm text-gray-600">{`IRR: ${loan.irr}%`}</div>
            <div className="text-sm text-gray-600">{`EMIs Left: ${loan.noOfemiLeft}`}</div>
            <div className="mt-4 flex justify-end">
              <Button
                type="button"
                onClick={() => {
                  setSelectedRow(loan);
                  dispatch(setLiabilityDialogEdit(true));
                }}
                variant={"outline"}
                className="rounded-full h-12 p-0 w-12"
              >
                <Pencil className="cursor-pointer text-secondary" size={20} />
              </Button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-4 border-2 border-dashed border-gray-300 w-full col-span-7">
          <p className="text-gray-500">No data available</p>
        </div>
      )}

      {selectedRow && (
        <Dialog
          open={liabilityDialogEdit}
          onOpenChange={(open) => {
            dispatch(setLiabilityDialogEdit(open));
          }}
        >
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Edit Liabilities</DialogTitle>
            </DialogHeader>
            {selectedRow && <LiabilityForm defaultValues={selectedRow} />}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
