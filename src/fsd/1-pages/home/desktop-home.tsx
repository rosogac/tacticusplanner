import { sum } from 'lodash';
import { useContext } from 'react';
import { isMobile } from 'react-device-detect';
import Zoom from 'react-medium-image-zoom';
import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line import-x/no-internal-modules
import { PersonalGoalType } from 'src/models/enums';
// eslint-disable-next-line import-x/no-internal-modules
import { menuItemById } from 'src/models/menu-items';
// eslint-disable-next-line import-x/no-internal-modules
import { StoreContext } from 'src/reducers/store.provider';

import { useAuth } from '@/fsd/5-shared/model';
import { Card, getImageUrl } from '@/fsd/5-shared/ui';
import { MiscIcon, UnitShardIcon } from '@/fsd/5-shared/ui/icons';

import { CharactersService } from '@/fsd/4-entities/character';
import { ILegendaryEventStatic, LegendaryEventEnum, LegendaryEventService } from '@/fsd/4-entities/lre';

import { Thanks } from '@/fsd/3-features/thank-you';

import { useBmcWidget } from './useBmcWidget';

function formatMonthAndDay(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function LreSection({ nextEvent }: { nextEvent: ILegendaryEventStatic }) {
    const navigate = useNavigate();
    const nextLeUnit = CharactersService.charactersData.find(x => x.snowprintId === nextEvent.unitSnowprintId);

    function timeLeftToFutureDate(targetDate: Date): string {
        const currentDate = new Date();
        const timeDifference = targetDate.getTime() - currentDate.getTime();

        // Calculate days, hours, and minutes
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        // Format the result
        const result = days === 0 ? `${hours} h left` : `${days} Days ${hours} h left`;

        return timeDifference >= 0 ? result : 'Finished';
    }

    const navigateToNextLre = () => {
        const route = `/plan/lre?character=${LegendaryEventEnum[nextEvent.id]}`;
        navigate(isMobile ? '/mobile' + route : route);
    };

    const nextLeDateStart = new Date(nextEvent.nextEventDateUtc!);
    const nextLeDateEnd = new Date(new Date(nextEvent.nextEventDateUtc!).setDate(nextLeDateStart.getDate() + 7));
    const timeToStart = timeLeftToFutureDate(nextLeDateStart);
    const timeToEnd = timeLeftToFutureDate(nextLeDateEnd);
    const isEventStarted = timeToStart === 'Finished';

    return (
        <div>
            <h3 className="text-center text-gray-800 dark:text-[#fafafa] mb-2">
                {isEventStarted ? 'Ongoing ' : 'Upcoming '}Legendary Event
            </h3>
            <Card onClick={navigateToNextLre} className="p-3 gap-2">
                <div className="flex items-center gap-3 pb-2 border-b border-gray-300 dark:border-[#ffffff1a]">
                    <UnitShardIcon icon={nextLeUnit?.roundIcon ?? ''} height={50} width={50} />
                    <div className="flex flex-col">
                        <span className="text-lg font-semibold text-gray-800 dark:text-[#fafafa]">
                            {nextLeUnit?.shortName}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-[#fafafa]">
                            {formatMonthAndDay(isEventStarted ? nextLeDateEnd : nextLeDateStart)}
                        </span>
                    </div>
                </div>
                <div className="flex flex-col font-medium text-gray-700 dark:text-[#fafafa]">
                    {isEventStarted ? timeToEnd : timeToStart}
                </div>
            </Card>
        </div>
    );
}

export const DesktopHome = () => {
    useBmcWidget();
    const navigate = useNavigate();
    const { userInfo } = useAuth();
    const { goals, dailyRaids } = useContext(StoreContext);
    const nextLeMenuItem = LegendaryEventService.getActiveEvent();

    const goalsMenuItem = menuItemById['goals'];
    const dailyRaidsMenuItem = menuItemById['dailyRaids'];

    const calendarUrls: { current?: string; next?: string } = {
        current: getImageUrl('calendar/calendar_20251026.png'),
        next: getImageUrl('calendar/calendar_20251130.png'),
    };

    const topPriorityGoal = goals[0];
    const unlockGoals = goals.filter(x => x.type === PersonalGoalType.Unlock).length;
    const ascendGoals = goals.filter(x => x.type === PersonalGoalType.Ascend).length;
    const upgradeRankGoals = goals.filter(x => x.type === PersonalGoalType.UpgradeRank).length;

    const announcements = () => {
        if (userInfo.tacticusApiKey) {
            return <></>;
        }

        return (
            <div style={{ textAlign: 'center', padding: '25px 0 50px' }}>
                <h2>Exciting News from WH40k Tacticus!</h2>
                <p>
                    We&apos;re thrilled to announce that player API keys are now available! Use your key to effortlessly
                    upload your Tacticus roster to the Planner.
                </p>
                <p>
                    For more details, check out our{' '}
                    <a href="/faq" target="_blank" rel="noreferrer">
                        FAQ
                    </a>{' '}
                    or find additional information in the user menu.
                </p>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-4 pb-8">
            {announcements()}

            {/* Thank You Section */}
            <div className="mb-2">
                <Thanks sliderMode={true} />
            </div>

            {/* Main Cards Row - Daily Raids, LRE Event, Goals, and Calendar */}
            <div className="w-full max-w-[1500px] mx-auto flex flex-col md:flex-row flex-wrap justify-center gap-3 px-4 md:px-0">
                {/* Daily Raids */}
                <div className="w-full md:w-auto">
                    <h3 className="text-center text-gray-800 dark:text-[#fafafa] mb-2">Daily Raids</h3>
                    <Card
                        onClick={() =>
                            navigate(isMobile ? dailyRaidsMenuItem.routeMobile : dailyRaidsMenuItem.routeWeb)
                        }
                        className="p-3 gap-2">
                        <div className="flex flex-col gap-2 pb-2 border-b border-gray-300 dark:border-[#ffffff1a]">
                            <div className="flex items-center gap-2">
                                {dailyRaidsMenuItem.icon}
                                <span className="text-base font-semibold text-gray-800 dark:text-[#fafafa]">
                                    {dailyRaids.raidedLocations?.length + ' locations'}
                                </span>
                            </div>
                            <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-[#fafafa]">
                                {sum(dailyRaids.raidedLocations?.map(x => x.energySpent))}
                                <MiscIcon icon={'energy'} width={15} height={15} />
                                {' spent'}
                            </span>
                        </div>
                        <ul className="flex-1 pl-5 m-0 space-y-1 overflow-y-auto text-sm">
                            {dailyRaids.raidedLocations.map(x => (
                                <li key={x.id} className="text-gray-700 dark:text-[#fafafa]">
                                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                                        {x.raidsCount}x
                                    </span>{' '}
                                    {x.campaign} {x.nodeNumber}
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
                {nextLeMenuItem && (
                    <div className="w-full md:w-auto">
                        <LreSection nextEvent={nextLeMenuItem} />
                    </div>
                )}

                {!!goals.length && (
                    <div className="w-full md:w-auto">
                        <h3 className="text-center text-gray-800 dark:text-[#fafafa] mb-2">Your Goals</h3>
                        <Card
                            onClick={() => navigate(isMobile ? goalsMenuItem.routeMobile : goalsMenuItem.routeWeb)}
                            className="p-3 gap-2">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-300 dark:border-[#ffffff1a]">
                                {goalsMenuItem.icon}
                                <span className="text-lg font-semibold text-gray-800 dark:text-[#fafafa]">
                                    {goalsMenuItem.label}
                                </span>
                            </div>
                            <div className="flex flex-col gap-2">
                                {!!unlockGoals && (
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-blue-600 dark:text-blue-400">Unlock</span>
                                        <span className="text-gray-700 dark:text-[#fafafa]">
                                            {unlockGoals} characters
                                        </span>
                                    </div>
                                )}
                                {!!ascendGoals && (
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-blue-600 dark:text-blue-400">Ascend</span>
                                        <span className="text-gray-700 dark:text-[#fafafa]">
                                            {ascendGoals} characters
                                        </span>
                                    </div>
                                )}
                                {!!upgradeRankGoals && (
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-blue-600 dark:text-blue-400">Upgrade rank</span>
                                        <span className="text-gray-700 dark:text-[#fafafa]">
                                            for {upgradeRankGoals} characters
                                        </span>
                                    </div>
                                )}
                                {!!topPriorityGoal?.notes && (
                                    <div className="flex flex-col gap-1 pt-2 border-t border-gray-300 dark:border-[#ffffff1a]">
                                        <span className="text-sm font-bold text-gray-800 dark:text-[#fafafa]">
                                            Top priority goal:
                                        </span>
                                        <span className="text-sm italic text-gray-700 dark:text-[#fafafa]">
                                            {topPriorityGoal.notes}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                )}

                {/* Events Calendar */}
                {(!!calendarUrls.current || !!calendarUrls.next) && (
                    <div className="w-full md:w-auto flex flex-col gap-3">
                        <h3 className="text-center text-gray-800 dark:text-[#fafafa]">Events Calendar</h3>
                        <div className="flex flex-wrap justify-center gap-3">
                            {!!calendarUrls.current && (
                                <div className="flex flex-col gap-1">
                                    {!!calendarUrls.next && (
                                        <h4 className="text-center text-gray-700 dark:text-[#fafafa] text-sm font-semibold">
                                            Current Season
                                        </h4>
                                    )}
                                    <div className="overflow-hidden transition-shadow duration-200 border border-gray-300 shadow-lg rounded-xl dark:border-gray-700 hover:shadow-xl w-full md:w-[280px] h-[200px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 p-2">
                                        <Zoom>
                                            <img
                                                src={calendarUrls.current}
                                                alt="Current Season Events Calendar"
                                                className="block object-contain max-w-full max-h-full"
                                            />
                                        </Zoom>
                                    </div>
                                </div>
                            )}

                            {!!calendarUrls.next && (
                                <div className="flex flex-col gap-1">
                                    <h4 className="text-center text-gray-700 dark:text-[#fafafa] text-sm font-semibold">
                                        Next Season
                                    </h4>
                                    <div className="overflow-hidden transition-shadow duration-200 border border-gray-300 shadow-lg rounded-xl dark:border-gray-700 hover:shadow-xl w-full md:w-[280px] h-[200px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 p-2">
                                        <Zoom>
                                            <img
                                                src={calendarUrls.next}
                                                alt="Next Season Events Calendar"
                                                className="block object-contain max-w-full max-h-full"
                                            />
                                        </Zoom>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
