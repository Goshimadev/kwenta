import React, { ChangeEvent, memo } from 'react';
import styled from 'styled-components';

import InputTitle from 'components/Input/InputTitle';
import NumericInput from 'components/Input/NumericInput';
import { FlexDivRow } from 'components/layout/flex';
import SelectorButtons from 'components/SelectorButtons/SelectorButtons';
import { editCrossMarginTradeMarginDelta } from 'state/futures/actions';
import {
	selectSelectedInputDenomination,
	selectMarginDeltaInputValue,
	selectIdleMargin,
} from 'state/futures/selectors';
import { useAppDispatch, useAppSelector } from 'state/hooks';
import { floorNumber } from 'utils/formatters/number';

const PERCENT_OPTIONS = ['10%', '25%', '50%', '100%'];

type MarginInputProps = {
	isMobile?: boolean;
};

const MarginInput: React.FC<MarginInputProps> = memo(({ isMobile }) => {
	const dispatch = useAppDispatch();

	const idleMargin = useAppSelector(selectIdleMargin);
	const assetInputType = useAppSelector(selectSelectedInputDenomination);
	const marginDeltaInputValue = useAppSelector(selectMarginDeltaInputValue);
	const maxMargin = useAppSelector(selectIdleMargin);

	const onChangeValue = (_: ChangeEvent<HTMLInputElement>, v: string) => {
		dispatch(editCrossMarginTradeMarginDelta(v));
	};

	const onSelectPercent = (index: number) => {
		const percent = PERCENT_OPTIONS[index].replace('%', '');
		const margin = idleMargin.div(100).mul(percent);

		dispatch(editCrossMarginTradeMarginDelta(floorNumber(margin).toString()));
	};

	const invalid =
		assetInputType === 'usd' &&
		marginDeltaInputValue !== '' &&
		maxMargin.lt(marginDeltaInputValue || 0);

	return (
		<>
			<Container>
				<OrderSizingRow>
					<InputTitle>Margin</InputTitle>
					<InputHelpers>
						<SelectorButtons onSelect={onSelectPercent} options={PERCENT_OPTIONS} />
					</InputHelpers>
				</OrderSizingRow>

				<NumericInput
					invalid={invalid}
					dataTestId={'set-order-margin-susd' + (isMobile ? '-mobile' : '-desktop')}
					value={marginDeltaInputValue}
					placeholder="0.00"
					onChange={onChangeValue}
				/>
			</Container>
		</>
	);
});

const Container = styled.div`
	margin-top: 18px;
	margin-bottom: 16px;
`;

const OrderSizingRow = styled(FlexDivRow)`
	width: 100%;
	align-items: center;
	margin-bottom: 8px;
	cursor: default;
`;

const InputHelpers = styled.div`
	display: flex;
`;

export default MarginInput;
