define([], function() {
  'use strict';

  var factoryArray = ["$http", factory];
  var module = {
    name: "dataService",
    factory: factoryArray
  };

  return module;

  function factory($http) {
    var baseUrl = "/api";

    return {
      getRetrospectives: getRetrospectives,
      getRetrospective: getRetrospective,
      deleteRetrospective: deleteRetrospective,
      createRetrospective: createRetrospective,
      updateRetrospective: updateRetrospective,
      addColumn: addColumn,
      addColumns: addColumns,
      updateColumn: updateColumn,
      deleteColumn: deleteColumn,
      pendingColumn: pendingColumn,
      addComment: addComment,
      updateComment: updateComment,
      deleteComment: deleteComment,
      pendingComment: pendingComment
    };

    function getRetrospectives() {
      return _httpGet([baseUrl, "retrospectives"].join("/"));
    }

    function getRetrospective(id) {
      return _httpGet([baseUrl, "retrospectives", id].join("/"));
    }

    function deleteRetrospective(id) {
      return _httpDelete([baseUrl, "retrospectives", id].join("/"));
    }

    function createRetrospective(retrospective) {
      return _httpPost([baseUrl, "retrospectives"].join("/"), retrospective);
    }

    function updateRetrospective(id, retrospective) {
      return _httpPost([baseUrl, "retrospectives", id].join("/"), retrospective);
    }

    function addColumns(retrospectiveId, columns) {
      return _httpPost([baseUrl, "columns", retrospectiveId].join("/"), columns);
    }

    function addColumn(retrospectiveId, column) {
      return _httpPost([baseUrl, "column", retrospectiveId].join("/"), column);
    }

    function updateColumn(retrospectiveId, column) {
      return _httpPut([baseUrl, "column", retrospectiveId].join("/"), column);
    }

    function deleteColumn(retrospectiveId, columnId) {
      return _httpDelete([baseUrl, "column", retrospectiveId, columnId].join("/"));
    }

    function pendingColumn(retrospectiveId, columnId) {
      return _httpPost([baseUrl, "column", retrospectiveId, columnId].join("/"));
    }

    function addComment(retrospectiveId, columnId, comment) {
      return _httpPost([baseUrl, "comment", retrospectiveId, columnId].join("/"), comment);
    }

    function updateComment(retrospectiveId, columnId, comment) {
      return _httpPut([baseUrl, "comment", retrospectiveId, columnId].join("/"), comment);
    }

    function deleteComment(retrospectiveId, columnId, commentId) {
      return _httpDelete([baseUrl, "comment", retrospectiveId, columnId, commentId].join("/"));
    }

    function pendingComment(retrospectiveId, columnId, commentId) {
      return _httpPost([baseUrl, "comment", retrospectiveId, columnId, commentId].join("/"));
    }

    function _httpGet(url) {
      return _wrapHttp("GET", url);
    }

    function _httpPost(url, data) {
      return _wrapHttp("POST", url, data);
    }

    function _httpPut(url, data) {
      return _wrapHttp("PUT", url, data);
    }

    function _httpDelete(url) {
      return _wrapHttp("DELETE", url);
    }

    function _wrapHttp(method, url, data) {
      var options = {
        method: method,
        url: url,
        headers: {
          Accept: "application/json"
        }
      };
      if (data !== null) {
        options.data = data;
      }
      return $http(options);
    }
  }
})
