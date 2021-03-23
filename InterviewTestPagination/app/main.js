(function (angular) {
    "use strict";

    angular
        .module("todoApp")
        .directive("todoPaginatedList", [todoPaginatedList])
        .directive("pagination", [pagination]);

    /**
     * Directive definition function of 'todoPaginatedList'.
     * 
     * @returns {} directive definition object
     */
    function todoPaginatedList() {
        var directive = {
            restrict: "E", // example setup as an element only
            templateUrl: "app/templates/todo.list.paginated.html",
            scope: {}, // example empty isolate scope
            controller: ["$scope", "$http", controller],
            link: link
        };

        function controller($scope, $http) { // example controller creating the scope bindings
            var URL = "api/Todo/Todos";
            var ID = 'id';
            var TASK = 'task';
            var CREATED_DATE = 'createdDate';
            var ALL = 'all';
            $scope.todos = [];
            $scope.totalPage = 0;
            $scope.currentPage = 1;
            $scope.orderItem = CREATED_DATE;
            $scope.order = 1;
            $scope.pageSize = 20;
            $scope.totalSize = 0;
            
            /**
             * Function that get todo list from server
            **/
            var getTodo = function () {
                if ($scope.currentPage === undefined) {
                    $scope.currentPage = 1;
                }
                var pageSizeParam;
                if ($scope.pageSize == ALL) {
                    pageSizeParam = -1;
                } else {
                    pageSizeParam = $scope.pageSize;
                }
                var data = {
                    pageSize: pageSizeParam,
                    currentPage: $scope.currentPage,
                    orderItem: $scope.orderItem,
                    order: $scope.order
                };
                var config = {
                    params: data
                };
                $http.get(URL, config).then(response => successTodo(response));
            };

            /**
             * Function that process response when it is successful
             * 
             * @param response - response from server
            **/
            var successTodo = function (response) {
                var responseData = response.data;
                $scope.todos = responseData.todoEnumerable;
                $scope.currentPage = responseData.currentPage;
                $scope.order = responseData.order;
                $scope.orderItem = responseData.orderItem;
                $scope.totalPage = responseData.totalPage;
                $scope.totalSize = responseData.totalSize;
            };

            getTodo();

            /**
             * Watcher to get changes in current page fromm pagination
            **/
            $scope.$watch("currentPage", function ($scope) {
                getTodo();
            });

            /**
             * Watcher to get changes in page size fromm pagination
            **/
            $scope.$watch("pageSize", function ($scope) {
                getTodo();
            });

            /**
             * Get the text for order
            **/
            var getOrderText = function () {
                if ($scope.order == -1) {
                    return "(desc)";
                } else {
                    return "(asc)";
                }
            };

            /**
             * Change the order side
            **/
            var changeOrder = function () {
                $scope.order = -1 * $scope.order;
                getTodo();
            }

            /**
             * Reset order and current page when order item changes
            **/
            var resetOrderAndGet = function () {
                $scope.order = 1;
                $scope.currentPage = 1;
                getTodo();
            };

            /**
             * Function to call order by Id
            **/
            $scope.orderById = function () {
                if ($scope.orderItem === ID) {
                    changeOrder();
                } else {
                    $scope.orderItem = ID;
                    resetOrderAndGet();
                }
            }

            /**
             * Function to indicate if it is ordered by id
            **/
            $scope.orderIdIndicator = function () {
                if ($scope.orderItem === ID) {
                    return getOrderText();
                }
                return "";
            };

            /**
             * Function to call order by task
            **/
            $scope.orderByTask = function () {
                if ($scope.orderItem === TASK) {
                    changeOrder();
                } else {
                    $scope.orderItem = TASK;
                    resetOrderAndGet();
                }
            };

            /**
             * Function to indicate if it is ordered by task
            **/
            $scope.orderTaskIndicator = function () {
                if ($scope.orderItem === TASK) {
                    return getOrderText();
                }
                return "";
            };

            /**
             * Function to call order by created date
            **/
            $scope.orderByCreatedDate = function () {
                if ($scope.orderItem === CREATED_DATE) {
                    changeOrder();
                } else {
                    $scope.orderItem = CREATED_DATE;
                    resetOrderAndGet();
                }
            };

            /**
             * Function to indicate if it is ordered by created date
            **/
            $scope.orderCreatedDateIndicator = function () {
                if ($scope.orderItem === CREATED_DATE) {
                    return getOrderText();
                }
                return "";
            };
        }

        function link(scope, element, attrs) { }

        return directive;
    }

    /**
     * Directive definition function of 'pagination' directive.
     * Scope:
     *      total-page: int - total pages
     *      current-page: int - current page
     *      page-size: int - selected page size
     * @returns {} directive definition object
     */
    function pagination() {
        var directive = {
            restrict: "E", // example setup as an element only
            templateUrl: "app/templates/pagination.html",
            scope: {
                totalPage: '=',
                currentPage: '=',
                pageSize: '='
            },
            controller: ["$scope", controller],
            link: link
        };

        function controller($scope) {
            var ALL = 'all';
            $scope.pageSizeOptions = [10, 20, 30, 'all'];

            /**
             * Go to the first page
            **/
            $scope.goToFirst = function () {
                $scope.currentPage = 1;
            }

            /**
             * Go to the previous page
            **/
            $scope.goToPrevious = function () {
                if ($scope.currentPage > 1) {
                    $scope.currentPage -= 1;
                }
            }

            /**
             * Go to the next page
            **/
            $scope.goToNext = function () {
                if ($scope.currentPage < $scope.totalPage) {
                    $scope.currentPage += 1;
                }
            }

            /**
             * Go to the last page
            **/
            $scope.goToLast = function () {
                $scope.currentPage = $scope.totalPage;
            }
        }

        function link($scope, element, attrs) {
        }

        return directive;
    }

})(angular);

