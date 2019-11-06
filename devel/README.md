
import styled from "styled-components";

const mobileMenuWidth = -200;
const easeOutBounceValues = [
	{ "%": 0, val: 1 },
	{ "%": 12, val: 0.89 },
	{ "%": 24, val: 0.56 },
	{ "%": 36, val: 0.02 },
	{ "%": 54, val: 0.25 },
	{ "%": 74, val: 0.02 },
	{ "%": 82, val: 0.06 },
	{ "%": 92, val: 0.01 },
	{ "%": 96, val: 0.02 },
	{ "%": 100, val: 0 }
];

const generateKeyframes = (keyValPairs, defaultValue) => {
	return keyValPairs.map(
		item => `${item["%"]}% {
			transform: translateX(${Math.trunc(defaultValue * item.val)}px);
		}`
	);
};

const StyledLayout = styled.div`
	@keyframes easeOutBounce {
		${generateKeyframes(easeOutBounceValues, mobileMenuWidth)}
	}
`;
