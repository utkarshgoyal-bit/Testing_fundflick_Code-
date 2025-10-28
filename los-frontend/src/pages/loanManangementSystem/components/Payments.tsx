import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
export const Payments = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Management</CardTitle>
        <CardDescription>Record and track loan payments and EMI collections</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-fg-secondary">Payment management interface will be implemented here...</p>
      </CardContent>
    </Card>
  );
};
