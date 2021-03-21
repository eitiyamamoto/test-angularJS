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
            $scope.todos = [];
            $scope.selected = [];
            $scope.orderId = 0;
            $scope.orderTask = 0;
            $scope.orderCreatedDate = 1;
            // example of xhr call to the server's 'RESTful' api
            $http.get("api/Todo/Todos").then(response => $scope.todos = response.data);
            
            /**
             * Watcher to check if total is loaded
            **/
            var totalWatcher = $scope.$watchCollection('total', () => {
                $scope.orderByCreatedDate();
                totalWatcher();
            });

            /**
             * Function to order list by id
            **/
            $scope.orderById = function () {
                if ($scope.todos && $scope.todos instanceof Array) {
                    if ($scope.orderId != 1) {
                        $scope.todos = $scope.todos.sort((a, b) => (a.id > b.id) ? 1 : -1);
                        $scope.orderId = 1;
                    } else {
                        $scope.todos = $scope.todos.sort((a, b) => (a.id < b.id) ? 1 : -1);
                        $scope.orderId = -1;
                    }
                    $scope.orderTask = 0;
                    $scope.orderCreatedDate = 0;
                }
            }

            /**
             * Function to show if it is ordered by id
            **/
            $scope.orderIdIndicator = function () {
                if ($scope.orderId == -1) {
                    return "(desc)";
                } else if ($scope.orderId == 1) {
                    return "(asc)";
                } else {
                    return "";
                }
            };

            /**
             * Function to order by Task
            **/
            $scope.orderByTask = function () {
                if ($scope.todos && $scope.todos instanceof Array) {
                    if ($scope.orderTask != 1) {
                        $scope.todos = $scope.todos.sort((a, b) => (a.task > b.task) ? 1 : -1);
                        $scope.orderTask = 1;
                    } else {
                        $scope.todos = $scope.todos.sort((a, b) => (a.task < b.task) ? 1 : -1);
                        $scope.orderTask = -1;
                    }
                    $scope.orderId = 0;
                    $scope.orderCreatedDate = 0;
                }
            };

            /**
             * Function that shows if it is ordered by task
            **/
            $scope.orderTaskIndicator = function () {
                if ($scope.orderTask == -1) {
                    return "(desc)";
                } else if ($scope.orderTask == 1) {
                    return "(asc)";
                } else {
                    return "";
                }
            };

            /**
             * Function that order by created date
            **/
            $scope.orderByCreatedDate = function () {
                if ($scope.todos && $scope.todos instanceof Array) {
                    if ($scope.orderCreatedDate != 1) {
                        $scope.todos = $scope.todos.sort((a, b) => (a.createdDate > b.createdDate) ? 1 : -1);
                        $scope.orderCreatedDate = 1;
                    } else {
                        $scope.todos = $scope.todos.sort((a, b) => (a.createdDate < b.createdDate) ? 1 : -1);
                        $scope.orderCreatedDate = -1;
                    }
                    $scope.orderId = 0;
                    $scope.orderTask = 0;
                }
            };

            /**
             * Function that shows if it is ordered by created date
            **/
            $scope.orderCreatedDateIndicator = function () {
                if ($scope.orderCreatedDate == -1) {
                    return "(desc)";
                } else if ($scope.orderCreatedDate == 1) {
                    return "(asc)";
                } else {
                    return "";
                }
            };
        }

        function link(scope, element, attrs) { }

        return directive;
    }

    /**
     * Directive definition function of 'pagination' directive.
     * 
     * @returns {} directive definition object
     */
    function pagination() {
        var directive = {
            restrict: "E", // example setup as an element only
            templateUrl: "app/templates/pagination.html",
            scope: {
                total: '=',
                selected: '=',
            }, // example empty isolate scope
            controller: ["$scope", controller],
            link: link
        };

        function controller($scope) {
            var ALL = 'all';
            $scope.pageSizeOptions = [10, 20, 30, 'all'];
            $scope.pageSize = 20;
            $scope.totalLength = 0;
            $scope.totalPage = 0;
            $scope.currentPage = 1;

            // Watcher to check if total is updated
            $scope.$watchCollection('total', () => {
                $scope.currentPage = 1;
                updateSelectedPage($scope.pageSize, $scope.currentPage);
            });

            /**
             * Update selected page when page size is updated
            **/
            $scope.updatePageSize = function () {
                updateSelectedPage($scope.pageSize, $scope.currentPage);
            }

            /**
             * Update current page
            **/
            $scope.updateCurrentPage = function () {
                updateSelectedPage($scope.pageSize, $scope.currentPage);
            }

            /**
             * Go to the first page
            **/
            $scope.goToFirst = function () {
                $scope.currentPage = 1;
                updateSelectedPage($scope.pageSize, $scope.currentPage);
            }

            /**
             * Go to the previous page
            **/
            $scope.goToPrevious = function () {
                if ($scope.currentPage > 1) {
                    $scope.currentPage -= 1;
                    updateSelectedPage($scope.pageSize, $scope.currentPage);
                }
            }

            /**
             * Go to the next page
            **/
            $scope.goToNext = function () {
                if ($scope.currentPage < $scope.totalPage) {
                    $scope.currentPage += 1;
                    updateSelectedPage($scope.pageSize, $scope.currentPage);
                }
            }

            /**
             * Go to the last page
            **/
            $scope.goToLast = function () {
                $scope.currentPage = $scope.totalPage;
                updateSelectedPage($scope.pageSize, $scope.currentPage);
            }

            /**
            *  Update selected page that will be shown in the table
            **/
            var updateSelectedPage = function (pageSize, currentPage) {
                // Check if total list is not empty and if it is array
                if ($scope.total && $scope.total instanceof Array) {
                    // Get total list size
                    $scope.totalLength = $scope.total.length;

                    // Update for page size
                    if (pageSize === ALL) {
                        $scope.selected = $scope.total;
                        currentPage = 0;
                        $scope.totalPage = 1;
                    }
                    else {
                        $scope.totalPage = Math.ceil($scope.totalLength / pageSize);
                        var init = 0;
                        var end = 0;
                        if (currentPage <= $scope.totalPage) {
                            init = pageSize * (currentPage - 1);
                            end = pageSize * currentPage;
                        }
                        $scope.selected = $scope.total.slice(init, end);
                    }
                    
                } else {
                    $scope.totalLength = 0;
                    $scope.totalPage = 0;
                }
            }
        }

        function link($scope, element, attrs) {
        }

        return directive;
    }

})(angular);

