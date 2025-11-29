import { useNavigate } from 'react-router-dom';

import { menuItemById } from '../../models/menu-items';

export const PlanGuildWarRoutes = () => {
    const navigate = useNavigate();
    const defenseItem = menuItemById['defense'];
    const offenseItem = menuItemById['offense'];
    const layoutItem = menuItemById['zones'];
    return (
        <div className="flex flex-col items-center w-full gap-3 px-4">
            <div
                onClick={() => navigate(defenseItem.routeMobile)}
                className="w-full min-h-[140px] cursor-pointer bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-[#ffffff1a] p-6 flex flex-col items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200">
                <div className="text-gray-700 dark:text-[#fafafa]">{defenseItem.icon}</div>
                <span className="text-xl font-bold text-gray-800 dark:text-[#fafafa] text-center">
                    {defenseItem.label}
                </span>
            </div>

            <div
                onClick={() => navigate(offenseItem.routeMobile)}
                className="w-full min-h-[140px] cursor-pointer bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-[#ffffff1a] p-6 flex flex-col items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200">
                <div className="text-gray-700 dark:text-[#fafafa]">{offenseItem.icon}</div>
                <span className="text-xl font-bold text-gray-800 dark:text-[#fafafa] text-center">
                    {offenseItem.label}
                </span>
            </div>

            <div
                onClick={() => navigate(layoutItem.routeMobile)}
                className="w-full min-h-[140px] cursor-pointer bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-[#ffffff1a] p-6 flex flex-col items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200">
                <div className="text-gray-700 dark:text-[#fafafa]">{layoutItem.icon}</div>
                <span className="text-xl font-bold text-gray-800 dark:text-[#fafafa] text-center">
                    {layoutItem.label}
                </span>
            </div>
        </div>
    );
};
