import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
const DashboardCard = ({ index, card }: { index: number; card: any }) => {
  const IconComponent = card.icon;
  return (
    <Card key={index} className="relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div
          className={`absolute top-0 right-0 w-20 h-20 bg-color-${card.color} rounded-full -translate-y-10 translate-x-10`}
        ></div>
      </div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-fg-secondary">{card.title}</CardTitle>
        <div className={`p-2 bg-color-${card.color}/10 rounded-lg`}>
          <IconComponent className={`h-4 w-4 text-color-${card.color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-fg-primary mb-1">{card.value}</div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-fg-secondary">{card.description}</p>
          <span
            className={`text-xs font-medium ${card.change.startsWith('+') ? 'text-color-success' : 'text-color-error'}`}
          >
            {card.change}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
