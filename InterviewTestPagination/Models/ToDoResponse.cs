using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using InterviewTestPagination.Models;
using InterviewTestPagination.Models.Todo;

namespace InterviewTestPagination.Models
{
    public class ToDoResponse
    {
        public int PageSize { get; set; }
        public int CurrentPage { get; set; }
        public string OrderItem { get; set; }
        public int Order { get; set; }
        public int TotalSize { get; set; }
        public int TotalPage { get; set; }
        public IEnumerable<Todo.Todo> TodoEnumerable { get; set; }
        
        public ToDoResponse(int pageSize, int currentPage, string orderItem, int order, int totalSize, int totalPage, IEnumerable<Todo.Todo> todoEnumerable)
        {
            PageSize = pageSize;
            CurrentPage = currentPage;
            OrderItem = orderItem;
            Order = order;
            TotalSize = totalSize;
            TotalPage = totalPage;
            TodoEnumerable = todoEnumerable;
        }
    }
}