import type { StatsCardData } from '@/types/models';
import Card from '@/components/common/Card';

export default function StatsCard({ label, value, icon, color }: StatsCardData) {
    const colorClasses = {
        blue: 'bg-primary-50 text-primary-600',
        green: 'bg-accent-50 text-accent-600',
        amber: 'bg-amber-50 text-amber-600',
    };

    return (
        <Card hover>
            <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colorClasses[color]}`}>
                    <span className="text-2xl" aria-hidden="true">{icon}</span>
                </div>
                <div>
                    <p className="text-sm text-surface-500">{label}</p>
                    <p className="text-2xl font-bold text-surface-900">{value}</p>
                </div>
            </div>
        </Card>
    );
}
