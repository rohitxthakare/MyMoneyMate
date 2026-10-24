const SummaryCard = ({ label, value, icon: Icon, iconColor, iconBg, valueColor = 'text-gray-900', }) => (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-200/50">
        <div className="mb-4">
            <div className={`${iconBg} p-3 rounded-xl inline-flex`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
        </div>

        <h3 className="text-gray-600 text-sm font-medium mb-1">
            {label}
        </h3>

        <p className={`text-2xl font-bold ${valueColor}`}>
            {value}
        </p>
    </div>
);

export default SummaryCard;