using InterviewTestPagination.Models;
using InterviewTestPagination.Models.Todo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace InterviewTestPagination.Business
{
    /// <summary>
    /// Business Object for Todo response
    /// </summary>
    public class ToDoResponseBO
    {
        const int ALL = -1;
        private readonly IModelService<Todo> _todoService = new TodoService();

        public ToDoResponseBO()
        {}

        /// <summary>
        /// Method that creates the response for client
        /// </summary>
        /// <param name="pageSize">Page size</param>
        /// <param name="currentPage">Current page</param>
        /// <param name="orderItem">Order Item</param>
        /// <param name="order">Order</param>
        /// <returns>ToDoResponse</returns>
        public ToDoResponse createResponse(int pageSize, int currentPage, string orderItem, int order)
        {
            IEnumerable<Todo> todoList = _todoService.Repository.All();

            todoList = orderToDo(todoList, orderItem, order);

            int totalSize = todoList.Count();

            int totalPage = calcTotalPage(totalSize, pageSize);

            todoList = todoPage(todoList, pageSize, currentPage);

            return new ToDoResponse(pageSize, currentPage, orderItem, order, totalSize, totalPage, todoList);
        }

        /// <summary>
        /// Calculates total page
        /// </summary>
        /// <param name="totalSize">Total size of todo list</param>
        /// <param name="pageSize">Page Size</param>
        /// <returns></returns>
        private int calcTotalPage(int totalSize, int pageSize)
        {
            if (isAll(pageSize))
            {
                return 1;
            } else
            {
                double calcTotal = (double) totalSize / (double) pageSize;
                int totalPage = (int)Math.Ceiling(calcTotal);
                return totalPage;
            }
        }

        /// <summary>
        /// Creates the todo list to be returned for the client
        /// </summary>
        /// <param name="originalList">Original list  of todo items</param>
        /// <param name="pageSize">Page size</param>
        /// <param name="currentPage">Current page</param>
        /// <returns></returns>
        private IEnumerable<Todo> todoPage(IEnumerable<Todo> originalList, int pageSize, int currentPage)
        {
            if (isAll(pageSize))
            {
                return originalList;
            }
            else
            {
                int start = (currentPage - 1) * pageSize;
                return originalList.Skip(start).Take(pageSize);
            }
        }

        /// <summary>
        /// Check if page size is all
        /// </summary>
        /// <param name="pageSize">Page size</param>
        /// <returns>true, if page size is all</returns>
        private bool isAll(int pageSize)
        {
            return pageSize == ALL;
        }

        /// <summary>
        /// Order todo list
        /// </summary>
        /// <param name="originalList"> Todo list to order</param>
        /// <param name="orderItem">Order Item</param>
        /// <param name="order">Order</param>
        /// <returns></returns>
        private IEnumerable<Todo> orderToDo(IEnumerable<Todo> originalList, string orderItem, int order)
        {
            switch (orderItem)
            {
                case "id":
                    return orderToDoByID(originalList, order);
                case "task":
                    return orderToDoByTask(originalList, order);
                default:
                    return orderToDoByCreatedDate(originalList, order);
            }
        }

        /// <summary>
        /// Order todo list by id
        /// </summary>
        /// <param name="originalList">Todo list to order</param>
        /// <param name="order">Order</param>
        /// <returns></returns>
        private IEnumerable<Todo> orderToDoByID(IEnumerable<Todo> originalList, int order)
        {
            if (order == -1)
            {
                return originalList.OrderByDescending(o => o.Id).ToList();
            }
            return originalList.OrderBy(o => o.Id).ToList();
        }

        /// <summary>
        /// Order todo list by task
        /// </summary>
        /// <param name="originalList">Todo list to order</param>
        /// <param name="order">Order</param>
        /// <returns></returns>
        private IEnumerable<Todo> orderToDoByTask(IEnumerable<Todo> originalList, int order)
        {
            if (order == -1)
            {
                return originalList.OrderByDescending(o => o.Task).ToList();
            }
            return originalList.OrderBy(o => o.Task).ToList();
        }

        /// <summary>
        /// Order todo list by created date
        /// </summary>
        /// <param name="originalList">Todo list to order</param>
        /// <param name="order">Order</param>
        /// <returns></returns>
        private IEnumerable<Todo> orderToDoByCreatedDate(IEnumerable<Todo> originalList, int order)
        {
            if (order == -1)
            {
                return originalList.OrderByDescending(o => o.CreatedDate).ToList();
            }
            return originalList.OrderBy(o => o.CreatedDate).ToList();
        }
    }
}