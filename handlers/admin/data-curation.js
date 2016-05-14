'use strict';

const Joi = require('joi');
const DataContribution = require('../../models/data-contribution');


function editDataContribution(request, reply) {
  const data = {
    approved: request.payload.approved,
    curation_comments: request.payload.curation_comments,
  }

  return new DataContribution({ id: request.params.id })
    .save(data, { patch: true, require: true })
    .then((dataContribution) => {
      request.yar.flash('success', 'Data Contribution updated successfully.');
      return reply.redirect('/admin/data-curation');
    })
    .catch(() => {
      // FIXME: Log error
      request.yar.flash('error', 'An internal error occurred, please try again later.');
      return reply.redirect('/admin/data-curation');
    });
}

function listDataContributions(request, reply) {
  return new DataContribution()
    .query('orderBy', 'created_at', 'desc')
    .fetchAll({ withRelated: ['user'] })
    .then((dataContributions) => {
      reply.view('admin/data-curation', {
        title: 'Data curation',
        dataContributions: dataContributions.toJSON(),
      });
    });
}

module.exports = {
  get: {
    handler: listDataContributions,
  },
  post: {
    handler: editDataContribution,
    validate: {
      query: {
        id: Joi.string().guid(),
      },
      payload: {
        curation_comments: Joi.string().trim().empty(''),
        approved: Joi.boolean().default(false),
      },
    },
  },
};
