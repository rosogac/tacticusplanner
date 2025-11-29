import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PlanGuildWarRoutes } from 'src/mobile-routes/events/guildWarRoutes';
import { PlanLeRoutes } from 'src/mobile-routes/events/leRoutes';
import { menuItemById } from 'src/models/menu-items';

import { CharactersService } from '@/fsd/4-entities/character';

import { campaignProgressionMenuItem } from '@/fsd/1-pages/plan-campaign-progression';

enum SelectedRoutes {
    all,
    lre,
    gw,
}

export const PlanRoutes = () => {
    const navigate = useNavigate();
    const goalsMenuItem = menuItemById['goals'];
    const dailyRaidsMenuItem = menuItemById['dailyRaids'];
    const teamsMenuItem = menuItemById['teams'];

    const [selectedRoutes, setSelectedRoutes] = useState<SelectedRoutes>(SelectedRoutes.all);

    return (
        <div className="flex flex-col items-center gap-3 px-4 pb-4">
            {selectedRoutes === SelectedRoutes.all ? (
                <>
                    {[goalsMenuItem, dailyRaidsMenuItem, teamsMenuItem, campaignProgressionMenuItem].map(menuItem => (
                        <div
                            key={menuItem.label}
                            onClick={() => navigate(menuItem.routeMobile)}
                            className="w-full max-w-[350px] min-h-[140px] cursor-pointer bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-[#ffffff1a] p-6 flex flex-col items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200">
                            <div className="text-gray-700 dark:text-[#fafafa]">{menuItem.icon}</div>
                            <span className="text-xl font-bold text-gray-800 dark:text-[#fafafa] text-center">
                                {menuItem.label}
                            </span>
                        </div>
                    ))}

                    <div
                        onClick={() => setSelectedRoutes(SelectedRoutes.gw)}
                        className="w-full max-w-[350px] cursor-pointer bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-[#ffffff1a] p-5 flex flex-col gap-4 shadow-lg hover:shadow-xl transition-all duration-200">
                        <div className="flex items-center justify-center gap-3 pb-3">
                            <FormatListBulletedIcon className="text-gray-700 dark:text-[#fafafa]" />
                            <span className="text-xl font-bold text-gray-800 dark:text-[#fafafa]">Guild War</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-center py-2 px-4 rounded-lg bg-gray-200 dark:bg-white/7 text-gray-800 dark:text-[#fafafa] hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer font-medium">
                                Defense
                            </div>
                            <div className="flex items-center justify-center py-2 px-4 rounded-lg bg-gray-200 dark:bg-white/7 text-gray-800 dark:text-[#fafafa] hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer font-medium">
                                Offense
                            </div>
                            <div className="flex items-center justify-center py-2 px-4 rounded-lg bg-gray-200 dark:bg-white/7 text-gray-800 dark:text-[#fafafa] hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer font-medium">
                                War zones
                            </div>
                        </div>
                    </div>

                    <div
                        onClick={() => setSelectedRoutes(SelectedRoutes.lre)}
                        className="w-full max-w-[350px] cursor-pointer bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-[#ffffff1a] p-5 flex flex-col gap-4 shadow-lg hover:shadow-xl transition-all duration-200">
                        <div className="flex items-center justify-center gap-3 pb-3">
                            <FormatListBulletedIcon className="text-gray-700 dark:text-[#fafafa]" />
                            <span className="text-xl font-bold text-gray-800 dark:text-[#fafafa]">LRE</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-center py-2 px-4 rounded-lg bg-gray-200 dark:bg-white/7 text-gray-800 dark:text-[#fafafa] hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer font-medium">
                                Master Table
                            </div>
                            {CharactersService.activeLres.map(le => (
                                <div
                                    key={le.name}
                                    className="flex items-center justify-center py-2 px-4 rounded-lg bg-gray-200 dark:bg-white/7 text-gray-800 dark:text-[#fafafa] hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer font-medium">
                                    {le.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <Button onClick={() => setSelectedRoutes(SelectedRoutes.all)}>Go Back</Button>
            )}

            {selectedRoutes === SelectedRoutes.lre && <PlanLeRoutes />}
            {selectedRoutes === SelectedRoutes.gw && <PlanGuildWarRoutes />}
        </div>
    );
};
