import { Button } from "@/components/ui/button"; // ShadCN UI Button component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // ShadCN UI Card component
import { Input } from "@/components/ui/input"; // ShadCN UI Input component
import { useState } from "react";

const EMICalculator = ({
  principalAmount,
  loanTenure,
}: {
  principalAmount: number;
  loanTenure: number;
}) => {
  const [principal, setPrincipal] = useState<number | "">(principalAmount);
  const [rate, setRate] = useState<number | "">("");
  const [tenure, setTenure] = useState<number | "">(loanTenure);
  const [tenureType, setTenureType] = useState<"months" | "years">("months");
  const [emi, setEmi] = useState<number | null>(null);

  const calculateEMI = () => {
    if (principal && rate && tenure) {
      const monthlyRate = rate / 12 / 100;
      const totalMonths = tenureType === "years" ? tenure * 12 : tenure;
      const emiValue =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);

      setEmi(emiValue);
    }
  };

  const resetForm = () => {
    setPrincipal("");
    setRate("");
    setTenure("");
    setTenureType("months");
    setEmi(null);
  };

  const toggleTenureType = (type: "months" | "years") => {
    if (type !== tenureType && tenure) {
      // Convert tenure value based on the selected tenure type
      setTenure(type === "years" ? Math.round(tenure / 12) : tenure * 12);
    }
    setTenureType(type);
  };

  return (
    <Card className="w-full  bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">
          EMI Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Principal Amount (₹)
          </label>
          <Input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            placeholder="Enter loan amount"
            className="w-full border border-gray-300 rounded"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            IRR(Annual %)
          </label>
          <Input
            type="number"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            placeholder="Enter annual interest rate"
            className="w-full border border-gray-300 rounded"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Tenure
          </label>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              placeholder={`Enter tenure in ${tenureType}`}
              className="w-full border border-gray-300 rounded"
            />
            <Button
              variant={tenureType === "months" ? "default" : "outline"}
              onClick={() => toggleTenureType("months")}
            >
              Months
            </Button>
            <Button
              variant={tenureType === "years" ? "default" : "outline"}
              onClick={() => toggleTenureType("years")}
            >
              Years
            </Button>
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <Button
            variant="default"
            onClick={calculateEMI}
            className="w-full mr-2"
          >
            Calculate EMI
          </Button>
          <Button variant="outline" onClick={resetForm} className="w-full ml-2">
            Reset
          </Button>
        </div>

        {emi !== null && (
          <div className="mt-4 text-center">
            <p className="text-lg font-medium text-gray-700">
              Monthly EMI:{" "}
              <span className="font-bold text-blue-600">₹{emi.toFixed(2)}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EMICalculator;
