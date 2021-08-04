import { createElement as h } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

// Round upward to the next group of ten
const round = (num) => Math.ceil(num / 10) * 10

const max = (items) => round(Math.max.apply(Math, items))
const mid = (items) => max(items) / 2
const min = () => 0

const percentage = (amount, max) => {
	if (amount === 0 && max === 0) return 0
	return (amount / max) * 100
}

const Row = (props) => {
	return (
		h('div', {
			className: classNames({
				'barChart__row': true,
				'barChart__row--top': props.position === 'top',
				'barChart__row--middle': props.position === 'middle',
				'barChart__row--bottom': props.position === 'bottom',
				'color-light': true,
			}),
		}, props.children)
	)
}

const Column = (props) => {
	return (
		h('div', {
			className: classNames({
				'barChart__column': true,
				'barChart__column--disabled': props.onClick == null,
				'active': props.active,
			}),
			onMouseEnter: props.onEnter,
			onMouseLeave: props.onLeave,
			onClick: props.onClick,
		},
			h('div', {
				'className': 'barChart__bar color-black',
				'style': { '--size': props.size },
				'data-label': props.label,
			}),
		)
	)
}

const PresentationBarChart = (props) => {
	return (
		h('div', { className: 'barChart' },
			h('div', { className: 'barChart__axis' },
				h(Row, { position: 'top' }, props.formatter(max(props.items))),
				h(Row, { position: 'middle' }, props.formatter(mid(props.items))),
				h(Row, { position: 'bottom' }, props.formatter(min())),
			),
			h('div', { className: 'barChart__columns' },
				props.items.map((item, index) => (
					h(Column, {
						key: index,
						active: props.active === index,
						size: `${ percentage(item, max(props.items)) }%`,
						onEnter: () => props.onItemEnter(index),
						onLeave: () => props.onItemLeave(index),
						onClick: props.onItemClick == null ? undefined : () => props.onItemClick(index),
						label: props.formatter(item),
					})
				)),
			),
		)
	)
}

PresentationBarChart.propTypes = {
	items: PropTypes.arrayOf(PropTypes.number).isRequired,
	formatter: PropTypes.func.isRequired,
	onItemEnter: PropTypes.func.isRequired,
	onItemLeave: PropTypes.func.isRequired,
	onItemClick: PropTypes.func,
}

export default PresentationBarChart