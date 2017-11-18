'use strict';

module.exports = function(app) {
  var retrospective = require('../controllers/retrospective_controller');

  app.route('/api/teams')
    .get(retrospective.read_all_teams)

  app.route('/api/retrospectives')
    .get(retrospective.read_all_retrospectives)
    .post(retrospective.create_a_retrospective)

  app.route('/api/retrospectives/:id')
    .get(retrospective.read_a_retrospective)
    .post(retrospective.update_a_retrospective)
    .delete(retrospective.delete_a_retrospective)

  app.route('/api/retrospectives/:id/:type')
    .get(retrospective.export_a_retrospective)

  app.route('/api/column/:retro_id')
    .post(retrospective.add_a_column)
    .put(retrospective.update_a_column)

  app.route('/api/columns/:retro_id')
    .post(retrospective.add_columns)

  app.route('/api/column/:retro_id/:column_id')
    .delete(retrospective.delete_a_column)
    .post(retrospective.pending_a_column)

  app.route('/api/comment/:retro_id/:column_id')
    .post(retrospective.add_a_comment)
    .put(retrospective.update_a_comment)

  app.route('/api/comment/:retro_id/:column_id/:comment_id')
    .delete(retrospective.delete_a_comment)
    .post(retrospective.pending_a_comment)
};
