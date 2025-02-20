import { ReactElement, memo, FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Body } from 'components/Text';
import Tooltip from 'components/Tooltip/Tooltip';
import { selectMarketInfo } from 'state/futures/selectors';
import { useAppSelector } from 'state/hooks';

import { isMarketDataKey, marketDataKeyMap } from './utils';

type MarketDetailProps = {
	mobile?: boolean;
	dataKey: string;
	color?: string;
	value: string | ReactElement;
};

const MarketDetail: FC<MarketDetailProps> = memo(({ mobile, dataKey, color, value }) => {
	const { t } = useTranslation();
	const marketInfo = useAppSelector(selectMarketInfo);
	const pausedClass = marketInfo?.isSuspended ? 'paused' : '';

	const contentSuffix = useMemo(() => {
		if (dataKey === marketInfo?.marketName) {
			return 'market-key';
		} else if (isMarketDataKey(dataKey)) {
			return marketDataKeyMap[dataKey];
		} else {
			return '';
		}
	}, [dataKey, marketInfo]);

	return (
		<MarketDetailsTooltip
			key={dataKey}
			mobile={mobile}
			content={t(`exchange.market-details-card.tooltips.${contentSuffix}`)}
		>
			<WithCursor cursor="help">
				<Body className="heading">{dataKey}</Body>
				<MarketDetailValue value={value} color={color} mobile={mobile} pausedClass={pausedClass} />
			</WithCursor>
		</MarketDetailsTooltip>
	);
});

export default MarketDetail;

// Extend type of cursor to accept different style of cursor. Currently accept only 'help'
const WithCursor = styled.div<{ cursor: 'help' }>`
	cursor: ${(props) => props.cursor};
`;

const MarketDetailsTooltip = styled(Tooltip).attrs({ position: 'fixed', height: 'auto' })<{
	mobile?: boolean;
}>`
	z-index: 2;
	padding: 10px;
	max-width: 300px;
	right: ${(props) => props.mobile && '1px'};
`;

export const MarketDetailValue = ({
	value,
	color,
	pausedClass = '',
	mobile = false,
}: {
	value: string | ReactElement;
	color?: string;
	pausedClass?: 'paused' | '';
	mobile?: boolean;
}) => (
	<Body
		as="span"
		mono
		weight="bold"
		size={mobile ? 'medium' : 'large'}
		className={`value ${color || ''} ${pausedClass}`}
	>
		{value}
	</Body>
);
