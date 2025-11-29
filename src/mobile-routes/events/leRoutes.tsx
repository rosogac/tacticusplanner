import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { menuItemById } from 'src/models/menu-items';

import { Card } from '@/fsd/5-shared/ui';
import { UnitShardIcon } from '@/fsd/5-shared/ui/icons';

import { CharactersService } from '@/fsd/4-entities/character';
import { ICharacterData } from '@/fsd/4-entities/character/model';
import { LegendaryEventEnum } from '@/fsd/4-entities/lre';

function sortCharsByLreDate(a: ICharacterData, b: ICharacterData) {
    function isValidLreDate(date: unknown): date is string {
        return (
            date !== null &&
            typeof date === 'string' &&
            date !== 'TBA' &&
            date !== '' &&
            !isNaN(new Date(date).getTime())
        );
    }
    const aDate = a.lre?.nextEventDateUtc;
    const bDate = b.lre?.nextEventDateUtc;

    const aHasValidDate = isValidLreDate(aDate);
    const bHasValidDate = isValidLreDate(bDate);

    // If both have valid dates, sort by date (earliest first)
    if (aHasValidDate && bHasValidDate) {
        return new Date(aDate).getTime() - new Date(bDate).getTime();
    }

    // Valid dates come before invalid/missing ones including "TBA"
    if (aHasValidDate && !bHasValidDate) return -1;
    if (!aHasValidDate && bHasValidDate) return 1;

    // When both have invalid dates - sort by eventStage (descending)
    const aStage = a.lre?.eventStage || 0;
    const bStage = b.lre?.eventStage || 0;
    return bStage - aStage;
}

export const PlanLeRoutes = () => {
    const navigate = useNavigate();
    const leMasterTableMenuItem = menuItemById['leMasterTable'];
    const sortedActiveLres: ICharacterData[] = useMemo(
        () => [...CharactersService.activeLres].sort(sortCharsByLreDate),
        [CharactersService.activeLres]
    );
    return (
        <div className="flex flex-col items-center w-full gap-3 px-4 pb-4">
            <Card
                onClick={() => navigate(leMasterTableMenuItem.routeMobile)}
                minHeight="min-h-[140px]"
                width="w-full"
                className="p-6 items-center justify-center gap-2">
                <div className="text-gray-700 dark:text-[#fafafa]">{leMasterTableMenuItem.icon}</div>
                <span className="text-xl font-bold text-gray-800 dark:text-[#fafafa] text-center">
                    {leMasterTableMenuItem.label}
                </span>
            </Card>

            {sortedActiveLres.map(le => {
                const isFinished = !!le.lre?.finished;
                return (
                    <Card
                        key={le.name}
                        onClick={() => navigate(`/mobile/plan/lre?character=${LegendaryEventEnum[le.lre!.id]}`)}
                        minHeight="min-h-[140px]"
                        width="w-full"
                        className={`${isFinished ? 'opacity-50' : ''}`}>
                        <div className="flex items-center gap-3 pb-3 border-b border-gray-300 dark:border-[#ffffff1a]">
                            <UnitShardIcon icon={le.roundIcon} name={le.name} />
                            <div className="flex flex-col">
                                <span className="text-lg font-semibold text-gray-800 dark:text-[#fafafa]">
                                    {le.name}
                                </span>
                                <span className="text-sm text-gray-600 dark:text-[#fafafa]">Legendary Event</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 text-gray-700 dark:text-[#fafafa]">
                            {isFinished ? (
                                <span>Finished</span>
                            ) : (
                                <>
                                    <span>Stage: {le.lre?.eventStage}/3</span>
                                    <span>Next event: {le.lre?.nextEventDate}</span>
                                </>
                            )}
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};
