import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency.js';

const COLORS = [
  '#6366f1', '#22c55e', '#f59e0b', '#ef4444',
  '#06b6d4', '#a855f7', '#ec4899', '#84cc16',
];

const CategoryPieChart = ({ data }) => {

  // Converting category breakdown data format
  const chartData = data.map((item, index) => ({
    name: item.category,
    value: item.total,
    fill: COLORS[index],
  }));

  return (
    <div className="max-w-xs mx-auto w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            strokeWidth={1}
          />
          <Tooltip
            formatter={(value) => [formatCurrency(value)]}
          />
          <Legend position="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPieChart;