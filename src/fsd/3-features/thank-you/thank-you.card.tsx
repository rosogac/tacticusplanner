import { isMobile } from 'react-device-detect';
import { useNavigate, Link } from 'react-router-dom';

import { Card } from '@/fsd/5-shared/ui';
import { BmcIcon } from '@/fsd/5-shared/ui/icons';

import { ContributorImage } from './contributor-image';
import { IContributor, IContentCreator, IYoutubeCreator } from './thank-you.model';

export const ThankYouCard = ({
    contributor,
    hide,
}: {
    contributor: IContributor | IContentCreator | IYoutubeCreator;
    hide?: boolean;
}) => {
    const navigate = useNavigate();
    return (
        <Card
            onClick={() => navigate(isMobile ? '/mobile/ty' : '/ty')}
            width="w-[350px]"
            minHeight="h-full"
            className="p-4"
            style={{
                opacity: hide ? 0 : 1,
                transition: 'opacity 1s ease-in-out, box-shadow 0.2s ease-in-out',
            }}>
            <div className="flex flex-col gap-2 pb-3 border-b border-gray-300 dark:border-[#ffffff1a] flex-shrink-0">
                <div className="flex items-center gap-3 cursor-pointer h-[50px]">
                    {isContentMaker(contributor) ? (
                        <Link
                            to={contributor.youtubeLink}
                            target={'_blank'}
                            className="flex items-center gap-3 text-gray-800 dark:text-[#fafafa] hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            onClick={event => event.stopPropagation()}>
                            <div className="w-[50px] h-[50px] flex-shrink-0 flex items-center justify-center">
                                <ContributorImage
                                    iconPath={contributor.avatarIcon}
                                    height={50}
                                    width={50}
                                    borderRadius={true}
                                />
                            </div>
                            <span className="text-lg font-semibold line-clamp-2">{contributor.name}</span>
                        </Link>
                    ) : !isYoutubeCreator(contributor) ? (
                        <>
                            <div className="w-[50px] h-[50px] flex-shrink-0 flex items-center justify-center">
                                {!!contributor.avatarIcon && (
                                    <ContributorImage
                                        iconPath={contributor.avatarIcon}
                                        height={50}
                                        width={50}
                                        borderRadius={true}
                                    />
                                )}
                                {!contributor.avatarIcon && <BmcIcon />}
                            </div>
                            <span className="text-lg font-semibold text-gray-800 dark:text-[#fafafa] line-clamp-2">
                                {contributor.name}
                            </span>
                        </>
                    ) : (
                        <>
                            <div className="w-[50px] h-[50px] flex-shrink-0 flex items-center justify-center">
                                <img
                                    loading={'lazy'}
                                    className="rounded-full w-[50px] h-[50px] object-cover"
                                    style={{ contentVisibility: 'auto' }}
                                    src={contributor.avatarLink}
                                    alt={contributor.name}
                                />
                            </div>
                            <span className="text-lg font-semibold text-gray-800 dark:text-[#fafafa] line-clamp-2">
                                {contributor.name}
                            </span>
                        </>
                    )}
                </div>
                <div className="h-[20px] flex items-center">
                    {(isContentMaker(contributor) || (!isYoutubeCreator(contributor) && contributor.type)) && (
                        <span className="text-sm text-gray-600 dark:text-[#fafafa]">
                            {isContentMaker(contributor)
                                ? 'Content creator'
                                : !isYoutubeCreator(contributor)
                                  ? contributor.type
                                  : ''}
                        </span>
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-2 text-gray-700 dark:text-[#fafafa] flex-1 min-h-0">
                {isContentMaker(contributor) ? (
                    <>
                        <p className="my-2 text-sm overflow-y-auto line-clamp-4">{contributor.thankYou}</p>
                        <Link
                            to={contributor.resourceLink}
                            className="block w-full text-center mt-auto"
                            target={'_blank'}
                            onClick={event => event.stopPropagation()}>
                            <div className="flex items-center justify-center h-[160px] overflow-hidden">
                                <ContributorImage
                                    iconPath={contributor.resourceIcon}
                                    height={160}
                                    width={contributor.name.includes('Severyn') ? 160 : 280}
                                />
                            </div>
                        </Link>
                    </>
                ) : !isYoutubeCreator(contributor) ? (
                    <>
                        <p className="my-2 text-sm overflow-y-auto flex-1 min-h-0">{contributor.thankYou}</p>
                        {contributor.resourceLink && (
                            <span className="text-sm flex-shrink-0">
                                Check out{' '}
                                <Link
                                    to={contributor.resourceLink}
                                    target={'_blank'}
                                    className="text-blue-600 dark:text-blue-400 hover:underline"
                                    onClick={event => event.stopPropagation()}>
                                    {contributor.resourceDescription}
                                </Link>
                            </span>
                        )}
                    </>
                ) : (
                    <Link
                        to={`https://www.youtube.com/watch?v=${contributor.youtubeVideoId}`}
                        className="block w-full text-center rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors mt-auto"
                        target={'_blank'}
                        onClick={event => event.stopPropagation()}>
                        <div className="flex items-center justify-center h-[180px] overflow-hidden bg-gray-100 dark:bg-gray-950">
                            <img
                                loading={'lazy'}
                                style={{ contentVisibility: 'auto' }}
                                src={`https://i3.ytimg.com/vi/${contributor.youtubeVideoId}/mqdefault.jpg`}
                                alt={contributor.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </Link>
                )}
            </div>
        </Card>
    );
};

const isContentMaker = (
    contributor: IContentCreator | IContributor | IYoutubeCreator
): contributor is IContentCreator => {
    return Object.hasOwn(contributor, 'youtubeLink');
};

const isYoutubeCreator = (
    contributor: IContentCreator | IContributor | IYoutubeCreator
): contributor is IYoutubeCreator => {
    return Object.hasOwn(contributor, 'youtubeVideoId');
};
