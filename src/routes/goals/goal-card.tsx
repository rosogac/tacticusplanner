import { ArrowForward, DeleteForever, Edit } from '@mui/icons-material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LinkIcon from '@mui/icons-material/Link';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import React, { useMemo } from 'react';
import { isMobile } from 'react-device-detect';
import { Link } from 'react-router-dom';

import { charsUnlockShards, rarityToStars } from 'src/models/constants';
import { PersonalGoalType } from 'src/models/enums';
import { StaticDataService } from 'src/services';
import { formatDateWithOrdinal } from 'src/shared-logic/functions';

import { AccessibleTooltip, Card } from '@/fsd/5-shared/ui';
import { MiscIcon, UnitShardIcon } from '@/fsd/5-shared/ui/icons';
import { RarityIcon } from '@/fsd/5-shared/ui/icons/rarity.icon';
import { StarsIcon } from '@/fsd/5-shared/ui/icons/stars.icon';

import { CampaignImage } from '@/fsd/4-entities/campaign/campaign.icon';
import { RankIcon } from '@/fsd/4-entities/character/ui/rank.icon';

import { CharacterAbilitiesTotal } from 'src/v2/features/characters/components/character-abilities-total';
import { CharacterRaidGoalSelect, IGoalEstimate } from 'src/v2/features/goals/goals.models';
import { GoalsService } from 'src/v2/features/goals/goals.service';
import { ShardsService } from 'src/v2/features/goals/shards.service';
import { XpTotal } from 'src/v2/features/goals/xp-total';

import { MowMaterialsTotal } from '@/fsd/1-pages/learn-mow/mow-materials-total';

import { XpGoalProgressBar } from './xp-book-progress-bar';

interface Props {
    goal: CharacterRaidGoalSelect;
    goalEstimate?: IGoalEstimate;
    menuItemSelect?: (item: 'edit' | 'delete') => void;
    bgColor: string;
}

export const GoalCard: React.FC<Props> = ({ goal, menuItemSelect, goalEstimate: passed, bgColor }) => {
    const goalEstimate: IGoalEstimate = passed ?? {
        daysLeft: 0,
        daysTotal: 0,
        oTokensTotal: 0,
        energyTotal: 0,
        xpBooksTotal: 0,
        goalId: '',
    };
    const isGoalCompleted = GoalsService.isGoalCompleted(goal, goalEstimate);

    const calendarDate: string = useMemo(() => {
        if (!goalEstimate.daysLeft) {
            return '';
        }
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + goalEstimate.daysLeft - 1);

        return formatDateWithOrdinal(nextDate);
    }, [goalEstimate.daysLeft]);

    const showRaidsTableButton =
        goal.type === PersonalGoalType.UpgradeRank || goal.type === PersonalGoalType.MowAbilities;
    const linkBase = isMobile ? '/mobile/plan/dailyRaids' : '/plan/dailyRaids';
    const params = `?charSnowprintId=${encodeURIComponent(goal.unitId)}`;

    const getGoalInfo = (goal: CharacterRaidGoalSelect) => {
        switch (goal.type) {
            case PersonalGoalType.Ascend: {
                const isSameRarity = goal.rarityStart === goal.rarityEnd;
                const minStars = rarityToStars[goal.rarityEnd];
                const isMinStars = minStars === goal.starsEnd;

                const targetShards = ShardsService.getTargetShards(goal);
                return (
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 py-2 px-3 bg-gray-200 dark:bg-white/7 rounded-lg">
                            {!isSameRarity && (
                                <>
                                    <RarityIcon rarity={goal.rarityStart} />
                                    <ArrowForward fontSize="small" />
                                    <RarityIcon rarity={goal.rarityEnd} />
                                    {!isMinStars && <StarsIcon stars={goal.starsEnd} />}
                                </>
                            )}

                            {isSameRarity && (
                                <>
                                    <StarsIcon stars={goal.starsStart} />
                                    <ArrowForward fontSize="small" />
                                    <StarsIcon stars={goal.starsEnd} />
                                </>
                            )}
                        </div>
                        <div className="text-base">
                            <span className="font-bold">
                                {goal.shards} of {targetShards}
                            </span>{' '}
                            Shards
                        </div>
                        <div className="flex items-center gap-4 flex-wrap">
                            <AccessibleTooltip title={`${goalEstimate.daysLeft} days. Estimated date ${calendarDate}`}>
                                <div className="flex items-center gap-1">
                                    <CalendarMonthIcon fontSize="small" /> {goalEstimate.daysLeft}
                                </div>
                            </AccessibleTooltip>
                            {!!goalEstimate.energyTotal && (
                                <AccessibleTooltip title={`${goalEstimate.energyTotal} energy`}>
                                    <div className="flex items-center gap-1">
                                        <MiscIcon icon={'energy'} height={18} width={15} /> {goalEstimate.energyTotal}
                                    </div>
                                </AccessibleTooltip>
                            )}

                            {!!goalEstimate.oTokensTotal && (
                                <AccessibleTooltip title={`${goalEstimate.oTokensTotal} Onslaught tokens`}>
                                    <div className="flex items-center gap-1">
                                        <CampaignImage campaign={'Onslaught'} size={18} /> {goalEstimate.oTokensTotal}
                                    </div>
                                </AccessibleTooltip>
                            )}
                        </div>
                    </div>
                );
            }
            case PersonalGoalType.UpgradeRank: {
                const { xpEstimate } = goalEstimate;

                return (
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 py-2 px-3 bg-gray-200 dark:bg-white/7 rounded-lg">
                            <RankIcon rank={goal.rankStart} />
                            <ArrowForward fontSize="small" />
                            <RankIcon rank={goal.rankEnd} rankPoint5={goal.rankPoint5} />
                            {!!goal.upgradesRarity.length && (
                                <>
                                    {goal.upgradesRarity.map(x => (
                                        <RarityIcon key={x} rarity={x} />
                                    ))}
                                </>
                            )}
                        </div>
                        <div className="flex items-center gap-4 flex-wrap">
                            <AccessibleTooltip title={`${goalEstimate.daysLeft} days. Estimated date ${calendarDate}`}>
                                <div className="flex items-center gap-1">
                                    <CalendarMonthIcon fontSize="small" /> {goalEstimate.daysLeft}
                                </div>
                            </AccessibleTooltip>
                            <AccessibleTooltip title={`${goalEstimate.energyTotal} energy`}>
                                <div className="flex items-center gap-1">
                                    <MiscIcon icon={'energy'} height={18} width={15} /> {goalEstimate.energyTotal}
                                </div>
                            </AccessibleTooltip>
                        </div>
                        {goalEstimate.xpDaysLeft !== undefined && (
                            <div className="flex items-center gap-4 flex-wrap">
                                <AccessibleTooltip
                                    title={`${goalEstimate.daysLeft} days. Estimated date ${calendarDate}`}>
                                    <div className="flex items-center gap-1">
                                        <CalendarMonthIcon fontSize="small" /> {goalEstimate.xpDaysLeft}
                                    </div>
                                </AccessibleTooltip>
                                {goalEstimate.xpBooksApplied !== undefined &&
                                    goalEstimate.xpBooksRequired !== undefined && (
                                        <XpGoalProgressBar
                                            applied={goalEstimate.xpBooksApplied}
                                            required={goalEstimate.xpBooksRequired}
                                        />
                                    )}
                            </div>
                        )}
                        {goalEstimate.xpDaysLeft === undefined && xpEstimate && <XpTotal {...xpEstimate} />}
                    </div>
                );
            }
            case PersonalGoalType.MowAbilities: {
                const hasPrimaryGoal = goal.primaryEnd > goal.primaryStart;
                const hasSecondaryGoal = goal.secondaryEnd > goal.secondaryStart;
                const targetShards = ShardsService.getTargetShardsForMow(goal);
                return (
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-4 py-2 px-3 bg-gray-200 dark:bg-white/7 rounded-lg flex-wrap">
                            <div className="flex flex-col gap-1">
                                {hasPrimaryGoal && (
                                    <div className="flex items-center gap-1 text-sm">
                                        <span>Primary:</span> <b>{goal.primaryStart}</b>
                                        <ArrowForward fontSize="small" />
                                        <b>{goal.primaryEnd}</b>
                                    </div>
                                )}

                                {hasSecondaryGoal && (
                                    <div className="flex items-center gap-1 text-sm">
                                        <span>Secondary:</span> <b>{goal.secondaryStart}</b>
                                        <ArrowForward fontSize="small" />
                                        <b>{goal.secondaryEnd}</b>
                                    </div>
                                )}
                            </div>
                            {!!goal.upgradesRarity.length && (
                                <div className="flex items-center gap-1">
                                    {goal.upgradesRarity.map(x => (
                                        <RarityIcon key={x} rarity={x} />
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="text-base">
                            <span className="font-bold">
                                {goal.shards} of {targetShards}
                            </span>{' '}
                            Shards
                        </div>
                        {goalEstimate.mowEstimate && (
                            <div className="py-2">
                                <MowMaterialsTotal
                                    size="small"
                                    mowAlliance={goal.unitAlliance}
                                    total={goalEstimate.mowEstimate}
                                />
                            </div>
                        )}
                        <div className="flex items-center gap-4 flex-wrap">
                            <AccessibleTooltip title={`${goalEstimate.daysLeft} days. Estimated date ${calendarDate}`}>
                                <div className="flex items-center gap-1">
                                    <CalendarMonthIcon fontSize="small" /> {goalEstimate.daysLeft}
                                </div>
                            </AccessibleTooltip>
                            <AccessibleTooltip title={`${goalEstimate.energyTotal} energy`}>
                                <div className="flex items-center gap-1">
                                    <MiscIcon icon={'energy'} height={18} width={15} /> {goalEstimate.energyTotal}
                                </div>
                            </AccessibleTooltip>
                        </div>
                    </div>
                );
            }
            case PersonalGoalType.CharacterAbilities: {
                const hasActiveGoal = goal.activeEnd > goal.activeStart;
                const hasPassiveGoal = goal.passiveEnd > goal.passiveStart;
                const { xpEstimateAbilities: xpEstimate } = goalEstimate;
                return (
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-4 py-2 px-3 bg-gray-200 dark:bg-white/7 rounded-lg">
                            <div className="flex flex-col gap-1">
                                {hasActiveGoal && (
                                    <div className="flex items-center gap-1 text-sm">
                                        <span>Active:</span> <b>{goal.activeStart}</b>
                                        <ArrowForward fontSize="small" />
                                        <b>{goal.activeEnd}</b>
                                    </div>
                                )}

                                {hasPassiveGoal && (
                                    <div className="flex items-center gap-1 text-sm">
                                        <span>Passive:</span> <b>{goal.passiveStart}</b>
                                        <ArrowForward fontSize="small" />
                                        <b>{goal.passiveEnd}</b>
                                    </div>
                                )}
                            </div>
                        </div>
                        {goalEstimate.xpDaysLeft !== undefined && (
                            <div className="flex items-center gap-4 flex-wrap">
                                <AccessibleTooltip
                                    title={`${goalEstimate.daysLeft} days. Estimated date ${calendarDate}`}>
                                    <div className="flex items-center gap-1">
                                        <CalendarMonthIcon fontSize="small" /> {goalEstimate.xpDaysLeft}
                                    </div>
                                </AccessibleTooltip>
                                {goalEstimate.xpBooksApplied !== undefined &&
                                    goalEstimate.xpBooksRequired !== undefined && (
                                        <XpGoalProgressBar
                                            applied={goalEstimate.xpBooksApplied}
                                            required={goalEstimate.xpBooksRequired}
                                        />
                                    )}
                            </div>
                        )}
                        {goalEstimate.xpDaysLeft === undefined && xpEstimate && <XpTotal {...xpEstimate} />}
                        {goalEstimate.abilitiesEstimate && (
                            <div className="py-2">
                                <CharacterAbilitiesTotal {...goalEstimate.abilitiesEstimate} />
                            </div>
                        )}
                        {goalEstimate.xpDaysLeft !== undefined && (
                            <span className="text-sm italic">XP in {goalEstimate.xpDaysLeft} days</span>
                        )}
                    </div>
                );
            }
            case PersonalGoalType.Unlock: {
                const targetShards = charsUnlockShards[goal.rarity];

                return (
                    <div className="flex flex-col gap-3">
                        <div className="text-base">
                            <span className="font-bold">
                                {goal.shards} of {targetShards}
                            </span>{' '}
                            Shards
                        </div>
                        <div className="flex items-center gap-4 flex-wrap">
                            {!goalEstimate.daysLeft && !goalEstimate.energyTotal && (
                                <div className="italic text-sm">{StaticDataService.getFactionPray(goal.faction)}</div>
                            )}
                            {(!!goalEstimate.daysLeft || !!goalEstimate.energyTotal) && (
                                <>
                                    <AccessibleTooltip
                                        title={`${goalEstimate.daysLeft} days. Estimated date ${calendarDate}`}>
                                        <div className="flex items-center gap-1">
                                            <CalendarMonthIcon fontSize="small" /> {goalEstimate.daysLeft}
                                        </div>
                                    </AccessibleTooltip>
                                    <AccessibleTooltip title={`${goalEstimate.energyTotal} energy`}>
                                        <div className="flex items-center gap-1">
                                            <MiscIcon icon={'energy'} height={18} width={15} />{' '}
                                            {goalEstimate.energyTotal}
                                        </div>
                                    </AccessibleTooltip>
                                </>
                            )}
                        </div>
                    </div>
                );
            }
        }
    };

    return (
        <Card
            width="w-full md:w-[350px]"
            className={`${showRaidsTableButton ? 'pb-12' : 'pb-5'} relative ${
                isGoalCompleted ? '!border-4 !border-[var(--success)]' : ''
            }`}
            style={{ background: isGoalCompleted ? undefined : bgColor }}>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-300 dark:border-[#ffffff1a]">
                <div className="flex items-center gap-2">
                    <span className="text-gray-800 dark:text-[#fafafa] font-semibold">#{goal.priority}</span>
                    <UnitShardIcon icon={goal.unitRoundIcon} height={30} />
                    <span className="text-lg font-semibold text-gray-800 dark:text-[#fafafa]">
                        {goal.unitName ?? goal.unitId}
                    </span>
                </div>
                {menuItemSelect && (
                    <div className="flex items-center gap-1">
                        {!isGoalCompleted && (
                            <IconButton onClick={() => menuItemSelect('edit')} size="small">
                                <Edit fontSize="small" />
                            </IconButton>
                        )}
                        <IconButton onClick={() => menuItemSelect('delete')} size="small">
                            <DeleteForever fontSize="small" />
                        </IconButton>
                    </div>
                )}
            </div>

            {/* Subheader */}
            {calendarDate && <div className="text-sm text-gray-600 dark:text-[#fafafa]">{calendarDate}</div>}

            {/* Content */}
            <div className="flex flex-col gap-2 text-gray-700 dark:text-[#fafafa] flex-1">
                {getGoalInfo(goal)}
                {goal.notes && <span className="mt-2 text-sm italic">{goal.notes}</span>}
            </div>

            {/* Raids Table Button (positioned at bottom) */}
            {showRaidsTableButton && (
                <Button
                    size="small"
                    variant={'outlined'}
                    component={Link}
                    to={linkBase + params}
                    target={'_self'}
                    className="absolute bottom-0 left-0 right-0 mx-5 mb-5">
                    <LinkIcon /> <span style={{ paddingLeft: 5 }}>Go to Raids Table</span>
                </Button>
            )}
        </Card>
    );
};
