import Wei, { wei } from '@synthetixio/wei';
import React, { useMemo, memo, useCallback } from 'react';
import styled from 'styled-components';

import InputTitle from 'components/Input/InputTitle';
import NumericInput from 'components/Input/NumericInput';
import { FlexDivRow } from 'components/layout/flex';
import Spacer from 'components/Spacer';
import { PositionSide } from 'sdk/types/futures';
import { selectShowPositionModal } from 'state/app/selectors';
import { editClosePositionSizeDelta } from 'state/futures/actions';
import {
	selectClosePositionOrderInputs,
	selectEditPositionModalInfo,
} from 'state/futures/selectors';
import { useAppDispatch, useAppSelector } from 'state/hooks';
import { zeroBN } from 'utils/formatters/number';

type OrderSizingProps = {
	maxNativeValue: Wei;
	isMobile?: boolean;
};

const ClosePositionSizeInput: React.FC<OrderSizingProps> = memo(({ isMobile, maxNativeValue }) => {
	const dispatch = useAppDispatch();

	const { nativeSizeDelta } = useAppSelector(selectClosePositionOrderInputs);
	const { position } = useAppSelector(selectEditPositionModalInfo);
	const modal = useAppSelector(selectShowPositionModal);

	const onSizeChange = useCallback(
		(value: string) => {
			if (modal) {
				dispatch(
					editClosePositionSizeDelta(
						modal.marketKey,
						position?.position?.side === PositionSide.LONG ? '-' + value : value
					)
				);
			}
		},
		[dispatch, modal, position?.position?.side]
	);

	const onChangeValue = useCallback(
		(_, v: string) => {
			onSizeChange(v);
		},
		[onSizeChange]
	);

	const nativeSizeDeltaWei = useMemo(() => {
		return !nativeSizeDelta || isNaN(Number(nativeSizeDelta)) ? zeroBN : wei(nativeSizeDelta);
	}, [nativeSizeDelta]);

	const invalid = nativeSizeDelta !== '' && maxNativeValue.lt(nativeSizeDeltaWei.abs());

	return (
		<OrderSizingContainer>
			<OrderSizingRow>
				<InputTitle>Amount to close</InputTitle>
			</OrderSizingRow>

			<NumericInput
				invalid={invalid}
				dataTestId={'edit-position-size-input' + (isMobile ? '-mobile' : '-desktop')}
				value={nativeSizeDelta.replace('-', '')}
				placeholder="0.00"
				onChange={onChangeValue}
			/>
			<Spacer height={16} />
		</OrderSizingContainer>
	);
});

const OrderSizingContainer = styled.div``;

const OrderSizingRow = styled(FlexDivRow)`
	width: 100%;
	align-items: center;
	margin-bottom: 8px;
	cursor: default;
`;

export default ClosePositionSizeInput;
