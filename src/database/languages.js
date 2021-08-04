'use strict'

const Record = require('../models/Record')
const aggregateTopRecords = require('../aggregations/aggregateTopRecords')
const aggregateNewRecords = require('../aggregations/aggregateNewRecords')
const aggregateRecentRecords = require('../aggregations/aggregateRecentRecords')
const sortings = require('../constants/sortings')
const languageCodes = require('../utils/languageCodes')
const recursiveId = require('../utils/recursiveId')

const get = async (ids, sorting, range, limit, dateDetails) => {
	const aggregation = (() => {
		if (sorting === sortings.SORTINGS_TOP) return aggregateTopRecords(ids, [ 'siteLanguage' ], range, limit, dateDetails)
		if (sorting === sortings.SORTINGS_NEW) return aggregateNewRecords(ids, [ 'siteLanguage' ], limit)
		if (sorting === sortings.SORTINGS_RECENT) return aggregateRecentRecords(ids, [ 'siteLanguage' ], limit)
	})()

	const enhanceId = (id) => {
		return languageCodes[id.siteLanguage] || id.siteLanguage
	}

	const enhance = (entries) => {
		return entries.map((entry) => {
			const value = enhanceId(entry._id)

			return {
				id: recursiveId([ value, sorting, range, ...ids ]),
				value,
				count: entry.count,
				created: entry.created,
			}
		})
	}

	return enhance(
		await Record.aggregate(aggregation),
	)
}

module.exports = {
	get,
}